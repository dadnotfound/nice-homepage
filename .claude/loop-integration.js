// Loop 集成脚本
// 用于与 Claude Code 的 loop 系统深度集成

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// 项目配置
const PROJECT_ROOT = path.join(__dirname, '..');
const AUTO_SCRIPT = path.join(PROJECT_ROOT, 'auto-test-and-push.sh');

// 日志函数
function log(type, message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${type}: ${message}`);
}

// 运行 shell 命令
function runCommand(command, options = {}) {
    return new Promise((resolve, reject) => {
        exec(command, {
            cwd: PROJECT_ROOT,
            timeout: options.timeout || 30000
        }, (error, stdout, stderr) => {
            if (error) {
                log('ERROR', error.message);
                reject(error);
                return;
            }
            if (stderr) {
                log('WARN', stderr);
            }
            resolve(stdout);
        });
    });
}

// 检查文件是否应该被处理
function shouldProcessFile(filePath) {
    const config = {
        watch: [
            'src/**/*',
            'docs/**/*',
            '*.md',
            '.looprc'
        ],
        ignore: [
            '.git/**',
            'node_modules/**',
            '*.log',
            '*.tmp',
            '.claude/**'
        ]
    };

    // 检查是否在忽略列表中
    for (const pattern of config.ignore) {
        if (minimatch(filePath, pattern)) {
            return false;
        }
    }

    // 检查是否在监控列表中
    for (const pattern of config.watch) {
        if (minimatch(filePath, pattern)) {
            return true;
        }
    }

    return false;
}

// 简单的通配符匹配
function minimatch(filePath, pattern) {
    const regex = new RegExp(pattern
        .replace(/\*/g, '.*')
        .replace(/\?/g, '.')
        .replace(/\//g, '\/'));
    return regex.test(filePath);
}

// Loop 集成类
class LoopIntegration {
    constructor() {
        this.lastRun = 0;
        this.debounceTime = 1000; // 1秒防抖
    }

    // 处理文件变更
    async handleFileChange(filePath) {
        if (!shouldProcessFile(filePath)) {
            return;
        }

        const now = Date.now();
        if (now - this.lastRun < this.debounceTime) {
            return; // 防抖
        }

        this.lastRun = now;
        log('INFO', `检测到文件变更: ${filePath}`);

        try {
            await this.runAutoProcess();
        } catch (error) {
            log('ERROR', '自动处理失败');
        }
    }

    // 运行自动处理流程
    async runAutoProcess() {
        log('INFO', '开始自动处理流程...');

        // 1. 运行测试
        log('INFO', '运行测试...');
        await runCommand('./auto-test-and-push.sh');

        // 2. 检查结果
        const status = await this.checkGitStatus();
        log('INFO', `Git 状态: ${status}`);
    }

    // 检查 Git 状态
    async checkGitStatus() {
        try {
            const status = await runCommand('git status --porcelain');
            if (status.trim() === '') {
                return 'clean';
            } else {
                return 'dirty';
            }
        } catch (error) {
            return 'error';
        }
    }

    // Hook 处理函数
    async onLoopStart() {
        log('INFO', 'Loop 启动');
        await this.sendNotification('Loop 启动', '监控已开始');
    }

    async onLoopSuccess() {
        log('SUCCESS', 'Loop 成功');
        await this.sendNotification('Loop 成功', '所有测试通过');
    }

    async onLoopError(error) {
        log('ERROR', `Loop 失败: ${error.message}`);
        await this.sendNotification('Loop 失败', error.message, 'error');
    }

    async sendNotification(title, message, type = 'info') {
        // 这里可以集成各种通知系统
        log(type, `${title}: ${message}`);
    }
}

// 导出供其他使用
module.exports = LoopIntegration;

// 如果直接运行，启动监控
if (require.main === module) {
    const integration = new LoopIntegration();

    // 监听文件变更
    fs.watch(PROJECT_ROOT, { recursive: true }, async (eventType, filename) => {
        if (eventType === 'change' && filename) {
            await integration.handleFileChange(filename);
        }
    });

    log('INFO', 'Loop 集成已启动');
}
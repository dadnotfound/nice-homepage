# Hook 集成指南

## 概述

本项目已配置了完整的 hook 系统，与 Claude Code 的 loop 深度集成，实现更智能的开发体验。

## Hook 配置文件

### 1. `.claude/hooks.json` - Hook 配置
```json
{
  "hooks": {
    "onFileChange": "文件变更时触发",
    "onLoopStart": "Loop 启动时触发",
    "onLoopSuccess": "Loop 成功时触发",
    "onLoopError": "Loop 失败时触发",
    "onBeforeCommit": "提交前触发",
    "onAfterPush": "推送后触发"
  }
}
```

### 2. Hook 脚本文件
- `pre-commit-hook.sh` - 提交前测试
- `post-push-hook.sh` - 推送后处理
- `loop-integration.js` - Loop 集成

## 使用方法

### 启动带 Hook 的 Loop
```bash
# 启动带有完整 Hook 的 Loop
/loop

# 或使用特定配置
/loop --hook-config .claude/hooks.json
```

## Hook 功能详解

### 1. 文件变更 Hook (`onFileChange`)
```json
{
  "onFileChange": {
    "enabled": true,
    "pattern": "**/*",
    "exclude": [".git/**", "node_modules/**"],
    "command": "echo '文件变更检测到: {{file}}'",
    "debounce": 1000
  }
}
```
- **触发条件**：文件被修改
- **防抖处理**：1秒内多次变更只触发一次
- **排除文件**：不监控 Git 和 node_modules

### 2. Loop 生命周期 Hook
```json
{
  "onLoopStart": {
    "enabled": true,
    "command": "echo '🔄 Loop 启动中...'",
    "actions": ["showNotification", "updateStatus"]
  },
  "onLoopSuccess": {
    "enabled": true,
    "command": "echo '✅ Loop 测试通过'",
    "actions": ["playSound", "showNotification"]
  },
  "onLoopError": {
    "enabled": true,
    "command": "echo '❌ Loop 测试失败'",
    "actions": ["showError", "playErrorSound"]
  }
}
```

### 3. Git 生命周期 Hook
```json
{
  "onBeforeCommit": {
    "enabled": true,
    "pattern": "src/**/*",
    "command": "./auto-test-and-push.sh pre-commit",
    "failOnError": true
  },
  "onAfterPush": {
    "enabled": true,
    "command": "echo '🎉 代码已推送到 GitHub'",
    "actions": ["showSuccess", "openUrl:https://github.com/..."]
  }
}
```

## 实际工作流程

### 完整自动化流程
```bash
# 1. 启动带 Hook 的 Loop
/loop --hook-config .claude/hooks.json

# 2. 修改代码
vim src/index.html

# 3. 触发的 Hook 链：
#    onFileChange → 检测到变更
#    onLoopStart → 显示启动状态
#    运行测试 → 自动处理
#    onLoopSuccess/Error → 显示结果
#    onBeforeCommit → 提交前测试
#    onAfterPush → 推送后处理
```

### Hook 执行顺序
1. **文件变更** → `onFileChange`
2. **Loop 启动** → `onLoopStart`
3. **测试运行** → 内部逻辑
4. **测试结果** → `onLoopSuccess` 或 `onLoopError`
5. **Git 操作** → `onBeforeCommit` 和 `onAfterPush`

## 高级功能

### 1. 桌面通知
```json
{
  "onLoopSuccess": {
    "actions": ["showNotification"]
  }
}
```

### 2. 声音提醒
```json
{
  "onLoopSuccess": {
    "actions": ["playSound"]
  }
}
```

### 3. 自动打开网页
```json
{
  "onAfterPush": {
    "actions": ["openUrl:https://github.com/..."]
  }
}
```

### 4. 自定义命令
```json
{
  "onFileChange": {
    "command": "node .claude/custom-handler.js {{file}}"
  }
}
```

## 调试 Hook

### 检查 Hook 配置
```bash
# 验证配置文件格式
cat .claude/hooks.json

# 测试单个 Hook
./.claude/pre-commit-hook.sh pre-commit

# 手动触发 Hook
echo "test.txt" | .claude/trigger-hook.sh onFileChange
```

### 故障排除
```bash
# 1. 检查 Hook 脚本权限
ls -la .claude/*.sh

# 2. 测试脚本执行
./.claude/pre-commit-hook.sh

# 3. 查看 Claude 日志
claude logs
```

## 自定义 Hook

### 创建自定义 Hook
```bash
# 1. 创建脚本
touch .claude/my-hook.sh
chmod +x .claude/my-hook.sh

# 2. 编辑 .claude/hooks.json
{
  "onMyEvent": {
    "enabled": true,
    "command": ".claude/my-hook.sh {{arg1}} {{arg2}}"
  }
}

# 3. 在脚本中处理
#!/bin/bash
echo "自定义 Hook 触发: $1 $2"
```

### Hook 参数
模板变量：
- `{{file}}` - 变更的文件路径
- `{{timestamp}}` - 时间戳
- `{{commit_hash}}` - 提交哈希
- `{{branch}}` - 分支名称

## 配置建议

### 开发环境
```json
{
  "onFileChange": {
    "enabled": true,
    "debounce": 500
  },
  "onLoopSuccess": {
    "actions": ["showNotification", "playSound"]
  }
}
```

### 生产环境
```json
{
  "onBeforeCommit": {
    "enabled": true,
    "failOnError": true
  },
  "onAfterPush": {
    "enabled": true,
    "actions": ["showSuccess", "openUrl"]
  }
}
```

## 总结

通过 hook 系统，您的开发流程变成了：

1. **启动** → `/loop`
2. **修改** → `vim src/index.html`
3. **自动** → Hook 触发整个链路
4. **完成** → 代码已测试、提交、推送

所有这些都是自动的，您只需要专注于创意编码！
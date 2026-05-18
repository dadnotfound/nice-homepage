# Loop 自动化配置说明

## 概述

本项目已配置了完整的自动化 loop 系统，实现代码变更后自动测试、提交和推送。

## 配置文件

### `.looprc` - Loop 配置
```json
{
  "watch": [
    "src/**/*",
    "docs/**/*",
    "*.md",
    ".looprc"
  ],
  "ignore": [
    ".git/**",
    "*.log",
    "*.tmp",
    ".obsidian/**"
  ],
  "debounce": 1000,
  "command": "auto-test-and-push.sh",
  "onSuccess": "echo '✅ 测试通过，已自动推送'",
  "onError": "echo '❌ 测试失败，请手动检查'",
  "verbose": true
}
```

## 工作流程

### 1. 触发 Loop
```bash
# 启动自动化 loop
/loop

# 或指定监控间隔（秒）
/loop 30
```

### 2. 自动化流程
当检测到文件变更时，系统会自动执行：

#### 步骤 1：检测变更
- 监控：`src/`, `docs/`, `*.md` 文件
- 忽略：`.git/`, `*.log`, `*.tmp`, `.obsidian/`
- 防抖：1秒内多次变更只执行一次

#### 步骤 2：运行测试
- 检查 HTML 语法（如果安装了 tidy）
- 验证关键文件存在
- 检查 Git 状态

#### 步骤 3：自动提交
- 添加所有修改的文件
- 生成规范的提交信息
- 更新 CHANGELOG.md

#### 步骤 4：推送 GitHub
- 推送到远程仓库
- 显示最新提交记录

## 脚本文件

### `auto-test-and-push.sh` (Linux/macOS)
- 自动测试和推送脚本
- 需要执行权限（已设置）

### `auto-test-and-push.bat` (Windows)
- Windows 版本的批处理脚本
- 无需额外权限

## 使用示例

### 示例 1：修改 HTML 文件
```bash
# 1. 修改 src/index.html
vim src/index.html

# 2. Loop 自动检测并执行：
#    - 运行测试
#    - 提交代码
#    - 推送到 GitHub

# 3. 查看结果
git log --oneline -3
```

### 示例 2：更新文档
```bash
# 1. 修改 README.md
vim README.md

# 2. Loop 自动：
#    - 检测变更
#    - 测试文档完整性
#    - 提交并推送
```

## 特性

### ✅ 自动化特性
- **智能监控**：只监控相关文件
- **防抖处理**：避免频繁执行
- **错误处理**：测试失败时不会提交
- **详细日志**：显示执行过程

### ✅ 提交规范
- 使用自动化提交信息格式
- 自动更新 CHANGELOG
- 包含时间戳和作者信息

### ✅ 安全保障
- 测试通过才提交
- 保持 Git 历史清洁
- 遵循提交信息规范

## 注意事项

1. **首次使用**：确保已配置 Git 远程仓库
2. **Windows 用户**：使用 `.bat` 版本的脚本
3. **Git 配置**：确保已设置用户信息
4. **网络连接**：需要能够访问 GitHub

## 故障排除

### 如果 Loop 不工作
```bash
# 检查 .looprc 文件
cat .looprc

# 检查脚本权限
ls -la auto-test-and-push.sh

# 手动测试脚本
./auto-test-and-push.sh
```

### 如果推送失败
```bash
# 检查远程仓库
git remote -v

# 手动推送
git push origin main
```

### 如果测试失败
```bash
# 检查文件语法
tidy -q -e src/index.html

# 检查文件完整性
ls -la src/index.html CLAUDE.md docs/CHANGELOG.md
```

## 扩展配置

如果需要自定义配置，可以修改 `.looprc`：

```json
{
  "watch": ["src/**/*"],
  "command": "custom-test-script.sh",
  "debounce": 2000,
  "verbose": true
}
```

## 总结

这个自动化配置让您可以专注于代码开发，loop 会自动处理：
- 测试验证
- 代码提交
- GitHub 推送
- 变更记录
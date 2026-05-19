# 快速开始指南

## 自动化 Loop 系统

本项目已配置完整的自动化开发流程，让开发更简单！

### 🚀 一键启动

```bash
# 启动自动化 loop
/loop
```

### 📝 开发流程

#### 1. 启动 Loop
```bash
/loop
```

#### 2. 修改代码
```bash
# 修改主页面
vim src/index.html

# 或修改文档
vim docs/README.md
```

#### 3. 自动化处理
Loop 会自动：
- ✅ 检测代码变更
- ✅ 运行测试验证
- ✅ 提交到本地仓库
- ✅ 推送到 GitHub
- ✅ 更新变更记录

### 🔧 配置文件

- `.looprc` - Loop 配置
- `auto-test-and-push.sh` - Linux/macOS 脚本
- `auto-test-and-push.bat` - Windows 脚本

### 📋 监控的文件
- `src/` - 源代码
- `docs/` - 文档
- `*.md` - Markdown 文件

### 🎯 测试内容
- HTML 语法检查
- 文件完整性验证
- Git 状态检查
- 自动提交生成

### 💡 使用技巧

1. **专注开发**：只管写代码，其他交给 loop
2. **实时反馈**：每次修改都会立即测试
3. **自动提交**：符合规范的提交信息
4. **云端同步**：自动推送到 GitHub

### ⚠️ 注意事项

- 确保已配置 Git 远程仓库
- 首次使用前运行一次 `/loop`
- Windows 用户使用 `.bat` 版本

### 🎉 开始使用

```bash
# 1. 进入项目目录
cd /path/to/homepage

# 2. 启动自动化系统
/loop

# 3. 开始编写代码！
```

就这么简单！现在您只需要专注于创意，所有重复的工作都交给自动化系统处理。
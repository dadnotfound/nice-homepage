# 工作流程规约

> 核心教义：**代码即真理，文档即记忆，变更即契约**

## 变更管理三原则

### 1. 文档同步原则 (DocSync)
**铁律：任何代码变更必须在同一提交中更新对应文档**

#### 代码与文档映射关系
| 代码变更 | 必须更新的文档 | 更新内容 |
|---------|---------------|---------|
| index.html 功能修改 | docs/CHANGELOG.md | 记录版本号、日期、变更描述 |
| index.html 结构调整 | CLAUDE.md | 检查文件头部契约、目录结构 |
| 新增/删除文件 | src/README.md | 文件清单、模块说明 |
| 样式主题变更 | CLAUDE.md | 检查设计原则、质量度量 |

#### 更新检查清单 (每次代码修改后)
- [ ] L3 文件头部契约是否更新？
- [ ] L2 模块清单是否同步？
- [ ] L1 项目宪法是否调整？
- [ ] CHANGELOG.md 是否记录？

### 2. 代码验证原则 (CodeVerify)
**铁律：** **任何修改必须经过 Claude Code 原生 loop 自动化测试验证，才能提交推送**

#### 自动化 Loop 流程
```bash
# 1. 启动自动化 Loop
/loop

# 2. Loop 会自动：
#   - 监控代码变更（src/, docs/, *.md）
#   - 运行自动化测试
#   - 提交代码到本地仓库
#   - 推送到 GitHub 远程仓库
#   - 更新 CHANGELOG.md
#   - 显示执行结果

# 3. 监控的文件类型：
#   - src/index.html - 主要源代码
#   - docs/ - 项目文档
#   - *.md - 所有 Markdown 文件
#   - .looprc - 配置文件

# 4. 测试内容：
#   - HTML 语法检查
#   - 文件完整性验证
#   - Git 状态检查
#   - 自动生成提交信息
```

### 3. Git 提交原则 (GitCommit)
**铁律：** **必须使用规范化的提交信息格式**

#### 提交信息规范
```bash
# 格式：<类型>(<范围>): <描述>
# 
# 类型：
# feat: 新功能
# fix: 修复bug
# docs: 文档更新
# style: 格式调整
# refactor: 重构
# test: 测试相关
# chore: 构建或辅助工具变动

# 范围：
# main: 主页面核心功能
# docs: 文档系统
# build: 构建配置
# ci: 持续集成

# 示例：
# feat(main): 添加暗黑模式切换功能
# fix(docs): 修复CLAUDE.md目录结构描述错误
# style(main): 优化CSS变量命名
```

#### 提交命令模板
```bash
# 1. 添加文件
git add .

# 2. 检查变更
git diff --cached

# 3. 提交（使用模板）
git commit -m "$(cat <<'EOF'
feat(main): 新功能描述

- 功能点1的具体说明
- 功能点2的具体说明

Co-Authored-By: 奈思 <noreply@anthropic.com>
EOF
)"

# 4. 推送
git push origin main
```

#### 自动化验证脚本
未来可集成：
```bash
npm run test    # 单元测试
npm run lint    # 代码检查
npm run build   # 构建验证
```

### 3. Git 提交原则 (GitCommit)
**铁律：** **必须使用规范化的提交信息格式**

#### 提交信息规范
```bash
# 格式：<类型>(<范围>): <描述>
# 
# 类型：
# feat: 新功能
# fix: 修复bug
# docs: 文档更新
# style: 格式调整
# refactor: 重构
# test: 测试相关
# chore: 构建或辅助工具变动

# 范围：
# main: 主页面核心功能
# docs: 文档系统
# build: 构建配置
# ci: 持续集成

# 示例：
# feat(main): 添加暗黑模式切换功能
# fix(docs): 修复CLAUDE.md目录结构描述错误
# style(main): 优化CSS变量命名
```

#### 提交命令模板
```bash
# 1. 添加文件
git add .

# 2. 检查变更
git diff --cached

# 3. 提交（使用模板）
git commit -m "$(cat <<'EOF'
feat(main): 添加新功能描述

- 功能点1的具体说明
- 功能点2的具体说明

Co-Authored-By: 奈思 <noreply@anthropic.com>
EOF
)"

# 4. 推送
git push origin main
```

## 完整工作流程

### 自动化开发流程
```bash
# 1. 启动自动化 Loop
/loop

# 2. 专注修改代码
vim src/index.html
# 或修改文档
vim docs/README.md

# 3. Loop 会自动：
#   - 检测文件变更
#   - 运行测试
#   - 提交代码
#   - 推送到 GitHub
#   - 更新记录

# 4. 查看结果
git log --oneline -3
```

### 手动控制（可选）
```bash
# 如果需要手动控制
# 1. 修改代码
vim src/index.html

# 2. 手动运行测试
./auto-test-and-push.sh

# 3. 查看状态
git status
```

### 修复 Bug（自动化）
```bash
# 1. 启动 Loop
/loop

# 2. 定位并修复问题
# 使用浏览器开发者工具找出问题
vim src/index.html

# 3. Loop 自动处理：
#   - 检测到修复
#   - 运行回归测试
#   - 提交修复记录
#   - 推送到 GitHub

# 4. 验证修复
git log --oneline -3
```

### 重构代码（自动化）
```bash
# 1. 启动 Loop
/loop

# 2. 重构代码
# 保持功能不变，优化结构
vim src/index.html

# 3. Loop 自动处理：
#   - 检测代码变更
#   - 验证功能完整性
#   - 记录重构记录
#   - 自动推送到 GitHub

# 4. 检查重构结果
git show --stat
```

## 质量保证清单

### 提交前必检
- [ ] 代码通过 /loop 测试
- [ ] 文档已同步更新
- [ ] 提交信息符合规范
- [ ] 没有提交无关文件 (.log, .tmp 等)
- [ ] 浏览器兼容性已验证

### 代码质量自检
- [ ] 函数长度 < 20 行
- [ ] 缩进层数 ≤ 3
- [ ] 命名简洁直白
- [ ] 无重复逻辑
- [ ] 特殊情况已消除

### 文档完整性检查
- [ ] L3 文件头部契约准确
- [ ] L2 模块清单完整
- [ ] L1 项目宪法最新
- [ ] CHANGELOG.md 有记录

## 紧急修复流程

当需要紧急修复生产环境问题时：
```bash
# 1. 快速修复
git checkout main
vim src/index.html  # 修复问题

# 2. 简化测试
# 仅测试核心功能
# 跳过部分非关键验证

# 3. 快速提交
git add .
git commit -m "fix(main): 紧急修复生产问题"

# 4. 立即推送
git push origin main

# 5. 补充文档
# 事后更新 CHANGELOG.md
```

## 团队协作规范

### 代码审查
- 所有变更必须经过至少一次 self-review
- 关注点：功能正确性、代码质量、文档完整性

### 分支管理
- main 分支始终保持可发布状态
- 功能开发使用 feature 分支
- 修复使用 hotfix 分支

### 发布流程
1. 完成所有测试和文档更新
2. 创建版本标签
3. 推送到远程仓库
4. 部署到生产环境

---

[PROTOCOL]: 此文档必须随项目变更同步更新
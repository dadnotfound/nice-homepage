# nice-homepage - 电影票风格个人主页

> 现象层：创意十足的展示页面 | 本质层：时间可视化的个人品牌 | 哲学层：编程即艺术

<directory>
src/ - 源代码实现 (4子目录: css, js)
├── index.html - 精简版主页，电影票风格展示
├── thoughts.html - 新增思考页面，时间轴内容展示
├── test.html - 功能测试页面
├── css/ - 样式模块
│   ├── base.css - 基础样式模块
│   ├── ticket.css - 电影票专用样式
│   └── thoughts.css - 思考页面样式
└── js/ - JavaScript模块
    ├── utils.js - 工具函数模块
    ├── i18n.js - 国际化模块
    ├── ticket.js - 电影票逻辑
    └── navigator.js - 导航系统
└── wrangler.jsonc - Cloudflare Pages部署配置
</directory>

<config>
docs/ - 项目文档集合
├── README.md - 项目概述和快速开始
└── CHANGELOG.md - 版本更新记录
</config>


---

## 项目定位

**核心使命：** 创意个人品牌展示，电影票隐喻编程生活，新增思考分享功能

**技术选择：** 
- 纯前端实现，无框架依赖
- 静态托管优先
- 多页面架构（主页 + 思考页）
- 模块化设计

**设计原则：** 基于davidhckh/portfolio-2025的交互设计启示

---

## GEB 文档系统

### L1 项目宪法（本文件）
- 项目定位：电影票风格个人主页
- 技术栈：HTML/CSS/JS
- 目录结构：src/ docs/ assets/ examples/

### L2 模块地图
```
# src/
> L2 | 父级: ../CLAUDE.md

成员清单
index.html: 主页面实现，包含样式、脚本和交互逻辑
wrangler.jsonc: Cloudflare Pages部署配置文件
```


### L3 文件头部契约
```javascript
/**
 * [INPUT]: 无外部依赖，纯前端实现
 * [OUTPUT]: 提供电影票风格的个人主页界面
 * [POS]: 项目的核心展示层，负责用户界面和交互
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
```

---

## 开发原则

### 代码哲学
- **简化原则**：单文件实现，无复杂依赖
- **实用主义**：直接解决展示需求
- **设计自由**：不被历史束缚，只为创意表达

### 质量度量
- 代码规模：单文件 < 800 行
- 功能聚焦：单页面、单流程
- 部署简单：静态托管即可

---

## 架构设计

### 数据流
1. 时间数据 → JavaScript定时器
2. 场次计算 → 90分钟间隔算法
3. ASCII艺术 → 随机数生成器
4. UI更新 → DOM操作

### 关键模块
- **Session Engine**: 场次计算和切换
- **ASCII Generator**: 艺术头像生成
- **I18n System**: 双语言支持
- **Export API**: 票根导出功能

---

## 部署策略

### 静态托管
- Cloudflare Pages（推荐）
- GitHub Pages
- Netlify
- Vercel

### CI/CD（可选）
```yaml
# GitHub Actions示例
name: Deploy
on: push
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npx wrangler pages deploy src
```

---

## 扩展方向

### 可能的改进
- 暗黑模式切换
- 更多ASCII艺术类型
- 主题定制选项
- 动画效果增强

### 设计原则
保持简洁，避免过度工程化
新增功能必须服务于核心创意

---

[PROTOCOL]: 变更时更新此文档，然后检查各模块 CLAUDE.md
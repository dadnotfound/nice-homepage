# 源代码说明

这里是 nice-homepage 项目的核心源代码。

## 文件说明

### index.html
**主要功能：** 完整的电影票风格个人主页实现

**结构：**
```html
<!DOCTYPE html>
<html lang="zh">
<head>
  <!-- 样式定义 -->
  <style>
    /* CSS变量定义 */
    :root { /* ... */ }
    
    /* 基础样式 */
    body, * { /* ... */ }
    
    /* 组件样式 */
    .ticket, .stub, .body { /* ... */ }
    
    /* 动画效果 */
    @keyframes tearOut { /* ... */ }
  </style>
</head>
<body>
  <!-- HTML结构 -->
  <button class="lang-toggle">EN</button>
  <div class="ticket-wrapper">
    <div class="ticket">
      <!-- 票根部分 -->
      <div class="stub"> <!-- ... --> </div>
      <!-- 主体部分 -->
      <div class="body"> <!-- ... --> </div>
    </div>
  </div>
  <script>
    // JavaScript逻辑
    (function(){
      'use strict';
      
      // 国际化字典
      var DICT = { /* ... */ };
      
      // 场次引擎
      function getSession(now) { /* ... */ }
      
      // ASCII艺术生成器
      var ASCII = { /* ... */ };
      
      // 定时器控制
      function updateAll() { /* ... */ }
      
      // 撕票动画
      function triggerTear() { /* ... */ }
      
      // 导出功能
      document.getElementById('saveBtn').addEventListener('click', function(){ /* ... */ });
    })();
  </script>
</body>
</html>
```

### 核心模块说明

#### 1. 国际化系统 (I18n)
- 支持中英文切换
- 使用 localStorage 保存语言偏好
- 完整的字典映射

#### 2. 场次引擎 (Session Engine)
- 90分钟一个场次
- 16个编程相关场次名称
- 自动计算当前场次和剩余时间

#### 3. ASCII艺术生成器
- 15种不同的ASCII艺术类型
- 随机生成但保持可重现
- 根据场次自动切换

#### 4. 导出功能
- 使用Canvas API
- 支持导出PNG格式
- 保持原始样式

#### 5. 响应式设计
- 移动端自适应
- Ticket组件在手机上变为垂直布局
- 保持良好的用户体验

---

[PROTOCOL]: 变更时更新此文档，然后检查各模块 CLAUDE.md
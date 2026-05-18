/* ═══════════════════════════
   i18n — 国际化模块
   ═══════════════════════════ */

// 当前语言设置
let lang = localStorage.getItem('lang') || 'zh';

// 翻译词典
const DICT = {
  // 时间系统翻译
  zh: {
    session: '会话',
    saved: '已保存 ✓',

    // 会话名称
    sessions: [
      { name: '深度阅读', sub: '当下存在' },
      { name: '创意写作', sub: '灵感涌现' },
      { name: '编码时间', sub: '逻辑构建' },
      { name: '冥想反思', sub: '内在对话' },
      { name: '运动健身', sub: '身心合一' },
      { name: '学习成长', sub: '知识积累' },
      { name: '社交连接', sub: '关系构建' },
      { name: '艺术创作', sub: '美的表达' },
      { name: '自然体验', sub: '与自然对话' },
      { name: '规划整理', sub: '系统思维' },
      { name: '休息恢复', sub: '能量补充' },
      { name: '陪伴家人', sub: '情感交流' },
      { name: '烹饪美食', sub: '生活艺术' },
      { name: '观影学习', sub: '视觉思考' },
      { name: '音乐欣赏', sub: '精神共鸣' },
      { name: '整理记录', sub: '知识沉淀' }
    ],

    // 思考页面翻译
    thoughts: {
      title: '思考',
      back: '返回主页',
      allTags: '所有标签',
      tags: ['哲学', '技术', '生活', '设计', '创新'],
      backToHome: '返回主页'
    }
  },

  en: {
    session: 'SESSION',
    saved: 'Saved  ✓',

    // Session names
    sessions: [
      { name: 'Deep Reading', sub: 'Present Existence' },
      { name: 'Creative Writing', sub: 'Inspiration Flow' },
      { name: 'Coding Time', sub: 'Logic Building' },
      { name: 'Meditation', sub: 'Inner Dialogue' },
      { name: 'Exercise', sub: 'Mind-Body Unity' },
      { name: 'Learning', sub: 'Knowledge Growth' },
      { name: 'Social Connect', sub: 'Relationship Building' },
      { name: 'Art Creation', sub: 'Artistic Expression' },
      { name: 'Nature Experience', sub: 'Dialogue with Nature' },
      { name: 'Planning', sub: 'Systematic Thinking' },
      { name: 'Rest', sub: 'Energy Recharge' },
      { name: 'Family Time', sub: 'Emotional Connection' },
      { name: 'Cooking', sub: 'Culinary Art' },
      { name: 'Film Study', sub: 'Visual Thinking' },
      { name: 'Music Appreciation', sub: 'Spiritual Resonance' },
      { name: 'Reflection', sub: 'Knowledge Integration' }
    ],

    // Thoughts page translations
    thoughts: {
      title: 'Thoughts',
      back: 'Back to Home',
      allTags: 'All Tags',
      tags: ['Philosophy', 'Tech', 'Life', 'Design', 'Innovation'],
      backToHome: 'Back to Home'
    }
  }
};

// 切换语言
function toggleLang() {
  lang = lang === 'zh' ? 'en' : 'zh';
  localStorage.setItem('lang', lang);
  updateUI();
  return lang;
}

// 翻译函数
function t(key) {
  if (key.includes('.')) {
    const keys = key.split('.');
    let value = DICT[lang];
    for (const k of keys) {
      value = value[k];
    }
    return value || key;
  }
  return DICT[lang][key] || key;
}

// 获取当前语言
function getCurrentLang() {
  return lang;
}

// 应用UI更新
function updateUI() {
  // 更新语言切换按钮
  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.textContent = lang === 'zh' ? 'EN' : '中';
    document.documentElement.lang = lang;
  }
}

// 批量更新文本内容
function updateTexts(elements) {
  for (const [selector, key] of Object.entries(elements)) {
    const el = document.querySelector(selector);
    if (el) {
      el.textContent = t(key);
    }
  }
}

// 格式化日期
function formatDate(date, format = 'YYYY-MM-DD') {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  if (format === 'YYYY-MM-DD') {
    return `${year}-${month}-${day}`;
  } else if (format === 'MM/DD') {
    return `${month}/${day}`;
  }
  return `${year}-${month}-${day}`;
}

// 格式化时间
function formatTime(date) {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

// 获取完整会话信息（包含语言）
function getSessionInfo(index) {
  const session = DICT[lang].sessions[index] || DICT[lang].sessions[0];
  return {
    name: session.name,
    subtitle: session.sub,
    desc: session.desc
  };
}

// 导出
window.i18n = {
  t,
  toggleLang,
  getCurrentLang,
  updateUI,
  updateTexts,
  formatDate,
  formatTime,
  getSessionInfo,
  DICT
};

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
  updateUI();
});
/* ═══════════════════════════
   i18n — 国际化模块
   ═══════════════════════════ */

// 当前语言设置
let lang = localStorage.getItem('lang') || 'zh';

// 翻译词典
const DICT = {
  // 现有翻译
  zh: {
    cinema: '本地主机',
    stub: '存根',
    save: '保存票根',
    date: '日期',
    showtime: '场次',
    price: '票价',
    priceVal: '开源',
    seat: '127排 · 0.0.1座',
    admit: '凭票入场',
    countdown: '距离开机剩余',
    today: '今日场次',
    year: '年度天数',
    slogan: '人生如电影。走到摄影机后面去。',
    saved: '票根已保存 ✓',
    feishu: '飞书',

    // 新增思考页面翻译
    thoughts: {
      title: '思考',
      back: '返回主页',
      allTags: '所有标签',
      tags: ['哲学', '技术', '生活', '设计', '创新'],
      backToHome: '返回主页'
    }
  },

  en: {
    cinema: 'LOCALHOST',
    stub: 'STUB',
    save: 'SAVE TICKET',
    date: 'DATE',
    showtime: 'SHOW',
    price: 'PRICE',
    priceVal: 'OPEN SOURCE',
    seat: 'ROW 127 · SEAT 0.0.1',
    admit: 'ADMIT ONE',
    countdown: 'Until roll',
    today: 'REEL',
    year: 'DAYS',
    slogan: 'Life unfolds like a film. Step behind the camera.',
    saved: 'Ticket saved  ✓',
    feishu: 'Feishu',

    // 新增思考页面翻译
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
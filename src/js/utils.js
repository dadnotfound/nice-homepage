/* ═══════════════════════════
   utils — 工具函数模块
   ═══════════════════════════ */

// 简化版性能优化：节流函数
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 防抖函数
function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// 生成随机数（范围）
function random(min, max) {
  return Math.random() * (max - min) + min;
}

// 生成随机整数
function randomInt(min, max) {
  return Math.floor(random(min, max));
}

// 打乱数组
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 深度合并对象
function deepMerge(target, source) {
  const result = {...target};
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

// 从URL获取查询参数
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// 设置URL查询参数
function setQueryParam(param, value) {
  const url = new URL(window.location);
  url.searchParams.set(param, value);
  window.history.pushState({}, '', url);
}

// 格式化持续时间
function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

// 复制到剪贴板
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // 降级方案
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    const result = document.execCommand('copy');
    document.body.removeChild(textArea);
    return result;
  }
}

// 检查设备是否支持触摸
function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// 检查视口宽度
function getViewportWidth() {
  return Math.max(document.documentElement.clientWidth, window.innerWidth);
}

// 检查视口高度
function getViewportHeight() {
  return Math.max(document.documentElement.clientHeight, window.innerHeight);
}

// 检查是否在移动设备上
function isMobile() {
  return getViewportWidth() <= 768;
}

// 检查是否在平板设备上
function isTablet() {
  return getViewportWidth() > 768 && getViewportWidth() <= 1024;
}

// 检查是否在桌面设备上
function isDesktop() {
  return getViewportWidth() > 1024;
}

// 简单事件发布-订阅系统
const EventBus = {
  events: {},
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    return this;
  },
  off(event, callback) {
    if (!this.events[event]) return this;
    if (callback) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    } else {
      delete this.events[event];
    }
    return this;
  },
  emit(event, data) {
    if (!this.events[event]) return this;
    this.events[event].forEach(callback => callback(data));
    return this;
  }
};

// 延迟执行
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 数组分块
function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// 去重
function unique(array) {
  return [...new Set(array)];
}

// 导出
window.utils = {
  throttle,
  debounce,
  random,
  randomInt,
  shuffle,
  deepMerge,
  getQueryParam,
  setQueryParam,
  formatDuration,
  copyToClipboard,
  isTouchDevice,
  isMobile,
  isTablet,
  isDesktop,
  getViewportWidth,
  getViewportHeight,
  EventBus,
  delay,
  chunk,
  unique
};
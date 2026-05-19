/* ═══════════════════════════
   Time Logic — 时间管理系统模块
   哲学内核：时间即存在 · 每一刻都在流逝
   ═══════════════════════════ */

// 时间格式化工具
const TimeFormat = {
  // 格式化分钟秒数
  formatTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  },

  // 格式化小时分钟
  formatHours(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
};

// 时间管理器
class TimeManager {
  constructor() {
    this.lastSessionIdx = -1;
    this.currentSession = null;
    this.asciiTypes = [
      'moon','wave','circuit','constellation','geo','blueprint','diamond',
      'spiral','face','structure','waves','pcb','starfield','fractal','terminal','symbol'
    ];
  }

  // 获取当前会话
  getSession(now) {
    if (!(now instanceof Date)) now = new Date(now);
    const midnight = new Date(now);
    midnight.setHours(0,0,0,0);
    const minsSinceMidnight = (now - midnight) / 60000;
    const idx = Math.min(Math.floor(minsSinceMidnight / 90), 15);
    const start = new Date(midnight.getTime() + idx * 90 * 60000);
    const end = new Date(start.getTime() + 90 * 60000);
    return {
      index: idx,
      ascii: this.asciiTypes[idx],
      start: start,
      end: end,
      remaining: Math.max(0, end - now)
    };
  }

  // 获取会话信息
  getSessionInfo(index) {
    return i18n.getSessionInfo(index);
  }

  // 更新所有时间信息
  updateAll() {
    const now = new Date();
    this.currentSession = this.getSession(now);

    // 更新会话信息
    const s = this.getSessionInfo(this.currentSession.index);
    const sessionName = document.getElementById('sessionName');
    const sessionSubtitle = document.getElementById('sessionSubtitle');

    if (sessionName) sessionName.textContent = s.name;
    if (sessionSubtitle) {
      sessionSubtitle.textContent = `· ${s.subtitle}`;
    }

    // 更新元数据网格
    const sessionValue = document.getElementById('sessionValue');
    const yearValue = document.getElementById('yearValue');
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);

    if (sessionValue) {
      sessionValue.textContent = `${this.currentSession.index + 1}/16`;
    }
    if (yearValue) {
      const yearStart = new Date(now.getFullYear(), 0, 1);
      const yearEnd = new Date(now.getFullYear() + 1, 0, 1);
      const totalDays = Math.round((yearEnd - yearStart) / 86400000);
      yearValue.textContent = `${dayOfYear}/${totalDays}`;
    }

    // 更新倒计时
    const countdown = document.getElementById('countdown');
    if (countdown) {
      countdown.textContent = `⏱ ${TimeFormat.formatTime(this.currentSession.remaining)} left`;
    }

    // 更新进度条
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
      const progress = 100 - (this.currentSession.remaining / (90 * 60000) * 100);
      // 使用CSS transition实现平滑过渡
      progressFill.style.transition = 'width 1s linear';
      progressFill.style.width = `${progress}%`;
    }

    // 更新电影胶片进度
    this.updateFilmReel();

    // 更新会话切换
    if (this.lastSessionIdx !== -1 && this.lastSessionIdx !== this.currentSession.index) {
      this.triggerSessionChange();
    }
    this.lastSessionIdx = this.currentSession.index;
  }

  // 触发会话切换动画
  triggerSessionChange() {
    const timeSection = document.querySelector('.time-section');
    if (timeSection) {
      timeSection.style.opacity = '0';
      setTimeout(() => {
        this.updateAll();
        timeSection.style.opacity = '1';
      }, 300);
    }
  }

  // 更新电影胶片显示
  updateFilmReel() {
    const frames = document.querySelectorAll('.film-frame');
    const filmProgress = document.getElementById('filmProgress');

    if (!frames.length || !filmProgress) return;

    // 计算当前进度百分比
    const progressPercent = ((this.currentSession.index + 1) / 16) * 100;

    // 更新CSS变量
    document.documentElement.style.setProperty('--progress', `${progressPercent}%`);

    // 更新每个电影帧的状态
    frames.forEach((frame, index) => {
      frame.classList.remove('active', 'completed');
      if (index < this.currentSession.index) {
        frame.classList.add('completed');
      } else if (index === this.currentSession.index) {
        frame.classList.add('active');
      }
    });

    // 更新会话提示
    this.updateSessionTip();
  }

  // 更新当前会话提示
  updateSessionTip() {
    const tip = document.getElementById('sessionTip');
    if (!tip) return;

    const currentSessionNum = this.currentSession.index + 1;
    const totalTime = 90; // 90分钟
    const remaining = Math.floor(this.currentSession.remaining / 60000); // 转换为分钟

    tip.querySelector('.tip-title').textContent = `Session ${currentSessionNum} - ${this.getSessionInfo(this.currentSession.index).name}`;
    tip.querySelector('.tip-desc').textContent = `A 90-minute journey of focus and creation - ${remaining} minutes remaining`;
  }

  // 获取剩余时间
  getRemaining() {
    return this.currentSession ? this.currentSession.remaining : 0;
  }

  // 导出时间信息
  exportTimeInfo() {
    const toast = document.getElementById('toast');
    if (!toast) return;

    const session = this.currentSession;
    const s = this.getSessionInfo(session.index);

    // 创建时间信息文本
    const timeInfo = `时间即存在 · Time is Existence

会话 · Session ${session.index + 1}
名称 · Name: ${s.name}
状态 · Status: ${TimeFormat.formatTime(session.remaining)} remaining
开始 · Start: ${TimeFormat.formatHours(session.start)}
结束 · End: ${TimeFormat.formatHours(session.end)}

导出时间 · Exported: ${new Date().toLocaleString('zh-CN')}`;

    // 复制到剪贴板
    navigator.clipboard.writeText(timeInfo).then(() => {
      if (toast) {
        toast.textContent = i18n.t('saved');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
      }
    }).catch(err => {
      console.error('Failed to copy to clipboard:', err);
    });
  }
}

// 初始化时间管理系统
function initTicket() {
  const timeManager = new TimeManager();

  // 初始化i18n
  i18n.updateUI();
  updateAll();

  // 初始化电影胶片
  initFilmReel();

  // 设置定时器
  setInterval(() => timeManager.updateAll(), 1000);


  // 导出时间信息
  const saveBtn = document.getElementById('saveBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      timeManager.exportTimeInfo();
    });
  }

  // 保存到window全局（保持兼容）
  window.timeManager = timeManager;

  // 模拟旧的sessionManager变量（如果需要）
  window.sessionManager = timeManager;
}

// 初始化电影胶片
function initFilmReel() {
  const filmTrack = document.getElementById('filmTrack');
  if (!filmTrack) return;

  const sessionNames = [
    'Sleep', 'Exercise', 'Plan', 'Deep Work',
    'Creative', 'Code', 'Meet', 'Design',
    'Read', 'Write', 'Think', 'Rest',
    'Connect', 'Create', 'Learn', 'Reflect'
  ];

  // 创建16个电影帧
  sessionNames.forEach((name, index) => {
    const frame = document.createElement('div');
    frame.className = 'film-frame';
    frame.dataset.index = index;
    frame.dataset.title = name;
    frame.textContent = index + 1;
    filmTrack.appendChild(frame);
  });
}

// 更新所有内容
function updateAll() {
  if (window.sessionManager) {
    window.sessionManager.updateAll();
  }
}

// 导出
window.ticket = {
  TimeFormat,
  TimeManager,
  init: initTicket,
  updateAll: updateAll
};
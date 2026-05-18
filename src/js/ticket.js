/* ═══════════════════════════
   Ticket Logic — 电影票功能模块
   ═══════════════════════════ */

// ASCII艺术生成器
const ASCII = {
  _seed: Math.floor(Math.random() * 2147483647),

  // 伪随机数生成器
  _rng() {
    this._seed = (this._seed * 16807 + 0) % 2147483647;
    return (this._seed - 1) / 2147483646;
  },

  // 从数组中随机选择
  pick(arr) {
    return arr[Math.floor(this._rng() * arr.length)];
  },

  // 脸部
  face() {
    const e = this.pick(['● ●','o o','• •','O O','@ @']);
    const m = this.pick(['____','────','﹏﹏﹏','~~~~']);
    return '  .---.\n | '+e+' |\n |  '+m+'  |\n  \'---\'';
  },

  // 钻石
  diamond() {
    const c = '◆', f = '·', n = 4, r = [];
    for (let i = 0; i < n; i++) {
      const s = ' '.repeat(n-i-1);
      r.push(i === 0 ? s + c : s + c + f.repeat(i*2-1) + c);
    }
    for (let i = n-2; i >= 0; i--) {
      const s = ' '.repeat(n-i-1);
      r.push(i === 0 ? s + c : s + c + f.repeat(i*2-1) + c);
    }
    return r.join('\n');
  },

  // 波浪
  wave() {
    const r = [], w = 13;
    for (let y = 0; y < 7; y++) {
      const l = '';
      for (let x = 0; x < w; x++) {
        const v = Math.sin(x/3+y/1.5) * Math.cos(y/2+x/4);
        l += v > 0.3 ? '~' : v < -0.3 ? '≈' : Math.abs(v) < 0.15 ? '·' : ' ';
      }
      r.push(l);
    }
    return r.join('\n');
  },

  // 星座
  constellation() {
    const stars = ['✦','✧','·','•','⋆'], w = 14, h = 9;
    const g = [];
    for (let y = 0; y < h; y++) {
      g[y] = [];
      for (let x = 0; x < w; x++) g[y][x] = ' ';
    }
    for (let i = 0; i < 8; i++) g[Math.floor(this._rng()*h)][Math.floor(this._rng()*w)] = this.pick(stars);
    const r = [];
    for (let y = 0; y < h; y++) r.push(g[y].join(''));
    return r.join('\n');
  },

  // 电路板
  circuit() {
    const w = 13, h = 8, g = [];
    for (let y = 0; y < h; y++) {
      g[y] = [];
      for (let x = 0; x < w; x++) g[y][x] = ' ';
    }
    for (let y = 1; y < h; y += 2) {
      for (let x = 0; x < w; x++) {
        if (this._rng() > 0.3) g[y][x] = '─';
      }
    }
    for (let x = 1; x < w; x += 3) {
      for (let y = 0; y < h; y++) {
        if (g[y][x] === '─') g[y][x] = '┼';
        else if (this._rng() > 0.4) g[y][x] = '│';
      }
    }
    for (let i = 0; i < 6; i++) g[Math.floor(this._rng()*h)][Math.floor(this._rng()*w)] = this.pick(['●','○','◉','◆']);
    const r = [];
    for (let y = 0; y < h; y++) r.push(g[y].join(''));
    return r.join('\n');
  },

  // 地图
  geo: function() { return this.diamond(); },

  // 结构
  structure() {
    const t = ['▀','▄','█','▌','▐'], r = [];
    for (let y = 0; y < 7; y++) {
      const l = '';
      for (let x = 0; x < 11; x++) l += this.pick(t);
      r.push(l);
    }
    return r.join('\n');
  },

  // 分形
  fractal() {
    const r = [], w = 15;
    for (let y = 0; y < 9; y++) {
      const l = '';
      for (let x = 0; x < w; x++) {
        const v = (x^y)/3%1;
        l += v < 0.25 ? '▓' : v < 0.5 ? '▒' : v < 0.75 ? '░' : ' ';
      }
      r.push(l);
    }
    return r.join('\n');
  },

  // 蓝图
  blueprint() {
    const r = [], w = 13;
    for (let y = 0; y < 7; y++) {
      const l = '';
      for (let x = 0; x < w; x++) {
        l += (y%2===0||x%3===0) ? '┼' : ' ';
      }
      r.push(l);
    }
    return r.join('\n');
  },

  // 月亮
  moon() { return '    ☽\n   ☽  \n  ✦   \n   ·  '; },

  // 螺旋
  spiral() {
    const n = 5, r = [];
    for (let i = 0; i < n; i++) {
      const s = ' '.repeat(n-i-1);
      r.push(s+'@'+'·'.repeat(i*2-1)+(i>0?'@':''));
    }
    for (let i = n-2; i >= 0; i--) {
      const s = ' '.repeat(n-i-1);
      r.push(s+'@'+'·'.repeat(i*2-1)+(i>0?'@':''));
    }
    return r.join('\n');
  },

  // 终端
  terminal() { return ' > _\n > ./build\n > deploy\n > ...\n > done  ✓'; },

  // 波浪2
  waves() {
    const r = [], w = 13;
    for (let y = 0; y < 7; y++) {
      const l = '';
      for (let x = 0; x < w; x++) {
        const v = Math.sin(x/2+y) * Math.cos(y+x/3);
        l += v > 0.4 ? '◠' : v < -0.4 ? '◡' : '~';
      }
      r.push(l);
    }
    return r.join('\n');
  }
};

// ASCII映射表
const ASCII_MAP = {
  moon: () => ASCII.moon(),
  wave: () => ASCII.wave(),
  circuit: () => ASCII.circuit(),
  constellation: () => ASCII.constellation(),
  geo: () => ASCII.geo(),
  blueprint: () => ASCII.blueprint(),
  diamond: () => ASCII.diamond(),
  spiral: () => ASCII.spiral(),
  face: () => ASCII.face(),
  structure: () => ASCII.structure(),
  pcb: () => ASCII.circuit(),
  starfield: () => ASCII.constellation(),
  terminal: () => ASCII.terminal(),
  fractal: () => ASCII.fractal(),
  symbol: () => '  ◆ ◇ ◆\n ◇ ◆ ◇\n  ◆ ◇ ◆',
  waves: () => ASCII.waves()
};

// 会话管理器
class SessionManager {
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

  // 更新所有会话信息
  updateAll() {
    const now = new Date();
    this.currentSession = this.getSession(now);

    // 更新场次文本
    const s = this.getSessionInfo(this.currentSession.index);
    document.getElementById('filmTitle').textContent = s.name;
    document.getElementById('filmSubtitle').textContent = s.sub;

    // 更新日期
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    document.getElementById('metaDate').textContent = `${year}-${month}-${day}`;

    // 更新场次时间
    const startHours = String(this.currentSession.start.getHours()).padStart(2, '0');
    const startMinutes = String(this.currentSession.start.getMinutes()).padStart(2, '0');
    const endHours = String(this.currentSession.end.getHours()).padStart(2, '0');
    const endMinutes = String(this.currentSession.end.getMinutes()).padStart(2, '0');
    document.getElementById('metaShowtime').textContent =
      `${startHours}:${startMinutes} — ${endHours}:${endMinutes}`;

    // 更新倒计时
    const remaining = this.currentSession.remaining;
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    const countdownEl = document.getElementById('countdown');
    countdownEl.textContent = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
    countdownEl.classList.toggle('urgent', remaining < 60000);

    // 更新今日进度
    const idx = this.currentSession.index;
    document.getElementById('todayFill').style.width = `${((idx + 1) / 16 * 100).toFixed(1)}%`;
    document.getElementById('todayPct').textContent = `${idx + 1}/16`;

    // 更新年度进度
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year + 1, 0, 1);
    const totalDays = Math.round((yearEnd - yearStart) / 86400000);
    const dayOfYear = Math.floor((now - yearStart) / 86400000) + 1;
    document.getElementById('yearFill').style.width = `${(dayOfYear / totalDays * 100).toFixed(1)}%`;
    document.getElementById('yearPct').textContent = `${dayOfYear}/${totalDays}`;

    // 处理会话切换
    if (this.lastSessionIdx !== -1 && this.lastSessionIdx !== idx) {
      this.triggerTear();
    }
    this.lastSessionIdx = idx;
  }

  // 触发撕裂动画
  triggerTear() {
    const ticket = document.getElementById('ticket');
    ASCII._seed = Math.floor(Math.random() * 2147483647);
    ticket.classList.add('tearing');

    setTimeout(() => {
      this.updateAvatar();
      this.updateAll();
      ticket.classList.remove('tearing');
      ticket.classList.add('fresh');
      setTimeout(() => { ticket.classList.remove('fresh'); }, 500);
    }, 450);
  }

  // 更新头像
  updateAvatar() {
    if (!this.currentSession) return;
    const gen = ASCII_MAP[this.currentSession.ascii] || ASCII.face;
    document.getElementById('avatar').textContent = gen();
  }

  // 获取剩余时间
  getRemaining() {
    return this.currentSession ? this.currentSession.remaining : 0;
  }

  // 导出票据
  async exportTicket() {
    const ticket = document.getElementById('ticket');
    const toast = document.getElementById('toast');
    const rect = ticket.getBoundingClientRect();
    const scale = 2;

    const canvas = document.createElement('canvas');
    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);

    // 获取样式
    const styles = Array.from(document.querySelectorAll('style')).map(s => s.textContent).join('\n');
    const html = ticket.outerHTML;
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${rect.width}" height="${rect.height}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml">
            <style>${styles}</style>
            ${html}
          </div>
        </foreignObject>
      </svg>
    `;

    // 生成图片
    const img = new Image();
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      canvas.toBlob((blob) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        const s = this.getSessionInfo(this.currentSession ? this.currentSession.index : 0);
        a.download = `ticket-${s.name.replace(/\s/g, '-')}.png`;
        a.click();

        toast.textContent = i18n.t('saved');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
      }, 'image/png');
    };

    img.src = url;
  }
}

// 初始化票据功能
function initTicket() {
  const sessionManager = new SessionManager();

  // 初始化i18n
  i18n.updateUI();
  updateAll();
  sessionManager.updateAvatar();

  // 设置定时器
  setInterval(() => sessionManager.updateAll(), 1000);

  // 绑定事件
  document.getElementById('langToggle').addEventListener('click', () => {
    i18n.toggleLang();
  });

  document.getElementById('saveBtn').addEventListener('click', () => {
    sessionManager.exportTicket();
  });

  // 返回当前实例
  window.sessionManager = sessionManager;
}

// 更新所有内容
function updateAll() {
  if (window.sessionManager) {
    window.sessionManager.updateAll();
  }
}

// 导出
window.ticket = {
  ASCII,
  ASCII_MAP,
  SessionManager,
  init: initTicket,
  updateAll: updateAll
};
/* ═══════════════════════════
   Navigator — 页面导航与动画管理
   ═══════════════════════════ */

// 页面导航管理器
class Navigator {
  constructor() {
    this.currentPage = 'home';
    this.transitioning = false;
    this.container = document.body;
    this.thoughtsContainer = null;
    this.init();
  }

  init() {
    // 初始化页面
    this.detectCurrentPage();
    this.setupTransitions();

    // 绑定导航事件
    this.bindNavigationEvents();
  }

  // 检测当前页面
  detectCurrentPage() {
    if (window.location.pathname.endsWith('/thoughts.html')) {
      this.currentPage = 'thoughts';
      this.thoughtsContainer = document.getElementById('thoughtsContainer');
    } else {
      this.currentPage = 'home';
    }
  }

  // 设置过渡效果
  setupTransitions() {
    // 添加CSS类以启用过渡
    this.container.style.transition = 'opacity 0.5s ease';

    // 思考页面特定设置
    if (this.thoughtsContainer) {
      this.thoughtsContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    }
  }

  // 绑定导航事件
  bindNavigationEvents() {
    // 监听导航按钮点击
    document.addEventListener('navigate:home', () => {
      this.navigateTo('home');
    });

    document.addEventListener('navigate:thoughts', () => {
      this.navigateTo('thoughts');
    });

    // 监听浏览器前进/后退
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.page) {
        this.currentPage = e.state.page;
        this.updateUI();
      }
    });

    // 处理页面加载动画
    window.addEventListener('load', () => {
      this.container.style.opacity = '1';
    });
  }

  // 导航到指定页面
  async navigateTo(page, options = {}) {
    if (this.transitioning || page === this.currentPage) return;

    this.transitioning = true;
    const animationType = options.animation || 'slide';
    const direction = options.direction || 'forward';

    try {
      // 触发离开动画
      await this.handlePageLeave(page, animationType, direction);

      // 更新URL（可选）
      if (options.updateUrl !== false) {
        this.updateURL(page);
      }

      // 切换页面
      this.currentPage = page;

      // 触发进入动画
      await this.handlePageEnter(page, animationType, direction);

      // 完成过渡
      this.transitioning = false;

      // 触发页面就绪事件
      this.emit('page:ready', { page });

    } catch (error) {
      console.error('Navigation error:', error);
      this.transitioning = false;
    }
  }

  // 处理页面离开动画
  async handlePageLeave(targetPage, animationType, direction) {
    return new Promise((resolve) => {
      const homeContent = document.querySelector('.ticket-wrapper');
      const thoughtsContent = document.querySelector('.thoughts-container');

      switch (animationType) {
        case 'slide':
          if (this.currentPage === 'home' && targetPage === 'thoughts') {
            // 主页离开动画
            if (homeContent) {
              homeContent.style.transform = 'translateX(-100%)';
              homeContent.style.opacity = '0';
            }
            setTimeout(resolve, 300);
          } else if (this.currentPage === 'thoughts' && targetPage === 'home') {
            // 思考页离开动画
            if (thoughtsContent) {
              thoughtsContent.style.transform = 'translateX(100%)';
              thoughtsContent.style.opacity = '0';
            }
            setTimeout(resolve, 300);
          }
          break;

        case 'fade':
          if (homeContent) {
            homeContent.style.opacity = '0';
          }
          if (thoughtsContent) {
            thoughtsContent.style.opacity = '0';
          }
          setTimeout(resolve, 300);
          break;

        case 'scale':
          if (homeContent) {
            homeContent.style.transform = 'scale(0.8)';
            homeContent.style.opacity = '0.3';
          }
          if (thoughtsContent) {
            thoughtsContent.style.transform = 'scale(0.8)';
            thoughtsContent.style.opacity = '0.3';
          }
          setTimeout(resolve, 300);
          break;

        default:
          resolve();
      }
    });
  }

  // 处理页面进入动画
  async handlePageEnter(targetPage, animationType, direction) {
    return new Promise((resolve) => {
      const homeContent = document.querySelector('.ticket-wrapper');
      const thoughtsContent = document.querySelector('.thoughts-container');

      switch (animationType) {
        case 'slide':
          if (targetPage === 'home' && homeContent) {
            homeContent.style.transform = 'translateX(0)';
            homeContent.style.opacity = '1';
          } else if (targetPage === 'thoughts' && thoughtsContent) {
            thoughtsContent.style.transform = 'translateX(0)';
            thoughtsContent.style.opacity = '1';
          }
          setTimeout(resolve, 300);
          break;

        case 'fade':
          if (targetPage === 'home' && homeContent) {
            homeContent.style.opacity = '1';
          } else if (targetPage === 'thoughts' && thoughtsContent) {
            thoughtsContent.style.opacity = '1';
          }
          setTimeout(resolve, 300);
          break;

        case 'scale':
          if (targetPage === 'home' && homeContent) {
            homeContent.style.transform = 'scale(1)';
            homeContent.style.opacity = '1';
          } else if (targetPage === 'thoughts' && thoughtsContent) {
            thoughtsContent.style.transform = 'scale(1)';
            thoughtsContent.style.opacity = '1';
          }
          setTimeout(resolve, 300);
          break;

        default:
          resolve();
      }
    });
  }

  // 更新URL
  updateURL(page) {
    const url = page === 'thoughts' ? 'thoughts.html' : 'index.html';
    if (window.location.pathname !== url) {
      history.pushState({ page }, '', url);
    }
  }

  // 更新UI状态
  updateUI() {
    // 更新导航按钮状态
    const thoughtsBtn = document.getElementById('thoughtsBtn');
    const backBtn = document.getElementById('backBtn');

    if (this.currentPage === 'home' && thoughtsBtn) {
      thoughtsBtn.style.display = 'inline-flex';
    }

    if (this.currentPage === 'thoughts' && backBtn) {
      backBtn.style.display = 'inline-flex';
    }

    // 更新页面标题
    const title = document.title;
    if (this.currentPage === 'thoughts') {
      document.title = '思考 - nice';
    } else {
      document.title = 'nice — 编程即艺术';
    }

    // 触发页面就绪事件
    this.emit('page:ready', { page: this.currentPage });
  }

  // 获取当前页面
  getCurrentPage() {
    return this.currentPage;
  }

  // 检查是否正在过渡
  isTransitioning() {
    return this.transitioning;
  }

  // 事件发射器
  emit(event, data) {
    const customEvent = new CustomEvent(event, { detail: data });
    document.dispatchEvent(customEvent);
  }

  // 事件监听器
  on(event, callback) {
    document.addEventListener(event, (e) => callback(e.detail));
  }

  // 移除事件监听器
  off(event, callback) {
    document.removeEventListener(event, callback);
  }
}

// 导航按钮处理器
class NavigationButtons {
  constructor(navigator) {
    this.navigator = navigator;
    this.init();
  }

  init() {
    // 主页导航按钮
    const thoughtsBtn = document.getElementById('thoughtsBtn');
    if (thoughtsBtn) {
      thoughtsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigator.navigateTo('thoughts', {
          animation: 'slide',
          direction: 'forward'
        });
      });
    }

    // 返回按钮
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
      backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigator.navigateTo('home', {
          animation: 'slide',
          direction: 'backward'
        });
      });
    }

    // 监听页面就绪事件
    document.addEventListener('page:ready', (e) => {
      this.handlePageReady(e.detail.page);
    });
  }

  // 处理页面就绪
  handlePageReady(page) {
    // 添加过渡效果类
    document.body.classList.remove('home-ready', 'thoughts-ready');
    document.body.classList.add(`${page}-ready`);

    // 添加进入动画
    if (page === 'home') {
      const ticket = document.getElementById('ticket');
      if (ticket) {
        ticket.classList.add('fresh');
        setTimeout(() => ticket.classList.remove('fresh'), 500);
      }
    }
  }
}

// 页面生命周期管理
class PageLifecycle {
  constructor(navigator) {
    this.navigator = navigator;
    this.init();
  }

  init() {
    // 监听页面显示/隐藏
    document.addEventListener('visibilitychange', () => {
      this.handleVisibilityChange();
    });

    // 监听页面卸载
    window.addEventListener('beforeunload', () => {
      this.handlePageUnload();
    });

    // 处理页面可见性变化
    this.handleVisibilityChange();
  }

  // 处理可见性变化
  handleVisibilityChange() {
    if (document.hidden) {
      // 页面隐藏
      this.navigator.emit('page:hidden');
      this.pauseAnimations();
    } else {
      // 页面显示
      this.navigator.emit('page:shown');
      this.resumeAnimations();
    }
  }

  // 暂停动画
  pauseAnimations() {
    // 暂停CSS动画
    const animatedElements = document.querySelectorAll('.animated');
    animatedElements.forEach(el => {
      el.style.animationPlayState = 'paused';
    });

    // 暂停倒计时
    if (window.sessionManager) {
      clearInterval(window.sessionManager.updateInterval);
    }
  }

  // 恢复动画
  resumeAnimations() {
    // 恢复CSS动画
    const animatedElements = document.querySelectorAll('.animated');
    animatedElements.forEach(el => {
      el.style.animationPlayState = 'running';
    });

    // 恢复倒计时
    if (window.sessionManager) {
      window.sessionManager.updateInterval = setInterval(() => {
        window.sessionManager.updateAll();
      }, 1000);
    }
  }

  // 处理页面卸载
  handlePageUnload() {
    this.navigator.emit('page:unload');
  }
}

// 初始化导航系统
function initNavigator() {
  const navigator = new Navigator();
  const navigationButtons = new NavigationButtons(navigator);
  const pageLifecycle = new PageLifecycle(navigator);

  // 暴露到全局
  window.Navigator = Navigator;
  window.NavigationButtons = NavigationButtons;
  window.PageLifecycle = PageLifecycle;
  window.navigatorInstance = navigator;

  return navigator;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 初始化导航系统
  const navigator = initNavigator();

  // 调试信息
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('Navigator initialized, current page:', navigator.getCurrentPage());
  }
});
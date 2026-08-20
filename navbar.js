// navbar.js - v18（修复高/中优先级问题）
(function() {
  'use strict';

  const NAVBAR_HTML = `
  <header class="navbar-header" id="mainNavbar">
    <div class="navbar-row-top">
      <div class="navbar-left">
        <span class="navbar-logo">
          <img src="avatar.jpg" alt="logo" />
        </span>
        <span class="navbar-site-name">走进新天地·Railway</span>
      </div>
      <nav class="navbar-nav" id="navLinks">
        <a href="index">首页</a>
        <a href="videos">视频</a>
        <a href="photos">照片</a>
        <a href="materials">资料</a>
        <a href="wiki">Wiki</a>
        <a href="articles">图文</a>
        <a href="announcements">报站</a>
        <a href="progress-tracking">进度跟踪</a>
        <a href="tools">工具</a>
      </nav>
      <div class="navbar-time" id="timeDisplay">
        <span id="timeBarText"></span>
      </div>
      <button class="navbar-menu-btn" id="mobileMenuBtn" aria-label="菜单">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    </div>
  </header>
  `;

  const NAVBAR_CSS = `
  body { margin: 0 !important; }

  .navbar-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: #111827;
    z-index: 10000;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    box-sizing: border-box;
  }

  .navbar-row-top {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    max-width: 1200px;
    margin: 0 auto;
    padding: 10px 24px 10px 10px;
    min-height: 60px;
    box-sizing: border-box;
    gap: 8px 16px;
  }

  .navbar-left {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
    margin-left: 0;
  }
  .navbar-logo {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    cursor: default;
  }
  .navbar-logo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .navbar-site-name {
    font-size: 16px;
    font-weight: 600;
    color: white;
    white-space: nowrap;
  }

  .navbar-nav {
    display: flex;
    gap: 8px;
    flex: 0 1 auto;
    flex-wrap: nowrap;
    margin-left: auto;
  }
  .navbar-nav a {
    padding: 6px 14px;
    border-radius: 8px;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    transition: background 0.3s, color 0.3s;
    white-space: nowrap;
  }
  .navbar-nav a:hover {
    background: #374151;
    color: white;
  }
  .navbar-nav a.active {
    background: #2563eb;
    color: white;
  }

  .navbar-time {
    flex: 0 1 auto;
    text-align: center;
    font-size: 14px;
    color: #ffffff;
    font-weight: 500;
    white-space: nowrap;
    padding: 4px 0;
    margin-left: auto;
  }
  .navbar-time span {
    cursor: pointer;
    user-select: none;
    display: inline-block;
    transition: transform 0.1s ease;
    transform-origin: center;
  }

  .navbar-menu-btn {
    display: none;
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 4px;
    width: 32px;
    height: 32px;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-left: 4px;
  }

  /* 平板断点 */
  @media (min-width: 769px) and (max-width: 1024px) {
    .navbar-row-top {
      padding: 6px 16px 6px 20px;
      gap: 6px 12px;
    }
    .navbar-time {
      flex: 0 1 100%;
      text-align: left;
      order: 3;
      margin-left: 0;
      padding: 2px 0;
    }
    .navbar-nav {
      order: 1;
      margin-left: auto;
    }
    .navbar-left {
      order: 0;
    }
  }

  /* 窄平板压缩菜单间距 */
  @media (min-width: 769px) and (max-width: 900px) {
    .navbar-nav a { padding: 6px 10px; font-size: 13px; }
    .navbar-nav { gap: 6px; }
  }
  @media (min-width: 769px) and (max-width: 820px) {
    .navbar-nav a { padding: 6px 8px; font-size: 13px; }
    .navbar-nav { gap: 4px; }
  }

  /* 手机断点 */
  @media (max-width: 768px) {
    .navbar-row-top {
      padding: 8px 20px 6px 20px;
      gap: 4px 8px;
      min-height: 56px;
    }
    .navbar-site-name {
      font-size: 14px;
    }
    .navbar-time {
      order: 2;
      flex: 0 1 100%;
      text-align: left;
      margin-left: 0;
      color: #ffffff;
      font-size: 13px;
      padding: 4px 0 2px 0;
    }
    .navbar-menu-btn {
      display: flex;
      order: 1;
      margin-left: auto;
    }
    .navbar-left {
      order: 0;
    }
    .navbar-nav {
      order: 3;
      flex-basis: 100%;
      flex-direction: column;
      gap: 0;
      background: #1f2937;
      border-top: 1px solid rgba(255,255,255,0.06);
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      transform: translateY(-10px);
      margin-left: 0;
      transition: max-height 0.35s ease, opacity 0.3s ease, transform 0.3s ease;
    }
    .navbar-nav.active {
      max-height: 500px;
      opacity: 1;
      transform: translateY(0);
    }
    .navbar-nav a {
      padding: 12px 20px;
      border-radius: 0;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      font-size: 14px;
      white-space: normal;
    }
    .navbar-nav a:last-child {
      border-bottom: none;
    }
  }

  /* ===== 返回顶部按钮 ===== */
  .navbar-back-to-top {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 40px;
    height: 40px;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 16px rgba(37,99,235,0.35);
    transition: opacity 0.3s, transform 0.3s;
    opacity: 0;
    visibility: hidden;
    z-index: 10001;
  }
  .navbar-back-to-top.visible {
    opacity: 1;
    visibility: visible;
  }
  .navbar-back-to-top:hover {
    background: #1d4ed8;
    transform: translateY(-4px);
  }

  /* ===== 问号按钮（修复间距） ===== */
  .navbar-help-btn {
    position: fixed;
    bottom: 80px;
    right: 30px;
    width: 40px;
    height: 40px;
    background: #6b7280;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transition: all 0.3s ease;
    z-index: 10001;
    overflow: hidden;
    white-space: nowrap;
    padding: 0;
  }
  .navbar-help-btn svg {
    width: 28px;
    height: 28px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    flex-shrink: 0;
    transition: margin 0.3s ease;
  }
  .navbar-help-btn .btn-text {
    max-width: 0;
    opacity: 0;
    transition: max-width 0.3s ease, opacity 0.3s ease, margin 0.3s ease;
    overflow: hidden;
    font-size: 14px;
    font-weight: 500;
    margin-left: 0;
  }
  .navbar-help-btn:hover {
    width: 140px;
    border-radius: 20px;
    background: #4b5563;
    padding: 0 12px 0 4px;
  }
  .navbar-help-btn:hover svg {
    margin-right: 1px;
  }
  .navbar-help-btn:hover .btn-text {
    max-width: 120px;
    opacity: 1;
    margin-left: 2px;
  }
  .navbar-help-btn:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    .navbar-help-btn {
      bottom: 70px;
      right: 20px;
      width: auto;
      min-width: 36px;
      height: 36px;
      border-radius: 18px;
      padding: 0 10px;
    }
    .navbar-help-btn svg {
      width: 22px;
      height: 22px;
      margin-right: 0;
    }
    .navbar-help-btn .btn-text {
      max-width: none;
      opacity: 1;
      margin-left: 6px;
      font-size: 13px;
    }
    .navbar-help-btn:hover {
      width: auto;
      padding: 0 10px;
      background: #6b7280;
    }
    .navbar-help-btn:hover svg {
      margin-right: 0;
    }
    .navbar-help-btn:hover .btn-text {
      max-width: none;
      margin-left: 6px;
    }
    .navbar-back-to-top {
      bottom: 20px;
      right: 20px;
      width: 36px;
      height: 36px;
    }
  }
  `;

  // 插入 viewport meta 到 head（确保生效）
  if (!document.querySelector('meta[name="viewport"]')) {
    const viewportMeta = document.createElement('meta');
    viewportMeta.name = 'viewport';
    viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    document.head.insertBefore(viewportMeta, document.head.firstChild);
  }

  // 插入样式
  if (!document.getElementById('navbar-style-v18')) {
    const style = document.createElement('style');
    style.id = 'navbar-style-v18';
    style.textContent = NAVBAR_CSS;
    document.head.appendChild(style);
  }

  // 移除旧样式（v17 及更早）
  ['navbar-style-v17', 'navbar-style', 'navbar-style-v16', 'navbar-style-v15'].forEach(function(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  });

  // 插入导航栏
  const temp = document.createElement('div');
  temp.innerHTML = NAVBAR_HTML;
  while (temp.firstElementChild) {
    document.body.insertBefore(temp.firstElementChild, document.body.firstChild);
  }

  // ===== 核心：更新 body padding-top（无 !important 冲突） =====
  function updateBodyPadding() {
    const header = document.getElementById('mainNavbar');
    if (header) {
      const height = header.offsetHeight;
      document.body.style.paddingTop = height + 'px';
    }
  }

  requestAnimationFrame(updateBodyPadding);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateBodyPadding);
  } else {
    updateBodyPadding();
  }
  window.addEventListener('load', updateBodyPadding);

  // ResizeObserver（带清理，避免内存泄漏）
  let resizeObserver = null;
  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver(function(entries) {
      updateBodyPadding();
    });
    const header = document.getElementById('mainNavbar');
    if (header) resizeObserver.observe(header);
  } else {
    window.addEventListener('resize', updateBodyPadding);
  }

  // 页面卸载时清理 observer
  window.addEventListener('beforeunload', function() {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
  });

  // ===== 实时时钟 =====
  function updateTime() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const wd = weekDays[now.getDay()];
    const text = h + ':' + m + ':' + s + '，' + month + '月' + day + '日，' + wd;
    const el = document.getElementById('timeBarText');
    if (el) el.textContent = text;
  }
  updateTime();
  setInterval(updateTime, 1000);

  // ===== 移动端菜单 =====
  const menuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (menuBtn && navLinks) {
    // 汉堡按钮点击
    menuBtn.addEventListener('click', function(e) {
      e.preventDefault();
      navLinks.classList.toggle('active');
      // transitionend 更新 padding，替代固定 400ms
      var onTransitionEnd = function(evt) {
        if (evt.propertyName === 'max-height' || evt.propertyName === 'transform') {
          updateBodyPadding();
          navLinks.removeEventListener('transitionend', onTransitionEnd);
        }
      };
      navLinks.addEventListener('transitionend', onTransitionEnd);
    });

    // 导航链接点击后关闭菜单（单页/锚点场景）
    navLinks.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navLinks.classList.remove('active');
        var onTransitionEnd = function(evt) {
          if (evt.propertyName === 'max-height' || evt.propertyName === 'transform') {
            updateBodyPadding();
            navLinks.removeEventListener('transitionend', onTransitionEnd);
          }
        };
        navLinks.addEventListener('transitionend', onTransitionEnd);
      });
    });
  }

  // 点击外部关闭菜单
  document.addEventListener('click', function (e) {
    if (navLinks && navLinks.classList.contains('active')) {
      if (menuBtn && menuBtn.contains(e.target)) return;
      if (!navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        var onTransitionEnd = function(evt) {
          if (evt.propertyName === 'max-height' || evt.propertyName === 'transform') {
            updateBodyPadding();
            navLinks.removeEventListener('transitionend', onTransitionEnd);
          }
        };
        navLinks.addEventListener('transitionend', onTransitionEnd);
      }
    }
  });

  // ===== 高亮当前页面 =====
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav a').forEach(function (a) {
    if (a.getAttribute('href') === currentPage ||
      (currentPage === '' && a.getAttribute('href') === 'index.html')) {
      a.classList.add('active');
    }
  });

  // ===== 返回顶部按钮 =====
  (function () {
    if (document.getElementById('navbar-back-to-top')) return;
    const btn = document.createElement('button');
    btn.id = 'navbar-back-to-top';
    btn.className = 'navbar-back-to-top';
    btn.setAttribute('aria-label', '返回顶部');
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5">' +
          '<line x1="12" y1="19" x2="12" y2="5" />' +
          '<polyline points="5 12 12 5 19 12" />' +
        '</svg>';
    document.body.appendChild(btn);

    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          btn.classList.toggle('visible', window.scrollY > 1000);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();

  // ===== 问号按钮（仅在非 advises.html 页面显示） =====
  (function () {
    if (window.location.pathname.includes('advises.html')) return;
    if (document.getElementById('navbar-help-btn')) return;

    const helpBtn = document.createElement('button');
    helpBtn.id = 'navbar-help-btn';
    helpBtn.className = 'navbar-help-btn';
    helpBtn.setAttribute('aria-label', '帮助');
    helpBtn.innerHTML =
      '<svg viewBox="0 0 24 24">' +
        '<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />' +
        '<line x1="12" y1="17" x2="12.01" y2="17" />' +
      '</svg>' +
      '<span class="btn-text">反馈建议</span>';
    document.body.appendChild(helpBtn);

    helpBtn.addEventListener('click', function () {
      window.location.href = 'advises.html';
    });
  })();

  // ===== 时钟彩蛋（增加 Ctrl/Alt 修饰键，避免误触发） =====
  (function () {
    let upCount = 0, clickCount = 0;
    let upTimer = null, clickTimer = null;
    const TARGET = 4, RESET_MS = 3000;

    function goToClock() {
      upCount = 0; clickCount = 0;
      clearTimeout(upTimer); clearTimeout(clickTimer);
      document.body.style.transition = 'opacity 0.6s ease';
      document.body.style.opacity = '0';
      setTimeout(function() { window.location.href = 'clock.html'; }, 600);
    }

    document.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
      // 增加修饰键检查：必须按住 Alt 或 Ctrl 才计数，避免纯方向键滚动误触发
      if ((e.altKey || e.ctrlKey) && e.key === 'ArrowUp') {
        upCount++;
        clearTimeout(upTimer);
        if (upCount >= TARGET) { goToClock(); } else {
          upTimer = setTimeout(function() { upCount = 0; }, RESET_MS);
        }
      } else if (e.key === 'ArrowUp') {
        // 纯方向键不计数，直接重置
        upCount = 0; clearTimeout(upTimer);
      } else {
        upCount = 0; clearTimeout(upTimer);
      }
    });

    const timeEl = document.getElementById('timeBarText');
    if (timeEl) {
      timeEl.addEventListener('click', function () {
        clickCount++;
        clearTimeout(clickTimer);
        this.style.transform = 'scale(0.96)';
        setTimeout(function() { timeEl.style.transform = ''; }, 100);
        if (clickCount >= TARGET) { goToClock(); } else {
          clickTimer = setTimeout(function() { clickCount = 0; }, RESET_MS);
        }
      });
    }
  })();

// ===== fun.html 彩蛋（点击站点名 4 次）=====
(function () {
  let funClickCount = 0;
  let funTimer = null;
  const FUN_TARGET = 4, FUN_RESET_MS = 3000;

  const siteNameEl = document.querySelector('.navbar-site-name');
  if (siteNameEl) {
    siteNameEl.style.cursor = 'pointer';
    siteNameEl.addEventListener('click', function () {
      funClickCount++;
      clearTimeout(funTimer);
      this.style.transform = 'scale(0.96)';
      setTimeout(function() { siteNameEl.style.transform = ''; }, 100);
      if (funClickCount >= FUN_TARGET) {
        funClickCount = 0; clearTimeout(funTimer);
        window.location.href = 'fun.html';
      } else {
        funTimer = setTimeout(function() { funClickCount = 0; }, FUN_RESET_MS);
      }
    });
  }
})();

})();
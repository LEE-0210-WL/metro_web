/**
 * banner-shuffle.js
 * 随机轮播 Banner 模块
 * 
 * 功能：
 * 1. 页面加载时随机生成 5 张轮播图（slogan 第1张 + 4 张随机线路图）
 * 2. 右下角"刷新一批"按钮，点击后准备下一轮
 * 3. 新轮尽量不与上一轮重复（智能去重）
 * 4. 等当前轮播到最后一张后，无缝替换并继续播放
 * 
 * 使用方式：在 index.html 中引入 <script src="banner-shuffle.js"></script>
 * 并移除原有的 banner 相关硬编码 HTML 和 JS
 */

(function() {
  'use strict';

  // ========== 配置 ==========
  const CONFIG = {
    // 线路图编号列表（从截图整理）
    LINE_IMAGES: ['1', '2+8', '3', '4', '5', '6', '6z', '7', '9', '10', '11', '12', '13', '14', '16', '20'],
    // Slogan 图编号
    SLOGAN_IMAGES: ['slogan1', 'slogan2', 'slogan3'],
    // 每轮展示几张线路图
    LINES_PER_ROUND: 4,
    // 电脑端自动轮播间隔（毫秒）
    AUTO_INTERVAL_DESKTOP: 5000,
    // 手机端自动轮播间隔（毫秒）—— 更长，给图片加载留时间
    AUTO_INTERVAL_MOBILE: 10000,
    // CSS transition 时长（毫秒）
    TRANSITION_DURATION: 800,
    // 历史记录保留轮数（最近N轮的线路图都排除）
    HISTORY_ROUNDS: 2,
  };

  // ========== 状态 ==========
  let currentSlide = 0;
  let bannerInterval = null;
  let isTransitioning = false;
  let currentRoundImages = [];   // 当前轮展示的图片列表
  let nextRoundImages = null;    // 预准备好的下一轮图片
  let isPreparingNext = false;   // 是否正在准备下一轮
  let lineHistory = [];          // 历史记录：[[id1,id2,id3,id4], [id5,id6,id7,id8], ...]

  // ========== 工具函数 ==========

  /**
   * 判断当前是否为手机端
   */
  function isMobile() {
    return window.matchMedia('(max-width: 768px)').matches;
  }

  /**
   * 获取当前自动轮播间隔
   */
  function getAutoInterval() {
    return isMobile() ? CONFIG.AUTO_INTERVAL_MOBILE : CONFIG.AUTO_INTERVAL_DESKTOP;
  }

  /**
   * Fisher-Yates 洗牌算法
   */
  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /**
   * 生成一轮随机图片列表
   * @param {string[]} excludeIds - 要排除的编号（上一轮用过的线路图）
   * @returns {Array<{id: string, type: 'slogan'|'line'}>}
   */
  function generateRound(excludeIds = []) {
    // 1. 随机选 slogan
    const sloganIdx = Math.floor(Math.random() * CONFIG.SLOGAN_IMAGES.length);
    const sloganId = CONFIG.SLOGAN_IMAGES[sloganIdx];

    // 2. 从线路图中选4张，尽量不与 excludeIds 重复
    let availableLines = CONFIG.LINE_IMAGES.filter(id => !excludeIds.includes(id));

    // 如果可用的不够4张，就从全部中补充（允许重复的情况）
    if (availableLines.length < CONFIG.LINES_PER_ROUND) {
      const need = CONFIG.LINES_PER_ROUND - availableLines.length;
      const rest = shuffle(CONFIG.LINE_IMAGES.filter(id => !availableLines.includes(id)));
      availableLines = availableLines.concat(rest.slice(0, need));
    }

    // 随机选4张
    const shuffled = shuffle(availableLines);
    const selectedLines = shuffled.slice(0, CONFIG.LINES_PER_ROUND);

    // 组装结果：slogan 放第1位
    const result = [
      { id: sloganId, type: 'slogan' },
      ...selectedLines.map(id => ({ id, type: 'line' }))
    ];

    return result;
  }

  /**
   * 获取图片路径（根据当前是横屏还是竖屏）
   */
  function getImagePaths(item) {
    if (item.type === 'slogan') {
      return {
        compu: item.id + '-compu.jpg',
        phone: item.id + '-phone.jpg'
      };
    } else {
      return {
        compu: item.id + '-compu.jpg',
        phone: item.id + '-phone.jpg'
      };
    }
  }

  /**
   * 创建 slide HTML
   */
  function createSlideHTML(item, index, isActive) {
    const paths = getImagePaths(item);
    const activeClass = isActive ? 'active' : '';
    return `
      <div class="banner-slide ${activeClass}" data-index="${index}">
        <picture>
          <source media="(orientation: portrait)" srcset="${paths.phone}">
          <img src="${paths.compu}" alt="Banner ${index + 1}" loading="eager" decoding="async" draggable="false">
        </picture>
      </div>
    `;
  }

  /**
   * 创建指示器 HTML
   */
  function createDotsHTML(count) {
    let html = '<div class="banner-dots">';
    for (let i = 0; i < count; i++) {
      html += `<button class="banner-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="第${i + 1}张"></button>`;
    }
    html += '</div>';
    return html;
  }

  /**
   * 预加载图片
   */
  function preloadImages(images) {
    images.forEach(item => {
      const paths = getImagePaths(item);
      const img1 = new Image();
      img1.src = paths.compu;
      const img2 = new Image();
      img2.src = paths.phone;
    });
  }

  // ========== 轮播核心逻辑 ==========

  function getSlides() {
    return document.querySelectorAll('.banner-slide');
  }

  function getDots() {
    return document.querySelectorAll('.banner-dot');
  }

  function showSlide(index) {
    const slides = getSlides();
    const dots = getDots();

    if (index === currentSlide || isTransitioning || slides.length === 0) return;
    isTransitioning = true;

    const prevIndex = currentSlide;
    currentSlide = index;

    // 判断方向
    let direction = 'next';
    if (index < prevIndex) direction = 'prev';
    if (prevIndex === slides.length - 1 && index === 0) direction = 'next';
    if (prevIndex === 0 && index === slides.length - 1) direction = 'prev';

    const prevSlide = slides[prevIndex];
    const currSlide = slides[currentSlide];

    // 复位不参与动画的 slide
    slides.forEach((slide, i) => {
      if (i !== prevIndex && i !== currentSlide) {
        slide.style.transition = 'none';
        slide.classList.remove('active', 'prev');
        slide.style.transform = direction === 'next' ? 'translateX(100%)' : 'translateX(-100%)';
        void slide.offsetWidth;
        slide.style.transition = '';
      }
    });

    // 设置初始位置
    prevSlide.style.transition = 'none';
    currSlide.style.transition = 'none';
    prevSlide.classList.remove('active', 'prev');
    currSlide.classList.remove('active', 'prev');

    prevSlide.style.transform = 'translateX(0)';
    currSlide.style.transform = direction === 'next' ? 'translateX(100%)' : 'translateX(-100%)';
    void prevSlide.offsetWidth;

    // 执行动画
    prevSlide.style.transition = '';
    currSlide.style.transition = '';
    prevSlide.style.transform = direction === 'next' ? 'translateX(-100%)' : 'translateX(100%)';
    currSlide.style.transform = 'translateX(0)';

    // z-index
    slides.forEach((slide, i) => {
      slide.style.zIndex = i === currentSlide ? '2' : '1';
    });

    // 更新指示器
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });

    // 动画结束
    setTimeout(() => {
      slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === currentSlide) slide.classList.add('active');
      });
      isTransitioning = false;

      // 检查是否需要切换到下一轮
      checkAndApplyNextRound();
    }, CONFIG.TRANSITION_DURATION);
  }

  function nextSlide() {
    if (isTransitioning) return;
    const slides = getSlides();
    if (slides.length === 0) return;
    showSlide((currentSlide + 1) % slides.length);
  }

  function startAutoPlay() {
    stopAutoPlay();
    bannerInterval = setInterval(nextSlide, getAutoInterval());
  }

  function stopAutoPlay() {
    clearInterval(bannerInterval);
  }

  // ========== 刷新按钮 ==========

  function createRefreshButton() {
    const btn = document.createElement('button');
    btn.id = 'banner-refresh-btn';
    btn.innerHTML = `
      <svg class="refresh-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="23 4 23 10 17 10"></polyline>
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
      </svg>
      <span class="refresh-text">刷新一批</span>
    `;
    btn.setAttribute('aria-label', '刷新轮播图片');
    btn.title = '点击准备下一轮随机图片';

    // 样式（内联 + 媒体查询）
    const style = document.createElement('style');
    style.textContent = `
      #banner-refresh-btn {
        position: absolute;
        bottom: 8px;
        right: 8px;
        z-index: 10;
        padding: 6px 12px;
        font-size: 13px;
        font-family: inherit;
        color: rgba(255,255,255,0.9);
        background: rgba(0,0,0,0.4);
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 20px;
        cursor: pointer;
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        transition: all 0.3s ease;
        user-select: none;
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 4px;
        line-height: 1;
      }
      #banner-refresh-btn:hover {
        background: rgba(0,0,0,0.6);
        color: #fff;
      }
      #banner-refresh-btn .refresh-icon {
        display: inline-block;
        width: 14px;
        height: 14px;
        flex-shrink: 0;
      }
      #banner-refresh-btn.ready {
        background: rgba(34,197,94,0.45);
        border-color: rgba(34,197,94,0.5);
      }
      #banner-refresh-btn.ready:hover {
        background: rgba(34,197,94,0.6);
      }
      /* 手机端：只显示图标 */
      @media (max-width: 768px) {
        #banner-refresh-btn {
          padding: 6px;
          bottom: 4px;
          right: 4px;
          border-radius: 50%;
        }
        #banner-refresh-btn .refresh-text {
          display: none;
        }
        #banner-refresh-btn .refresh-icon {
          width: 16px;
          height: 16px;
        }
      }
    `;
    document.head.appendChild(style);

    return btn;
  }

  function updateRefreshButtonState(btn) {
    if (nextRoundImages) {
      btn.classList.add('ready');
      btn.querySelector('.refresh-text').textContent = '已准备';
      btn.title = '已准备好下一轮，播完当前自动切换';
    } else {
      btn.classList.remove('ready');
      btn.querySelector('.refresh-text').textContent = '刷新一批';
      btn.title = '点击准备下一轮随机图片';
    }
  }

  // ========== 轮次切换逻辑 ==========

  /**
   * 准备下一轮图片
   */
  function prepareNextRound() {
    if (isPreparingNext) return;
    isPreparingNext = true;

    // 收集历史用过的线路图编号（最近 HISTORY_ROUNDS 轮）
    const usedLineIds = [];
    const recentHistory = lineHistory.slice(-CONFIG.HISTORY_ROUNDS);
    recentHistory.forEach(roundIds => {
      roundIds.forEach(id => {
        if (!usedLineIds.includes(id)) usedLineIds.push(id);
      });
    });

    // 生成下一轮
    nextRoundImages = generateRound(usedLineIds);

    // 预加载图片
    preloadImages(nextRoundImages);

    // 更新按钮状态
    const btn = document.getElementById('banner-refresh-btn');
    if (btn) updateRefreshButtonState(btn);

    isPreparingNext = false;
  }

  /**
   * 检查并应用下一轮
   * 在当前轮播到最后一张，且下一轮已准备好时触发
   */
  function checkAndApplyNextRound() {
    // 必须是最后一张，且下一轮已准备好
    if (!nextRoundImages || currentSlide !== getSlides().length - 1) return;

    // 应用下一轮
    applyRound(nextRoundImages);
    nextRoundImages = null;

    // 重置按钮状态
    const btn = document.getElementById('banner-refresh-btn');
    if (btn) updateRefreshButtonState(btn);
  }

  /**
   * 应用一轮图片到 DOM
   */
  function applyRound(images) {
    const carousel = document.querySelector('.banner-carousel');
    if (!carousel) return;

    // 保存当前轮播状态
    const wasPlaying = !!bannerInterval;
    stopAutoPlay();

    // 移除旧的 slides 和 dots
    const oldSlides = carousel.querySelectorAll('.banner-slide');
    const oldDots = carousel.querySelector('.banner-dots');
    oldSlides.forEach(s => s.remove());
    if (oldDots) oldDots.remove();

    // 插入新的 slides
    const fragment = document.createDocumentFragment();
    images.forEach((item, index) => {
      const div = document.createElement('div');
      div.innerHTML = createSlideHTML(item, index, index === 0);
      fragment.appendChild(div.firstElementChild);
    });
    carousel.appendChild(fragment);

    // 插入新的 dots
    const dotsDiv = document.createElement('div');
    dotsDiv.innerHTML = createDotsHTML(images.length);
    carousel.appendChild(dotsDiv.firstElementChild);

    // 更新状态
    currentRoundImages = images;
    currentSlide = 0;

    // 记录本轮线路图编号到历史
    const lineIds = images
      .filter(item => item.type === 'line')
      .map(item => item.id);
    lineHistory.push(lineIds);
    // 只保留最近 HISTORY_ROUNDS + 1 轮（当前轮 + 历史）
    if (lineHistory.length > CONFIG.HISTORY_ROUNDS + 1) {
      lineHistory = lineHistory.slice(-(CONFIG.HISTORY_ROUNDS + 1));
    }

    // 绑定 dot 点击事件
    const dots = getDots();
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        stopAutoPlay();
        showSlide(i);
        startAutoPlay();
      });
    });

    // 恢复自动播放
    if (wasPlaying) startAutoPlay();
  }

  // ========== 初始化 ==========

  function init() {
    const carousel = document.querySelector('.banner-carousel');
    if (!carousel) {
      console.error('[banner-shuffle] 未找到 .banner-carousel 元素');
      return;
    }

    // 1. 清空现有内容
    carousel.innerHTML = '';

    // 2. 生成第一轮
    currentRoundImages = generateRound();
    applyRound(currentRoundImages);

    // 3. 添加刷新按钮
    const refreshBtn = createRefreshButton();
    carousel.appendChild(refreshBtn);

    refreshBtn.addEventListener('click', () => {
      if (nextRoundImages) {
        // 如果已经准备好了，提示用户
        const textSpan = refreshBtn.querySelector('.refresh-text');
        const originalText = textSpan.textContent;
        textSpan.textContent = '等待切换';
        setTimeout(() => {
          textSpan.textContent = originalText;
        }, 1500);
        return;
      }
      prepareNextRound();
    });

    // 4. 鼠标悬停暂停
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);

    // 5. 开始自动播放
    startAutoPlay();

    console.log('[banner-shuffle] 初始化完成，当前轮播:', currentRoundImages.map(i => i.id).join(', '));
  }

  // DOM 就绪后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

(function() {

// ==================== 文章数据（按发布顺序）====================
const articleList = [
  { 
    id: 'article 04', 
    title: '探站系列 · EP01：大运站——它陪我长大，我帮它卖房（bushi）', 
    series: '探站系列', 
    date: '2026.8.18', 
    subtitle: '从幼儿园窗外的"圆形体育场"，到群昵称里的"TOD巨作"', 
    images: [], 
    desc: '选择大运站作为开篇很简单，它承载了我太多的回忆。从幼儿园跟老爸坐3号线经过，到14/16号线开通后的巨变，这座站陪我走过了整个学生时代。' 
  },
  { id: 'article 03', title: '摄站系列 · EP01：梨园站', series: '摄站系列', date: '2025.12.26', subtitle: '深圳地铁全网"最后的高架站"，阳光+低碳的绿色标杆', images: [], desc: '作为3号线四期的一个站点，同时也是深圳地铁全网最后的高架站，它的设计充满了独特性。这种"最后"的身份，让我格外想记录下它。' },
  { id: 'article 01', title: '探站系列 · EP02：大剧院站', series: '探站系列', date: '2026.1.11', subtitle: '5号线西延段终点，1、2号线超级枢纽', images: ['图文1-1.jpg', '图文1-2.jpg', '图文1-3.jpg'], desc: '上一站，我定格了远郊梨园站——那座安静伫立的"最后高架站"。这一次，我一头扎进城市的喧嚣几何中心，落脚于5号线西延段的崭新终点...' },
  { id: 'article 02', title: '技术解密 · EP01 - 资产编号小秘密', series: '技术解密', date: '2026.8.7', subtitle: '从罗宝线到32号线，编码背后的逻辑', images: ['图文2-1.jpg'], desc: '在深圳地铁的庞大网络中，每一条线路、每一组道岔、每一列电客车，都有其独一无二的"身份编码"。这些看似晦涩的数字与字母组合...' }
];

// ==================== 系列配色配置 ====================
const seriesColors = {
  '摄站系列': { from: '#F59E0B', to: '#D97706' },
  '探站系列': { from: '#10B981', to: '#059669' },
  '技术解密': { from: '#7c3aed', to: '#4f46e5' },
};

const defaultColor = { from: '#6b7280', to: '#4b5563' };

// ==================== 应用系列色（直接设置行内样式）====================
function applySeriesColor() {
  const el = document.querySelector('.article-series');
  if (!el) return;
  const text = el.textContent;
  let colors = null;
  if (text.includes('摄站')) colors = seriesColors['摄站系列'];
  else if (text.includes('探站')) colors = seriesColors['探站系列'];
  else if (text.includes('技术解密')) colors = seriesColors['技术解密'];
  else colors = defaultColor;
  
  el.style.background = `linear-gradient(135deg, ${colors.from}, ${colors.to})`;
  el.style.color = '#fff';
}

// ==================== 1. 渲染上下篇导航 ====================
function renderArticleNav() {
  const nav = document.getElementById('articleNav');
  if (!nav) return;
  const currentPath = decodeURIComponent(window.location.pathname);
  const currentIndex = articleList.findIndex(a => currentPath.includes(a.id));
  let html = '';
  if (currentIndex > 0) {
    const prev = articleList[currentIndex - 1];
    html += '<a href="' + prev.id + '"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>上一篇：' + prev.title + '</a>';
  } else {
    html += '<a href="#" class="disabled"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>上一篇：无</a>';
  }
  if (currentIndex >= 0 && currentIndex < articleList.length - 1) {
    const next = articleList[currentIndex + 1];
    html += '<a href="' + next.id + '">下一篇：' + next.title + '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a>';
  } else {
    html += '<a href="#" class="disabled">下一篇：暂无<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a>';
  }
  nav.innerHTML = html;
}

// ==================== 2. 渲染文章详情页底部列表 ====================
function renderArticleList() {
  const container = document.getElementById('articleListSection');
  if (!container) return;
  const currentPath = decodeURIComponent(window.location.pathname);
  const currentIndex = articleList.findIndex(a => currentPath.includes(a.id));
  let html = '<h2 class="section-title">📚 文章列表</h2><div class="article-list">';
  articleList.forEach((article, i) => {
    const isCurrent = i === currentIndex;
    const color = getSeriesColor(article.series);
    const borderColor = color.from;
    html += '<a href="' + article.id + '" class="article-list-item' + (isCurrent ? ' current' : '') + '" style="border-left-color:' + borderColor + '">';
    html += '<div class="article-list-series" style="color:' + borderColor + '">' + article.series + '</div>';
    html += '<div class="article-list-title">' + article.title + '</div>';
    html += '<div class="article-list-date">' + article.date + '</div>';
    if (isCurrent) html += '<div class="article-list-badge" style="background:' + borderColor + '">当前阅读</div>';
    html += '</a>';
  });
  html += '</div>';
  container.innerHTML = html;
}

// ==================== 3. 渲染图文首页文章卡片 ====================
function renderArticlesIndex() {
  const container = document.getElementById('articlesIndex');
  if (!container) return;
  let html = '';
  articleList.slice().reverse().forEach(article => {
    const color = getSeriesColor(article.series);
    const imgHtml = article.images.map(img => '<img src="' + img + '" alt="' + article.title + '" class="carousel-image">').join('');
    html += '<a href="' + article.id + '" class="article-card">';
    html += '<div class="carousel" data-carousel="' + article.id + '">';
    html += '<div class="carousel-images">' + imgHtml + '</div>';
    html += '</div>';
    html += '<div class="article-content">';
    html += '<div class="article-series-badge" style="display:inline-block;background:linear-gradient(135deg,' + color.from + ',' + color.to + ');color:white;padding:4px 12px;border-radius:12px;font-size:12px;font-weight:600;margin-bottom:10px;">' + article.series + '</div>';
    html += '<h2 class="article-title">' + article.title + '</h2>';
    html += '<p class="article-subtitle">' + article.subtitle + '</p>';
    html += '<div class="article-meta">';
    html += '<span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>走进新天地·Railway</span>';
    html += '<span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>' + article.date + '</span>';
    html += '</div>';
    html += '<div class="article-body"><p>' + article.desc + '</p></div>';
    html += '<span class="read-more">阅读全文<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></span>';
    html += '</div></a>';
  });
  container.innerHTML = html;
  initCarousels();
}

// ==================== 辅助函数 ====================
function getSeriesColor(seriesName) {
  return seriesColors[seriesName] || defaultColor;
}

// ==================== 轮播图初始化 ====================
function initCarousels() {
  document.querySelectorAll('.carousel').forEach(carousel => {
    const imagesContainer = carousel.querySelector('.carousel-images');
    const images = carousel.querySelectorAll('.carousel-image');
    if (images.length <= 1) return;
    let currentIndex = 0;
    const nav = document.createElement('div');
    nav.className = 'carousel-nav';
    images.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'carousel-dot ' + (i === 0 ? 'active' : '');
      dot.addEventListener('click', () => goToSlide(i));
      nav.appendChild(dot);
    });
    carousel.appendChild(nav);
    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-arrow prev';
    prevBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';
    prevBtn.addEventListener('click', e => { e.preventDefault(); goToSlide(currentIndex - 1); });
    carousel.appendChild(prevBtn);
    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-arrow next';
    nextBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';
    nextBtn.addEventListener('click', e => { e.preventDefault(); goToSlide(currentIndex + 1); });
    carousel.appendChild(nextBtn);
    function goToSlide(index) {
      if (index < 0) index = images.length - 1;
      if (index >= images.length) index = 0;
      currentIndex = index;
      imagesContainer.style.transform = 'translateX(-' + currentIndex * 100 + '%)';
      nav.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }
    setInterval(() => goToSlide(currentIndex + 1), 5000);
  });
}

// ==================== 自动执行 ====================
function init() {
  applySeriesColor();
  renderArticleNav();
  renderArticleList();
  renderArticlesIndex();
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();
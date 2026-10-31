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
  { id: 'article 03', title: '站记系列 · EP01：梨园站', series: '站记系列', date: '2025.12.26', subtitle: '深圳地铁全网"最后的高架站"，阳光+低碳的绿色标杆', images: [], desc: '作为3号线四期的一个站点，同时也是深圳地铁全网最后的高架站，它的设计充满了独特性。这种"最后"的身份，让我格外想记录下它。' },
  { id: 'article 01', title: '探站系列 · EP02：大剧院站', series: '探站系列', date: '2026.1.11', subtitle: '5号线西延段终点，1、2号线超级枢纽', images: ['图文1-1.jpg', '图文1-2.jpg', '图文1-3.jpg', '图文1-4.jpg', '图文1-5.jpg', '图文1-6.jpg', '图文1-7.jpg', '图文1-8.jpg', '图文1-9.jpg', '图文1-10.jpg'], desc: '上一站，我定格了远郊梨园站——那座安静伫立的"最后高架站"。这一次，我一头扎进城市的喧嚣几何中心，落脚于5号线西延段的崭新终点...' },
  { id: 'article 02', title: '技术解密 · EP01 - 资产编号小秘密', series: '技术解密', date: '2026.8.7', subtitle: '从罗宝线到32号线，编码背后的逻辑', images: ['图文2-1.jpg'], desc: '在深圳地铁的庞大网络中，每一条线路、每一组道岔、每一列电客车，都有其独一无二的"身份编码"。这些看似晦涩的数字与字母组合...' },
  { 
    id: 'article 05', 
    title: '运营观察 · EP01：2号线大站快车——存活不足24小时', 
    series: '运营观察', 
    date: '2026.9.9', 
    subtitle: '从9月8日试行到9月10日恢复原图，这趟"闪电快车"甚至没能撑过一个完整的晚高峰', 
    images: ['图文5-1.jpg', '图文5-2.jpg', '图文5-3.jpg', '图文5-4.jpg', '图文5-5.jpg', '图文5-6.jpg', '图文5-7.png', '图文5-8.jpg', '图文5-9.jpg'], 
    desc: '"这是我了解大站快的唯一途径。"2026年9月8日，这句话在轨交社群里刷屏。没人想到，这趟快车第二天就没了——它活了不到24小时，甚至没能撑过一个完整的晚高峰。' 
  },
  { 
    id: 'article 06', 
    title: '运营观察 · EP02：一份 PIDS 诉求，和一份"符合规范"的回复', 
    series: '运营观察', 
    date: '2026.10.26', 
    subtitle: '三个月前为"辣眼睛"的广告连夜道歉整改，三个月后对一份 PIDS 专业诉求只回"符合规范"',
    images: [], 
    desc: '2026年10月13日提交，10月23日办结。一份关于深圳地铁 PIDS（乘客信息系统）的诉求，换来了一份逐条落字的书面回复——但落点几乎全是「符合规范」。而三个月前，网友吐槽广告"辣眼睛"，深圳地铁的回应是《听劝！马上改！》。同样是广告挤占公共信息空间，一边连夜整改，一边"严格核准"。' 
  },
  { 
    id: 'article 07', 
    title: '运营观察 · EP03：广告围城——当站台只剩下广告可以看', 
    series: '运营观察', 
    date: '2026.10.26', 
    subtitle: '21 张实地照片：闸机、车窗、吊环、立柱、屏蔽门、PIDS 全都长满广告，其中不少是 AI 生成的',
    images: ['图文7-1.jpg','图文7-3.jpg','图文7-4.jpg','图文7-8.jpg','图文7-13.jpg','图文7-16.jpg','图文7-17.jpg','图文7-19.jpg'], 
    desc: '在深圳地铁站台上站五分钟，你能看到的东西绝大部分是广告。闸机被三面包成广告箱、车窗贴满整幅海报、吊环上挂着广告牌、立柱全被包成红柱、屏蔽门每一扇都贴、站台中央立着三层楼高的竖幅、PIDS 屏右半屏给 APEC 宣传。更狠的是：这些广告里不少是 AI 批量生成的——连深圳地铁自己的官方小程序海报，客服形象都是 AI。三个月前承诺"闸机口被广告堵得严严实实"马上改，三个月后还是这样。' 
  }
];

/* 按发布日期升序排序：保证「上一篇 / 下一篇」是真实时间顺序，
   以后新增文章只要把条目丢进数组，不用管摆放位置。 */
articleList.sort((a, b) => {
  const toNum = s => String(s).split('.').reduce((acc, n) => acc * 100 + (parseInt(n, 10) || 0), 0);
  return toNum(a.date) - toNum(b.date);
});

// ==================== 系列配色配置 ====================
const seriesColors = {
  '站记系列': { from: '#F59E0B', to: '#D97706' },
  '探站系列': { from: '#10B981', to: '#059669' },
  '技术解密': { from: '#7c3aed', to: '#4f46e5' },
  '运营观察': { from: '#EF4444', to: '#DC2626' },
};

const defaultColor = { from: '#6b7280', to: '#4b5563' };

// ==================== 应用系列色（直接设置行内样式）====================
function applySeriesColor() {
  const el = document.querySelector('.article-series');
  if (!el) return;
  const text = (el.textContent || '').trim();

  // 1) 先按「· EPxx」前面的系列名精确匹配
  const base = text.split(/[·・|]/)[0].trim();
  let colors = seriesColors[base] || null;

  // 2) 再退化为包含匹配（系列名去掉「系列」二字），
  //    兼容 "技术解密 · EP01 - 资产编号小秘密" 这种带副标题的写法
  if (!colors) {
    for (const name of Object.keys(seriesColors)) {
      const key = name.replace(/系列$/, '');
      if (key && (text.includes(key) || base.includes(key))) { colors = seriesColors[name]; break; }
    }
  }

  // 3) 都没匹配上才用灰色兜底
  if (!colors) colors = defaultColor;

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
    html += '<a href="' + prev.id + '"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>上一篇：' + prev.title + '</a>';
  } else {
    html += '<a href="#" class="disabled"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>上一篇：无</a>';
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

  const pad2 = n => (n < 10 ? '0' + n : '' + n);
  const dateNum = d => String(d).split('.').reduce((acc, n) => acc * 100 + (parseInt(n, 10) || 0), 0);
  const epNum = t => { const m = /EP\s*(\d+)/i.exec(t || ''); return m ? parseInt(m[1], 10) : 999; };

  /* 按系列分组 */
  const groups = [];
  articleList.forEach(a => {
    let g = groups.find(x => x.series === a.series);
    if (!g) { g = { series: a.series, items: [] }; groups.push(g); }
    g.items.push(a);
  });

  /* 组内按 EP 编号排，组间按最早日期排 */
  groups.forEach(g => g.items.sort((a, b) => epNum(a.title) - epNum(b.title)));
  groups.sort((a, b) => Math.min.apply(null, a.items.map(x => dateNum(x.date)))
                      - Math.min.apply(null, b.items.map(x => dateNum(x.date))));

  let html = '<h2 class="section-title">文章列表</h2><div class="idx-groups idx-art">';
  groups.forEach((g, gi) => {
    const color = getSeriesColor(g.series);
    html += '<div class="idx-group">';
    html += '<div class="idx-group-head">';
    html += '<span class="no">' + pad2(gi + 1) + '</span>';
    html += '<span class="nm" style="color:' + color.from + '">' + g.series + '</span>';
    html += '<span class="cnt">' + pad2(g.items.length) + '</span>';
    html += '</div><div class="idx-list">';
    g.items.forEach((article, i) => {
      const isCurrent = currentPath.includes(article.id);
      /* 去掉标题里的「系列名 · 」前缀，只留 EPxx：xxx */
      const shortTitle = article.title.replace(article.series + ' · ', '');
      html += '<a href="' + article.id + '" class="idx-item' + (isCurrent ? ' is-current' : '') + '" title="' + article.title + '">';
      html += '<span class="no">' + pad2(i + 1) + '</span>';
      html += '<span class="nm">' + shortTitle + '</span>';
      html += '<span class="ds">' + article.date + '</span>';
      if (isCurrent) html += '<span class="idx-cur" style="background:' + color.from + '">当前阅读</span>';
      html += '</a>';
    });
    html += '</div></div>';
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
    /* 只有确实有配图时才渲染轮播图；没配图的文章不占那块高度 */
    const imgs = Array.isArray(article.images) ? article.images : [];
    const hasImgs = imgs.length > 0;
    html += '<a href="' + article.id + '" class="article-card' + (hasImgs ? ' has-cover' : ' no-cover') + '">';
    if (hasImgs) {
      const imgHtml = imgs.map(img => '<img src="' + img + '" alt="' + article.title + '" class="carousel-image">').join('');
      html += '<div class="carousel" data-carousel="' + article.id + '">';
      html += '<div class="carousel-images">' + imgHtml + '</div>';
      /* 左右箭头 + 指示条由 initCarousels() 统一创建：
         它内部已有「images.length <= 1 时直接 return」的逻辑，
         所以单图卡片不会有任何多余控件。 */
      html += '</div>';
    }
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
  /* 图片是异步加载的，高度会变；先排一次，等图片都 load 完再排一次 */
  layoutMasonry();
  const imgs = container.querySelectorAll('img');
  let pending = imgs.length;
  if (pending === 0) return;
  imgs.forEach(img => {
    const done = () => { if (--pending === 0) layoutMasonry(); };
    if (img.complete) done(); else { img.addEventListener('load', done, { once: true }); img.addEventListener('error', done, { once: true }); }
  });
}

/* ==================== 瀑布流：按卡片实际高度计算 grid-row span ====================
   不用 column-count 是为了保持「新→旧」的阅读顺序；
   grid-auto-rows 固定 8px，每张卡片 span = ceil((高度+间距)/8)。 */
function layoutMasonry() {
  const grid = document.getElementById('articlesIndex');
  if (!grid) return;
  const ROW = 8;      /* 与 CSS 的 grid-auto-rows 保持一致 */
  const GAP = 24;     /* 与 .article-card 的 margin-bottom 保持一致 */
  const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
  /* 单列时不需要 span，直接让卡片自然排列 */
  for (const card of grid.children) {
    if (cols <= 1) { card.style.gridRowEnd = ''; continue; }
    card.style.gridRowEnd = 'auto';
    const h = card.getBoundingClientRect().height;
    card.style.gridRowEnd = 'span ' + Math.max(1, Math.ceil((h + GAP) / ROW));
  }
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
  /* 窗口尺寸变化时重排瀑布流（列数可能从 2 变 1） */
  let rzTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(rzTimer);
    rzTimer = setTimeout(layoutMasonry, 150);
  });
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();
/* ============================================================
   pids-lines/_lightmap.js —— 闪灯图模式（从 lightmap-line1.html 迁入）
   整体包在 IIFE 里，只对外暴露 window.LM = { init, show, hide }，
   内部的 render / toggleMode / next / prev 不会和 PIDS 模式的同名函数冲突。
   ============================================================ */
(function () {
'use strict';


  /* ===== 数据全部来自 all-lines-enhanced.js / pids-en.js ===== */
  /* 全局错误捕获：有任何 JS 报错直接显示在页面上 */
  window.addEventListener('error', function (e) {
    var box = document.getElementById('errBox');
    if (!box) {
      box = document.createElement('pre');
      box.id = 'errBox';
      box.style.cssText = 'position:fixed;left:0;top:0;z-index:99999;background:#fee;color:#b00;' +
                          'font:12px monospace;padding:8px;margin:0;max-width:100vw;white-space:pre-wrap;border:2px solid #b00';
      document.body.appendChild(box);
    }
    box.textContent += '[ERROR] ' + e.message + ' @ ' + (e.filename || '') + ':' + e.lineno + '\n';
  });

  const LINE_ID = '1';

  const _line = (typeof getEnhancedLineData === 'function')
    ? getEnhancedLineData(LINE_ID)
    : null;

  const STATIONS  = (_line && _line.stationList) ? _line.stationList.slice() : [];
  const TRANSFERS = (_line && _line.transfers)   ? _line.transfers          : {};
  const EN        = window.PIDS_EN || {};
  const N = STATIONS.length;
  const SMALL_PER_GAP = 2;
  const GAP = 90;
  const LEFT = 150;

  let current = 8;
  let dir = -1;
  let mode = 'next';   // 'next' = 下一站态, 'stop' = 停靠站态
  let doorSide = 'this';   // 'this' = 本侧开门, 'other' = 对侧开门

  /* 线路配色（来自 all-lines-enhanced.js）*/
  let waveTimer = null;
  let waveAt = 0;

  /* ===== 灭灯波浪：3 个灯一组，从下一站往终点快速移动 ===== */
  function startWave(els, curPos) {
    if (waveTimer) { clearInterval(waveTimer); waveTimer = null; }
    if (!els || els.length === 0) return;

    // 起始位置：下一站（黄色灯）之后的一个灯
    // 先找到黄色灯在 DOM 里的索引
    let yellowIdx = -1;
    els.forEach((el, i) => {
      if (yellowIdx < 0 && el.classList.contains('yellow')) yellowIdx = i;
    });
    if (yellowIdx < 0) yellowIdx = 0;

    const start = Math.max(0, yellowIdx - 2);   // 从黄色灯左边的 2 个小绿灯开始（第一组 = 绿绿黄）
    const end = els.length;        // 波浪扫到灯带末端
    const WAVE = 3;                // 一组 3 个灯

    waveAt = start;

    const step_dir = (typeof dir !== 'undefined' && dir === 1) ? -1 : 1;   // 朝终点方向
    const lo = step_dir === 1 ? start : 0;
    const hi = step_dir === 1 ? end : start + WAVE;

    waveAt = step_dir === 1 ? start : start;

    function step() {
      els.forEach(el => el.classList.remove('dim'));

      for (let k = 0; k < WAVE; k++) {
        const i = waveAt + k;
        if (i >= 0 && i < els.length) els[i].classList.add('dim');
      }

      waveAt += step_dir;
      if (step_dir === 1) {
        if (waveAt + WAVE > end) waveAt = start;
      } else {
        if (waveAt < 0) waveAt = start;
      }
    }

    step();
    waveTimer = setInterval(step, 110);
  }

  /* 根据背景色自动算文字颜色（站内统一公式）*/
  function getContrastText(bg) {
    if (!bg) return '#ffffff';
    let hex = String(bg).replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(function (c) { return c + c; }).join('');
    if (hex.length !== 6) return '#ffffff';
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    return brightness > 130 ? '#111827' : '#ffffff';
  }

  /* 线路色：直接调用 all-lines-enhanced.js 的 getLineColorEnhanced */
  function getLineColor(id) {
    const key = String(id);
    try {
      if (typeof getLineColorEnhanced === 'function') {
        const c = getLineColorEnhanced(key);
        if (c) return c;
      }
    } catch (e) {}
    return '#9CA3AF';
  }

  /* ===== 渲染 ===== */
  function render() {
    if (typeof waveTimer !== 'undefined' && waveTimer) {
      clearInterval(waveTimer); waveTimer = null;
    }
    const map = document.getElementById('lmCanvas');
    const track = map.querySelector('.track');
    map.classList.toggle('mode-stop', mode === 'stop');
    console.log('[render] dir=' + dir + ' current=' + current + ' (' + STATIONS[current] + ') mode=' + mode);

    // 清掉旧的灯珠和站名
    map.querySelectorAll('.light, .station').forEach(e => e.remove());

    // 站序：固定为「机场东在左、罗湖在右」（index 29 … 0）
    const seq = [];
    for (let i = 0; i < N; i++) seq.push(N - 1 - i);

    const curPos = seq.indexOf(current);   // 当前站在显示序列里的位置

    // 已过方向：往罗湖(dir=-1) → 当前站左侧已过；
    //            往机场东(dir=1) → 当前站右侧已过
    const passedLeft = (dir === -1);

    let lightHtml = '';
    let nameHtml = '';

    for (let pos = 0; pos < N; pos++) {
      const idx = seq[pos];                // 实际站索引
      const x = LEFT + pos * GAP;

      // 大灯：已过红 / 当前（下一站）黄 / 未到绿
      let cls;
      if (pos === curPos) cls = 'yellow';
      else if (passedLeft ? pos < curPos : pos > curPos) cls = 'red';
      else cls = 'green';
      lightHtml += '<div class="light big ' + cls + '" style="left:' + x.toFixed(1) + 'px"></div>';

      // 站名（上下交错）+ 换乘徽标
      const name = STATIONS[idx];
      const en = EN[name] || '';
      // 已开通线路白名单（五期未开通的全部排除；20 号线二期也未开通，一并排除）
      const OPENED = ['1','2','3','4','5','6','6z','7','8','9','10','11','12','13','14','16'];
      const trs = (TRANSFERS[name] || []).filter(t => OPENED.indexOf(String(t).toLowerCase()) >= 0);
      let badges = '';
      trs.forEach(t => {
        const lnEn = 'Line' + t;
      badges += '<span class="badge" data-line="' + t + '">' +
                  '<b class="num">' + t + '</b>' +
                  '<span class="tx"><i class="cn">号线</i><i class="en">' + lnEn + '</i></span>' +
                '</span>';
      });
      const side = pos % 2 === 0 ? 'up' : 'down';
      nameHtml +=
        '<div class="station ' + side + '" style="left:' + x.toFixed(1) + 'px">' +
          '<div class="nm"><span class="cn">' + name + '</span>' +
          '<span class="en">' + en + '</span></div>' +
          '<div class="bds">' + badges + '</div>' +
        '</div>';

      // 小灯：两站之间 2 个
      if (pos < N - 1) {
        for (let k = 1; k <= SMALL_PER_GAP; k++) {
          const sx = x + GAP * k / (SMALL_PER_GAP + 1);
          let scls;
          const adjacentToCur = passedLeft ? (pos === curPos - 1) : (pos === curPos);
          if (adjacentToCur) {
            // 紧邻黄色站的 2 个小灯：停靠站态=黄，下一站态=绿
            scls = (mode === 'stop') ? 'yellow' : 'green';
          } else if (passedLeft ? pos < curPos - 1 : pos > curPos) {
            scls = 'red';
          } else {
            scls = 'green';
          }
          lightHtml += '<div class="light small ' + scls + '" style="left:' + sx.toFixed(1) + 'px"></div>';
        }
      }
    }

    track.style.background = getLineColor(LINE_ID);
    track.insertAdjacentHTML('afterend', lightHtml);
    track.parentElement.insertAdjacentHTML('beforeend', nameHtml);

    // 给每个灯加上顺序号（DOM 顺序即灯带顺序）
    const els = map.querySelectorAll('.light');
    els.forEach((el, i) => { el.dataset.i = i; });

    if (mode === 'stop') {
      // 停靠站态：无动画
      els.forEach(el => el.classList.remove('dim'));
      if (waveTimer) { clearInterval(waveTimer); waveTimer = null; }
    } else {
      startWave(els, curPos);
    }

    // 调试：打印灯色分布
    if (window.DEBUG_LM) {
      const arr = [...map.querySelectorAll('.light.big')].map(el =>
        el.classList.contains('red') ? 'R' : el.classList.contains('yellow') ? 'Y' : 'G');
      console.log('[lights] ' + arr.join(''));
    }

    // 换乘徽标上色（线路色，来自 getLineColorEnhanced）
    map.querySelectorAll('.badge').forEach(function (el) {
      const lid = el.getAttribute('data-line');
      const col = getLineColor(lid);
      const fg = getContrastText(col);          // ← 文字色自动计算 ✅
      el.style.setProperty('background-color', col, 'important');
      el.style.setProperty('color', fg, 'important');
    });

    // 所有控件与状态同步
    syncAllControls();
  }

  /* ===== 控制区 ===== */
  /* ===== 所有控件与内部状态同步 ===== */
  function syncAllControls() {
    const csel = document.getElementById('lmCurSel');
    if (csel) csel.value = String(current);
    const dsel = document.getElementById('lmDirSel');
    if (dsel) dsel.value = String(dir);
    syncModeBtn();
    syncDoorArrows();
  }

  /* ===== 状态切换 ===== */
  function toggleMode() {
    if (mode === 'next') {
      // 下一站态 → 停靠站态（同一站）
      mode = 'stop';
    } else {
      // 停靠站态 → 下一站态（自动推进一站）
      mode = 'next';
      advanceStation();
    }
    syncModeBtn();
    syncDoorArrows();
    render();
  }

  /* 推进一站：按方向走，到端点则反向继续 */
  function advanceStation() {
    const step = (dir === -1) ? -1 : 1;    // 往罗湖(-1)索引递减；往机场东(+1)索引递增
    let next = current + step;

    if (next < 0 || next >= N) {
      // 到端点：方向反向，再走一站
      dir = -dir;
      next = current + ((dir === -1) ? -1 : 1);
      // 极端情况（两端来回）也保证不越界
      if (next < 0) next = 0;
      if (next >= N) next = N - 1;
      console.log('[advance] 到端点，方向反转为 ' + dir);
    }

    current = next;

    // 同步所有控件（render 里还会再调一次，双保险）
    syncAllControls();

    console.log('[advance] → ' + STATIONS[current] + '（索引 ' + current + '）dir=' + dir);
  }
  function syncDoorArrows() {
    const L = document.getElementById('doorArrowL');
    const R = document.getElementById('doorArrowR');
    if (!L || !R) return;
    // 固定「本侧开门」：两个箭头都常亮
    L.classList.add('active');
    R.classList.add('active');

    const tl = document.getElementById('doorLabelL');
    const tr = document.getElementById('doorLabelR');
    if (tl && tr) {
      tl.innerHTML = '<span class="en">DOORS OPEN<br>THIS SIDE</span><span class="cn">本侧开门</span>';
      tr.innerHTML = '<span class="en">DOORS OPEN<br>THIS SIDE</span><span class="cn">本侧开门</span>';
    }
  }

  function syncModeBtn() {
    const b = document.getElementById('lmModeBtn');
    if (!b) return;
    b.textContent = (mode === 'stop') ? '切换：下一站态' : '切换：停靠站态';
    b.classList.toggle('on', mode === 'stop');
  }

  function initControls() {
    const sel = document.getElementById('lmCurSel');
    sel.innerHTML = STATIONS.map((n, i) => '<option value="' + i + '">' + n + '</option>').join('');
    sel.value = String(current);
    sel.onchange = () => { current = parseInt(sel.value, 10); render(); };
    syncModeBtn();
    const dsel = document.getElementById('lmDirSel');
    dsel.value = String(dir);                 // ← 让菜单与 dir 变量保持一致
    dsel.onchange = (e) => { dir = parseInt(e.target.value, 10); console.log('[dir change] ' + dir); render(); };
  }

  /* ===== 自适应缩放 ===== */
  const CANVAS_W = 2950;
  const CANVAS_H = 480;

  let _lastFitW = 0;
  let _fitLock = false;

  function fit() {
    if (_fitLock) return;
    const map = document.getElementById('lmCanvas');
    const scaler = document.getElementById('lmScalerX');
    if (!map || !scaler) return;

    // 用 body 的可用宽度（padding 20 两侧 = 40）
    const avail = Math.max(320, (document.body.clientWidth || window.innerWidth) - 40);

    // 宽度没变就不重算，避免 ResizeObserver 反复触发形成循环
    // 首次必须放行；之后抖动容差 4px
    if (_lastFitW > 0 && Math.abs(avail - _lastFitW) < 4) return;
    _lastFitW = avail;

    _fitLock = true;
    const k = Math.min(1, avail / CANVAS_W);

    scaler.style.width  = (CANVAS_W * k) + 'px';
    scaler.style.height = (CANVAS_H * k) + 'px';

    map.style.transform = 'scale(' + k + ')';
    map.style.transformOrigin = 'top left';
    map.style.left = '0';
    map.style.top = '0';
    _fitLock = false;

    // 屏幕诊断
    const d = document.getElementById('lmDiag');
    if (d) {
      const iw = window.innerWidth;
      const dw = document.documentElement.clientWidth;
      const bw = document.body.clientWidth;
      const sw = document.querySelector('#lmWrap .stage').clientWidth;
      d.textContent = 'win ' + iw + ' / html ' + dw + ' / body ' + bw + ' / stage ' + sw +
                      ' / avail ' + avail + ' / k ' + k.toFixed(3);
    }
    console.log('[fit] win=' + window.innerWidth +
                ' html=' + document.documentElement.clientWidth +
                ' body=' + document.body.clientWidth +
                ' stage=' + document.querySelector('#lmWrap .stage').clientWidth +
                ' avail=' + avail + ' k=' + k.toFixed(3));
  }

  window.addEventListener('resize', fit);
  initControls();
  render();

  /* 首次进入 + 任何尺寸变化都重新适配
     ResizeObserver 监听 stage，彻底解决首次 layout 未稳定导致裁切 */
  (function setupFit() {
    const stage = document.querySelector('#lmWrap .stage');
    if (stage && 'ResizeObserver' in window) {
      try {
        const ro = new ResizeObserver(function () { fit(); });
        ro.observe(stage);
      } catch (e) {}
    }

    // 2 秒内每 100ms 强制跑一次（不依赖任何事件），保证一定生效
    var n = 0;
    var timer = setInterval(function () {
      fit();
      n++;
      if (n > 20) clearInterval(timer);
    }, 100);

    // 首次立刻跑
    fit();
    requestAnimationFrame(fit);
    window.addEventListener('load', fit);
  })();


  /* ===== 对外接口 ===== */
  window.LM = {
    /* 原脚本加载即自动执行 initControls()+render()，这里不需要重复初始化 */
    init: function () {},
    show: function () {
      const w = document.getElementById('lmWrap');
      if (w) w.hidden = false;
      /* 显示后元素才有尺寸，重新适配 */
      try { fit(); } catch (e) {}
      requestAnimationFrame(function () { try { fit(); } catch (e) {} });
    },
    hide: function () {
      const w = document.getElementById('lmWrap');
      if (w) w.hidden = true;
    }
  };
})();

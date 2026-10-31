/**
 * 深圳地铁五期线路建设进度数据
 * ─────────────────────────────────────────────
 * 数据全部来自公开渠道：
 *   · 深圳地铁集团官网 szmc.net 环评信息公告（里程 / 站数 / 换乘站数）
 *   · 深圳市规划和自然资源局 规划公示（区间名单 / 站名）
 *   · 各区政府「交通轨道管理中心」月度进展通报
 *   · 深圳交通（深圳市政府账号）、奥一新闻、深圳特区报、香港商报、工人日报等
 *
 * 状态取值：
 *   车站 stationStatus : operating 已运营 | capped 已封顶 | mep 机电/附属 | todo 未开工
 *   区间 segments.l/.r  : through 区间贯通 | track 机电/铺轨 | wip 掘进中 | todo 未开工
 *
 * 维护方式：
 *   1. 跑 tools\scan-progress.ps1 抓官方页面，得到候选事件清单
 *   2. 人工确认后改本文件对应条目
 *   3. 更新 dataDate 为数据截止日
 */

const PROGRESS_DATA = [
    {
      id: '13s', name: '13 号线二期（南延）', color: '#DE7C00',
      lengthKm: 4.1, stationCount: 3,
      stations: ['深圳湾口岸','潮汐公园','歌剧院','东角头'],
      stationStatus: {
        '深圳湾口岸': 'operating',
        '潮汐公园': 'capped',
        '歌剧院': 'mep',
        '东角头': 'mep'
      },
      segments: {
        '深圳湾口岸-潮汐公园': { l: 'through', r: 'through' },
        '潮汐公园-歌剧院': { l: 'track', r: 'track' },
        '歌剧院-东角头': { l: 'through', r: 'through' }
      },
      overall: '全线隧道洞通（日深区间左线 9-29 贯通）；3 座车站全部封顶并进入装饰装修：东角头站、潮汐公园站 2026-07 起开展设备区及轨行区装修，2026-08 启动公共区装修招标；歌剧院站 2026-08-22 发布公共区装修招标计划',
      dataDate: '2026-09-30',
      bars: [
        { k: '主体结构', v: 100 }, { k: '盾构区间', v: 100 },
        { k: '附属工程', v: 55 }
      ],
      staStat: '3 座车站全部封顶 · 均进入装饰装修',
      summary: {},
      footnote: '东角头站为线路起点、与 2 号线换乘，地下两层岛式双线换乘站，东西向布置，明挖顺做法，总建筑面积 14642.16 ㎡，设 2 个出入口并与蛇口公交站互通。歌剧院站为线路中间标准站，地下三层岛式（B1 漫游层 / B2 站厅 / B3 站台），总长 295 m，设 3 个出入口、2 组地面风亭、1 座冷却塔，总建筑面积 24328.74 ㎡（主体 20785.69 ㎡、附属 3543.05 ㎡）。潮汐公园站原名「日出剧场站」，为线路第 3 座车站，地下四层岛式「哑铃状」车站，位于填海造陆形成的海积平原，距后海海岸线约 70 m。深圳湾口岸站为 13 号线一期已开通车站，不计入二期南延的 3 座新建车站。控制中心设于深圳线网控制中心 NOCC。',
      sources: '深圳市城市轨道交通13号线二期（南延）线路全长 4.1 km、全地下敷设、设站 3 座，起于东角头站（换乘 2 号线）、止于深圳湾口岸站（不含）。主要依据：<a href="http://www.mcc5.com.cn/index.php/show/41162.html" target="_blank" rel="noopener noreferrer">中国五冶 2025-07-09（东角头—歌剧院区间双线洞通）</a>；<a href="https://tl.powerchina.cn/col/col9356/art/2025/art_2b74f17560a34c77b078016ccc95b8e6.html" target="_blank" rel="noopener noreferrer">中国电建 2025-04-30（歌-日区间双线贯通、3 站全部封顶）</a>；<a href="http://sz.people.com.cn/n2/2026/0106/c202846-41464577.html" target="_blank" rel="noopener noreferrer">深圳特区报 / 人民网 2026-01-06</a>；<a href="http://7j.powerchina.cn/col/col11171/art/2026/art_e0c96cdf7ef24a0e9842276bfc562841.html" target="_blank" rel="noopener noreferrer">中国电建水电七局 2026-07-17（日深区间右线贯通）</a>；<a href="https://szexgrp.com/jyfw/details.html?contentId=20593290" target="_blank" rel="noopener noreferrer">深圳交易集团 2026-08-22（歌剧院站公共区装修招标，含车站规模数据）</a>；<a href="https://szexgrp.com/jyfw/details.html?contentId=20576515" target="_blank" rel="noopener noreferrer">深圳交易集团 2026-08-14（一工区公共区装修招标计划）</a>。'
    },
    {
      id: '15', name: '15 号线（前南线 · 环线）', color: '#84BD00',
      isLoop: true,
      lengthKm: 32.21, stationCount: 24,
      stations: ['听海','铲湾南','铲湾中','金港','海城','坪洲','西乡公园','流塘','宝安公园','洪浪北','同乐关','打石山','西丽高铁站','朗山路','麻雀岭','深大北','深大南','名海','东滨路','四海','月亮湾公园','铁路公园','通港路','前保'],
      stationStatus: { '洪浪北': 'capped' },
      // 区间状态按站序，"名海-深大南" 已贯通（2026-10-13）；"跨海区间" 贯通（2026-07-29）
      segments: {
        '听海-铲湾南': { l: 'done', r: 'done' },        // 跨海区间（官方名「铲湾—听海路区间」）：右线 7-21 贯通、左线 8-28 完成前海湾下穿
        '名海-深大南': { l: 'done', r: 'done' },        // 10-13 左线贯通
        '铲湾中-铲湾南': { l: 'done', r: 'done' },      // 9月右线贯通，该区间已双线贯通
        '流塘-西乡公园': { l: 'done', r: 'done' },      // 9-28 双线贯通（中国电建南方公司），区间约 950m
        '朗山路-西丽高铁站': { l: 'wip', r: 'todo' },    // 9-29 左线盾构始发
        '打石山-同乐关': { l: 'wip', r: 'wip' }
      },
      overall: '14 座车站已封顶、17 个单线区间已洞通（7 月下旬官微口径）。深圳首条环形地铁线。铲湾—听海路区间双线千米跨海掘进完成（右线 7-21 贯通、左线 8-28 完成前海湾海域段下穿）；同乐车辆段高压电力管线迁改工程 J3-J6 区间洞通，该工程区间隧道全线贯通。目标 2028 年开通',
      dataDate: '2026-10-12',
      bars: [
        { k: '围护结构', v: 96 }, { k: '土方开挖', v: 89 },
        { k: '主体结构', v: 88 }, { k: '盾构区间', v: 61 }
      ],
      segStat: '贯通 24 区间 · 掘进 20 台 · 未施工 7',
      staStat: '机电 3 座 · 封顶 16 座 · 土建 8 座',
      summary: { capped: 16, shield: 20, twin: 24 },
      footnote: '15 号线为深圳首条环形地铁线路，串联前海、南山、宝安三大核心片区，线路全长 32.2 公里，设 24 座车站。跨海段：铲湾—听海路区间右线 2026-07-21 贯通、左线 8-28 掘进至 813 环完成前海湾海域段下穿，双线千米跨海掘进任务完成。同乐车辆段高压电力管线迁改工程线路总长 4.7 公里（4.4 公里新建电力隧道 + 0.3 公里架空线），配置 4 台盾构机、1 台顶管机，侧穿 22 座高压线塔，创下单日掘进 17 环。洪浪北站位于城市建成核心区，周边建筑密集、交通流量大、施工场地狭小，场区燃气、电力、雨污水、通信等管线纵横交错，9 月 10 日完成主体结构封顶。流西区间（流塘—西乡公园）总长约 950 米。',
      sources: '主要依据：<a href="https://www.sz.gov.cn/cn/xxgk/zfxxgj/zwdt/content/post_13015890.html" target="_blank" rel="noopener noreferrer">深圳政府在线（深圳特区报）2026-10-12：同乐车辆段电力管线迁改工程全线贯通、环形线 32.2km/24 站、围护 96%/土方 89%/主体 88%/盾构 61%</a>；<a href="https://www.sz.gov.cn/ztfw/jtly/wyk_184755/content/post_12960983.html" target="_blank" rel="noopener noreferrer">深圳政府在线（深圳市交通运输局）2026-08-31：铲湾—听海路区间双线千米跨海掘进完成</a>；<a href="https://14j.powerchina.cn/col/col809/art/2026/art_c228d1c7fde24fb8ace599cb8d09611c.html" target="_blank" rel="noopener noreferrer">中国电建水电十四局 2026-09-15：洪浪北站主体结构封顶</a>；<a href="https://tl.powerchina.cn/col/col9356/art/2026/art_22b5790e7f0147e293b8e4a2b103bfe5.html" target="_blank" rel="noopener noreferrer">中国电建南方公司 2026-09-30：流塘站至西乡公园站盾构区间 9-28 双线贯通、区间约 950 米</a>；<a href="https://mp.weixin.qq.com/s/W1hOE-8npNYtDhNHsU2nzw" target="_blank" rel="noopener noreferrer">深圳地铁官微 2026-07-25：14 座车站已封顶、17 个单线区间已洞通</a>；<a href="https://mp.weixin.qq.com/s/IFWTcGJAb-wdPreQwRVnCw" target="_blank" rel="noopener noreferrer">深圳地铁官微 2026-01-30：车站主体结构完成 65%、盾构区间完成 29%</a>。'
    },
    {
      id: '22', name: '22 号线（中轴线）', color: '#FBE122',
      lengthKm: 34.7, stationCount: 21, transferCount: 10,
      stations: ['黎光','库坑','桂花','松元厦','松轩','鹭湖','观湖','风门坳','岗头北','富康','松和','民治北','民治','民新','民乐','凯丰','梅丰','香梅北','国交中心','香蜜西','上沙'],
      stationStatus: {
        '桂花': 'capped',
        '松元厦': 'capped'
      },
      segments: {
        '观湖-鹭湖': { l: 'done', r: 'done' },      // 2026-04 双线贯通（龙华段首个）
        '民乐-民新': { l: 'todo', r: 'done' },      // 9-10 右线贯通
        '松元厦-桂花': { l: 'done', r: 'done' },     // 官微 2026-08-04：松桂区间双线贯通
        '松轩-松元厦': { l: 'wip', r: 'todo' },     // 9月左线盾构始发
        '民治北-民治': { l: 'todo', r: 'wip' }      // 9月民治北—明挖段右线始发
      },
      dataDate: '2026-10-28',
      overall: '松元厦—桂花（松桂区间）双线贯通（8 月初）；两个区间四条盾构隧道全部贯通、盾构区间开累 35%（8 月下旬）；黎光车辆段运用库盖板全面封顶（1 月初）；土建九工区松元厦站、桂花站两站主体结构全部封顶，为全线首个双站全封顶工区（9 月下旬）；民乐站～民新站区间右线盾构抵达明挖段接收井（9-10）；松轩站～松元厦站区间左线盾构始发（10 月下旬）。计划 2028 年开通',
      bars: [],
      summary: {},
      footnote: '22 号线一期为贯穿城市中部的纵向轨道快线，全长 34.7 公里，起于上沙站、途经福田/龙华/龙岗三区、终于黎光站，设黎光车辆段与香蜜停车场，共 21 座地下车站（3 座枢纽站、10 座换乘站、8 座标准站），计划 2028 年开通。松元厦站位于龙华区观澜文化小镇（观澜大道与沿河东路东北象限），为地下三层换乘车站、可换乘 4 号线，车站总长 211 米、基坑最大开挖深度 24.74 米。民乐站～民新站（原横岭站）区间单线全长约 1.1 公里，盾构下穿梅关快速路、正穿既有桥梁桩基及锚索区。',
      sources: '主要依据：<a href="https://www.szlhq.gov.cn/bmdt/content/post_12995748.html" target="_blank" rel="noopener noreferrer">龙华政府在线 2026-09-23：松元厦站与桂花站主体结构封顶（全线首个双站全封顶工区）、22 号线 34.7km/21 站/10 换乘/2028 年开通、松元厦站参数</a>；<a href="https://wb.sznews.com/PC/content/202610/28/content_3487502.html" target="_blank" rel="noopener noreferrer">深圳晚报 2026-10-28：松轩站～松元厦站区间左线盾构始发</a>；<a href="http://www.ahyouth.com/news/20260910/1789998.shtml" target="_blank" rel="noopener noreferrer">安青网 2026-09-10：民乐站～民新站区间右线盾构接收、区间单线约 1.1 公里</a>；<a href="https://mp.weixin.qq.com/s/MfVP4k1xQabLBqpcSKdaLw" target="_blank" rel="noopener noreferrer">深圳地铁官微 2026-08-04：松桂区间双线贯通、盾构区间开累 30.6%</a>；<a href="https://mp.weixin.qq.com/s/HYsSZFpz-0WK8oKCtRlALA" target="_blank" rel="noopener noreferrer">深圳地铁官微 2026-08-20：两个区间四条盾构隧道全部贯通、盾构区间开累 35%</a>；<a href="https://mp.weixin.qq.com/s/P2-z316HskaxBVnCXEYN1g" target="_blank" rel="noopener noreferrer">深圳地铁官微 2026-01-06：黎光车辆段运用库盖板全面封顶</a>。'
    },
    {
      id: '20b', name: '20 号线二期', color: '#88D8DF',
      lengthKm: 24.8, stationCount: 11, transferCount: 9,
      stations: ['机场北','机场东','狮子山公园','航城大道东','西乡公园','文汇','甲岸','中山公园西','南头古城','深大','高新园','白石洲'],
      stationStatus: {
        '机场北': 'operating',
        '狮子山公园': 'capped',
        '文汇': 'capped',
        '甲岸': 'capped',
        '中山公园西': 'capped',
        '南头古城': 'capped'
      },
      segments: {
        '深大-南头古城': { l: 'wip', r: 'wip' },        // 深南区间：2026-04-01 盾构组装下井
        '南头古城-中山公园西': { l: 'todo', r: 'wip' },  // 南中区间：2026-07-09 右线始发
        '狮子山公园-机场东': { l: 'wip', r: 'wip' },
        '西乡公园-文汇': { l: 'wip', r: 'todo' },
        '文汇-甲岸': { l: 'wip', r: 'todo' }        // 3-07 甲岸站～文汇站区间左线盾构在文汇站始发（区间左线约 1658.9 米）
      },
      overall: '多线同步盾构掘进中：南头古城—中山公园西右线（7-09 始发）、航城大道东—中间风井左线（7-13 始发）、深大—南头古城（4-01 盾构下井）。三座全预制装配式车站全部封顶（甲岸站 9-17 最后一块预制构件拼装完成）；全线一半车站已封顶，盾构累计始发 20 台次。文汇站主体结构封顶（4-07）。甲岸站～文汇站区间左线盾构于 3 月 7 日在文汇站始发，区间左线全长约 1658.9 米，沿 107 国道东侧向北敷设，由中交（广州）建设有限公司承建。下一阶段重点推进关键换乘车站与盾构区间',
      dataDate: '2026-09-17',
      bars: [
        { k: '围护结构', v: 98 }, { k: '土方开挖', v: 70 },
        { k: '主体结构', v: 53 }, { k: '盾构掘进', v: 5.9 }
      ],
      segStat: '掘进 18 台 · 下井 1 台 · 未施工 9',
      staStat: '封顶 5 座 · 土建 6 座',
      summary: { capped: 5, shield: 18 },
      footnote: '线路起自 20 号线一期机场北站（不含），途经福永、航城、西乡、新安街道，终至南山区白石洲站；全长 24.8 km，全地下敷设，设 11 座地下车站（换乘站 9 座），平均站间距约 2.23 km，设计最高运行时速 120 km/h，为全自动驾驶市域快线，力争 2029 年建成。三座全预制装配式车站为中山公园西站、甲岸站、狮子山公园站，采用矩形平顶结构体系，是深圳地铁五期 20 座装配式车站的组成部分；首座为狮子山公园站，其不换撑拼装工艺被深铁建设作为典型优秀案例在五期线路推广。文汇站（原上川一路站）位于 107 国道与上川二路交叉口，车站总长 248.5 米、标准段宽 20.1 米、基坑深约 17.1 米，为地下二层单柱双跨结构，明挖法施工，设 4 个出入口、2 组外挂风亭。盾构区间：深南区间（深大—南头古城）为全线核心控制性工程，采用土压平衡式盾构机，2026-04-01 完成组装下井；南中区间（南头古城—中山公园西）右线盾构 2026-07-09 始发；航城大道东—中间风井区间左线盾构 2026-07-13 通过始发条件验收并开始掘进。进度条数据为 2026-07-18 口径。另注：早期资料中的「航城站」「航城医院站」为旧站名，现行站名为狮子山公园站、航城大道东站。',
      sources: '主要依据：<a href="https://www.sz.gov.cn/cn/xxgk/zfxxgj/gqdt/content/post_12988267.html" target="_blank" rel="noopener noreferrer">深圳政府在线（宝安区）2026-09-17：三座装配式车站封顶、一半车站封顶、盾构始发 20 台次</a>；<a href="https://static.nfnews.com/content/202505/07/c11263430.html" target="_blank" rel="noopener noreferrer">南方+（转深圳交通、深圳地铁）2025-05-07：全长 24.8 km、11 站、9 换乘、平均站间距 2.23 km，文汇站参数</a>；<a href="https://www.dutenews.com/n/article/10568473" target="_blank" rel="noopener noreferrer">深圳商报·读创 2026-04-07：文汇站主体结构封顶、力争 2029 年建成</a>；<a href="https://www.dutenews.com/n/ctmedia/60085680" target="_blank" rel="noopener noreferrer">深圳地铁 2026-09-13：中山公园西站、甲岸站、狮子山公园站三座装配式车站全部封顶（9-09），南头古城站/深大站/西乡公园站换乘说明</a>；<a href="https://www.chinametro.net/index.php?m=newscon&id=539&aid=65174" target="_blank" rel="noopener noreferrer">深圳地铁 2026-06-08：南头古城站、中山公园西站相继完成主体封顶</a>；<a href="https://www.sz.gov.cn/cn/xxgk/zfxxgj/bmdt/content/post_12715903.html" target="_blank" rel="noopener noreferrer">深圳政府在线（深圳市交通运输局）2026-04-01：深南区间盾构组装下井、中山公园西站装配式台车组装、围护 93%/土方 67%/主体 30%</a>；<a href="https://dutenews.com/n/article/60033615" target="_blank" rel="noopener noreferrer">深圳地铁 2026-07-18：南中区间右线（7-09）、航城大道东—中间风井左线（7-13）双盾构始发，围护 98%/土方 70%/主体 53%/盾构 5.9%</a>；<a href="https://m.dutenews.com/n/article/10514521" target="_blank" rel="noopener noreferrer">读创·深圳商报 2026-03-07：甲岸站～文汇站区间左线盾构在文汇站始发、区间左线约 1658.9 米</a>。'
    },
    { id: '17', name: '17 号线（平湖线）', color: '#D3C0CD', lengthKm: 18.62, stationCount: 18,
      transferCount: 9,
      stations: ['上李朗','深朗','下李朗','石芽岭','丹竹头','南岭北','南岭','求水山','百鸽笼','罗岗','德兴','罗湖北','笋岗北','笋岗','大塘龙','老街','嘉宾','侨社'],
      stationStatus: { '南岭北': 'capped', '南岭': 'capped' },
      segments: {
        '南岭北-丹竹头': { l: 'done', r: 'wip' },   // 8-13 左线贯通（香港商报）
        '罗湖北-德兴': { l: 'todo', r: 'done' },    // 9-26 右线贯通（全线第 4 个贯通区间）
        '罗岗-百鸽笼': { l: 'wip', r: 'todo' },    // 9月左线盾构施工
        '求水山-南岭': { l: 'todo', r: 'wip' },     // 9月右线盾构施工
        '上李朗-深朗': { l: 'wip', r: 'wip' }      // 9月双线盾构施工
      },
      overall: '南岭站主体结构封顶（8 月中旬，南岭北站 5 月已封顶），南湾两大车站全部完成土建主体；南岭北—丹竹头区间左线盾构贯通（约 745 米，EPB/TBM 双模，8 月中旬）；罗岗—百鸽笼区间（罗百区间）左线盾构始发（10 月下旬，全线地质最复杂的重点区间之一，土压平衡/TBM 双模盾构机）',
      dataDate: '2026-10-23',
      bars: [], summary: {},
      footnote: '17 号线一期为服务深圳东部片区的骨干轨道线路，起于罗湖区侨社站（罗湖西站）、终至龙岗区上李朗站，全长约 18.62 公里，设 18 座地下车站。南岭北站至丹竹头站区间左线全长约 745 米，由中交二航局首台 EPB/TBM 双模盾构机承担掘进，施工中连续下穿多处房屋建筑群及管线，成功穿越地铁 3 号线丹竹头站、龙岗大道、恋珠小区及南芳学校操场等高危区域。罗岗站至百鸽笼站区间为全线地质最复杂的重点区间之一，采用土压平衡/TBM 双模盾构机，搭载超前地质预报、同步注浆、自动化监测等系统。',
      sources: '主要依据：<a href="https://www.sztv.com.cn/ysz/zx/zw/83912866.shtml" target="_blank" rel="noopener noreferrer">深圳卫视·深视新闻 2026-10-23：罗百区间（罗岗～百鸽笼）左线盾构始发、18.62km/18 站</a>；<a href="http://hkcd.com/hkcdweb/content/2026/08/13/content_8769488.html" target="_blank" rel="noopener noreferrer">香港商报（转深圳特区报）2026-08-13：南岭北站至丹竹头站区间左线盾构贯通、区间约 745 米</a>；<a href="https://mp.weixin.qq.com/s/aQl1ipmYVYUtK6dDH0mCSg" target="_blank" rel="noopener noreferrer">深圳地铁官微 2026-08-17：南岭站主体结构封顶（南岭北站 5 月已封顶）、南湾两大车站完成土建主体</a>。' },
    { id: '19', name: '19 号线（坪山线）', color: '#BB16A3', lengthKm: 14.79, stationCount: 12,
      stations: ['南塘围','人民医院','汤坑','锦龙','新围','宝山','新和','坪山剧院','坪山中心','燕子岭','南布','聚龙'],
      segments: {
        '汤坑-锦龙': { l: 'todo', r: 'wip' },       // 9月底起开展盾构施工
        '聚龙-南布': { l: 'wip', r: 'todo' }        // 聚龙站盾构下井一台
      },
      overall: '汤坑站全预制装配式主体结构封顶（9-11，全线重点科技创新示范站点，采用「工厂智造、现场装配」模式）；聚龙站盾构下井',
      dataDate: '2026-09-11',
      bars: [
        { k: '围护结构', v: 99 }, { k: '土方开挖', v: 76 },
        { k: '主体结构', v: 50 }, { k: '盾构掘进', v: 8 }
      ],
      segStat: '掘进 4 台 · 下井 1 台 · 未施工 21',
      staStat: '封顶 2 座 · 土建 10 座',
      summary: { capped: 2, shield: 4 },
      footnote: '19 号线一期串联坪山核心片区，是完善深圳东部轨道交通网络、优化城市交通格局、助推片区产业升级的骨干线路。建成后可与地铁 14 号线、16 号线及深大城际无缝衔接。汤坑站为全线重点科技创新示范站点，采用全预制装配式施工模式。',
      sources: '主要依据：<a href="https://www.sz.gov.cn/ztfw/jtly/wyk_184755/content/post_12978717.html" target="_blank" rel="noopener noreferrer">深圳政府在线（深圳市交通运输局，转深圳特区报）2026-09-11：汤坑站全预制装配式主体结构封顶</a>；<a href="https://sz.cnr.cn/gstjsz/20260912/t20260912_527811488.shtml" target="_blank" rel="noopener noreferrer">央广网 2026-09-12：19 号线建设提速、汤坑站主体封顶</a>。' },
    { id: '25', name: '25 号线（大浪线）', color: '#FEAD77', lengthKm: 16.5, stationCount: 14, transferCount: 5,
      stations: ['吉华医院','贝尔路','黄君山','上油松','松和','油福','景龙','龙华','龙华公园','华富','华昌','石凹','创意城','石龙'],
      stationStatus: { '石凹': 'capped', '龙华': 'capped', '华昌': 'capped', '华富': 'capped' },
      /* 官微 2026-08-02：9 座车站主体封顶；龙华站～景龙站区间双线洞通，为全线首个双线贯通区间 */
      segments: {
        '黄君山-贝尔路': { l: 'wip', r: 'todo' },    // 2026-07 左线盾构始发
        '贝尔路-吉华医院': { l: 'todo', r: 'wip' },  // 2026-07 右线盾构始发
        '上油松-黄君山': { l: 'todo', r: 'wip' },    // 2026-07 右线盾构始发
        '龙华-景龙': { l: 'done', r: 'done' }       // 官微 2026-08-02：双线洞通，全线首个双线贯通区间
      },
      overall: '龙华站～景龙站区间双线洞通，为全线首个双线贯通区间（8 月初）；9 座车站主体结构封顶；12 座车站围护结构全部完成围闭；石龙—创意城右线、华昌—华富右线、出入段线右线 3 台盾构集中始发（6 月中旬）',
      bars: [], summary: {},
      dataDate: '2026-06-16',
      footnote: '25 号线西起宝安区石龙站，东至龙岗区吉华医院站，线路全长 16.5 公里，串联宝安、龙华、龙岗多个片区。盾构始发区间的官方表述为「华昌站—华富站」（非「华昌—石凹」）。',
      sources: '主要依据：<a href="https://mp.weixin.qq.com/s/wCkYWZFEs1N5-LUQlVB4Tg" target="_blank" rel="noopener noreferrer">深圳地铁官微 2026-08-02：华富站封顶、9 座车站封顶、龙华～景龙双线洞通（全线首个双线贯通区间）</a>；<a href="https://mp.weixin.qq.com/s/Z6JhKnIuL9V5NX6FuL4DVg" target="_blank" rel="noopener noreferrer">深圳地铁官微 2026-06-15：12 座车站围护全围闭、8 座封顶、龙华—景龙单线贯通</a>；<a href="https://mp.weixin.qq.com/s/YbjXSAs-G7k1y7fc1f3Ssw" target="_blank" rel="noopener noreferrer">深圳地铁官微 2026-02-24：石凹/龙华/华昌站封顶、全线 7 座封顶</a>；<a href="https://www.sz.gov.cn/cn/xxgk/zfxxgj/tpxw/content/mpost_12846042.html" target="_blank" rel="noopener noreferrer">深圳政府在线（转深圳特区报）2026-06-16：石龙—创意城右线、华昌—华富右线、出入段线右线 3 台盾构集中始发、16.5km/石龙—吉华医院</a>；<a href="https://www.sz.gov.cn/cn/xxgk/zfxxgj/tpxw/content/mpost_12846042.html" target="_blank" rel="noopener noreferrer">同期线路走向表述</a>。' },
    { id: '27', name: '27 号线（前海线）', color: '#4F868E', lengthKm: 25, stationCount: 19,
      stations: ['松坪村','西丽高铁站','文光','西丽','丽山','丽水','深大丽湖','南科大','长岭陂','北站西广场','民丰路','白石龙','民康','民宝','华城','银泉','油福','富康','岗头西'],
      stationStatus: { '丽山': 'capped' },
      segments: {
        '长岭陂-北站西广场': { l: 'done', r: 'done' }, // 9-26 双线盾构完成下穿既有地铁
        '丽山-丽水': { l: 'todo', r: 'wip' },       // 9-21 "鹏程2号"右线始发，进入双线掘进
        '华城-银泉': { l: 'wip', r: 'todo' }
      },
      overall: '丽山站主体结构封顶（6 月下旬，装配式建造新模式）；丽山—丽水右线盾构始发（9-21）；长岭陂—北站西广场双线下穿既有地铁（9-26）；华城站封顶',
      bars: [], summary: {},
      dataDate: '2026-10-14',
      sources: '主要依据：<a href="https://mp.weixin.qq.com/s/I2jdtZ2zN2V0746_ZJE06A" target="_blank" rel="noopener noreferrer">深圳地铁官微 2026-06-22：丽山站主体结构封顶（装配式建造新模式）</a>。' },
    { id: '29', name: '29 号线（深超线）', color: '#91D6AC', lengthKm: 11.1, stationCount: 9,
      stations: ['红树湾南','白石洲','白石洲北','欧洲城','珠光','西丽东','西丽高铁站','西丽西','兴东'],
      segments: {
        '欧洲城-珠光': { l: 'wip', r: 'todo' },     // 珠光站现浇段为欧洲城—珠光区间盾构始发场地
        '珠光-西丽东': { l: 'wip', r: 'wip' }
      },
      overall: '西丽西站至兴东站区间风井顺利封顶，成为全线首个封顶工点（9-16）；珠光站现浇结构封顶（9-21）',
      dataDate: '2026-09-24',
      bars: [
        { k: '围护结构', v: 99.8 }, { k: '土方开挖', v: 65.7 },
        { k: '主体结构', v: 36.2 }, { k: '盾构掘进', v: 1.5 }
      ],
      segStat: '掘进 2 台 · 未施工 18',
      staStat: '土建 9 座',
      summary: {},
      sources: '主要依据：<a href="https://www.sztv.com.cn/ysz/zx/szdyxc/83890940.shtml" target="_blank" rel="noopener noreferrer">深圳卫视·第一现场 2026-09-16：西丽西站至兴东站区间风井封顶（全线首个封顶工点）、29 号线一期红树湾南—兴东 11.1km/7 站/4 换乘</a>。',
      footnote: '西兴区间风井为地下三层结构，承担两次盾构始发、三次盾构接收任务，为全线控制性工程；9 月中旬封顶后，计划国庆节前完成西兴区间左线盾构机吊装下井。29 号线站名为暂定名，正式站名以市政府批准公告为准。另：本站数按 2024 年交通详细规划调整公示的 9 座列示，深圳地铁 2026-10 施工通报称 7 座，两者存在差异，暂以规划公示为准。' },
    { id: '32', name: '32 号线（大鹏线）', color: '#744F28', lengthKm: 9.53, stationCount: 5,
      stations: ['溪涌','上洞','土洋','葵涌','葵涌东'],
      segments: {
        '上洞-土洋': { l: 'done', r: 'done' },       // 8-19 上洞站~工作井区间双线贯通
        '土洋-葵涌': { l: 'wip', r: 'todo' },       // 9月初葵涌东—葵涌右线盾构下井
        '葵涌-葵涌东': { l: 'todo', r: 'wip' }
      },
      overall: '「鹏程跃」盾构机始发，溪涌站—上洞站区间右线盾构顺利始发，为全线首台始发的盾构机（3-13）；上洞站—工作井区间双线贯通（8-19）；9 月初葵涌东—葵涌右线盾构下井',
      bars: [], summary: {},
      dataDate: '2026-09-10',
      footnote: '32 号线一期起自 8 号线三期溪涌站（不含），终至葵涌东站，线路全长约 9.5 公里，设站 4 座，其中葵涌站与深惠城际大鹏支线换乘。「溪上区间」为全线控制性工程之一，左线长 1671 米、右线长 1711 米，隧道埋深 9.4 米至 146.1 米；「鹏程跃」号为土压+TBM 双模盾构机，整机长 119 米、开挖直径 6.58 米。',
      sources: '主要依据：<a href="https://www.sz.gov.cn/ztfw/jtly/wyk_184755/content/post_12686590.html" target="_blank" rel="noopener noreferrer">深圳政府在线（深圳市交通运输局，转深圳特区报）2026-03-16：溪涌—上洞区间右线首台盾构始发、9.5km/4 站、溪上区间参数</a>；<a href="https://sz.cnr.cn/gstjsz/20260620/t20260620_527669093.shtml" target="_blank" rel="noopener noreferrer">央广网 2026-06-20：32 号线建设再提速</a>。' },
  ];

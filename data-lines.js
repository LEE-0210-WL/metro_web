/**
 * data-lines.js - 深圳地铁线路统一数据源
 * 
 * 使用说明：
 * 1. 此文件放在网站根目录（与 index.html 同级）
 * 2. 各页面通过 <script src="data-lines.js"></script> 引用
 * 3. 修改任意线路数据只需改此文件一处
 * 
 * 数据格式规范：
 * - 线路编号：字符串，如 "1", "6Z", "15"
 * - 颜色：HEX大写，如 "#00B140"
 * - 日期：YYYY-MM-DD 或 "预计YYYY年M月"
 * - 里程：数字（公里），保留2位小数
 * - 站点列表：数组，按实际顺序排列
 * - 换乘：对象，键为站点名，值为可换乘线路编号数组
 * 
 * 编制日期：2026-08-08
 */

const LINES_DATA = {
  // ==================== 已开通线路 ====================

  "1": {
    name: "深圳地铁1号线",
    alias: "罗宝线",
    color: "#00B140",
    openDate: "2004-12-28",
    length: 40.88,
    stations: 30,
    underground: 28,
    elevated: 2,
    formation: "6A",
    maxSpeed: 80,
    operator: "深圳市地铁集团有限公司",
    category: "operating",
    stationList: [
      "罗湖", "国贸", "老街", "大剧院", "科学馆", "华强路", "岗厦",
      "会展中心", "购物公园", "香蜜湖", "车公庙", "竹子林", "侨城东",
      "华侨城", "世界之窗", "白石洲", "高新园", "深大", "桃园",
      "大新", "鲤鱼门", "前海湾", "新安", "宝安中心", "宝体",
      "坪洲", "西乡", "固戍", "后瑞", "机场东"
    ],
    transfers: {
      "老街": ["3"],
      "大剧院": ["2"],
      "科学馆": ["6"],
      "岗厦": ["10"],
      "会展中心": ["4"],
      "购物公园": ["3"],
      "车公庙": ["7", "9", "11"],
      "世界之窗": ["2"],
      "深大": ["13"],
      "前海湾": ["5", "11"],
      "宝安中心": ["5"],
      "机场东": ["12", "20"]
    }
  },

  "2": {
    name: "深圳地铁2号线",
    alias: "蛇口线",
    color: "#F18A00",
    openDate: "2010-12-28",
    length: 39.78,
    stations: 32,
    underground: 32,
    elevated: 0,
    formation: "6A",
    maxSpeed: 80,
    operator: "深圳市地铁集团有限公司",
    category: "operating",
    stationList: [
      "赤湾", "蛇口港", "海上世界", "水湾", "东角头", "湾厦", "海月",
      "登良", "后海", "科苑", "红树湾", "世界之窗", "侨城北", "安托山",
      "深康", "侨香", "香蜜", "香梅北", "景田", "莲花西", "福田",
      "市民中心", "岗厦北", "华强北", "燕南", "大剧院", "湖贝",
      "黄贝岭", "新秀", "莲塘口岸", "仙湖路", "莲塘"
    ],
    transfers: {
      "世界之窗": ["1"],
      "后海": ["11"],
      "科苑": ["13"],
      "景田": ["9"],
      "福田": ["3", "11"],
      "市民中心": ["4"],
      "岗厦北": ["10", "11", "14"],
      "华强北": ["7"],
      "大剧院": ["1"],
      "黄贝岭": ["5"],
      "莲塘": ["8"]
    }
  },

  "3": {
    name: "深圳地铁3号线",
    alias: "龙岗线",
    color: "#00A9E0",
    openDate: "2010-12-28",
    length: 42.54,
    stations: 31,
    underground: 24,
    elevated: 7,
    formation: "6B",
    maxSpeed: 100,
    operator: "深圳市地铁集团有限公司",
    category: "operating",
    stationList: [
      "福保", "益田", "石厦", "购物公园", "福田", "少年宫", "莲花村",
      "华新", "通新岭", "红岭", "老街", "晒布", "翠竹", "田贝",
      "水贝", "草埔", "布吉", "木棉湾", "大芬", "丹竹头", "六约",
      "塘坑", "横岗", "永湖", "荷坳", "大运", "爱联", "吉祥",
      "龙城广场", "南联", "双龙"
    ],
    transfers: {
      "购物公园": ["1"],
      "福田": ["2", "11"],
      "少年宫": ["4"],
      "莲花村": ["10"],
      "通新岭": ["6"],
      "红岭": ["9"],
      "老街": ["1"],
      "田贝": ["7"],
      "布吉": ["5", "14"],
      "大运": ["14", "16"]
    }
  },

  "4": {
    name: "深圳地铁4号线",
    alias: "龙华线",
    color: "#D42E0F",
    openDate: "2004-12-28",
    length: 31.30,
    stations: 23,
    underground: 15,
    elevated: 8,
    formation: "6A",
    maxSpeed: 80,
    operator: "港铁轨道交通（深圳）有限公司",
    category: "operating",
    stationList: [
      "福田口岸", "福民", "会展中心", "市民中心", "少年宫", "莲花北",
      "上梅林", "民乐", "白石龙", "深圳北站", "红山", "上塘",
      "龙胜", "龙华", "清湖", "清湖北", "竹村", "茜坑", "长湖",
      "观澜", "松元厦", "观澜湖", "牛湖"
    ],
    transfers: {
      "福民": ["7", "10"],
      "会展中心": ["1"],
      "市民中心": ["2"],
      "少年宫": ["3"],
      "上梅林": ["9"],
      "深圳北站": ["5", "6"],
      "红山": ["6"]
    }
  },

  "5": {
    name: "深圳地铁5号线",
    alias: "环中线",
    color: "#9E4DAA",
    openDate: "2011-06-22",
    length: 47.39,
    stations: 34,
    underground: 29,
    elevated: 5,
    formation: "6A",
    maxSpeed: 80,
    operator: "深圳市地铁集团有限公司",
    category: "operating",
    stationList: [
      "赤湾", "荔湾", "铁路公园", "妈湾", "前湾公园", "前湾", "桂湾",
      "前海湾", "临海", "宝华", "宝安中心", "翻身", "灵芝", "洪浪北",
      "兴东", "留仙洞", "西丽", "大学城", "塘朗", "长岭陂", "深圳北站",
      "民治", "五和", "坂田", "杨美", "上水径", "下水径", "长龙",
      "布吉", "百鸽笼", "布心", "太安", "怡景", "黄贝岭"
    ],
    transfers: {
      "前湾": ["9"],
      "前海湾": ["1", "11"],
      "宝安中心": ["1"],
      "灵芝": ["12"],
      "西丽": ["7"],
      "深圳北站": ["4", "6"],
      "五和": ["10"],
      "布吉": ["3", "14"],
      "太安": ["7"],
      "黄贝岭": ["2"]
    }
  },

  "6": {
    name: "深圳地铁6号线",
    alias: "光明线",
    color: "#01C4B7",
    openDate: "2020-08-18",
    length: 49.35,
    stations: 27,
    underground: 18,
    elevated: 9,
    formation: "6A",
    maxSpeed: 100,
    operator: "深圳市地铁集团有限公司",
    category: "operating",
    stationList: [
      "科学馆", "通新岭", "体育中心", "八卦岭", "银湖", "翰岭",
      "梅林关", "深圳北站", "红山", "上芬", "元芬", "阳台山东",
      "官田", "上屋", "长圳", "凤凰城", "光明大街", "光明",
      "科学公园", "楼村", "红花山", "公明广场", "合水口", "薯田埔",
      "松岗公园", "溪头", "松岗"
    ],
    transfers: {
      "科学馆": ["1"],
      "通新岭": ["3"],
      "八卦岭": ["7"],
      "银湖": ["9"],
      "深圳北站": ["4", "5"],
      "红山": ["4"],
      "松岗": ["11"]
    }
  },

  "6Z": {
    name: "深圳地铁6号线支线",
    alias: "",
    color: "#87DBDF",
    openDate: "2022-11-28",
    length: 6.13,
    stations: 4,
    underground: 4,
    elevated: 0,
    formation: "6B",
    maxSpeed: 120,
    operator: "深圳市地铁集团有限公司",
    category: "operating",
    stationList: [
      "光明", "圳美", "中大", "深理工"
    ],
    transfers: {
      "光明": ["6"]
    }
  },

  "7": {
    name: "深圳地铁7号线",
    alias: "西丽线",
    color: "#027776",
    openDate: "2016-10-28",
    length: 32.35,
    stations: 28,
    underground: 28,
    elevated: 0,
    formation: "6A",
    maxSpeed: 80,
    operator: "深圳市地铁集团有限公司",
    category: "operating",
    stationList: [
      "西丽湖", "西丽", "茶光", "珠光", "龙井", "桃源村", "深云",
      "安托山", "农林", "车公庙", "上沙", "沙尾", "石厦", "皇岗村",
      "福民", "皇岗口岸", "福邻", "赤尾", "华强南", "华强北",
      "华新", "黄木岗", "八卦岭", "红岭北", "笋岗", "洪湖",
      "田贝", "太安"
    ],
    transfers: {
      "西丽": ["5"],
      "安托山": ["2"],
      "车公庙": ["1", "9", "11"],
      "石厦": ["3"],
      "福民": ["4", "10"],
      "华强北": ["2"],
      "华新": ["3"],
      "黄木岗": ["14"],
      "八卦岭": ["6"],
      "红岭北": ["9"],
      "田贝": ["3"],
      "太安": ["5"]
    }
  },

  "8": {
    name: "深圳地铁8号线",
    alias: "盐田线",
    color: "#0131AC",
    openDate: "2020-10-28",
    length: 20.38,
    stations: 11,
    underground: 11,
    elevated: 0,
    formation: "6A",
    maxSpeed: 80,
    operator: "深圳市地铁集团有限公司",
    category: "operating",
    stationList: [
      "莲塘", "梧桐山南", "沙头角", "海山", "盐田港西", "深外高中",
      "盐田路", "洪安围", "北山道", "盐田食街", "大梅沙", "小梅沙"
    ],
    transfers: {
      "莲塘": ["2"]
    }
  },

  "9": {
    name: "深圳地铁9号线",
    alias: "梅林线",
    color: "#896B70",
    openDate: "2016-10-28",
    length: 36.18,
    stations: 32,
    underground: 32,
    elevated: 0,
    formation: "6A",
    maxSpeed: 80,
    operator: "深圳市地铁集团有限公司",
    category: "operating",
    stationList: [
      "前湾", "梦海", "怡海", "荔林", "南油西", "南油", "南山书城",
      "深大南", "粤海门", "高新南", "科苑", "红树湾南", "深湾",
      "深圳湾公园", "下沙", "车公庙", "香梅", "景田", "梅景",
      "下梅林", "梅村", "上梅林", "孖岭", "银湖", "泥岗",
      "红岭北", "园岭", "红岭", "鹿丹村", "人民南", "向西村", "文锦"
    ],
    transfers: {
      "前湾": ["5"],
      "南油": ["12"],
      "深大南": ["15"],
      "粤海门": ["13"],
      "科苑": ["2", "13"],
      "红树湾南": ["11"],
      "车公庙": ["1", "7", "11"],
      "景田": ["2"],
      "上梅林": ["4"],
      "银湖": ["6"],
      "红岭北": ["7"],
      "红岭": ["3"]
    }
  },

  "10": {
    name: "深圳地铁10号线",
    alias: "坂田线",
    color: "#F67599",
    openDate: "2020-08-18",
    length: 29.34,
    stations: 24,
    underground: 24,
    elevated: 0,
    formation: "8A",
    maxSpeed: 80,
    operator: "深圳市地铁集团有限公司",
    category: "operating",
    stationList: [
      "福田口岸", "福民", "岗厦", "岗厦北", "莲花村", "冬瓜岭",
      "孖岭", "雅宝", "南坑", "光雅园", "五和", "坂田北",
      "贝尔路", "华为", "岗头", "雪象", "甘坑", "凉帽山",
      "上李朗", "木古", "华南城", "禾花", "平湖", "双拥街"
    ],
    transfers: {
      "福田口岸": ["4"],
      "福民": ["4", "7"],
      "岗厦": ["1"],
      "岗厦北": ["2", "11", "14"],
      "莲花村": ["3"],
      "孖岭": ["9"],
      "五和": ["5"]
    }
  },

  "11": {
    name: "深圳地铁11号线",
    alias: "机场线",
    color: "#672146",
    openDate: "2016-06-28",
    length: 57.50,
    stations: 21,
    underground: 16,
    elevated: 5,
    formation: "8A",
    maxSpeed: 120,
    operator: "深圳市地铁集团有限公司",
    category: "operating",
    stationList: [
      "岗厦北", "福田", "车公庙", "红树湾南", "后海", "南山",
      "前海湾", "宝安", "碧海湾", "机场", "机场北", "福永",
      "桥头", "塘尾", "马安山", "沙井", "后亭", "松岗",
      "碧头", "华强南", "红岭南"
    ],
    transfers: {
      "岗厦北": ["2", "10", "14"],
      "福田": ["2", "3"],
      "车公庙": ["1", "7", "9"],
      "红树湾南": ["9"],
      "后海": ["2"],
      "前海湾": ["1", "5"],
      "松岗": ["6"],
      "华强南": ["7"],
      "红岭南": ["1", "2"]
    }
  },

  "12": {
    name: "深圳地铁12号线",
    alias: "南宝线",
    color: "#A092B2",
    openDate: "2022-11-28",
    length: 40.54,
    stations: 33,
    underground: 33,
    elevated: 0,
    formation: "6A",
    maxSpeed: 80,
    operator: "深圳市地铁集团有限公司",
    category: "operating",
    stationList: [
      "左炮台东", "太子湾", "海上世界", "花果山", "四海", "南油",
      "南光", "南山", "桃园", "南头古城", "中山公园", "同乐南",
      "新安公园", "灵芝", "上川", "流塘", "宝安客运站", "宝田一路",
      "平峦山", "西乡桃源", "钟屋南", "黄田", "兴围", "机场东",
      "福围", "怀德", "福永", "桥头西", "福海西", "国展",
      "国展北", "海上田园南", "海上田园东"
    ],
    transfers: {
      "海上世界": ["2"],
      "南油": ["9"],
      "南山": ["11"],
      "桃园": ["1"],
      "灵芝": ["5"],
      "机场东": ["1", "20"],
      "福永": ["11"],
      "国展北": ["20"]
    }
  },

  "13": {
    name: "深圳地铁13号线",
    alias: "",
    color: "#F49AC1",
    openDate: "预计2025年",
    length: 22.40,
    stations: 16,
    underground: 16,
    elevated: 0,
    formation: "8A",
    maxSpeed: 100,
    operator: "深圳市地铁集团有限公司",
    category: "operating",
    stationList: [
      "深圳湾口岸", "人才公园", "后海", "科苑", "粤海门", "深大",
      "高新中", "高新北", "西丽高铁", "留仙洞", "百旺港大",
      "应人石", "罗租", "石岩", "上屋", "李松蓢"
    ],
    transfers: {
      "后海": ["2", "11"],
      "科苑": ["2", "9"],
      "粤海门": ["9"],
      "深大": ["1"],
      "留仙洞": ["5"]
    }
  },

  "14": {
    name: "深圳地铁14号线",
    alias: "东部快线",
    color: "#F6AD2D",
    openDate: "2022-10-28",
    length: 50.34,
    stations: 18,
    underground: 18,
    elevated: 0,
    formation: "8A",
    maxSpeed: 120,
    operator: "深圳市地铁集团有限公司",
    category: "operating",
    stationList: [
      "岗厦北", "黄木岗", "罗湖北", "布吉", "石芽岭", "六约北",
      "龙城南", "嶂背", "大运", "南约", "宝龙", "锦龙",
      "坪山围", "坪山广场", "六和", "新和", "坪山中心", "沙田"
    ],
    transfers: {
      "岗厦北": ["2", "10", "11"],
      "黄木岗": ["7"],
      "布吉": ["3", "5"],
      "大运": ["3", "16"]
    }
  },

  "16": {
    name: "深圳地铁16号线",
    alias: "龙坪线",
    color: "#F4CB67",
    openDate: "2022-12-28",
    length: 29.20,
    stations: 24,
    underground: 24,
    elevated: 0,
    formation: "6A",
    maxSpeed: 80,
    operator: "深圳市地铁集团有限公司",
    category: "operating",
    stationList: [
      "大运", "大运中心", "龙城公园", "黄阁坑", "愉园", "回龙埔",
      "尚景", "盛平", "龙园", "双龙", "新塘围", "龙东",
      "宝龙同乐", "坪山", "六和", "坪山围", "坪环", "东纵纪念馆",
      "沙壆", "燕子湖", "石井", "技术大学", "田心"
    ],
    transfers: {
      "大运": ["3", "14"],
      "双龙": ["3"],
      "六和": ["14"],
      "坪山围": ["14"]
    }
  },

  "20": {
    name: "深圳地铁20号线",
    alias: "",
    color: "#181BA5",
    openDate: "2021-12-28",
    length: 8.43,
    stations: 5,
    underground: 5,
    elevated: 0,
    formation: "8A",
    maxSpeed: 120,
    operator: "深圳市地铁集团有限公司",
    category: "operating",
    stationList: [
      "机场北", "国展南", "国展", "国展北", "会展城"
    ],
    transfers: {
      "机场北": ["11"],
      "国展": ["12"],
      "国展北": ["12"]
    }
  },

  // ==================== 五期线路（建设中）====================

  "15": {
    name: "深圳地铁15号线",
    alias: "环线",
    color: "#86BE00",
    openDate: "预计2028年6月",
    length: 32.21,
    stations: 24,
    underground: 24,
    elevated: 0,
    formation: "4A/6A",
    maxSpeed: 80,
    operator: "深圳市地铁集团有限公司",
    category: "construction",
    stationList: [
      "前保", "通港路", "铁路公园", "月亮湾公园", "四海", "东滨路",
      "名海", "深大南", "深大北", "麻雀岭", "朗山路", "西丽高铁",
      "打石一路", "同乐关", "洪浪北", "宝安公园", "流塘", "西乡公园",
      "坪洲", "海城", "铲湾北", "铲湾中", "铲湾南", "听海路"
    ],
    transfers: {
      "四海": ["12"],
      "深大南": ["9"],
      "西丽高铁": ["13", "27", "29"],
      "洪浪北": ["5"],
      "流塘": ["12"],
      "坪洲": ["1"]
    }
  },

  "17": {
    name: "深圳地铁17号线",
    alias: "",
    color: "#103389",
    openDate: "预计2028年",
    length: 28.00,
    stations: 24,
    underground: 24,
    elevated: 0,
    formation: "6A",
    maxSpeed: 80,
    operator: "深圳市地铁集团有限公司",
    category: "construction",
    stationList: [
      "罗湖西", "嘉宾", "老街", "大塘龙", "笋岗", "梨园",
      "罗湖北", "德兴", "罗岗", "百鸽笼", "求水山", "南岭",
      "丹竹头", "石芽岭", "下李朗", "深朗", "上李朗", "凉帽山",
      "甘坑", "岗头", "雪象", "下雪", "象角塘", "观湖"
    ],
    transfers: {
      "老街": ["1", "3"],
      "笋岗": ["7"],
      "罗湖北": ["14", "25"],
      "百鸽笼": ["5"],
      "丹竹头": ["3"],
      "石芽岭": ["14"],
      "上李朗": ["21"],
      "凉帽山": ["10"],
      "甘坑": ["10"]
    }
  },

  "19": {
    name: "深圳地铁19号线",
    alias: "",
    color: "#197199",
    openDate: "预计2028年",
    length: 33.00,
    stations: 24,
    underground: 24,
    elevated: 0,
    formation: "4A/6A",
    maxSpeed: 80,
    operator: "深圳市地铁集团有限公司",
    category: "construction",
    stationList: [
      "南塘围", "人民医院", "汤坑", "锦龙", "新围", "宝山",
      "新和", "坪山中心", "燕子岭", "南布", "聚龙", "荔景",
      "坑梓", "金沙", "沙田", "竹坑", "石井", "技术大学",
      "田心", "三角楼", "碧岭", "马峦", "江岭", "葵涌"
    ],
    transfers: {
      "锦龙": ["14"],
      "新和": ["16"],
      "坪山中心": ["14"],
      "沙田": ["14"]
    }
  },

  "22": {
    name: "深圳地铁22号线",
    alias: "",
    color: "#246732",
    openDate: "预计2028年",
    length: 38.00,
    stations: 21,
    underground: 21,
    elevated: 0,
    formation: "8A",
    maxSpeed: 100,
    operator: "深圳市地铁集团有限公司",
    category: "construction",
    stationList: [
      "上沙", "香蜜西", "红荔西", "香梅北", "北环中学", "凯丰",
      "民乐", "横岭", "民治", "民治北", "油松", "松和",
      "岗头北", "风门坳", "观湖", "松元厦", "桂花", "库坑",
      "黎光", "鹭湖", "观澜"
    ],
    transfers: {
      "上沙": ["7"],
      "香梅北": ["2"],
      "民乐": ["4"],
      "民治": ["5"],
      "民治北": ["27"],
      "松和": ["25"],
      "观湖": ["17"],
      "松元厦": ["4"],
      "观澜": ["4"]
    }
  },

  "25": {
    name: "深圳地铁25号线",
    alias: "",
    color: "#597276",
    openDate: "预计2028年",
    length: 16.20,
    stations: 14,
    underground: 14,
    elevated: 0,
    formation: "6A",
    maxSpeed: 80,
    operator: "深圳市地铁集团有限公司",
    category: "construction",
    stationList: [
      "吉华医院", "贝尔路", "黄君山", "上油松", "油松", "油福",
      "景龙", "龙华", "龙华公园", "华富", "华昌", "华盛",
      "大浪", "石凹"
    ],
    transfers: {
      "贝尔路": ["10"],
      "龙华": ["4"]
    }
  },

  "27": {
    name: "深圳地铁27号线",
    alias: "",
    color: "#594419",
    openDate: "预计2028年",
    length: 25.00,
    stations: 21,
    underground: 21,
    elevated: 0,
    formation: "6A",
    maxSpeed: 80,
    operator: "深圳市地铁集团有限公司",
    category: "construction",
    stationList: [
      "松坪村", "西丽高铁", "文光", "西丽", "丽山", "丽水",
      "深大丽湖", "长岭陂", "南山智园", "科苑北", "高新北",
      "高新中", "深大", "桃园", "南园", "怡海", "前湾",
      "前湾公园", "妈湾", "赤湾", "前海公园"
    ],
    transfers: {
      "西丽高铁": ["13", "15", "29"],
      "西丽": ["5", "7"],
      "长岭陂": ["5"],
      "深大": ["1", "13"],
      "桃园": ["1", "12"],
      "怡海": ["9"]
    }
  },

  "29": {
    name: "深圳地铁29号线",
    alias: "",
    color: "#606506",
    openDate: "预计2028年",
    length: 30.60,
    stations: 24,
    underground: 24,
    elevated: 0,
    formation: "6A",
    maxSpeed: 80,
    operator: "深圳市地铁集团有限公司",
    category: "construction",
    stationList: [
      "红树湾南", "白石洲", "世界之窗", "侨城北", "深康", "安托山",
      "侨香", "景田", "香梅", "香蜜", "香梅北", "梅景",
      "下梅林", "梅村", "上梅林", "翰岭", "银湖", "泥岗",
      "红岭北", "园岭", "红岭", "鹿丹村", "人民南", "文锦"
    ],
    transfers: {
      "红树湾南": ["9", "11"],
      "白石洲": ["1"],
      "世界之窗": ["1", "2"],
      "安托山": ["2", "7"],
      "景田": ["2", "9"],
      "上梅林": ["4", "9"],
      "银湖": ["6", "9"],
      "红岭北": ["7", "9"],
      "红岭": ["3", "9"]
    }
  },

  "32": {
    name: "深圳地铁32号线",
    alias: "",
    color: "#625916",
    openDate: "预计2028年",
    length: 9.50,
    stations: 5,
    underground: 5,
    elevated: 0,
    formation: "4A",
    maxSpeed: 80,
    operator: "深圳市地铁集团有限公司",
    category: "construction",
    stationList: [
      "溪涌", "上洞", "土洋", "葵涌", "葵涌东"
    ],
    transfers: {}
  }
};

// ==================== 辅助函数 ====================

/**
 * 根据线路编号获取线路数据
 * @param {string} lineId - 线路编号，如 "1", "15"
 * @returns {Object|null}
 */
function getLineData(lineId) {
  return LINES_DATA[lineId] || null;
}

/**
 * 获取所有已开通线路
 * @returns {Array}
 */
function getOperatingLines() {
  return Object.entries(LINES_DATA)
    .filter(([_, data]) => data.category === "operating")
    .map(([id, data]) => ({ id, ...data }));
}

/**
 * 获取所有建设中线路（五期）
 * @returns {Array}
 */
function getConstructionLines() {
  return Object.entries(LINES_DATA)
    .filter(([_, data]) => data.category === "construction")
    .map(([id, data]) => ({ id, ...data }));
}

/**
 * 根据站点名查找所属线路
 * @param {string} stationName - 站点名
 * @returns {Array} - 包含该站点的线路编号数组
 */
function findLinesByStation(stationName) {
  const result = [];
  for (const [lineId, data] of Object.entries(LINES_DATA)) {
    if (data.stationList.includes(stationName)) {
      result.push(lineId);
    }
  }
  return result;
}

/**
 * 获取某站点的换乘信息
 * @param {string} stationName - 站点名
 * @returns {Object|null} - { line: "线路编号", transfers: ["可换乘线路"] }
 */
function getTransferInfo(stationName) {
  for (const [lineId, data] of Object.entries(LINES_DATA)) {
    if (data.transfers[stationName]) {
      return {
        line: lineId,
        lineName: data.name,
        transfers: data.transfers[stationName]
      };
    }
  }
  return null;
}

/**
 * 获取线路颜色（带#的HEX格式）
 * @param {string} lineId - 线路编号
 * @returns {string}
 */
function getLineColor(lineId) {
  return LINES_DATA[lineId]?.color || "#999999";
}

/**
 * 获取线路简称（用于显示）
 * @param {string} lineId - 线路编号
 * @returns {string}
 */
function getLineShortName(lineId) {
  const data = LINES_DATA[lineId];
  if (!data) return lineId;
  return data.alias ? `${data.name}（${data.alias}）` : data.name;
}

// 导出（如果是模块化环境）
if (typeof module !== "undefined" && module.exports) {
  module.exports = { LINES_DATA, getLineData, getOperatingLines, 
    getConstructionLines, findLinesByStation, getTransferInfo, 
    getLineColor, getLineShortName };
}

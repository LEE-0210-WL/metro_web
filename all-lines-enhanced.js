/**
 * all-lines-enhanced.js - 深圳地铁线路完整数据（增强版）
 * 
 * 整合来源：
 *   - all_lines_final.json（25条线路基础数据，站点已核对）
 *   - data-lines.js（运营商、分类、结构化数字字段）
 *   - trains.html（车型、编号范围、制造商）
 *   - encountered.html（已遇到车号记录）
 * 
 * 字段说明：
 *   - name/alias/color/openDate: 基础信息
 *   - lengthDesc/stationsDesc/formationDesc/maxSpeedDesc: 原始描述字符串
 *   - lengthKm/stationCount/undergroundCount/elevatedCount/maxSpeedKmh: 结构化数字
 *   - formationCode: 编组代码如 "6A"、"8A"、"4A"
 *   - operator: 运营商
 *   - category: "operating"(已开通) / "construction"(建设中)
 *   - maxPassengerFlow: 历史最大客流记录（取最高值）
 *   - stationList: 完整站点列表（按顺序）
 *   - transfers: 换乘信息 {站点名: [可换乘线路编号]}
 *   - trains: 车辆信息数组 [{model, numberRange, manufacturer, encountered}]
 * 
 * 编制日期：2026-08-13
 */

const ALL_LINES_ENHANCED = [
  {
    "id": "1",
    "name": "深圳地铁1号线（罗宝线）",
    "alias": "Line 1 / Luobao Line",
    "color": "#01AF55",
    "openDate": "2004年12月28日（一期）；2009年9月28日（续建试验段）；2011年6月15日（续建段）",
    "lengthDesc": "约 40.88 公里",
    "stationsDesc": "30座（地下28座、高架2座）",
    "formationDesc": "6节编组A型列车",
    "maxSpeedDesc": "80公里/小时",
    "lengthKm": 40.98,
    "stationCount": 30,
    "undergroundCount": 28,
    "elevatedCount": 2,
    "formationCode": "6A",
    "maxSpeedKmh": 80,
    "operator": "深圳市地铁集团有限公司",
    "category": "operating",
    "stationList": [
      "罗湖",
      "国贸",
      "老街",
      "大剧院",
      "科学馆",
      "华强路",
      "岗厦",
      "会展中心",
      "购物公园",
      "香蜜湖",
      "车公庙",
      "竹子林",
      "侨城东",
      "华侨城",
      "世界之窗",
      "白石洲",
      "高新园",
      "深大",
      "桃园",
      "大新",
      "鲤鱼门",
      "前海湾",
      "新安",
      "宝安中心",
      "宝体",
      "坪洲",
      "西乡",
      "固戍",
      "后瑞",
      "机场东"
    ],
    "transfers": {
      "老街": [
        "3",
        "17"
      ],
      "大剧院": [
        "2",
        "5"
      ],
      "科学馆": [
        "6"
      ],
      "岗厦": [
        "10"
      ],
      "会展中心": [
        "4"
      ],
      "购物公园": [
        "3"
      ],
      "车公庙": [
        "7",
        "9",
        "11"
      ],
      "世界之窗": [
        "2"
      ],
      "白石洲": [
        "20",
        "29"
      ],
      "高新园": [
        "20"
      ],
      "深大": [
        "13",
        "20"
      ],
      "桃园": [
        "12"
      ],
      "前海湾": [
        "5",
        "11"
      ],
      "宝安中心": [
        "5"
      ],
      "坪洲": [
        "15"
      ],
      "机场东": [
        "12"
      ]
    },
    "trains": [
      {
        "model": "01A2206庞",
        "numberRange": "101-122",
        "manufacturer": "庞巴迪",
        "encountered": "110、116、119、121"
      },
      {
        "model": "01A0406長",
        "numberRange": "123-126",
        "manufacturer": "长春轨道客车",
        "encountered": "126"
      },
      {
        "model": "01A2606株",
        "numberRange": "127-152",
        "manufacturer": "株洲电力机车",
        "encountered": "127、129、135、136、141"
      },
      {
        "model": "01A3306株",
        "numberRange": "153-185",
        "manufacturer": "株洲电力机车",
        "encountered": "153、161、166、172、175"
      }
    ],
    "maxPassengerFlow": "143.9万人次（2019年12月31日）"
  },
  {
    "id": "2",
    "name": "深圳地铁2号线（蛇口线）",
    "alias": "Line 2 / Shekou Line",
    "color": "#B95800",
    "openDate": "2010年12月28日（一期）；2011年6月28日（二期）；2020年10月28日（三期）",
    "lengthDesc": "约 39.57 公里",
    "stationsDesc": "32座（地下站32座）",
    "formationDesc": "6节编组A型列车",
    "maxSpeedDesc": "80公里/小时",
    "lengthKm": 39.57,
    "stationCount": 32,
    "undergroundCount": 32,
    "elevatedCount": 0,
    "formationCode": "6A",
    "maxSpeedKmh": 80,
    "operator": "深圳市地铁集团有限公司",
    "category": "operating",
    "stationList": [
      "赤湾",
      "蛇口港",
      "海上世界",
      "水湾",
      "东角头",
      "湾厦",
      "海月",
      "登良",
      "后海",
      "科苑",
      "红树湾",
      "世界之窗",
      "侨城北",
      "深康",
      "安托山",
      "侨香",
      "香蜜",
      "香梅北",
      "景田",
      "莲花西",
      "福田",
      "市民中心",
      "岗厦北",
      "华强北",
      "燕南",
      "大剧院",
      "湖贝",
      "黄贝岭",
      "新秀",
      "莲塘口岸",
      "仙湖路",
      "莲塘"
    ],
    "transfers": {
      "赤湾": [
        "5"
      ],
      "海上世界": [
        "12"
      ],
      "东角头": [
        "13"
      ],
      "后海": [
        "11",
        "13"
      ],
      "科苑": [
        "13"
      ],
      "世界之窗": [
        "1"
      ],
      "安托山": [
        "7"
      ],
      "香梅北": [
        "22"
      ],
      "景田": [
        "9"
      ],
      "福田": [
        "3",
        "11"
      ],
      "市民中心": [
        "4"
      ],
      "岗厦北": [
        "10",
        "11",
        "14"
      ],
      "华强北": [
        "7"
      ],
      "大剧院": [
        "1",
        "5"
      ],
      "湖贝": [
        "5"
      ],
      "黄贝岭": [
        "5"
      ],
      "莲塘": [
        "8"
      ]
    },
    "trains": [
      {
        "model": "02A3506長",
        "numberRange": "201-235",
        "manufacturer": "长春轨道客车",
        "encountered": "201、211、218、226、228"
      },
      {
        "model": "02A1606長",
        "numberRange": "236-251",
        "manufacturer": "长春轨道客车",
        "encountered": "240、244"
      },
      {
        "model": "02A0606株",
        "numberRange": "252-257",
        "manufacturer": "株洲电力机车",
        "encountered": null
      },
      {
        "model": "02A2406株/08A2406株",
        "numberRange": "258/801-281/824",
        "manufacturer": "株洲电力机车",
        "encountered": "266/809、268/811、271/814、273/816、278/821"
      },
      {
        "model": "02A0904株/08A0904株",
        "numberRange": "282/825-290/833",
        "manufacturer": "株洲电力机车",
        "encountered": null
      }
    ],
    "maxPassengerFlow": "149.31万人次（2/8号线合计，截至2025年7月）"
  },
  {
    "id": "3",
    "name": "深圳地铁3号线（龙岗线）",
    "alias": "Line 3 / Longgang Line",
    "color": "#00A9DF",
    "openDate": "2010年12月28日（一期）；2011年6月28日（二期）；2020年10月28日（三期）；2024年12月28日（四期）",
    "lengthDesc": "约52.3公里",
    "stationsDesc": "38座（地下站15座，高架站23座，换乘站13座）",
    "formationDesc": "6节编组B型车",
    "maxSpeedDesc": "100公里/小时",
    "lengthKm": 52.33,
    "stationCount": 38,
    "undergroundCount": 24,
    "elevatedCount": 7,
    "formationCode": "6B",
    "maxSpeedKmh": 100,
    "operator": "深圳市地铁集团有限公司",
    "category": "operating",
    "stationList": [
      "福保",
      "益田",
      "石厦",
      "购物公园",
      "福田",
      "少年宫",
      "莲花村",
      "华新",
      "通新岭",
      "红岭",
      "老街",
      "晒布",
      "翠竹",
      "田贝",
      "水贝",
      "草埔",
      "布吉",
      "木棉湾",
      "大芬",
      "丹竹头",
      "六约",
      "塘坑",
      "横岗",
      "永湖",
      "荷坳",
      "大运",
      "爱联",
      "吉祥",
      "龙城广场",
      "南联",
      "双龙",
      "梨园",
      "新生",
      "坪西",
      "低碳城",
      "白石塘",
      "富坪",
      "坪地六联"
    ],
    "transfers": {
      "石厦": [
        "7"
      ],
      "购物公园": [
        "1"
      ],
      "福田": [
        "2",
        "11"
      ],
      "少年宫": [
        "4"
      ],
      "莲花村": [
        "10"
      ],
      "华新": [
        "7"
      ],
      "通新岭": [
        "6"
      ],
      "红岭": [
        "9"
      ],
      "老街": [
        "1",
        "17"
      ],
      "田贝": [
        "7"
      ],
      "布吉": [
        "5",
        "14"
      ],
      "丹竹头": [
        "17"
      ],
      "大运": [
        "16"
      ],
      "双龙": [
        "16"
      ]
    },
    "trains": [
      {
        "model": "03B4306長",
        "numberRange": "301-343",
        "manufacturer": "长春轨道客车",
        "encountered": "302、318、337、342、343"
      },
      {
        "model": "03B3306浦",
        "numberRange": "344-376",
        "manufacturer": "浦镇车辆厂",
        "encountered": "342、351、360、367、375"
      },
      {
        "model": "03B2206浦",
        "numberRange": "377-398",
        "manufacturer": "浦镇车辆厂",
        "encountered": "378、383、388、390、395"
      }
    ],
    "maxPassengerFlow": "115.15万人次（2025年12月31日）"
  },
  {
    "id": "4",
    "name": "深圳地铁4号线（龙华线）",
    "alias": "Line 4 / Longhua Line",
    "color": "#D42E0F",
    "openDate": "2004年12月28日（一期）；2011年6月16日（二期）；2020年10月28日（三期）",
    "lengthDesc": "约 31.3 公里",
    "stationsDesc": "23座（14座地下站、1座地面站、8座高架站）",
    "formationDesc": "6节编组A型列车",
    "maxSpeedDesc": "80公里/小时",
    "lengthKm": 31.3,
    "stationCount": 23,
    "undergroundCount": 15,
    "elevatedCount": 8,
    "formationCode": "6A",
    "maxSpeedKmh": 80,
    "operator": "港铁轨道交通（深圳）有限公司",
    "category": "operating",
    "stationList": [
      "福田口岸",
      "福民",
      "会展中心",
      "市民中心",
      "少年宫",
      "莲花北",
      "上梅林",
      "民乐",
      "白石龙",
      "深圳北站",
      "红山",
      "上塘",
      "龙胜",
      "龙华",
      "清湖",
      "清湖北",
      "竹村",
      "茜坑",
      "长湖",
      "观澜",
      "松元厦",
      "观澜湖",
      "牛湖"
    ],
    "transfers": {
      "福田口岸": [
        "10"
      ],
      "福民": [
        "7",
        "10"
      ],
      "会展中心": [
        "1"
      ],
      "市民中心": [
        "2"
      ],
      "少年宫": [
        "3"
      ],
      "上梅林": [
        "9"
      ],
      "民乐": [
        "22"
      ],
      "白石龙": [
        "27"
      ],
      "红山": [
        "6"
      ],
      "龙华": [
        "25"
      ],
      "松元厦": [
        "22"
      ],
      "深圳北站": [
        "5",
        "6"
      ]
    },
    "trains": [
      {
        "model": "二期",
        "numberRange": "401-428",
        "manufacturer": "制造商信息未提供",
        "encountered": null
      },
      {
        "model": "三期",
        "numberRange": "429-452",
        "manufacturer": "制造商信息未提供",
        "encountered": null
      }
    ],
    "maxPassengerFlow": "91.13万人次（2025年12月31日）"
  },
  {
    "id": "5",
    "name": "深圳地铁5号线（环中线）",
    "alias": "Line 5 / Huanzhong Line",
    "color": "#9E4DAA",
    "openDate": "2011年6月22日（一期）；2019年9月28日（二期）；2025年12月28日（西延段）",
    "lengthDesc": "约 50.27 公里",
    "stationsDesc": "37座（35座地下站、2座高架站）",
    "formationDesc": "6节编组A型列车",
    "maxSpeedDesc": "80公里/小时",
    "lengthKm": 50.27,
    "stationCount": 37,
    "undergroundCount": 29,
    "elevatedCount": 5,
    "formationCode": "6A",
    "maxSpeedKmh": 80,
    "operator": "深圳市地铁集团有限公司",
    "category": "operating",
    "stationList": [
      "赤湾",
      "荔湾",
      "铁路公园",
      "妈湾",
      "前湾公园",
      "前湾",
      "桂湾",
      "前海湾",
      "临海",
      "宝华",
      "宝安中心",
      "翻身",
      "灵芝",
      "洪浪北",
      "兴东",
      "留仙洞",
      "西丽",
      "大学城",
      "塘朗",
      "长岭陂",
      "深圳北站",
      "民治",
      "五和",
      "坂田",
      "杨美",
      "上水径",
      "下水径",
      "长龙",
      "布吉",
      "百鸽笼",
      "布心",
      "太安",
      "怡景",
      "黄贝岭",
      "湖贝",
      "东门",
      "大剧院"
    ],
    "transfers": {
      "赤湾": [
        "2"
      ],
      "铁路公园": [
        "15"
      ],
      "前湾": [
        "9"
      ],
      "前海湾": [
        "1",
        "11"
      ],
      "宝安中心": [
        "1"
      ],
      "灵芝": [
        "12"
      ],
      "洪浪北": [
        "15"
      ],
      "兴东": [
        "29"
      ],
      "留仙洞": [
        "13"
      ],
      "西丽": [
        "7",
        "27"
      ],
      "长岭陂": [
        "27"
      ],
      "民治": [
        "22"
      ],
      "五和": [
        "10"
      ],
      "布吉": [
        "3",
        "14"
      ],
      "百鸽笼": [
        "17"
      ],
      "太安": [
        "7"
      ],
      "黄贝岭": [
        "2"
      ],
      "大剧院": [
        "1",
        "2"
      ],
      "深圳北站": [
        "4",
        "6"
      ]
    },
    "trains": [
      {
        "model": "05A2206株",
        "numberRange": "501-522",
        "manufacturer": "株洲电力机车",
        "encountered": "504、514、518、520、543"
      },
      {
        "model": "05A0806株",
        "numberRange": "523-530",
        "manufacturer": "株洲电力机车",
        "encountered": null
      },
      {
        "model": "05A2106長",
        "numberRange": "531-551",
        "manufacturer": "长春轨道客车",
        "encountered": null
      },
      {
        "model": "05A0706株",
        "numberRange": "552-558",
        "manufacturer": "株洲电力机车",
        "encountered": "553"
      },
      {
        "model": "05A3906深",
        "numberRange": "559-597",
        "manufacturer": "深圳中车",
        "encountered": "559、563、566、576、578"
      }
    ],
    "maxPassengerFlow": "185.04万人次（2025年12月31日）"
  },
  {
    "id": "6",
    "name": "深圳地铁6号线（光明线）",
    "alias": "Line 6 / Guangming Line",
    "color": "#01C4B7",
    "openDate": "2020年8月18日",
    "lengthDesc": "约 49.51 公里",
    "stationsDesc": "27座（12座地下站、15座高架站）",
    "formationDesc": "6节编组A型列车",
    "maxSpeedDesc": "100公里/小时",
    "lengthKm": 49.5,
    "stationCount": 27,
    "undergroundCount": 18,
    "elevatedCount": 9,
    "formationCode": "6A",
    "maxSpeedKmh": 100,
    "operator": "深圳市地铁集团有限公司",
    "category": "operating",
    "stationList": [
      "科学馆",
      "通新岭",
      "体育中心",
      "八卦岭",
      "银湖",
      "翰岭",
      "梅林关",
      "深圳北站",
      "红山",
      "上芬",
      "元芬",
      "阳台山东",
      "官田",
      "上屋",
      "长圳",
      "凤凰城",
      "光明大街",
      "光明",
      "科学公园",
      "楼村",
      "红花山",
      "公明广场",
      "合水口",
      "薯田埔",
      "松岗公园",
      "溪头",
      "松岗"
    ],
    "transfers": {
      "科学馆": [
        "1"
      ],
      "通新岭": [
        "3"
      ],
      "八卦岭": [
        "7"
      ],
      "银湖": [
        "9"
      ],
      "红山": [
        "4"
      ],
      "上屋": [
        "13"
      ],
      "凤凰城": [
        "13"
      ],
      "光明": [
        "6z"
      ],
      "公明广场": [
        "13"
      ],
      "松岗": [
        "11",
        "12"
      ],
      "深圳北站": [
        "4",
        "5"
      ]
    },
    "trains": [
      {
        "model": "06A5106浦",
        "numberRange": "601-651",
        "manufacturer": "浦镇车辆厂",
        "encountered": null
      }
    ],
    "maxPassengerFlow": "79.20万人次（2025年12月31日）"
  },
  {
    "id": "7",
    "name": "深圳地铁7号线（西丽线）",
    "alias": "Line 7 / Xili Line",
    "color": "#0131AC",
    "openDate": "2016年10月28日（一期）；2024年12月28日（二期）",
    "lengthDesc": "约 32.41 公里",
    "stationsDesc": "29座（地下站29座，换乘站13座）",
    "formationDesc": "6节编组A型车",
    "maxSpeedDesc": "80公里/小时",
    "lengthKm": 32.39,
    "stationCount": 29,
    "undergroundCount": 28,
    "elevatedCount": 0,
    "formationCode": "6A",
    "maxSpeedKmh": 80,
    "operator": "深圳市地铁集团有限公司",
    "category": "operating",
    "stationList": [
      "深大丽湖",
      "北大",
      "西丽湖",
      "西丽",
      "茶光",
      "珠光",
      "龙井",
      "桃源村",
      "深云",
      "安托山",
      "农林",
      "车公庙",
      "上沙",
      "沙尾",
      "石厦",
      "皇岗村",
      "福民",
      "皇岗口岸",
      "赤尾",
      "华强南",
      "华强北",
      "华新",
      "黄木岗",
      "八卦岭",
      "红岭北",
      "笋岗",
      "洪湖",
      "田贝",
      "太安"
    ],
    "transfers": {
      "深大丽湖": [
        "27"
      ],
      "西丽": [
        "5",
        "27"
      ],
      "珠光": [
        "29"
      ],
      "安托山": [
        "2"
      ],
      "车公庙": [
        "1",
        "9",
        "11"
      ],
      "上沙": [
        "22"
      ],
      "石厦": [
        "3"
      ],
      "福民": [
        "4",
        "10"
      ],
      "华强南": [
        "11"
      ],
      "华强北": [
        "2"
      ],
      "华新": [
        "3"
      ],
      "黄木岗": [
        "14"
      ],
      "八卦岭": [
        "6"
      ],
      "红岭北": [
        "9"
      ],
      "笋岗": [
        "17"
      ],
      "田贝": [
        "3"
      ],
      "太安": [
        "5"
      ]
    },
    "trains": [
      {
        "model": "07A4106長",
        "numberRange": "701-741",
        "manufacturer": "长春轨道客车",
        "encountered": "706、710、711、720、735"
      },
      {
        "model": "07A0203長",
        "numberRange": "742-743",
        "manufacturer": "长春轨道客车",
        "encountered": null
      }
    ],
    "maxPassengerFlow": "72.3万人次（2024年12月31日）"
  },
  {
    "id": "8",
    "name": "深圳地铁8号线（盐田线）",
    "alias": "Line 8 / Yantian Line",
    "color": "#B95800",
    "openDate": "2020年10月28日（一期）；2023年12月27日（二期）；2025年12月28日（三期）",
    "lengthDesc": "约 27.78 公里",
    "stationsDesc": "12座（全部为地下站）",
    "formationDesc": "6节编组A型列车",
    "maxSpeedDesc": "80公里/小时",
    "lengthKm": 27.78,
    "stationCount": 12,
    "undergroundCount": 11,
    "elevatedCount": 0,
    "formationCode": "6A",
    "maxSpeedKmh": 80,
    "operator": "深圳市地铁集团有限公司",
    "category": "operating",
    "stationList": [
      "莲塘",
      "梧桐山南",
      "沙头角",
      "海山",
      "盐田港西",
      "深外高中",
      "盐田路",
      "鸿安围",
      "盐田墟",
      "大梅沙",
      "小梅沙",
      "溪涌"
    ],
    "transfers": {
      "莲塘": [
        "2"
      ],
      "溪涌": [
        "32"
      ]
    },
    "trains": [
      {
        "model": "02A2406株/ 08A2406株",
        "numberRange": "258/801-281/824",
        "manufacturer": "株洲电力机车",
        "note": "与2号线共用车辆",
        "encountered": null
      },
      {
        "model": "02A0904株/08A0904株",
        "numberRange": "282/825-290/833",
        "manufacturer": "株洲电力机车",
        "note": "与2号线共用车辆",
        "encountered": null
      }
    ],
    "maxPassengerFlow": "52.55万人次（2025年5月1日）"
  },
  {
    "id": "9",
    "name": "深圳地铁9号线（梅林线）",
    "alias": "Line 9 / Meilin Line",
    "color": "#896B70",
    "openDate": "2016年10月28日（一期）；2019年12月8日（二期）",
    "lengthDesc": "约 36.18 公里",
    "stationsDesc": "32座（全部为地下站）",
    "formationDesc": "6节编组A型列车",
    "maxSpeedDesc": "80公里/小时",
    "lengthKm": 36.18,
    "stationCount": 32,
    "undergroundCount": 32,
    "elevatedCount": 0,
    "formationCode": "6A",
    "maxSpeedKmh": 80,
    "operator": "深圳市地铁集团有限公司",
    "category": "operating",
    "stationList": [
      "前湾",
      "梦海",
      "怡海",
      "荔林",
      "南油西",
      "南油",
      "南山书城",
      "深大南",
      "粤海门",
      "高新南",
      "红树湾南",
      "深湾",
      "深圳湾公园",
      "下沙",
      "车公庙",
      "香梅",
      "景田",
      "梅景",
      "下梅林",
      "梅村",
      "上梅林",
      "孖岭",
      "银湖",
      "泥岗",
      "红岭北",
      "园岭",
      "红岭",
      "红岭南",
      "鹿丹村",
      "人民南",
      "向西村",
      "文锦"
    ],
    "transfers": {
      "前湾": [
        "5"
      ],
      "南油": [
        "12"
      ],
      "深大南": [
        "15"
      ],
      "粤海门": [
        "13"
      ],
      "红树湾南": [
        "11",
        "29"
      ],
      "车公庙": [
        "1",
        "7",
        "11"
      ],
      "景田": [
        "2"
      ],
      "上梅林": [
        "4"
      ],
      "孖岭": [
        "10"
      ],
      "银湖": [
        "6"
      ],
      "红岭北": [
        "7"
      ],
      "红岭": [
        "3"
      ],
      "红岭南": [
        "11"
      ]
    },
    "trains": [
      {
        "model": "09A2906長",
        "numberRange": "901-929",
        "manufacturer": "长春轨道客车",
        "encountered": "915、927"
      },
      {
        "model": "09A2206長",
        "numberRange": "930-951",
        "manufacturer": "长春轨道客车",
        "encountered": "935、948、951"
      }
    ],
    "maxPassengerFlow": "78.1万人次（2024年12月31日）"
  },
  {
    "id": "10",
    "name": "深圳地铁10号线（坂田线）",
    "alias": "Line 10 / Bantian Line",
    "color": "#F67599",
    "openDate": "2020年8月18日",
    "lengthDesc": "约 29.31 公里",
    "stationsDesc": "24座（全部为地下站）",
    "formationDesc": "8节编组A型列车",
    "maxSpeedDesc": "80公里/小时",
    "lengthKm": 29.31,
    "stationCount": 24,
    "undergroundCount": 24,
    "elevatedCount": 0,
    "formationCode": "8A",
    "maxSpeedKmh": 80,
    "operator": "深圳市地铁集团有限公司",
    "category": "operating",
    "stationList": [
      "福田口岸",
      "福民",
      "岗厦",
      "岗厦北",
      "莲花村",
      "冬瓜岭",
      "孖岭",
      "雅宝",
      "南坑",
      "光雅园",
      "五和",
      "坂田北",
      "贝尔路",
      "华为",
      "岗头",
      "雪象",
      "甘坑",
      "凉帽山",
      "上李朗",
      "木古",
      "华南城",
      "禾花",
      "平湖",
      "双拥街"
    ],
    "transfers": {
      "福田口岸": [
        "4"
      ],
      "福民": [
        "4",
        "7"
      ],
      "岗厦": [
        "1"
      ],
      "岗厦北": [
        "2",
        "11",
        "14"
      ],
      "莲花村": [
        "3"
      ],
      "孖岭": [
        "9"
      ],
      "五和": [
        "5"
      ],
      "贝尔路": [
        "25"
      ],
      "上李朗": [
        "17"
      ]
    },
    "trains": [
      {
        "model": "10A3508長",
        "numberRange": "1001-1035",
        "manufacturer": "长春轨道客车",
        "encountered": "1007、1013、1019、1021、1022"
      }
    ],
    "maxPassengerFlow": "66.89万人次（2025年12月31日）"
  },
  {
    "id": "11",
    "name": "深圳地铁11号线（机场线）",
    "alias": "Line 11 / Airport Line",
    "color": "#672146",
    "openDate": "2016年6月28日（一期）；2022年10月28日（二期①）；2024年12月28日（二期②）；2025年12月28日（二期③）",
    "lengthDesc": "约 57.56 公里",
    "stationsDesc": "23座（18座地下站、4座高架站）",
    "formationDesc": "8节编组A型列车（6节普通+2节商务）",
    "maxSpeedDesc": "120公里/小时",
    "lengthKm": 57.56,
    "stationCount": 22,
    "undergroundCount": 16,
    "elevatedCount": 5,
    "formationCode": "8A",
    "maxSpeedKmh": 120,
    "operator": "深圳市地铁集团有限公司",
    "category": "operating",
    "stationList": [
      "红岭南",
      "华强南",
      "福星",
      "岗厦北",
      "福田",
      "车公庙",
      "红树湾南",
      "后海",
      "南山",
      "前海湾",
      "宝安",
      "碧海湾",
      "机场",
      "机场北",
      "福永",
      "桥头",
      "塘尾",
      "马安山",
      "沙井",
      "后亭",
      "松岗",
      "碧头"
    ],
    "transfers": {
      "红岭南": [
        "9"
      ],
      "华强南": [
        "7"
      ],
      "岗厦北": [
        "2",
        "10",
        "14"
      ],
      "福田": [
        "2",
        "3"
      ],
      "车公庙": [
        "1",
        "7",
        "9"
      ],
      "红树湾南": [
        "9",
        "27"
      ],
      "后海": [
        "2",
        "13"
      ],
      "南山": [
        "12"
      ],
      "前海湾": [
        "1",
        "5"
      ],
      "机场北": [
        "20"
      ],
      "福永": [
        "12"
      ],
      "松岗": [
        "6",
        "12"
      ]
    },
    "trains": [
      {
        "model": "11A3308株",
        "numberRange": "1101-1133",
        "manufacturer": "株洲电力机车",
        "encountered": "1101、1113、1132、1133"
      },
      {
        "model": "11A4008長",
        "numberRange": "1134-1173",
        "manufacturer": "长春轨道客车",
        "encountered": "1138、1145、1150、1153、1159"
      }
    ],
    "maxPassengerFlow": "141.46万人次（2025年12月31日）"
  },
  {
    "id": "12",
    "name": "深圳地铁12号线（南宝线）",
    "alias": "Line 12 / Nanbao Line",
    "color": "#A092B2",
    "openDate": "2022年11月28日（一期）；2024年12月28日（二期）",
    "lengthDesc": "约 48.61 公里",
    "stationsDesc": "39座（全部为地下站）",
    "formationDesc": "6节编组A型列车",
    "maxSpeedDesc": "80公里/小时",
    "lengthKm": 48.59,
    "stationCount": 39,
    "undergroundCount": 33,
    "elevatedCount": 0,
    "formationCode": "6A",
    "maxSpeedKmh": 80,
    "operator": "深圳市地铁集团有限公司",
    "category": "operating",
    "stationList": [
      "左炮台东",
      "太子湾",
      "海上世界",
      "花果山",
      "四海",
      "南油",
      "南光",
      "南山",
      "桃园",
      "南头古城",
      "中山公园",
      "同乐南",
      "新安公园",
      "灵芝",
      "上川",
      "流塘",
      "宝安客运站",
      "宝田一路",
      "平峦山",
      "西乡桃源",
      "钟屋南",
      "黄田",
      "兴围",
      "机场东",
      "福围",
      "怀德",
      "福永",
      "桥头西",
      "福海西",
      "国展",
      "国展北",
      "海上田园南",
      "海上田园东",
      "蚝乡",
      "沙蚝",
      "沙井古墟",
      "步涌",
      "朗下",
      "松岗"
    ],
    "transfers": {
      "海上世界": [
        "2"
      ],
      "四海": [
        "15"
      ],
      "南油": [
        "9"
      ],
      "南山": [
        "11"
      ],
      "桃园": [
        "1"
      ],
      "南头古城": [
        "20"
      ],
      "灵芝": [
        "5"
      ],
      "流塘": [
        "15"
      ],
      "机场东": [
        "1",
        "20"
      ],
      "福永": [
        "11"
      ],
      "国展": [
        "20"
      ],
      "国展北": [
        "20"
      ],
      "松岗": [
        "6",
        "11"
      ]
    },
    "trains": [
      {
        "model": "12A5606浦",
        "numberRange": "1201-1256",
        "manufacturer": "浦镇车辆厂",
        "encountered": null
      },
      {
        "model": "12A2006浦",
        "numberRange": "1257-1276",
        "manufacturer": "浦镇车辆厂",
        "encountered": null
      }
    ],
    "maxPassengerFlow": "74.54万人次（2025年12月31日）"
  },
  {
    "id": "13",
    "name": "深圳地铁13号线（石岩线）",
    "alias": "Line 13 / Shiyan Line",
    "color": "#F6AD2D",
    "openDate": "2024年12月28日（一期南段）；2025年12月28日（一期北段）；2026年6月28日（二期北延）",
    "lengthDesc": "约 41.69 公里",
    "stationsDesc": "27座（全部为地下站）",
    "formationDesc": "8节编组A型列车",
    "maxSpeedDesc": "100公里/小时",
    "lengthKm": 41.69,
    "stationCount": 27,
    "undergroundCount": 16,
    "elevatedCount": 0,
    "formationCode": "8A",
    "maxSpeedKmh": 100,
    "operator": "深圳市地铁集团有限公司",
    "category": "operating",
    "stationList": [
      "深圳湾口岸",
      "人才公园",
      "后海",
      "科苑",
      "粤海门",
      "深大",
      "高新中",
      "高新北",
      "西丽高铁站",
      "石鼓",
      "留仙洞",
      "百旺港大",
      "应人石",
      "罗租",
      "石岩",
      "上屋",
      "红坳公园",
      "光明城",
      "德雅路",
      "凤凰城",
      "月亮路",
      "将围",
      "新庄",
      "公明广场",
      "上村",
      "下村",
      "李松蓢"
    ],
    "transfers": {
      "后海": [
        "2",
        "11"
      ],
      "科苑": [
        "2"
      ],
      "粤海门": [
        "9"
      ],
      "深大": [
        "1",
        "20"
      ],
      "西丽高铁站": [
        "15",
        "27",
        "29"
      ],
      "留仙洞": [
        "5"
      ],
      "上屋": [
        "6"
      ],
      "光明城": [
        "6z"
      ],
      "凤凰城": [
        "6"
      ],
      "公明广场": [
        "6"
      ]
    },
    "trains": [
      {
        "model": "一期",
        "numberRange": "1301-1319",
        "manufacturer": "制造商信息未提供",
        "encountered": null
      },
      {
        "model": "二期",
        "numberRange": "1320-1356",
        "manufacturer": "制造商信息未提供",
        "encountered": null
      }
    ],
    "maxPassengerFlow": null
  },
  {
    "id": "14",
    "name": "深圳地铁14号线（东部快线）",
    "alias": "Line 14 / Eastern Express",
    "color": "#F4CB67",
    "openDate": "2022年10月28日",
    "lengthDesc": "约 50.34 公里",
    "stationsDesc": "18座（全部为地下站）",
    "formationDesc": "8节编组A型列车",
    "maxSpeedDesc": "120公里/小时",
    "lengthKm": 50.34,
    "stationCount": 18,
    "undergroundCount": 18,
    "elevatedCount": 0,
    "formationCode": "8A",
    "maxSpeedKmh": 120,
    "operator": "深圳市地铁集团有限公司",
    "category": "operating",
    "stationList": [
      "岗厦北",
      "黄木岗",
      "罗湖北",
      "布吉",
      "石芽岭",
      "六约北",
      "龙城南",
      "嶂背",
      "大运",
      "南约",
      "宝龙",
      "锦龙",
      "坪山围",
      "坪山广场",
      "六和",
      "新和",
      "坪山中心",
      "沙田"
    ],
    "transfers": {
      "岗厦北": [
        "2",
        "10",
        "11"
      ],
      "黄木岗": [
        "7"
      ],
      "罗湖北": [
        "17"
      ],
      "布吉": [
        "3",
        "5"
      ],
      "石芽岭": [
        "17"
      ],
      "大运": [
        "3",
        "16"
      ],
      "锦龙": [
        "19"
      ],
      "坪山围": [
        "16"
      ],
      "坪山中心": [
        "19"
      ]
    },
    "trains": [
      {
        "model": "14A4408長",
        "numberRange": "1401-1444",
        "manufacturer": "长春轨道客车",
        "encountered": "1403、1406、1431、1433、1441"
      }
    ],
    "maxPassengerFlow": "79.73万人次（2025年12月31日）"
  },
  {
    "id": "15",
    "name": "深圳地铁15号线（环线）",
    "alias": "Line 15 / Loop Line",
    "color": "#86BE00",
    "openDate": "预计2028年6月",
    "lengthDesc": "约 32.21 公里",
    "stationsDesc": "24座（全部为地下站）",
    "formationDesc": "4节或6节编组A型列车",
    "maxSpeedDesc": "80公里/小时",
    "lengthKm": 32.21,
    "stationCount": 25,
    "undergroundCount": 24,
    "elevatedCount": 0,
    "formationCode": "4A/6A",
    "maxSpeedKmh": 80,
    "operator": "深圳市地铁集团有限公司",
    "category": "construction",
    "stationList": [
      "听海",
      "铲湾南",
      "铲湾",
      "金港",
      "海城",
      "坪洲",
      "西乡公园",
      "流塘",
      "宝安公园",
      "洪浪北",
      "同乐关",
      "打石山",
      "西丽高铁站",
      "朗山路",
      "麻雀岭",
      "深大北",
      "深大南",
      "民海",
      "东滨路",
      "四海",
      "月亮湾公园",
      "铁路公园",
      "通港路",
      "前海保税区",
      "听海"
    ],
    "transfers": {
      "坪洲": [
        "1"
      ],
      "西乡公园": [
        "20"
      ],
      "流塘": [
        "12"
      ],
      "洪浪北": [
        "5"
      ],
      "西丽高铁站": [
        "13",
        "27",
        "29"
      ],
      "深大南": [
        "9"
      ],
      "四海": [
        "12"
      ],
      "铁路公园": [
        "5"
      ]
    },
    "trains": [
      {
        "model": "15Axxxx?",
        "numberRange": "4A：预计21列",
        "manufacturer": "厂商未知",
        "encountered": null
      },
      {
        "model": "15Axxxx?",
        "numberRange": "6A：预计22列",
        "manufacturer": "厂商未知",
        "encountered": null
      }
    ],
    "maxPassengerFlow": null
  },
  {
    "id": "16",
    "name": "深圳地铁16号线（龙坪线）",
    "alias": "Line 16 / Longping Line",
    "color": "#181BA5",
    "openDate": "2022年12月28日（一期）；2025年9月28日（二期）",
    "lengthDesc": "约 38.74 公里",
    "stationsDesc": "32座（全部为地下站）",
    "formationDesc": "6节编组A型列车",
    "maxSpeedDesc": "80公里/小时",
    "lengthKm": 38.74,
    "stationCount": 32,
    "undergroundCount": 32,
    "elevatedCount": 0,
    "formationCode": "6A",
    "maxSpeedKmh": 80,
    "operator": "深圳市地铁集团有限公司",
    "category": "operating",
    "stationList": [
      "田心",
      "技术大学",
      "石井",
      "燕子湖",
      "沙壆",
      "东纵纪念馆",
      "坪环",
      "坪山围",
      "六和",
      "新和",
      "坪山",
      "宝龙同乐",
      "龙东",
      "新塘围",
      "双龙",
      "龙园",
      "盛平",
      "尚景",
      "回龙埔",
      "愉园",
      "黄阁坑",
      "龙城公园",
      "大运中心",
      "大运",
      "金源",
      "吉溪",
      "大安",
      "园山",
      "大康",
      "福坑",
      "安良",
      "园山西坑"
    ],
    "transfers": {
      "大运": [
        "3",
        "14"
      ],
      "双龙": [
        "3"
      ],
      "新和": [
        "19"
      ],
      "坪山围": [
        "14"
      ]
    },
    "trains": [
      {
        "model": "16A3206株",
        "numberRange": "1601-1632",
        "manufacturer": "株洲电力机车",
        "encountered": "1601、1611、1614、1616、1620"
      },
      {
        "model": "16A1206株",
        "numberRange": "1633-1644",
        "manufacturer": "株洲电力机车",
        "encountered": "1633、1634"
      }
    ],
    "maxPassengerFlow": "35.35万人次（2025年12月31日）"
  },
  {
    "id": "17",
    "name": "深圳地铁17号线（平湖线）",
    "alias": "Line 17 / Pinghu Line",
    "color": "#D2C0CD",
    "openDate": "预计2029年",
    "lengthDesc": "全线约 28.7 公里，一期约 18.8 公里",
    "stationsDesc": "全线25座，一期18座",
    "formationDesc": "6节编组A型列车",
    "maxSpeedDesc": "80公里/小时",
    "lengthKm": 28.7,
    "stationCount": 18,
    "undergroundCount": 24,
    "elevatedCount": 0,
    "formationCode": "6A",
    "maxSpeedKmh": 80,
    "operator": "深圳市地铁集团有限公司",
    "category": "construction",
    "stationList": [
      "上李朗",
      "深朗",
      "下李朗",
      "石芽岭",
      "丹竹头",
      "南岭北",
      "南岭",
      "求水山",
      "百鸽笼",
      "罗岗",
      "德兴",
      "罗湖北",
      "笋岗北",
      "笋岗",
      "大塘龙",
      "老街",
      "嘉宾",
      "侨社"
    ],
    "transfers": {
      "上李朗": [
        "10"
      ],
      "石芽岭": [
        "14"
      ],
      "丹竹头": [
        "3"
      ],
      "百鸽笼": [
        "5"
      ],
      "罗湖北": [
        "14"
      ],
      "笋岗": [
        "7"
      ],
      "老街": [
        "1",
        "3"
      ]
    },
    "trains": [
      {
        "model": "17Axxxx?",
        "numberRange": "预计22列",
        "manufacturer": "厂商未知",
        "encountered": null
      }
    ],
    "maxPassengerFlow": null
  },
  {
    "id": "19",
    "name": "深圳地铁19号线（南塘线）",
    "alias": "Line 19 / Nantang Line",
    "color": "#BA16A4",
    "openDate": "预计2028年",
    "lengthDesc": "约 14.78 公里（一期）",
    "stationsDesc": "12座（一期）",
    "formationDesc": "4节编组A型列车",
    "maxSpeedDesc": "80公里/小时",
    "lengthKm": 14.78,
    "stationCount": 12,
    "undergroundCount": 24,
    "elevatedCount": 0,
    "formationCode": "4A/6A",
    "maxSpeedKmh": 80,
    "operator": "深圳市地铁集团有限公司",
    "category": "construction",
    "stationList": [
      "南塘围",
      "人民医院",
      "汤坑",
      "锦龙",
      "新围",
      "宝山",
      "新和",
      "坪山剧院",
      "坪山中心",
      "燕子岭",
      "南布",
      "聚龙"
    ],
    "transfers": {
      "锦龙": [
        "14"
      ],
      "新和": [
        "16"
      ],
      "坪山中心": [
        "14"
      ]
    },
    "trains": [
      {
        "model": "19Axxxx?",
        "numberRange": "预计12列",
        "manufacturer": "厂商未知",
        "encountered": null
      }
    ],
    "maxPassengerFlow": null
  },
  {
    "id": "20",
    "name": "深圳地铁20号线（会展线）",
    "alias": "Line 20 / Convention Line",
    "color": "#87DBDF",
    "openDate": "2021年12月28日（一期）",
    "lengthDesc": "一期约 8.43 公里",
    "stationsDesc": "一期5座（全部为地下站）",
    "formationDesc": "8节编组A型列车",
    "maxSpeedDesc": "120公里/小时",
    "lengthKm": 8.43,
    "stationCount": 5,
    "undergroundCount": 5,
    "elevatedCount": 0,
    "formationCode": "8A",
    "maxSpeedKmh": 120,
    "operator": "深圳市地铁集团有限公司",
    "category": "operating",
    "stationList": [
      "会展城",
      "国展北",
      "国展",
      "国展南",
      "机场北",
      "狮子山公园",
      "航城大道东",
      "西乡公园",
      "文汇",
      "甲岸",
      "中山公园西",
      "南头古城",
      "深大",
      "高新园",
      "白石洲"
    ],
    "transfers": {
      "机场北": [
        "11"
      ],
      "国展北": [
        "12"
      ],
      "国展": [
        "12"
      ],
      "西乡公园": [
        "15"
      ],
      "南头古城": [
        "12"
      ],
      "深大": [
        "1",
        "13"
      ],
      "高新园": [
        "1"
      ],
      "白石洲": [
        "1",
        "29"
      ]
    },
    "trains": [
      {
        "model": "20A0908長",
        "numberRange": "8A：2001-2009",
        "manufacturer": "长春轨道客车",
        "encountered": null
      },
      {
        "model": "20Axxxx?",
        "numberRange": "6A：预计25列",
        "manufacturer": "长春轨道客车",
        "encountered": null
      }
    ],
    "maxPassengerFlow": null
  },
  {
    "id": "22",
    "name": "深圳地铁22号线（中轴线）",
    "alias": "Line 22 / Central Axis",
    "color": "#F5E524",
    "openDate": "预计2028年",
    "lengthDesc": "约 34.2 公里（一期）",
    "stationsDesc": "21座（一期）",
    "formationDesc": "6节或8节编组A型列车",
    "maxSpeedDesc": "100公里/小时",
    "lengthKm": 34.2,
    "stationCount": 21,
    "undergroundCount": 21,
    "elevatedCount": 0,
    "formationCode": "8A",
    "maxSpeedKmh": 100,
    "operator": "深圳市地铁集团有限公司",
    "category": "construction",
    "stationList": [
      "黎光",
      "库坑",
      "桂花",
      "松元厦",
      "松轩",
      "鹭湖",
      "观湖",
      "风门坳",
      "岗头北",
      "富康",
      "松和",
      "民治北",
      "民治",
      "民新",
      "民乐",
      "凯丰",
      "梅丰",
      "香梅北",
      "国交中心",
      "香蜜西",
      "上沙"
    ],
    "transfers": {
      "松元厦": [
        "4"
      ],
      "富康": [
        "27"
      ],
      "松和": [
        "25"
      ],
      "民治": [
        "5"
      ],
      "民乐": [
        "4"
      ],
      "香梅北": [
        "2"
      ],
      "上沙": [
        "7"
      ]
    },
    "trains": [
      {
        "model": "22Axxxx?",
        "numberRange": "预计46列",
        "manufacturer": "厂商未知",
        "encountered": null
      }
    ],
    "maxPassengerFlow": null
  },
  {
    "id": "25",
    "name": "深圳地铁25号线（石龙线）",
    "alias": "Line 25 / Shilong Line",
    "color": "#FDAD76",
    "openDate": "预计2028年",
    "lengthDesc": "约 16.2 公里（一期）",
    "stationsDesc": "14座（一期）",
    "formationDesc": "6节编组A型列车",
    "maxSpeedDesc": "80公里/小时",
    "lengthKm": 16.2,
    "stationCount": 14,
    "undergroundCount": 14,
    "elevatedCount": 0,
    "formationCode": "6A",
    "maxSpeedKmh": 80,
    "operator": "深圳市地铁集团有限公司",
    "category": "construction",
    "stationList": [
      "吉华医院",
      "贝尔路",
      "黄君山",
      "上油松",
      "松和",
      "油福",
      "景龙",
      "龙华",
      "龙华公园",
      "华富",
      "华昌",
      "石凹",
      "创意城",
      "石龙"
    ],
    "transfers": {
      "吉华医院": [
        "27"
      ],
      "贝尔路": [
        "10"
      ],
      "松和": [
        "22"
      ],
      "油福": [
        "27"
      ],
      "龙华": [
        "4"
      ]
    },
    "trains": [
      {
        "model": "25Axxxx?",
        "numberRange": "预计16列",
        "manufacturer": "厂商未知",
        "encountered": null
      }
    ],
    "maxPassengerFlow": null
  },
  {
    "id": "27",
    "name": "深圳地铁27号线（前海线）",
    "alias": "Line 27 / Qianhai Line",
    "color": "#4E8D8E",
    "openDate": "预计2028年",
    "lengthDesc": "约 24.9 公里（一期）",
    "stationsDesc": "21座（一期）",
    "formationDesc": "6节编组A型列车",
    "maxSpeedDesc": "80公里/小时",
    "lengthKm": 24.9,
    "stationCount": 19,
    "undergroundCount": 21,
    "elevatedCount": 0,
    "formationCode": "6A",
    "maxSpeedKmh": 80,
    "operator": "深圳市地铁集团有限公司",
    "category": "construction",
    "stationList": [
      "松坪村",
      "西丽高铁站",
      "文光",
      "西丽",
      "丽山",
      "丽水",
      "深大丽湖",
      "南科大",
      "长岭陂",
      "北站西广场",
      "民丰路",
      "白石龙",
      "民康",
      "民宝",
      "华城",
      "银泉",
      "油福",
      "富康",
      "岗头西"
    ],
    "transfers": {
      "西丽高铁站": [
        "13",
        "15",
        "29"
      ],
      "西丽": [
        "5",
        "7"
      ],
      "深大丽湖": [
        "7"
      ],
      "长岭陂": [
        "5"
      ],
      "白石龙": [
        "4"
      ],
      "油福": [
        "25"
      ],
      "富康": [
        "22"
      ]
    },
    "trains": [
      {
        "model": "27Axxxx?",
        "numberRange": "预计32列",
        "manufacturer": "厂商未知",
        "encountered": null
      }
    ],
    "maxPassengerFlow": null
  },
  {
    "id": "29",
    "name": "深圳地铁29号线（深超线）",
    "alias": "Line 29 / Shenchao Line",
    "color": "#92D6AC",
    "openDate": "预计2029年7月",
    "lengthDesc": "约 11.3 公里（一期）",
    "stationsDesc": "9座（一期，全部为地下站）",
    "formationDesc": "4节或6节编组A型列车",
    "maxSpeedDesc": "80公里/小时",
    "lengthKm": 11.3,
    "stationCount": 9,
    "undergroundCount": 24,
    "elevatedCount": 0,
    "formationCode": "6A",
    "maxSpeedKmh": 80,
    "operator": "深圳市地铁集团有限公司",
    "category": "construction",
    "stationList": [
      "红树湾南",
      "白石洲",
      "白石洲北",
      "欧洲城",
      "珠光",
      "西丽东",
      "西丽高铁站",
      "西丽西",
      "兴东"
    ],
    "transfers": {
      "红树湾南": [
        "9",
        "11"
      ],
      "白石洲": [
        "1",
        "20"
      ],
      "珠光": [
        "7"
      ],
      "西丽高铁站": [
        "13",
        "15",
        "27"
      ],
      "兴东": [
        "5"
      ]
    },
    "trains": [
      {
        "model": "29Axxxx?",
        "numberRange": "预计13列",
        "manufacturer": "厂商未知",
        "encountered": null
      }
    ],
    "maxPassengerFlow": null
  },
  {
    "id": "32",
    "name": "深圳地铁32号线（大鹏线）",
    "alias": "Line 32 / Dapeng Line",
    "color": "#735128",
    "openDate": "预计2028年12月",
    "lengthDesc": "约 9.53 公里（一期）",
    "stationsDesc": "4座（一期）",
    "formationDesc": "4节编组A型列车",
    "maxSpeedDesc": "80公里/小时",
    "lengthKm": 9.53,
    "stationCount": 5,
    "undergroundCount": 5,
    "elevatedCount": 0,
    "formationCode": "4A",
    "maxSpeedKmh": 80,
    "operator": "深圳市地铁集团有限公司",
    "category": "construction",
    "stationList": [
      "溪涌",
      "上洞",
      "土洋",
      "葵涌",
      "葵涌东"
    ],
    "transfers": {
      "溪涌": [
        "8"
      ]
      },
    "trains": [
      {
        "model": "32Axxxx?",
        "numberRange": "车辆数未知（招标未公布）",
        "manufacturer": "厂商未知",
        "encountered": null
      }
    ],
    "maxPassengerFlow": null
  },
  {
    "id": "6z",
    "name": "深圳地铁6号线支线",
    "alias": "Line 6Z / Line 6 Branch",
    "color": "#027776",
    "openDate": "一期：2022年11月28日；二期：2025年9月28日",
    "lengthDesc": "约 11.03 公里（一期6.13km，二期4.96km）",
    "stationsDesc": "7座（一期4座、二期3座）",
    "formationDesc": "6节编组B型列车",
    "maxSpeedDesc": "120公里/小时",
    "lengthKm": 11.07,
    "stationCount": 7,
    "undergroundCount": 4,
    "elevatedCount": 0,
    "formationCode": "6B",
    "maxSpeedKmh": 120,
    "operator": "深圳市地铁集团有限公司",
    "category": "operating",
    "stationList": [
      "深理工",
      "中大",
      "圳美",
      "光明",
      "碧眼",
      "虹桥公园",
      "光明城"
    ],
    "transfers": {
      "光明": [
        "6"
      ],
      "光明城": [
        "13"
      ]
    },
    "trains": [
      {
        "model": "6ZB0906浦",
        "numberRange": "6Z01-6Z09",
        "manufacturer": "浦镇车辆厂",
        "encountered": null
      }
    ],
    "maxPassengerFlow": null
  }
];

// ==================== 辅助函数 ====================

/** 根据线路编号获取数据 */
function getEnhancedLineData(lineId) {
  return ALL_LINES_ENHANCED.find(l => l.id === lineId) || null;
}

/** 获取已开通线路 */
function getOperatingLinesEnhanced() {
  return ALL_LINES_ENHANCED.filter(l => l.category === "operating");
}

/** 获取建设中线路（五期） */
function getConstructionLinesEnhanced() {
  return ALL_LINES_ENHANCED.filter(l => l.category === "construction");
}

/** 根据站点名查找所属线路 */
function findLinesByStationEnhanced(stationName) {
  return ALL_LINES_ENHANCED
    .filter(l => l.stationList.includes(stationName))
    .map(l => l.id);
}

/** 获取某站点的换乘信息 */
function getTransferInfoEnhanced(stationName) {
  for (const line of ALL_LINES_ENHANCED) {
    if (line.transfers[stationName]) {
      return {
        line: line.id,
        lineName: line.name,
        transfers: line.transfers[stationName]
      };
    }
  }
  return null;
}

/** 获取线路颜色 */
function getLineColorEnhanced(lineId) {
  const line = getEnhancedLineData(lineId);
  if (!line) return "#9CA3AF";
  if (line.category === "construction") return "#9CA3AF";
  return line.color;
}

/** 获取车辆总数 */
function getTotalTrainCount(lineId) {
  const line = getEnhancedLineData(lineId);
  if (!line || !line.trains) return 0;
  let total = 0;
  for (const train of line.trains) {
    const match = train.numberRange.match(/(\d+)-(\d+)/);
    if (match) {
      total += parseInt(match[2]) - parseInt(match[1]) + 1;
    } else if (train.numberRange.includes("预计")) {
      const m = train.numberRange.match(/预计(\d+)/);
      if (m) total += parseInt(m[1]);
    }
  }
  return total;
}

/** 获取已遇到车号列表 */
function getEncounteredNumbers(lineId) {
  const line = getEnhancedLineData(lineId);
  if (!line || !line.trains) return [];
  const numbers = [];
  for (const train of line.trains) {
    if (train.encountered) {
      numbers.push(...train.encountered.split("、"));
    }
  }
  return numbers;
}

// 导出（如果是模块化环境）
if (typeof module !== "undefined" && module.exports) {
  module.exports = { 
    ALL_LINES_ENHANCED, 
    getEnhancedLineData, 
    getOperatingLinesEnhanced, 
    getConstructionLinesEnhanced,
    findLinesByStationEnhanced,
    getTransferInfoEnhanced,
    getLineColorEnhanced,
    getTotalTrainCount,
    getEncounteredNumbers
  };
}

// 卫生间位置查询 - 数据文件
// 由深圳地铁官方资料整理，数据仅供参考，请以现场实际指引为准

// 线路色号
const lineColors = {
  '1': '#01AF55', '2': '#B95800', '3': '#00A9DF', '4': '#D42E0F',
  '5': '#9E4DAA', '6': '#01C4B7', '6z': '#027776', '7': '#0131AC',
  '8': '#B95800', '9': '#896B70', '10': '#F67599', '11': '#672146',
  '12': '#A092B2', '13': '#F6AD2D', '14': '#F4CB67', '15': '#86BE00',
  '16': '#181BA5', '17': '#D2C0CD', '19': '#BA16A4', '20': '#87DBDF',
  '22': '#F5E524', '25': '#FDAD76', '27': '#4E8D8E', '29': '#92D6AC',
  '32': '#735128',
};

// 线路筛选配置
const filters = [
  { key: 'all', label: '全部' },
  { key: '1', label: '1号线', lineClass: 'line-1' },
  { key: '2&8', label: '2&8号线', lineClass: 'line-2' },
  { key: '3', label: '3号线', lineClass: 'line-3' },
  { key: '4', label: '4号线', lineClass: 'line-4' },
  { key: '5', label: '5号线', lineClass: 'line-5' },
  { key: '6', label: '6号线', lineClass: 'line-6' },
  { key: '6z', label: '6号线支线', lineClass: 'line-6z' },
  { key: '7', label: '7号线', lineClass: 'line-7' },
  { key: '9', label: '9号线', lineClass: 'line-9' },
  { key: '10', label: '10号线', lineClass: 'line-10' },
  { key: '11', label: '11号线', lineClass: 'line-11' },
  { key: '12', label: '12号线', lineClass: 'line-12' },
  { key: '13', label: '13号线', lineClass: 'line-13' },
  { key: '14', label: '14号线', lineClass: 'line-14' },
  { key: '16', label: '16号线', lineClass: 'line-16' },
  { key: '20', label: '20号线', lineClass: 'line-20' },
];

// 站点数据
const stations = [
  // ========== 1号线 ==========
  {
    name: '罗湖',
    lines: ['1'],
    toilets: [
      { type: 'outside', text: '近B出入口(罗湖站交通层)' },
    ]
  },
  {
    name: '国贸',
    lines: ['1'],
    toilets: [
      { type: 'none', text: '无' },
    ]
  },
  {
    name: '老街',
    lines: ['1', '3'],
    toilets: [
      { type: 'none', text: '无' },
    ]
  },
  {
    name: '大剧院',
    lines: ['1', '2', '8', '5'],
    toilets: [
      { type: 'inside', text: '5号线站台(往赤湾方向尾端)', num: '①' },
      { type: 'outside', text: '5号线站厅(近G出入口)', num: '②' },
      { type: 'outside', text: '1号线站厅(近B出入口)仅男女卫生间', num: '③' },
      { type: 'outside', text: '2号线站厅(近F出入口)仅无障碍卫生间', num: '④' },
    ]
  },
  {
    name: '科学馆',
    lines: ['1', '6'],
    toilets: [
      { type: 'outside', text: '1号线站厅(A出入口通道内)', num: '①' },
      { type: 'outside', text: '6号线站厅(近E出入口)', num: '②' },
      { type: 'inside', text: '6号线站台(往科学馆方向头端)', num: '③' },
    ]
  },
  {
    name: '华强路',
    lines: ['1'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)' },
    ]
  },
  {
    name: '岗厦',
    lines: ['1', '10'],
    toilets: [
      { type: 'outside', text: '站厅(G出入口通道内)', num: '①' },
      { type: 'inside', text: '10号线站台(往福田口岸方向头端)', num: '②' },
    ]
  },
  {
    name: '会展中心',
    lines: ['1', '4'],
    toilets: [
      { type: 'outside', text: '站厅(E出入口通道内)' },
    ]
  },
  {
    name: '购物公园',
    lines: ['1', '3'],
    toilets: [
      { type: 'outside', text: '3号线站厅(近H出入口)', note: '步行约400米' },
    ]
  },
  {
    name: '香蜜湖',
    lines: ['1'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)' },
    ]
  },
  {
    name: '车公庙',
    lines: ['1', '7', '9', '11'],
    toilets: [
      { type: 'inside', text: '11号线站台(往碧头方向头端)', num: '①' },
      { type: 'inside', text: '7/9号线站台(往深大丽湖方向尾端)', num: '②' },
      { type: 'inside', text: '7/9号线站台(往文锦方向尾端)', num: '③' },
      { type: 'outside', text: '1号线站厅(B出入口通道内)', num: '④' },
    ]
  },
  {
    name: '竹子林',
    lines: ['1'],
    toilets: [
      { type: 'none', text: '无' },
    ]
  },
  {
    name: '侨城东',
    lines: ['1'],
    toilets: [
      { type: 'outside', text: '站厅(A出入口通道内)' },
    ]
  },
  {
    name: '华侨城',
    lines: ['1'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)' },
    ]
  },
  {
    name: '世界之窗',
    lines: ['1', '2', '8'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '白石洲',
    lines: ['1'],
    toilets: [
      { type: 'outside', text: '站厅(A出入口通道内)', note: '因新线施工，已关闭' },
    ]
  },
  {
    name: '高新园',
    lines: ['1'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)', note: '因新线施工，已关闭' },
    ]
  },
  {
    name: '深大',
    lines: ['1', '13'],
    toilets: [
      { type: 'inside', text: '13号线站台(往李松蓢方向头端)', num: '①' },
      { type: 'outside', text: '13号线站厅(J出入口通道内)', num: '②' },
      { type: 'outside', text: '1号线站厅(A出入口通道内)', num: '③' },
    ]
  },
  {
    name: '桃园',
    lines: ['1', '12'],
    toilets: [
      { type: 'inside', text: '12号线站厅中部(闸机内)', num: '①' },
      { type: 'outside', text: '1号线站厅(C出入口通道内)', num: '②' },
    ]
  },
  {
    name: '大新',
    lines: ['1'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)' },
    ]
  },
  {
    name: '鲤鱼门',
    lines: ['1'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '前海湾',
    lines: ['1', '5', '11'],
    toilets: [
      { type: 'outside', text: '1号线站厅(B出入口通道内)' },
    ]
  },
  {
    name: '新安',
    lines: ['1'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)' },
    ]
  },
  {
    name: '宝安中心',
    lines: ['1', '5'],
    toilets: [
      { type: 'outside', text: '站厅(A出入口通道内)' },
    ]
  },
  {
    name: '宝体',
    lines: ['1'],
    toilets: [
      { type: 'outside', text: '站厅(A出入口通道内)' },
    ]
  },
  {
    name: '坪洲',
    lines: ['1'],
    toilets: [
      { type: 'outside', text: '站厅(A出入口通道内)' },
    ]
  },
  {
    name: '西乡',
    lines: ['1'],
    toilets: [
      { type: 'none', text: '无' },
    ]
  },
  {
    name: '固戍',
    lines: ['1'],
    toilets: [
      { type: 'outside', text: '站厅(A出入口通道内)' },
    ]
  },
  {
    name: '后瑞',
    lines: ['1'],
    toilets: [
      { type: 'outside', text: '站厅(B/C出入口通道内)' },
    ]
  },
  {
    name: '机场东',
    lines: ['1', '12'],
    toilets: [
      { type: 'inside', text: '12号线站台(往松岗方向头端)', num: '①' },
      { type: 'outside', text: '12号线站厅(D出入口通道内)', num: '②' },
      { type: 'outside', text: '1号线站厅地面层(近无障碍电梯)', num: '③', note: '步行约260米' },
    ]
  },

  // ========== 2/8号线 ==========
  {
    name: '赤湾',
    lines: ['2', '8', '5'],
    toilets: [
      { type: 'outside', text: '2号线站厅(C出入口通道内)', num: '①' },
      { type: 'outside', text: '5号线站厅(E出入口通道内)', num: '②' },
    ]
  },
  {
    name: '蛇口港',
    lines: ['2', '8'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '海上世界',
    lines: ['2', '8', '12'],
    toilets: [
      { type: 'inside', text: '12号线站台(往松岗方向头端)', num: '①' },
      { type: 'outside', text: '12号线站厅(近H出入口)', num: '②' },
      { type: 'outside', text: '2号线站厅(近D出入口)', num: '③', note: '步行约300米' },
    ]
  },
  {
    name: '水湾',
    lines: ['2', '8'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)' },
    ]
  },
  {
    name: '东角头',
    lines: ['2', '8'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)' },
    ]
  },
  {
    name: '湾厦',
    lines: ['2', '8'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)' },
    ]
  },
  {
    name: '海月',
    lines: ['2', '8'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '登良',
    lines: ['2', '8'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)' },
    ]
  },
  {
    name: '后海',
    lines: ['2', '8', '11', '13'],
    toilets: [
      { type: 'inside', text: '13号线站台(往李松蓢方向头端)', num: '①' },
      { type: 'outside', text: '13号线站厅(近N出入口)', num: '②' },
      { type: 'inside', text: '11号线站台(往碧头方向头端)', num: '③' },
      { type: 'outside', text: '11号线站厅(H出入口通道内)', num: '④' },
      { type: 'outside', text: '2号线站厅(D出入口通道内)', num: '⑤' },
    ]
  },
  {
    name: '南山',
    lines: ['11', '12'],
    toilets: [
      { type: 'inside', text: '11号线站台(往碧头方向头端)', num: '①' },
      { type: 'outside', text: '11号线站厅(E出入口通道内)', num: '②' },
      { type: 'inside', text: '12号线站台(往左炮台东方向尾端)', num: '③' },
      { type: 'inside', text: '12号线站台(往松岗方向尾端)', num: '④' },
    ]
  },
  {
    name: '科苑',
    lines: ['2', '8', '13'],
    toilets: [
      { type: 'inside', text: '13号线站台(往东角头方向头端)', num: '①' },
      { type: 'outside', text: '13号线站厅(F出入口通道内)', num: '②' },
      { type: 'outside', text: '2号线站厅(A出入口通道内)', num: '③' },
    ]
  },
  {
    name: '红树湾',
    lines: ['2', '8'],
    toilets: [
      { type: 'outside', text: '站厅(A出入口通道内)' },
    ]
  },
  {
    name: '世界之窗',
    lines: ['1', '2', '8'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '侨城北',
    lines: ['2', '8'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '深康',
    lines: ['2', '8'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)' },
    ]
  },
  {
    name: '安托山',
    lines: ['2', '8', '7'],
    toilets: [
      { type: 'outside', text: '站厅(A出入口通道内)', num: '①' },
      { type: 'inside', text: '7号线站台(往深大丽湖方向尾端)', num: '②' },
    ]
  },
  {
    name: '侨香',
    lines: ['2', '8'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '香蜜',
    lines: ['2', '8'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)' },
    ]
  },
  {
    name: '香梅北',
    lines: ['2', '8'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)' },
    ]
  },
  {
    name: '景田',
    lines: ['2', '8', '9'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)', num: '①' },
      { type: 'inside', text: '9号线站台(往前湾方向头端)', num: '②' },
    ]
  },
  {
    name: '莲花西',
    lines: ['2', '8'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)' },
    ]
  },
  {
    name: '福田',
    lines: ['2', '8', '3', '11'],
    toilets: [
      { type: 'outside', text: '站厅(近1号出入口)', num: '①' },
      { type: 'outside', text: '站厅(近3号出入口)', num: '②' },
      { type: 'outside', text: '站厅(近28号出入口)', num: '③' },
      { type: 'outside', text: '站厅(近27号出入口)', num: '④' },
    ]
  },
  {
    name: '市民中心',
    lines: ['2', '8', '4'],
    toilets: [
      { type: 'outside', text: '2号线站厅(F出入口通道内)', num: '①' },
      { type: 'outside', text: '4号线站厅(B口通道内)', num: '②' },
    ]
  },
  {
    name: '岗厦北',
    lines: ['2', '8', '10', '11', '14'],
    toilets: [
      { type: 'inside', text: '14号线站台(往岗厦北方向头端)', num: '①' },
      { type: 'inside', text: '14号线站台(往沙田方向尾端)', num: '②' },
      { type: 'inside', text: '10号线站台(往福田口岸方向头端)', num: '③' },
      { type: 'inside', text: '10号线站台(往双拥街方向尾端)', num: '④' },
      { type: 'inside', text: '2/8号线换乘通道(近19号口)', num: '⑤' },
      { type: 'outside', text: '站厅(近19号出入口)', num: '⑥' },
      { type: 'outside', text: '站厅(近7号出入口)', num: '⑦' },
    ]
  },
  {
    name: '华强北',
    lines: ['2', '8', '7'],
    toilets: [
      { type: 'inside', text: '7号线站台(往深大丽湖方向头端)' },
    ]
  },
  {
    name: '燕南',
    lines: ['2', '8'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '湖贝',
    lines: ['2', '8', '5'],
    toilets: [
      { type: 'outside', text: '5号线站厅(G出入口通道内)' },
    ]
  },
  {
    name: '黄贝岭',
    lines: ['2', '8', '5'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)' },
    ]
  },
  {
    name: '新秀',
    lines: ['2', '8'],
    toilets: [
      { type: 'none', text: '无' },
    ]
  },
  {
    name: '莲塘口岸',
    lines: ['2', '8'],
    toilets: [
      { type: 'outside', text: '站厅(A出入口通道内)' },
    ]
  },
  {
    name: '仙湖路',
    lines: ['2', '8'],
    toilets: [
      { type: 'outside', text: '站厅(近B出入口)' },
    ]
  },
  {
    name: '莲塘',
    lines: ['2', '8'],
    toilets: [
      { type: 'outside', text: '站厅(A出入口通道内)' },
    ]
  },
  {
    name: '梧桐山南',
    lines: ['2', '8'],
    toilets: [
      { type: 'outside', text: '站厅中部(近D出入口)' },
    ]
  },
  {
    name: '沙头角',
    lines: ['2', '8'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '海山',
    lines: ['2', '8'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)' },
    ]
  },
  {
    name: '盐田港西',
    lines: ['2', '8'],
    toilets: [
      { type: 'outside', text: '站厅(近C出入口)' },
    ]
  },
  {
    name: '深外高中',
    lines: ['2', '8'],
    toilets: [
      { type: 'outside', text: '站厅(近C出入口)' },
    ]
  },
  {
    name: '盐田路',
    lines: ['2', '8'],
    toilets: [
      { type: 'outside', text: '站厅(近E2出入口)' },
    ]
  },
  {
    name: '鸿安围',
    lines: ['2', '8'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '盐田墟',
    lines: ['2', '8'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '大梅沙',
    lines: ['2', '8'],
    toilets: [
      { type: 'outside', text: '站厅(近B出入口)' },
    ]
  },
  {
    name: '小梅沙',
    lines: ['2', '8'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '溪涌',
    lines: ['2', '8'],
    toilets: [
      { type: 'outside', text: '站厅(近A/B出入口)' },
    ]
  },

  // ========== 3号线 ==========
  {
    name: '福保',
    lines: ['3'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)' },
    ]
  },
  {
    name: '益田',
    lines: ['3'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '石厦',
    lines: ['3', '7'],
    toilets: [
      { type: 'outside', text: '站厅(近A出入口)', num: '①' },
      { type: 'outside', text: '站厅(G出入口通道内)', num: '②' },
      { type: 'inside', text: '7号线站台(往深大丽湖方向的头端)', num: '③' },
    ]
  },
  {
    name: '购物公园',
    lines: ['1', '3'],
    toilets: [
      { type: 'outside', text: '站厅(近H出入口)' },
    ]
  },
  {
    name: '福田',
    lines: ['2', '8', '3', '11'],
    toilets: [
      { type: 'outside', text: '站厅(近1号出入口)', num: '①' },
      { type: 'outside', text: '站厅(近3号出入口)', num: '②' },
      { type: 'outside', text: '站厅(近28号出入口)', num: '③' },
      { type: 'outside', text: '站厅(近27号出入口)', num: '④' },
    ]
  },
  {
    name: '少年宫',
    lines: ['3', '4'],
    toilets: [
      { type: 'outside', text: '3号线站厅(E出入口通道内)', num: '①' },
      { type: 'outside', text: '4号线站厅(D出入口通道内)', num: '②' },
    ]
  },
  {
    name: '莲花村',
    lines: ['3', '10'],
    toilets: [
      { type: 'outside', text: '站厅(A1出入口通道内)', num: '①' },
      { type: 'inside', text: '10号线站台(往双拥街方向头端)', num: '②' },
      { type: 'outside', text: '10号线站厅(近E出入口)', num: '③' },
    ]
  },
  {
    name: '华新',
    lines: ['3', '7'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)', num: '①' },
      { type: 'inside', text: '7号线站台(往深大丽湖方向头端)', num: '②' },
    ]
  },
  {
    name: '通新岭',
    lines: ['3', '6'],
    toilets: [
      { type: 'outside', text: '3号线站厅(C出入口通道内)', num: '①' },
      { type: 'inside', text: '6号线站台(往松岗方向头端)', num: '②' },
    ]
  },
  {
    name: '红岭',
    lines: ['3', '9'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)' },
    ]
  },
  {
    name: '老街',
    lines: ['1', '3'],
    toilets: [
      { type: 'none', text: '无' },
    ]
  },
  {
    name: '晒布',
    lines: ['3'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '翠竹',
    lines: ['3'],
    toilets: [
      { type: 'outside', text: '站厅(B2出入口通道内)' },
    ]
  },
  {
    name: '田贝',
    lines: ['3', '7'],
    toilets: [
      { type: 'inside', text: '7号线站台(往深大丽湖方向头端)', num: '①' },
      { type: 'outside', text: '3号线站厅(D出入口通道内)', num: '②' },
      { type: 'outside', text: '7号线站厅(F出入口通道内)', num: '③' },
    ]
  },
  {
    name: '水贝',
    lines: ['3'],
    toilets: [
      { type: 'outside', text: '站厅(A出入口通道内)' },
    ]
  },
  {
    name: '草埔',
    lines: ['3'],
    toilets: [
      { type: 'none', text: '无' },
    ]
  },
  {
    name: '布吉',
    lines: ['3', '5', '14'],
    toilets: [
      { type: 'inside', text: '14号线站台(往沙田方向头端)', num: '①' },
      { type: 'outside', text: '14号线站厅(近D出入口)', num: '②' },
    ]
  },
  {
    name: '木棉湾',
    lines: ['3'],
    toilets: [
      { type: 'none', text: '无' },
    ]
  },
  {
    name: '大芬',
    lines: ['3'],
    toilets: [
      { type: 'none', text: '无' },
    ]
  },
  {
    name: '丹竹头',
    lines: ['3'],
    toilets: [
      { type: 'none', text: '无' },
    ]
  },
  {
    name: '六约',
    lines: ['3'],
    toilets: [
      { type: 'none', text: '无' },
    ]
  },
  {
    name: '塘坑',
    lines: ['3'],
    toilets: [
      { type: 'none', text: '无' },
    ]
  },
  {
    name: '横岗',
    lines: ['3'],
    toilets: [
      { type: 'none', text: '无' },
    ]
  },
  {
    name: '永湖',
    lines: ['3'],
    toilets: [
      { type: 'none', text: '无' },
    ]
  },
  {
    name: '荷坳',
    lines: ['3'],
    toilets: [
      { type: 'none', text: '无' },
    ]
  },
  {
    name: '大运',
    lines: ['3', '14', '16'],
    toilets: [
      { type: 'inside', text: '14/16号线站台(往园山西坑方向尾端)', num: '①' },
      { type: 'inside', text: '14/16号线站台(往田心方向尾端)', num: '②' },
      { type: 'outside', text: '站厅(12号出入口通道内)', num: '③' },
    ]
  },
  {
    name: '爱联',
    lines: ['3'],
    toilets: [
      { type: 'none', text: '无' },
    ]
  },
  {
    name: '吉祥',
    lines: ['3'],
    toilets: [
      { type: 'none', text: '无' },
    ]
  },
  {
    name: '龙城广场',
    lines: ['3'],
    toilets: [
      { type: 'none', text: '无' },
    ]
  },
  {
    name: '南联',
    lines: ['3'],
    toilets: [
      { type: 'none', text: '无' },
    ]
  },
  {
    name: '双龙',
    lines: ['3', '16'],
    toilets: [
      { type: 'inside', text: '16号线站台(往园山西坑方向尾端)' },
    ]
  },
  {
    name: '梨园',
    lines: ['3'],
    toilets: [
      { type: 'outside', text: '站厅(B/C出入口之间)' },
    ]
  },
  {
    name: '新生',
    lines: ['3'],
    toilets: [
      { type: 'inside', text: '站台(往坪地六联方向头端)', num: '①' },
      { type: 'inside', text: '站台(往福保方向尾端)', num: '②' },
      { type: 'outside', text: '站厅(近C出入口)', num: '③' },
    ]
  },
  {
    name: '坪西',
    lines: ['3'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)' },
    ]
  },
  {
    name: '低碳城',
    lines: ['3'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)' },
    ]
  },
  {
    name: '白石塘',
    lines: ['3'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)' },
    ]
  },
  {
    name: '富坪',
    lines: ['3'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)' },
    ]
  },
  {
    name: '坪地六联',
    lines: ['3'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)' },
    ]
  },

  // ========== 4号线 ==========
  {
    name: '福田口岸',
    lines: ['4', '10'],
    toilets: [
      { type: 'outside', text: '站外福田口岸联检大楼10号门(近A出入口)', num: '①' },
      { type: 'outside', text: '10号线站厅(D出入口通道内)', num: '②' },
      { type: 'inside', text: '10号线站台(往福田口岸方向头端)', num: '③' },
    ]
  },
  {
    name: '福民',
    lines: ['4', '7', '10'],
    toilets: [
      { type: 'outside', text: '4号线站厅(D出入口通道内)', num: '①' },
      { type: 'inside', text: '7号线站台(往太安方向尾端)', num: '②' },
      { type: 'outside', text: '10号线站厅(J出入口通道内)', num: '③' },
      { type: 'inside', text: '10号线站台(往福田口岸方向头端)', num: '④' },
    ]
  },
  {
    name: '会展中心',
    lines: ['1', '4'],
    toilets: [
      { type: 'outside', text: '站厅(近E出入口)' },
    ]
  },
  {
    name: '市民中心',
    lines: ['2', '8', '4'],
    toilets: [
      { type: 'outside', text: '4号线站厅(E出入口通道内)', num: '①' },
      { type: 'outside', text: '2号线站厅(F出入口通道内)', num: '②' },
    ]
  },
  {
    name: '少年宫',
    lines: ['3', '4'],
    toilets: [
      { type: 'outside', text: '3号线站厅(E出入口通道内)', num: '①' },
      { type: 'outside', text: '4号线站厅(D出入口通道内)', num: '②' },
    ]
  },
  {
    name: '莲花北',
    lines: ['4'],
    toilets: [
      { type: 'inside', text: '站厅中部' },
    ]
  },
  {
    name: '上梅林',
    lines: ['4', '9'],
    toilets: [
      { type: 'inside', text: '4号线站厅中部', num: '①' },
      { type: 'inside', text: '9号线站台(往前湾方向头端)', num: '②' },
      { type: 'outside', text: '9号线站厅(近J1出入口)', num: '③' },
    ]
  },
  {
    name: '民乐',
    lines: ['4'],
    toilets: [
      { type: 'inside', text: '站厅南端' },
    ]
  },
  {
    name: '白石龙',
    lines: ['4'],
    toilets: [
      { type: 'inside', text: '站厅中部' },
    ]
  },
  {
    name: '深圳北站',
    lines: ['4', '5', '6'],
    toilets: [
      { type: 'inside', text: '4号线站厅中部' },
    ]
  },
  {
    name: '红山',
    lines: ['4', '6'],
    toilets: [
      { type: 'inside', text: '6号线站厅中部' },
      { type: 'inside', text: '4号线站厅中部' },
    ]
  },
  {
    name: '上塘',
    lines: ['4'],
    toilets: [
      { type: 'inside', text: '站厅中部' },
    ]
  },
  {
    name: '龙胜',
    lines: ['4'],
    toilets: [
      { type: 'inside', text: '站厅中部' },
    ]
  },
  {
    name: '龙华',
    lines: ['4'],
    toilets: [
      { type: 'inside', text: '站厅中部' },
    ]
  },
  {
    name: '清湖',
    lines: ['4'],
    toilets: [
      { type: 'inside', text: '站厅中部' },
    ]
  },
  {
    name: '清湖北',
    lines: ['4'],
    toilets: [
      { type: 'outside', text: '站厅(近D出入口)' },
    ]
  },
  {
    name: '竹村',
    lines: ['4'],
    toilets: [
      { type: 'outside', text: '站厅(近A出入口)' },
    ]
  },
  {
    name: '茜坑',
    lines: ['4'],
    toilets: [
      { type: 'outside', text: '站厅(近F出入口)' },
    ]
  },
  {
    name: '长湖',
    lines: ['4'],
    toilets: [
      { type: 'outside', text: '站厅(近D出入口)' },
    ]
  },
  {
    name: '观澜',
    lines: ['4'],
    toilets: [
      { type: 'outside', text: '站厅(近C出入口)' },
    ]
  },
  {
    name: '松元厦',
    lines: ['4'],
    toilets: [
      { type: 'outside', text: '站厅(近D出入口)' },
    ]
  },
  {
    name: '观澜湖',
    lines: ['4'],
    toilets: [
      { type: 'outside', text: '站厅(近A出入口)' },
    ]
  },
  {
    name: '牛湖',
    lines: ['4'],
    toilets: [
      { type: 'outside', text: '站厅(近C出入口)' },
    ]
  },

  // ========== 5号线 ==========
  {
    name: '赤湾',
    lines: ['2', '8', '5'],
    toilets: [
      { type: 'outside', text: '5号线站厅(E出入口通道内)', num: '①' },
      { type: 'outside', text: '2号线站厅(C出入口通道内)', num: '②' },
    ]
  },
  {
    name: '荔湾',
    lines: ['5'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)' },
    ]
  },
  {
    name: '铁路公园',
    lines: ['5'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)' },
    ]
  },
  {
    name: '妈湾',
    lines: ['5'],
    toilets: [
      { type: 'outside', text: '站厅(近C出入口)' },
    ]
  },
  {
    name: '前湾公园',
    lines: ['5'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '前湾',
    lines: ['5', '9'],
    toilets: [
      { type: 'inside', text: '5号线站台(往赤湾方向头端)', num: '①' },
      { type: 'outside', text: '站厅(近B出入口)', num: '②' },
    ]
  },
  {
    name: '桂湾',
    lines: ['5'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)' },
    ]
  },
  {
    name: '前海湾',
    lines: ['1', '5', '11'],
    toilets: [
      { type: 'outside', text: '1号线站厅(B出入口通道内)' },
    ]
  },
  {
    name: '临海',
    lines: ['5'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)', note: '暂未启用' },
    ]
  },
  {
    name: '宝华',
    lines: ['5'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)' },
    ]
  },
  {
    name: '宝安中心',
    lines: ['1', '5'],
    toilets: [
      { type: 'outside', text: '站厅(A出入口通道内)' },
    ]
  },
  {
    name: '翻身',
    lines: ['5'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '灵芝',
    lines: ['5', '12'],
    toilets: [
      { type: 'inside', text: '12号线站台(往左炮台东方向尾端)', num: '①' },
      { type: 'inside', text: '12号线站台(往松岗方向头端)', num: '②' },
      { type: 'outside', text: '站厅(B出入口通道内)', num: '③' },
    ]
  },
  {
    name: '洪浪北',
    lines: ['5'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '兴东',
    lines: ['5'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)' },
    ]
  },
  {
    name: '留仙洞',
    lines: ['5', '13'],
    toilets: [
      { type: 'inside', text: '13号线站台(往李松蓢方向尾端)', num: '①' },
      { type: 'outside', text: '13号线站厅(近F出入口)', num: '②' },
      { type: 'outside', text: '5号线站厅(C出入口通道内)', num: '③' },
    ]
  },
  {
    name: '西丽',
    lines: ['5', '7'],
    toilets: [
      { type: 'inside', text: '7号线站台(往深大丽湖方向头端)', num: '①' },
      { type: 'inside', text: '7号线站台(往太安方向尾端)', num: '②' },
      { type: 'outside', text: '5号线站厅(F出入口通道内)', num: '③' },
    ]
  },
  {
    name: '大学城',
    lines: ['5'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '塘朗',
    lines: ['5'],
    toilets: [
      { type: 'outside', text: '站厅(近C出入口)' },
    ]
  },
  {
    name: '长岭陂',
    lines: ['5'],
    toilets: [
      { type: 'outside', text: '站厅(近A出入口)' },
    ]
  },
  {
    name: '民治',
    lines: ['5'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)' },
    ]
  },
  {
    name: '五和',
    lines: ['5', '10'],
    toilets: [
      { type: 'inside', text: '10号线站台(往福田口岸方向头端)', num: '①' },
      { type: 'outside', text: '站厅(A出入口通道内)', num: '②' },
    ]
  },
  {
    name: '坂田',
    lines: ['5'],
    toilets: [
      { type: 'outside', text: '站厅(A出入口通道内)' },
    ]
  },
  {
    name: '杨美',
    lines: ['5'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)' },
    ]
  },
  {
    name: '上水径',
    lines: ['5'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '下水径',
    lines: ['5'],
    toilets: [
      { type: 'outside', text: '站厅(A出入口通道内)' },
    ]
  },
  {
    name: '长龙',
    lines: ['5'],
    toilets: [
      { type: 'outside', text: '站厅(A出入口通道内)' },
    ]
  },
  {
    name: '百鸽笼',
    lines: ['5'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)' },
    ]
  },
  {
    name: '布心',
    lines: ['5'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)' },
    ]
  },
  {
    name: '太安',
    lines: ['5', '7'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '怡景',
    lines: ['5'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '东门',
    lines: ['5'],
    toilets: [
      { type: 'outside', text: '站厅(下沉广场)' },
    ]
  },

  // ========== 6号线 ==========
  {
    name: '科学馆',
    lines: ['1', '6'],
    toilets: [
      { type: 'outside', text: '1号线站厅(A出入口通道内)', num: '①' },
      { type: 'outside', text: '6号线站厅(近E出入口)', num: '②' },
      { type: 'inside', text: '6号线站台(往科学馆方向头端)', num: '③' },
    ]
  },
  {
    name: '通新岭',
    lines: ['3', '6'],
    toilets: [
      { type: 'inside', text: '6号线站台(往松岗方向头端)', num: '①' },
      { type: 'outside', text: '3号线站厅(C出入口通道内)', num: '②' },
    ]
  },
  {
    name: '体育中心',
    lines: ['6'],
    toilets: [
      { type: 'outside', text: '站厅(近B出入口)' },
    ]
  },
  {
    name: '八卦岭',
    lines: ['6', '7'],
    toilets: [
      { type: 'outside', text: '6号线站厅(E出入口通道内)', num: '①' },
      { type: 'inside', text: '6号线站台(往科学馆方向尾端)', num: '②' },
      { type: 'outside', text: '7号线站厅(近B出入口)', num: '③' },
      { type: 'inside', text: '7号线站台(往深大丽湖方向尾端)', num: '④' },
    ]
  },
  {
    name: '银湖',
    lines: ['6', '9'],
    toilets: [
      { type: 'inside', text: '6号线站台(往科学馆方向尾端)', num: '①' },
      { type: 'outside', text: '站厅(B出入口通道内)', num: '②' },
    ]
  },
  {
    name: '翰岭',
    lines: ['6'],
    toilets: [
      { type: 'outside', text: '站厅(近B出入口)' },
    ]
  },
  {
    name: '梅林关',
    lines: ['6'],
    toilets: [
      { type: 'outside', text: '站厅(近A出入口)' },
    ]
  },
  {
    name: '上芬',
    lines: ['6'],
    toilets: [
      { type: 'outside', text: '站厅(A/D出入口之间)' },
    ]
  },
  {
    name: '元芬',
    lines: ['6'],
    toilets: [
      { type: 'outside', text: '站厅(近D出入口)' },
    ]
  },
  {
    name: '阳台山东',
    lines: ['6'],
    toilets: [
      { type: 'outside', text: '站厅(近B出入口)' },
    ]
  },
  {
    name: '官田',
    lines: ['6'],
    toilets: [
      { type: 'outside', text: '站厅(近D出入口)' },
    ]
  },
  {
    name: '上屋',
    lines: ['6', '13'],
    toilets: [
      { type: 'inside', text: '13号线站台(往李松蓢方向尾端)', num: '①' },
      { type: 'outside', text: '13号线站厅(近E出入口)', num: '②' },
      { type: 'outside', text: '6号线站厅(近D出入口)', num: '③' },
    ]
  },
  {
    name: '长圳',
    lines: ['6'],
    toilets: [
      { type: 'outside', text: '站厅(近D出入口垂梯旁)' },
    ]
  },
  {
    name: '凤凰城',
    lines: ['6', '13'],
    toilets: [
      { type: 'inside', text: '13号线站台(往李松蓢方向头端)', num: '①' },
      { type: 'outside', text: '13号线站厅(近E出入口)', num: '②' },
      { type: 'outside', text: '6号线站厅(近C出入口)', num: '③' },
    ]
  },
  {
    name: '光明大街',
    lines: ['6'],
    toilets: [
      { type: 'outside', text: '站厅(A/D出入口之间)' },
    ]
  },
  {
    name: '光明',
    lines: ['6', '6z'],
    toilets: [
      { type: 'outside', text: '站厅(近C出入口)' },
    ]
  },
  {
    name: '科学公园',
    lines: ['6'],
    toilets: [
      { type: 'outside', text: '站厅(近C出入口)' },
    ]
  },
  {
    name: '楼村',
    lines: ['6'],
    toilets: [
      { type: 'outside', text: '站厅(近C出入口)' },
    ]
  },
  {
    name: '红花山',
    lines: ['6'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)' },
    ]
  },
  {
    name: '公明广场',
    lines: ['6', '13'],
    toilets: [
      { type: 'inside', text: '13号线站台(往李松蓢方向头端)', num: '①' },
      { type: 'outside', text: '13号线站厅(近E出入口)', num: '②' },
      { type: 'outside', text: '6号线站厅(近B出入口)', num: '③' },
    ]
  },
  {
    name: '合水口',
    lines: ['6'],
    toilets: [
      { type: 'outside', text: '站厅(近C出入口)' },
    ]
  },
  {
    name: '薯田埔',
    lines: ['6'],
    toilets: [
      { type: 'outside', text: '站厅(近C出入口)' },
    ]
  },
  {
    name: '松岗公园',
    lines: ['6'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)' },
    ]
  },
  {
    name: '溪头',
    lines: ['6'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)' },
    ]
  },
  {
    name: '松岗',
    lines: ['6', '11', '12'],
    toilets: [
      { type: 'inside', text: '12号线站台(往左炮台东方向头端)', num: '①' },
      { type: 'outside', text: '12号线站厅(J出入口通道内)', num: '②' },
      { type: 'outside', text: '6/11号线站厅(近F出入口)', num: '③', note: '步行约170米' },
      { type: 'inside', text: '11号线站台(往碧头方向头端)', num: '④' },
      { type: 'inside', text: '6号线站台(往松岗方向中部)', num: '⑤' },
      { type: 'inside', text: '6号线站台(往科学馆方向中部)', num: '⑥' },
    ]
  },


  // ========== 7号线补充 ==========
  {
    name: '华强南',
    lines: ['7', '11'],
    toilets: [
      { type: 'inside', text: '11号线站台(往碧头方向尾端)', num: '①' },
      { type: 'outside', text: '11号线站厅(近F出入口)', num: '②' },
      { type: 'outside', text: '7号线站厅(近C出入口)', num: '③' },
    ]
  },
  {
    name: '赤尾',
    lines: ['7'],
    toilets: [
      { type: 'outside', text: '站厅(A出入口通道内)' },
    ]
  },
  {
    name: '皇岗口岸',
    lines: ['7'],
    toilets: [
      { type: 'outside', text: '下沉广场(靠近E出入口)' },
    ]
  },
  {
    name: '皇岗村',
    lines: ['7'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)' },
    ]
  },
  {
    name: '沙尾',
    lines: ['7'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)' },
    ]
  },
  {
    name: '上沙',
    lines: ['7'],
    toilets: [
      { type: 'outside', text: '站厅(A/E出入口通道交汇处)' },
    ]
  },
  {
    name: '农林',
    lines: ['7'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)' },
    ]
  },
  {
    name: '深云',
    lines: ['7'],
    toilets: [
      { type: 'outside', text: '站厅(近B出入口)' },
    ]
  },
  {
    name: '桃源村',
    lines: ['7'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)' },
    ]
  },
  {
    name: '龙井',
    lines: ['7'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '珠光',
    lines: ['7'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)' },
    ]
  },
  {
    name: '茶光',
    lines: ['7'],
    toilets: [
      { type: 'outside', text: '站厅(A出入口通道内)' },
    ]
  },
  {
    name: '西丽湖',
    lines: ['7'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)' },
    ]
  },
  {
    name: '北大',
    lines: ['7'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)' },
    ]
  },
  {
    name: '深大丽湖',
    lines: ['7'],
    toilets: [
      { type: 'outside', text: '站厅(近C出入口)' },
    ]
  },
  {
    name: '洪湖',
    lines: ['7'],
    toilets: [
      { type: 'outside', text: '站厅(近A出入口)' },
    ]
  },
  {
    name: '笋岗',
    lines: ['7'],
    toilets: [
      { type: 'outside', text: '站厅(近E出入口)' },
    ]
  },
  {
    name: '红岭北',
    lines: ['7', '9'],
    toilets: [
      { type: 'inside', text: '7号线站台(往太安方向头端)', num: '①' },
      { type: 'outside', text: '站厅(AB出入口通道内)', num: '②' },
    ]
  },
  {
    name: '黄木岗',
    lines: ['7', '14'],
    toilets: [
      { type: 'inside', text: '14号线站台(往岗厦北头端)', num: '①' },
      { type: 'inside', text: '14号线站台(往沙田方向尾端)', num: '②' },
      { type: 'inside', text: '7号线站台(往深大丽湖方向尾端)', num: '③' },
      { type: 'outside', text: '站厅(近1出入口)', num: '④' },
      { type: 'outside', text: '站厅(14出入口通道内)', num: '⑤' },
    ]
  },

  // ========== 9号线补充 ==========
  {
    name: '文锦',
    lines: ['9'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '向西村',
    lines: ['9'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)' },
    ]
  },
  {
    name: '人民南',
    lines: ['9'],
    toilets: [
      { type: 'outside', text: '站厅(A出入口通道内)' },
    ]
  },
  {
    name: '鹿丹村',
    lines: ['9'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '红岭南',
    lines: ['9'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)' },
    ]
  },
  {
    name: '园岭',
    lines: ['9'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '泥岗',
    lines: ['9'],
    toilets: [
      { type: 'outside', text: '站厅(近A出入口)' },
    ]
  },
  {
    name: '红树湾南',
    lines: ['9', '11'],
    toilets: [
      { type: 'inside', text: '9/11号线站台(往红岭南方向头端)', num: '①' },
      { type: 'outside', text: '站厅(A出入口通道内)', num: '②' },
    ]
  },
  {
    name: '高新南',
    lines: ['9'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '粤海门',
    lines: ['9', '13'],
    toilets: [
      { type: 'inside', text: '13号线站台(往东角头方向头端)', num: '①' },
      { type: 'outside', text: '13号线站厅(G出入口通道内)', num: '②' },
      { type: 'outside', text: '9号线站厅(A出入口通道内)', num: '③' },
    ]
  },
  {
    name: '深大南',
    lines: ['9'],
    toilets: [
      { type: 'outside', text: '站厅(A出入口通道内)' },
    ]
  },
  {
    name: '南山书城',
    lines: ['9'],
    toilets: [
      { type: 'outside', text: '站厅(近E出入口)' },
    ]
  },
  {
    name: '南油',
    lines: ['9', '12'],
    toilets: [
      { type: 'outside', text: '站厅(近E出入口)', num: '①' },
      { type: 'inside', text: '9号线站台(往文锦方向头端)', num: '②' },
    ]
  },
  {
    name: '南油西',
    lines: ['9'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)' },
    ]
  },
  {
    name: '荔林',
    lines: ['9'],
    toilets: [
      { type: 'outside', text: '站厅(E出入口通道内)' },
    ]
  },
  {
    name: '怡海',
    lines: ['9'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '梦海',
    lines: ['9'],
    toilets: [
      { type: 'outside', text: '站厅(近D出入口)' },
    ]
  },
  {
    name: '梅村',
    lines: ['9'],
    toilets: [
      { type: 'outside', text: '站厅(E出入口通道内)' },
    ]
  },
  {
    name: '下梅林',
    lines: ['9'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)' },
    ]
  },
  {
    name: '梅景',
    lines: ['9'],
    toilets: [
      { type: 'outside', text: '站厅(近A出入口)' },
    ]
  },
  {
    name: '香梅',
    lines: ['9'],
    toilets: [
      { type: 'outside', text: '站厅(近D出入口)' },
    ]
  },
  {
    name: '下沙',
    lines: ['9'],
    toilets: [
      { type: 'outside', text: '站厅(近C出入口)' },
    ]
  },
  {
    name: '深圳湾公园',
    lines: ['9'],
    toilets: [
      { type: 'outside', text: '站厅(E出入口通道内)', num: '①' },
      { type: 'outside', text: '站厅(A出入口通道内)', num: '②' },
    ]
  },
  {
    name: '深湾',
    lines: ['9'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)' },
    ]
  },

  // ========== 10号线补充 ==========
  {
    name: '冬瓜岭',
    lines: ['10'],
    toilets: [
      { type: 'outside', text: '站厅(近C出入口)' },
    ]
  },
  {
    name: '雅宝',
    lines: ['10'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '南坑',
    lines: ['10'],
    toilets: [
      { type: 'outside', text: '站厅(B/C出入口之间)' },
    ]
  },
  {
    name: '光雅园',
    lines: ['10'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)' },
    ]
  },
  {
    name: '坂田北',
    lines: ['10'],
    toilets: [
      { type: 'outside', text: '站厅(A出入口通道内)' },
    ]
  },
  {
    name: '贝尔路',
    lines: ['10'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)' },
    ]
  },
  {
    name: '华为',
    lines: ['10'],
    toilets: [
      { type: 'outside', text: '站厅(近F出入口)' },
    ]
  },
  {
    name: '岗头',
    lines: ['10'],
    toilets: [
      { type: 'outside', text: '站厅(E出入口通道内)' },
    ]
  },
  {
    name: '雪象',
    lines: ['10'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '甘坑',
    lines: ['10'],
    toilets: [
      { type: 'outside', text: '站厅(近B出入口)' },
    ]
  },
  {
    name: '凉帽山',
    lines: ['10'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)' },
    ]
  },
  {
    name: '上李朗',
    lines: ['10'],
    toilets: [
      { type: 'outside', text: '站厅(近B出入口)' },
    ]
  },
  {
    name: '木古',
    lines: ['10'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)' },
    ]
  },
  {
    name: '华南城',
    lines: ['10'],
    toilets: [
      { type: 'outside', text: '站厅(近A出入口)' },
    ]
  },
  {
    name: '禾花',
    lines: ['10'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口对面通道)' },
    ]
  },
  {
    name: '平湖',
    lines: ['10'],
    toilets: [
      { type: 'inside', text: '站台(往双拥街方向尾端)', num: '①' },
      { type: 'outside', text: '站厅(B出入口通道内)', num: '②' },
    ]
  },
  {
    name: '双拥街',
    lines: ['10'],
    toilets: [
      { type: 'outside', text: '站厅(近C出入口)' },
    ]
  },


  // ========== 11号线补充 ==========
  {
    name: '红岭南',
    lines: ['11'],
    toilets: [
      { type: 'inside', text: '站台(往碧头方向尾端)', num: '①' },
      { type: 'outside', text: '站厅(近G出入口)', num: '②' },
    ]
  },
  {
    name: '福星',
    lines: ['11'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '宝安',
    lines: ['11'],
    toilets: [
      { type: 'outside', text: '站厅(A出入口通道内)' },
    ]
  },
  {
    name: '碧海湾',
    lines: ['11'],
    toilets: [
      { type: 'outside', text: '站厅(A出入口通道内)' },
    ]
  },
  {
    name: '机场',
    lines: ['11'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)' },
    ]
  },
  {
    name: '机场北',
    lines: ['11', '20'],
    toilets: [
      { type: 'inside', text: '20号线站台(往会展城方向头端)', num: '①' },
      { type: 'outside', text: '20号线站厅(D出入口通道内)', num: '②' },
      { type: 'inside', text: '11号线站台(往碧头方向头端)', num: '③' },
      { type: 'outside', text: '11号线站厅(A出入口通道内)', num: '④' },
    ]
  },
  {
    name: '桥头',
    lines: ['11'],
    toilets: [
      { type: 'outside', text: '站厅(近C出入口)' },
    ]
  },
  {
    name: '塘尾',
    lines: ['11'],
    toilets: [
      { type: 'outside', text: '站厅(近C出入口)' },
    ]
  },
  {
    name: '马安山',
    lines: ['11'],
    toilets: [
      { type: 'outside', text: '站厅(近C出入口)' },
    ]
  },
  {
    name: '沙井',
    lines: ['11'],
    toilets: [
      { type: 'outside', text: '站厅(近C出入口)' },
    ]
  },
  {
    name: '后亭',
    lines: ['11'],
    toilets: [
      { type: 'outside', text: '站厅(A出入口通道内)' },
    ]
  },
  {
    name: '碧头',
    lines: ['11'],
    toilets: [
      { type: 'outside', text: '站厅(近E出入口)' },
    ]
  },

  // ========== 12号线补充 ==========
  {
    name: '左炮台东',
    lines: ['12'],
    toilets: [
      { type: 'outside', text: '站厅(A出入口通道内)' },
    ]
  },
  {
    name: '太子湾',
    lines: ['12'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)' },
    ]
  },
  {
    name: '花果山',
    lines: ['12'],
    toilets: [
      { type: 'outside', text: '站厅(近B出入口)' },
    ]
  },
  {
    name: '四海',
    lines: ['12'],
    toilets: [
      { type: 'outside', text: '站厅(近J出入口)' },
    ]
  },
  {
    name: '南光',
    lines: ['12'],
    toilets: [
      { type: 'outside', text: '站厅(近C出入口)' },
    ]
  },
  {
    name: '南头古城',
    lines: ['12'],
    toilets: [
      { type: 'outside', text: '站厅(E出入口通道内)' },
    ]
  },
  {
    name: '中山公园',
    lines: ['12'],
    toilets: [
      { type: 'outside', text: '站厅(近B出入口)' },
    ]
  },
  {
    name: '同乐南',
    lines: ['12'],
    toilets: [
      { type: 'outside', text: '站厅(近B出入口)' },
    ]
  },
  {
    name: '新安公园',
    lines: ['12'],
    toilets: [
      { type: 'outside', text: '站厅(近B出入口)' },
    ]
  },
  {
    name: '上川',
    lines: ['12'],
    toilets: [
      { type: 'outside', text: '站厅(近H出入口)', num: '①' },
      { type: 'outside', text: '站厅(C/D出入口通道之间)', num: '②' },
    ]
  },
  {
    name: '流塘',
    lines: ['12'],
    toilets: [
      { type: 'outside', text: '站厅(近B出入口)' },
    ]
  },
  {
    name: '宝安客运站',
    lines: ['12'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '宝田一路',
    lines: ['12'],
    toilets: [
      { type: 'outside', text: '站厅(近A出入口)' },
    ]
  },
  {
    name: '平峦山',
    lines: ['12'],
    toilets: [
      { type: 'outside', text: '站厅(A出入口通道内)' },
    ]
  },
  {
    name: '西乡桃源',
    lines: ['12'],
    toilets: [
      { type: 'outside', text: '站厅(A出入口通道内)' },
    ]
  },
  {
    name: '钟屋南',
    lines: ['12'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)' },
    ]
  },
  {
    name: '黄田',
    lines: ['12'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)' },
    ]
  },
  {
    name: '兴围',
    lines: ['12'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '福围',
    lines: ['12'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '怀德',
    lines: ['12'],
    toilets: [
      { type: 'outside', text: '站厅(近C出入口)' },
    ]
  },
  {
    name: '桥头西',
    lines: ['12'],
    toilets: [
      { type: 'outside', text: '站厅(A出入口通道内)' },
    ]
  },
  {
    name: '福海西',
    lines: ['12'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '海上田园南',
    lines: ['12'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)', note: '暂未启用' },
    ]
  },
  {
    name: '海上田园东',
    lines: ['12'],
    toilets: [
      { type: 'inside', text: '站台(往松岗方向头端)', num: '①' },
      { type: 'outside', text: '站厅(B出入口通道内)', num: '②' },
    ]
  },
  {
    name: '蚝乡',
    lines: ['12'],
    toilets: [
      { type: 'outside', text: '站厅(近D出入口通道)' },
    ]
  },
  {
    name: '沙蚝',
    lines: ['12'],
    toilets: [
      { type: 'outside', text: '站厅(近A出入口通道)' },
    ]
  },
  {
    name: '沙井古墟',
    lines: ['12'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)' },
    ]
  },
  {
    name: '步涌',
    lines: ['12'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)' },
    ]
  },
  {
    name: '朗下',
    lines: ['12'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)' },
    ]
  },

  // ========== 20号线补充 ==========
  {
    name: '国展',
    lines: ['12', '20'],
    toilets: [
      { type: 'inside', text: '20号线站台(往机场北方向头端)', num: '①' },
      { type: 'outside', text: '站厅(C1出入口通道内)', num: '②' },
    ]
  },
  {
    name: '国展北',
    lines: ['12', '20'],
    toilets: [
      { type: 'inside', text: '20号线站台(往会展城方向头端)', num: '①' },
      { type: 'outside', text: '站厅(C1出入口通道内)', num: '②' },
    ]
  },


  // ========== 14号线补充 ==========
  {
    name: '罗湖北',
    lines: ['14'],
    toilets: [
      { type: 'inside', text: '站台(往岗厦北方向尾端)', num: '①' },
      { type: 'inside', text: '站台(往沙田方向头端)', num: '②' },
      { type: 'outside', text: '站厅(近H出入口)', num: '③' },
    ]
  },
  {
    name: '石芽岭',
    lines: ['14'],
    toilets: [
      { type: 'inside', text: '站台(往沙田方向头端)', num: '①' },
      { type: 'outside', text: '站厅(H出入口通道内)', num: '②' },
    ]
  },
  {
    name: '六约北',
    lines: ['14'],
    toilets: [
      { type: 'outside', text: '站厅(近B出入口)' },
    ]
  },
  {
    name: '四联',
    lines: ['14'],
    toilets: [
      { type: 'inside', text: '站台(往岗厦北方向尾端)', num: '①' },
      { type: 'inside', text: '站台(往沙田方向头端)', num: '②' },
      { type: 'outside', text: '站厅(D口通道内)', num: '③' },
    ]
  },
  {
    name: '坳背',
    lines: ['14'],
    toilets: [
      { type: 'inside', text: '站台(往岗厦北方向头端)', num: '①' },
      { type: 'inside', text: '站台(往沙田方向尾端)', num: '②' },
      { type: 'outside', text: '站厅(A出入口通道旁)', num: '③' },
    ]
  },
  {
    name: '嶂背',
    lines: ['14'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口旁)' },
    ]
  },
  {
    name: '南约',
    lines: ['14'],
    toilets: [
      { type: 'inside', text: '站台(往沙田方向头端)', num: '①' },
      { type: 'inside', text: '站台(往岗厦北方向尾端)', num: '②' },
      { type: 'outside', text: '站厅(C口通道内)', num: '③' },
    ]
  },
  {
    name: '宝龙',
    lines: ['14'],
    toilets: [
      { type: 'outside', text: '站厅(A出入口通道内)' },
    ]
  },
  {
    name: '锦龙',
    lines: ['14'],
    toilets: [
      { type: 'outside', text: '站厅(A出入口通道内)' },
    ]
  },
  {
    name: '坪山围',
    lines: ['14', '16'],
    toilets: [
      { type: 'inside', text: '14号线站台(往岗厦北方向尾端)', num: '①' },
      { type: 'outside', text: '14号线站厅(C/D出入口通道内)', num: '②' },
    ]
  },
  {
    name: '坪山广场',
    lines: ['14'],
    toilets: [
      { type: 'outside', text: '站厅(近A出入口)' },
    ]
  },
  {
    name: '坪山中心',
    lines: ['14'],
    toilets: [
      { type: 'inside', text: '站台(往沙田方向头端)', num: '①' },
      { type: 'inside', text: '站台(往岗厦北方向尾端)', num: '②' },
      { type: 'outside', text: '站厅(C出入口通道旁)', num: '③' },
    ]
  },
  {
    name: '坑梓',
    lines: ['14'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道旁)' },
    ]
  },
  {
    name: '沙田',
    lines: ['14'],
    toilets: [
      { type: 'inside', text: '站台(往沙田方向头端)', num: '①' },
      { type: 'outside', text: '站厅(D出入口通道内)', num: '②' },
    ]
  },

  // ========== 20号线补充 ==========
  {
    name: '国展南',
    lines: ['20'],
    toilets: [
      { type: 'outside', text: '站厅(A出入口通道内)' },
    ]
  },
  {
    name: '会展城',
    lines: ['20'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },


  // ========== 16号线补充 ==========
  {
    name: '园山西坑',
    lines: ['16'],
    toilets: [
      { type: 'outside', text: '站厅(近A出入口)' },
    ]
  },
  {
    name: '安良',
    lines: ['16'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)' },
    ]
  },
  {
    name: '福坑',
    lines: ['16'],
    toilets: [
      { type: 'outside', text: '站厅(A出入口通道内)' },
    ]
  },
  {
    name: '大康',
    lines: ['16'],
    toilets: [
      { type: 'outside', text: '站厅(近B出入口)' },
    ]
  },
  {
    name: '园山',
    lines: ['16'],
    toilets: [
      { type: 'outside', text: '站厅(近C出入口)' },
    ]
  },
  {
    name: '大安',
    lines: ['16'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)' },
    ]
  },
  {
    name: '吉溪',
    lines: ['16'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口对面)' },
    ]
  },
  {
    name: '金源',
    lines: ['16'],
    toilets: [
      { type: 'outside', text: '站厅(近C出入口)' },
    ]
  },
  {
    name: '大运中心',
    lines: ['16'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '坪山',
    lines: ['16'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)' },
    ]
  },
  {
    name: '新和',
    lines: ['16'],
    toilets: [
      { type: 'outside', text: '站厅(近D出入口)' },
    ]
  },
  {
    name: '六和',
    lines: ['16'],
    toilets: [
      { type: 'outside', text: '站厅(A出入口通道内)' },
    ]
  },
  {
    name: '坪环',
    lines: ['16'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '东纵纪念馆',
    lines: ['16'],
    toilets: [
      { type: 'outside', text: '站厅(A出入口通道内)' },
    ]
  },
  {
    name: '沙壆',
    lines: ['16'],
    toilets: [
      { type: 'outside', text: '站厅(A出入口通道内)' },
    ]
  },
  {
    name: '燕子湖',
    lines: ['16'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)' },
    ]
  },
  {
    name: '石井',
    lines: ['16'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)' },
    ]
  },
  {
    name: '技术大学',
    lines: ['16'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)' },
    ]
  },
  {
    name: '田心',
    lines: ['16'],
    toilets: [
      { type: 'outside', text: '站厅(近A出入口)' },
    ]
  },
  {
    name: '龙城公园',
    lines: ['16'],
    toilets: [
      { type: 'outside', text: '站厅(A出入口通道内)' },
    ]
  },
  {
    name: '黄阁坑',
    lines: ['16'],
    toilets: [
      { type: 'outside', text: '站厅(近C出入口)' },
    ]
  },
  {
    name: '愉园',
    lines: ['16'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)' },
    ]
  },
  {
    name: '回龙埔',
    lines: ['16'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '尚景',
    lines: ['16'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)' },
    ]
  },
  {
    name: '盛平',
    lines: ['16'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)' },
    ]
  },
  {
    name: '龙园',
    lines: ['16'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },
  {
    name: '新塘围',
    lines: ['16'],
    toilets: [
      { type: 'outside', text: '站厅(D出入口通道内)' },
    ]
  },
  {
    name: '龙东',
    lines: ['16'],
    toilets: [
      { type: 'outside', text: '站厅(B出入口通道内)' },
    ]
  },
  {
    name: '宝龙同乐',
    lines: ['16'],
    toilets: [
      { type: 'outside', text: '站厅(C出入口通道内)' },
    ]
  },

  // ========== 13号线补充 ==========
  {
    name: '深圳湾口岸',
    lines: ['13'],
    toilets: [
      { type: 'inside', text: '1站台(往东角头方向头端)', num: '①' },
      { type: 'inside', text: '3站台(往东角头方向头端)', num: '②' },
      { type: 'inside', text: '4站台(往东角头方向尾端)', num: '③' },
      { type: 'outside', text: '站厅(B出入口通道内)', num: '④' },
    ]
  },
  {
    name: '人才公园',
    lines: ['13'],
    toilets: [
      { type: 'inside', text: '站台(往李松蓢方向尾端)', num: '①' },
      { type: 'outside', text: '站厅(B出入口通道内)', num: '②' },
    ]
  },
  {
    name: '高新中',
    lines: ['13'],
    toilets: [
      { type: 'inside', text: '站台(往李松蓢方向头端)', num: '①' },
      { type: 'outside', text: '站厅(C出入口通道内)', num: '②' },
    ]
  },
  {
    name: '高新北',
    lines: ['13'],
    toilets: [
      { type: 'inside', text: '站台(往东角头方向头端)', num: '①' },
      { type: 'outside', text: '站厅中部(近C出入口)', num: '②' },
    ]
  },
  {
    name: '石鼓',
    lines: ['13'],
    toilets: [
      { type: 'outside', text: '站厅(近A出入口)' },
    ]
  },
  {
    name: '百旺',
    lines: ['13'],
    toilets: [
      { type: 'outside', text: '站厅(近C出入口)' },
    ]
  },
  {
    name: '应人石',
    lines: ['13'],
    toilets: [
      { type: 'outside', text: '站厅(近A出入口)' },
    ]
  },
  {
    name: '罗租',
    lines: ['13'],
    toilets: [
      { type: 'outside', text: '站厅(近E出入口)' },
    ]
  },
  {
    name: '石岩',
    lines: ['13'],
    toilets: [
      { type: 'inside', text: '站台(往李松蓢方向尾端)', num: '①' },
      { type: 'outside', text: '站厅(近B出入口)', num: '②' },
    ]
  },
  {
    name: '红坳公园',
    lines: ['13'],
    toilets: [
      { type: 'outside', text: '站厅(近A出入口)' },
    ]
  },
  {
    name: '光明城',
    lines: ['6z', '13'],
    toilets: [
      { type: 'outside', text: '站厅(近B出入口)' },
    ]
  },
  {
    name: '德雅路',
    lines: ['13'],
    toilets: [
      { type: 'outside', text: '站厅(近C出入口)' },
    ]
  },
  {
    name: '月亮路',
    lines: ['13'],
    toilets: [
      { type: 'outside', text: '站厅(近C出入口)' },
    ]
  },
  {
    name: '将围',
    lines: ['13'],
    toilets: [
      { type: 'inside', text: '站台(往李松蓢方向头端)', num: '①' },
      { type: 'outside', text: '站厅(近B出入口)', num: '②' },
    ]
  },
  {
    name: '新庄',
    lines: ['13'],
    toilets: [
      { type: 'outside', text: '站厅(近A出入口)' },
    ]
  },
  {
    name: '上村',
    lines: ['13'],
    toilets: [
      { type: 'outside', text: '站厅(近C出入口)' },
    ]
  },
  {
    name: '下村',
    lines: ['13'],
    toilets: [
      { type: 'outside', text: '站厅(近A出入口)' },
    ]
  },
  {
    name: '李松蓢',
    lines: ['13'],
    toilets: [
      { type: 'inside', text: '站台(往李松蓢方向头端)', num: '①' },
      { type: 'outside', text: '站厅(近B出入口)', num: '②' },
    ]
  },
];
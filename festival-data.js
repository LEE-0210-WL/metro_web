// festival-data.js - 节日与节气数据（2026-2027年）
// 数据来源：紫金山天文台、中国政府网
// 每年1月1日需更新下一年数据

const festivalData = {
  // 公历固定节日（每年日期不变）
  fixed: [
    { month: 1, day: 1, name: "元旦快乐" },
    { month: 2, day: 14, name: "情人节快乐" },
    { month: 3, day: 8, name: "妇女节快乐" },
    { month: 3, day: 12, name: "植树节" },
    { month: 4, day: 1, name: "愚人节" },
    { month: 5, day: 1, name: "劳动节快乐" },
    { month: 5, day: 4, name: "青年节" },
    { month: 6, day: 1, name: "儿童节快乐" },
    { month: 7, day: 1, name: "建党节" },
    { month: 8, day: 1, name: "建军节" },
    { month: 9, day: 10, name: "教师节" },
    { month: 10, day: 1, name: "国庆节" },
    { month: 10, day: 13, name: "少先队建队日" },
    { month: 11, day: 8, name: "记者节" },
    { month: 12, day: 25, name: "圣诞节" }
  ],

  // 农历节日（每年公历日期不同，需按年更新）
  lunar: {
    2026: [
      { month: 2, day: 17, name: "春节快乐" },      // 正月初一
      { month: 3, day: 3, name: "元宵节" },         // 正月十五
      { month: 4, day: 5, name: "清明节" },         // 节气日
      { month: 6, day: 19, name: "端午节安康" },     // 五月初五
      { month: 8, day: 19, name: "七夕节" },        // 七月初七
      { month: 8, day: 27, name: "中元节" },        // 七月十五
      { month: 9, day: 25, name: "中秋节快乐" },      // 八月十五
      { month: 10, day: 18, name: "重阳节" },        // 九月初九
      { month: 11, day: 9, name: "寒衣节" },         // 十月初一
      { month: 11, day: 23, name: "下元节" },        // 十月十五
      { month: 12, day: 22, name: "冬至" }           // 冬至（节气+节日）
    ],
    2027: [
      { month: 1, day: 15, name: "腊八节" },         // 腊月初八
      { month: 2, day: 6, name: "春节快乐" },        // 正月初一
      { month: 2, day: 20, name: "元宵节" },         // 正月十五
      { month: 4, day: 5, name: "清明节" },          // 节气日
      { month: 6, day: 9, name: "端午节安康" },      // 五月初五
      { month: 8, day: 8, name: "七夕节" },          // 七月初七
      { month: 8, day: 16, name: "中元节" },         // 七月十五
      { month: 9, day: 14, name: "中秋节快乐" },      // 八月十五
      { month: 10, day: 7, name: "重阳节" },          // 九月初九
      { month: 12, day: 22, name: "冬至" }            // 冬至
    ]
  },

  // 二十四节气（每年公历日期，需按年更新）
  solarTerms: {
    2026: [
      { month: 2, day: 4, name: "立春" },
      { month: 2, day: 18, name: "雨水" },
      { month: 3, day: 5, name: "惊蛰" },
      { month: 3, day: 20, name: "春分" },
      { month: 4, day: 5, name: "清明" },
      { month: 4, day: 20, name: "谷雨" },
      { month: 5, day: 5, name: "立夏" },
      { month: 5, day: 21, name: "小满" },
      { month: 6, day: 5, name: "芒种" },
      { month: 6, day: 21, name: "夏至" },
      { month: 7, day: 7, name: "小暑" },
      { month: 7, day: 23, name: "大暑" },
      { month: 8, day: 7, name: "立秋" },
      { month: 8, day: 23, name: "处暑" },
      { month: 9, day: 7, name: "白露" },
      { month: 9, day: 23, name: "秋分" },
      { month: 10, day: 8, name: "寒露" },
      { month: 10, day: 23, name: "霜降" },
      { month: 11, day: 7, name: "立冬" },
      { month: 11, day: 22, name: "小雪" },
      { month: 12, day: 7, name: "大雪" },
      { month: 12, day: 22, name: "冬至" }
    ],
    2027: [
      { month: 1, day: 5, name: "小寒" },
      { month: 1, day: 20, name: "大寒" },
      { month: 2, day: 4, name: "立春" },
      { month: 2, day: 19, name: "雨水" },
      { month: 3, day: 6, name: "惊蛰" },
      { month: 3, day: 21, name: "春分" },
      { month: 4, day: 5, name: "清明" },
      { month: 4, day: 20, name: "谷雨" },
      { month: 5, day: 6, name: "立夏" },
      { month: 5, day: 21, name: "小满" },
      { month: 6, day: 6, name: "芒种" },
      { month: 6, day: 21, name: "夏至" },
      { month: 7, day: 7, name: "小暑" },
      { month: 7, day: 23, name: "大暑" },
      { month: 8, day: 8, name: "立秋" },
      { month: 8, day: 23, name: "处暑" },
      { month: 9, day: 8, name: "白露" },
      { month: 9, day: 23, name: "秋分" },
      { month: 10, day: 8, name: "寒露" },
      { month: 10, day: 23, name: "霜降" },
      { month: 11, day: 7, name: "立冬" },
      { month: 11, day: 22, name: "小雪" },
      { month: 12, day: 7, name: "大雪" },
      { month: 12, day: 22, name: "冬至" }
    ]
  }
};

// 智能检测函数
function getFestivalOrSolarTerm() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const year = now.getFullYear();

  // 1. 优先检测公历固定节日
  const fixedMatch = festivalData.fixed.find(f => f.month === month && f.day === day);
  if (fixedMatch) return fixedMatch.name;

  // 2. 检测农历节日（按年匹配）
  if (festivalData.lunar[year]) {
    const lunarMatch = festivalData.lunar[year].find(f => f.month === month && f.day === day);
    if (lunarMatch) return lunarMatch.name;
  }

  // 3. 检测节气（按年匹配）
  if (festivalData.solarTerms[year]) {
    const termMatch = festivalData.solarTerms[year].find(t => t.month === month && t.day === day);
    if (termMatch) return termMatch.name;
  }

  // 4. 跨年前后的节气（如2026年12月的小寒大寒属于2027年数据）
  if (month === 12) {
    const nextYear = year + 1;
    if (festivalData.solarTerms[nextYear]) {
      const nextMatch = festivalData.solarTerms[nextYear].find(t => t.month === month && t.day === day);
      if (nextMatch) return nextMatch.name;
    }
  }
  if (month === 1) {
    const prevYear = year - 1;
    if (festivalData.lunar[prevYear]) {
      const prevMatch = festivalData.lunar[prevYear].find(f => f.month === month && f.day === day);
      if (prevMatch) return prevMatch.name;
    }
  }

  return null;
}

// 导出（兼容模块和全局）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { festivalData, getFestivalOrSolarTerm };
}

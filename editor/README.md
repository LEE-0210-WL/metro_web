# 线路绘制器（metro_web/editor）

浏览器端的地铁线路绘制器雏形（M0/M1）：导入 AARC 存档、平移缩放、画线（45°/90° 吸附）、拖点、改站名、换乘胶囊、撤销重做、导出 PNG/存档。
纯静态 ES Module，无构建步骤，可直接由 Cloudflare Pages 提供。

## 使用

本地预览（零依赖）：

```bash
node editor/dev-server.cjs 8788
# 打开 http://127.0.0.1:8788/editor.html
```

线上：部署后访问 `https://<站点>/editor.html`。

## 操作

- 滚轮缩放；空格/中键拖动平移；点击点选中
- “新建线路”后点击画布加点，线段自动吸附 45°（Alt 取消吸附），Esc 结束
- 选中点：改站名、切换“作为车站”、删除
- 选中线路：改名、改色、删除
- 撤销/重做：Ctrl+Z / Ctrl+Shift+Z（或 Ctrl+Y）
- 导入/导出 AARC 兼容存档 JSON；导出 1920×1080 PNG
- 编辑内容自动保存到 localStorage（键 `metro_editor_save_v1`）

## 文件

| 文件 | 作用 |
|---|---|
| `geometry.js` | 45°/90° formalize、圆角路径、吸附、胶囊尺寸 |
| `save.js` | AARC 存档子集校验、站点簇推导（同名 + 60 单位邻近）、序列化 |
| `render.js` | Canvas 线路/站点/胶囊/站名渲染、命中测试 |
| `view.js` | 相机与坐标变换 |
| `main.js` | 页面入口：工具、面板、撤销、导入导出 |
| `dev-server.cjs` | 本地静态服务器 |
| `test/` | 几何一致性（对照 anim 的 AARC 移植）、存档 round-trip、吸附方向 |

## 测试

```bash
node editor/test/geometry.test.cjs   # 25 条线、3302 个采样点，误差 0
node editor/test/save.test.cjs       # round-trip + 4 个吸附方向
```

## 来源与许可

几何算法（`formalize` / 圆角路径 / 换乘胶囊规则）移植自 AARC
（https://github.com/au114514/aarc ，AGPLv3），本目录相关代码同样按 AGPLv3 分发。
`sample.save.json` 是合成的演示数据（3 条线、16 个站、1 个换乘站），不含任何个人线网。

## 尚未实现（后续里程碑）

- 线中插点、线段拖动、站名方向/偏移、半径微调
- 分支/共线、时间切片、DIY 站点样式
- 账号云存档（需 metro-auth-worker 侧接口）

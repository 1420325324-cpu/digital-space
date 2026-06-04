# Digital Space

一个个人数字空间，通过抽象视觉映射每日状态。

## 特性

- **能量值** - 粒子密度与运动速度映射
- **关注领域** - 气泡云展示近期关注点
- **情绪温度** - 波浪形态与色彩温度
- **思维活跃度** - 涟漪扩散频率
- **工作/生活平衡** - 天平倾斜角度

## 技术栈

- Next.js 14 (App Router)
- Three.js + React Three Fiber
- Tailwind CSS
- Framer Motion

## 自动更新

通过 Claude Code hook 自动分析对话内容并更新状态。

## 部署

```bash
npm run dev     # 开发
npm run build   # 构建
npm start       # 生产
```

## 数据

状态数据存储在 `data/state.json`，可通过脚本或手动更新。

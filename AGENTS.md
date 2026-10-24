# 前任匿名评价测评网站

## 项目定位

面向移动端的单次密码测评网站。服务端保存一次性访问密码、测评会话与可分享的匿名结果；不得将答题原文或用户身份信息暴露在分享页。

## 目录

- `public/`：GitHub Pages 发布的移动端网页、题库、计分与长图下载逻辑；`config.js` 只允许保存公开的 Edge Function 地址。
- `supabase/migrations/`：Postgres 表、RLS 与数据库函数，作为生产数据库的唯一结构来源。
- `supabase/functions/assessment/`：Supabase Edge Function，负责密码验证、结果保存与匿名分享。
- `scripts/`：本地与 Supabase 运营密码生成脚本。
- `server.js`、`data/`：仅供本地 Node + SQLite 开发回归，禁止直接暴露到公网或作为生产后端。

## 工程边界

- 密码的“一次性”必须由 Supabase Edge Function 和数据库原子更新校验，不能只依赖浏览器状态。
- 生产表必须启用 RLS；Service Role Key 只能在 Edge Function 或本机运营脚本中使用，绝不进入前端、Git 仓库或公开日志。
- 分享结果仅展示结果类型、维度分数和通用分析，不暴露答题记录或访问密码。
- 测评仅供娱乐和自我探索，不得声称能读取前任真实想法、预测复合可能或提供诊断。

## 验证入口

- `npm run start`：启动 Node + SQLite 本地回归服务。
- `npm run dev`：启动开发服务。
- `npm run codes:generate -- --count 10`：生成 10 个一次性密码。
- `npm run codes:supabase -- --count 10`：写入 Supabase 的 10 个一次性密码，需临时设置 Service Role Key。

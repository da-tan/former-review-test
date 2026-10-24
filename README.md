# 前任匿名评价测评网站

移动端优先的 36 题趣味测评网站。用户使用一次性密码进入答题，完成后可查看关系遗产画像、保存结果长图并分享匿名结果链接。

生产环境由 GitHub Pages 托管静态前端，Supabase Postgres 保存密码、会话和匿名结果，Supabase Edge Function 承接 API；浏览器不会接触服务密钥、答题原文或其他用户数据。

## 线上部署结构

- `public/`：GitHub Pages 发布目录。`public/config.js` 中的 `apiBaseUrl` 必须写入实际 Supabase Edge Function 地址。
- `supabase/migrations/`：生产数据库结构与 RLS 策略。
- `supabase/functions/assessment/`：密码验证、结果保存与匿名分享 API。
- `.github/workflows/deploy-pages.yml`：推送到 `main` 后发布 `public/` 到 GitHub Pages。

数据库表已启用 RLS，不为匿名和已登录用户开放直接读取。Edge Function 只返回匿名结果类型和维度分数，绝不返回密码、会话令牌或答题内容。

## 本地启动

```powershell
cd D:\project\open-fun\former-review-test
npm install
npm run start
```

启动后打开 `http://localhost:4173`。首次启动会创建一个本地演示密码 `DEMO-LOVE-2026`。演示密码和所有运营密码均为一次性密码。

## 生成运营密码

```powershell
npm run codes:generate -- --count 100
```

本地 Node 开发服务会将新密码输出到终端，并把密码的哈希值存入 `data/assessment.db`。请在安全的运营渠道保存和发放终端输出的明文密码；数据库不会保存明文密码。

生产环境使用 Supabase 时，先在当前 PowerShell 会话设置 Supabase 项目 URL 和 Service Role Key，再执行：

```powershell
$env:SUPABASE_URL = "https://YOUR_PROJECT_REF.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY = "请从 Supabase Dashboard 的 Settings > API Keys 获取"
npm run codes:supabase -- --count 100 --label "首批发放"
Remove-Item Env:SUPABASE_URL
Remove-Item Env:SUPABASE_SERVICE_ROLE_KEY
```

该脚本只将明文密码输出到当前终端，提交数据库的只有 SHA-256 哈希。Service Role Key 只能保留在本机临时环境变量中，不能写入 `public/`、Git 仓库或 GitHub Secrets 以外的公开位置。

## 功能范围

- 36 道题、6 个关系维度、8 种结果类型与 1 种复盘结果。
- 同一密码仅能开启一个服务端会话；“再测一次”仅允许同一用户重新答题并覆盖其结果链接。
- 结果页在本机或手机浏览器中生成 PNG 长图；移动端会优先打开系统分享面板，以便保存到相册。
- 分享链接只公开结果类型、维度分数和通用分析，不公开答题记录或密码。
- “好评有礼”弹窗按产品文案展示 1 元返现提醒。

## 数据与上线提醒

`data/` 是本地 Node 开发服务的运行时数据，已被 Git 忽略；线上数据库使用 Supabase，不迁移本地 SQLite 测试数据。GitHub Pages 的站点和匿名分享链接均为公开页面，请勿在题目、结果或运营密码中写入个人隐私。

# __NWdrawer__

React + Vite project.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local` and set any required environment variables.
3. Run the app:
   `npm run dev`

## Available scripts

- `npm run dev` — start local development server
- `npm run build` — build for production
- `npm run preview` — preview the production build
- `npm run clean` — remove generated `dist` folder
- `npm run lint` — type-check with TypeScript

## GitHub Pages Deployment

This repository is configured to deploy to GitHub Pages via GitHub Actions.

- The app is built with Vite and published from the `dist` directory.
- The GitHub Pages site is served from the `gh-pages` branch.
- `base` is set to `'/__NWdrawer__/'` in `vite.config.ts` for the repo path.
- The deployment workflow needs `contents: write` permission so it can push to `gh-pages`.

After pushing to `main`, the workflow will automatically build and deploy.

### 可能的錯誤原因

- `Error: Action failed with "The process '/usr/bin/git' failed with exit code 128"` 通常是因為部署工作流程沒有 `GITHUB_TOKEN` 的寫入權限。
- 也可能是因為 GitHub repository 的分支保護設定不允許 action 直接推送到 `gh-pages`。
- 這份 repo 目前已經在工作流程裡加入 `permissions: contents: write`，應該可以解決大多數部署失敗問題。

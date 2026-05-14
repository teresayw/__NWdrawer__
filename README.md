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
- The GitHub Pages site will be served from `gh-pages` branch.
- `base` is set to `'/__NWdrawer__/'` in `vite.config.ts` for the repo path.

After pushing to `main`, the workflow will automatically build and deploy.

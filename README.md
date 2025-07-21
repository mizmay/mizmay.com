# mizmay.com

This project is a statically-exported Next.js site, deployed to GitHub Pages and served at [mizmay.com](https://mizmay.com).

## Local Development

To start a local development server:

```sh
npm install
npm run dev
```
- Visit [http://localhost:3000](http://localhost:3000) to view the site locally.

## Committing Changes to Main

1. Make your changes in the codebase.
2. Stage and commit your changes:
   ```sh
   git add .
   git commit -m "Describe your change"
   git push origin main
   ```
3. Your changes are now in the `main` branch on GitHub.

## Deploying to GitHub Pages (`gh-pages` branch)

1. Build the static site:
   ```sh
   npm run build
   ```
   This will generate the static site in the `out/` directory.

2. Deploy to GitHub Pages:
   ```sh
   npm run deploy
   ```
   This uses the [`gh-pages`](https://www.npmjs.com/package/gh-pages) package to push the contents of `out/` to the `gh-pages` branch.

3. GitHub Pages will serve your site from the `gh-pages` branch. If you have a custom domain (like mizmay.com), make sure it is set in your repo's **Settings > Pages**.

## Notes
- The `main` branch contains the source code.
- The `gh-pages` branch is managed automatically and contains only the static site output.
- For custom domain setup, ensure your DNS points to GitHub Pages and the domain is set in repo settings. 
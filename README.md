# tradyai

Personal portfolio for the **tradyai** product ecosystem — a quiet, dark
"command-center" terminal that ties together live products and in-development
projects under one brand.

Live at **[tradyai.live](https://tradyai.live)**.

## Highlights

- Single dark page, monospace-accented, a single accent colour.
- An interactive terminal — type `help`; the commands are real, not decoration.
- A live BTC/ETH/SOL ticker (CoinGecko) that fails gracefully and never shows fake numbers.
- Fully static output, keyboard accessible, Lighthouse 100 across the board.

## Stack

- [Astro](https://astro.build) — static output
- [React](https://react.dev) — two interactive islands (terminal, ticker)
- Tailwind CSS v4 + CSS custom properties for design tokens
- Self-hosted Inter & JetBrains Mono

## Develop

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # output to ./dist
npm run preview  # preview the production build
```

## Editing content

All copy lives in `src/data/`:

- `profile.ts` — name, links, about/contact copy, capabilities.
- `projects.ts` — the project list (status, tech, links).

## Deploy

Static build (`dist/`), no adapter — deploy on any static host.

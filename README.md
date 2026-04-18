# React + Vite
# Crypto Tracker

A sleek cryptocurrency tracking app built with React and Vite. It lets users explore top crypto assets, search and sort coins instantly, switch between grid and list layouts, and open a dedicated coin details page with market stats and a 7-day interactive price chart.

## Live Demo

Hosted Link: [https://crypto-mini-project.vercel.app/](https://crypto-mini-project.vercel.app/)

## Preview

Crypto Tracker is designed to feel fast, clean, and mobile-friendly while showing useful market information in a simple UI.

## Features

- Browse top cryptocurrencies with real-time market data
- Search coins by name or symbol
- Sort by rank, name, price, 24h change, and market cap
- Toggle between grid view and list view
- Paginated coin listing for a cleaner browsing experience
- Dedicated coin details page
- 7-day interactive SVG price chart with hover tooltip
- Market stats including price, 24h high/low, volume, market cap, and supply data
- Responsive layout for desktop and mobile screens

## Tech Stack

- React
- Vite
- React Router DOM
- JavaScript
- CSS
- CoinGecko API
- Vercel

## Project Structure

```text
myapp/
├── public/
├── src/
│   ├── api/
│   │   └── coinGecko.js
│   ├── components/
│   │   └── CryptoCard.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── CoinDeatil.jsx
│   ├── utils/
│   │   └── formatter.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── package.json
└── vite.config.js
```

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd crypto-project/myapp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

### 5. Preview the production build

```bash
npm run preview
```

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
## Routing

Currently, two official plugins are available:
- `/` - Home page with searchable and sortable crypto list
- `/coin/:id` - Coin details page with chart and market information

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)
## Data Source

## React Compiler
This project uses the CoinGecko API for cryptocurrency market data.

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).
## Highlights

- Clean, modern UI
- Fast Vite-powered development experience
- Reusable card-based component structure
- Interactive custom-built chart without relying on heavy chart libraries

## Deployment

This project is deployed on Vercel:

## Expanding the ESLint configuration
[https://crypto-mini-project.vercel.app/](https://crypto-mini-project.vercel.app/)

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
## Author

Built as a crypto mini project using React.

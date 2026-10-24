# NovaCart frontend

React + Vite + Redux Toolkit + Tailwind CSS storefront for the Spring Boot product API.

```bash
npm install
npm run dev
```

- `VITE_API_URL` sets the backend base URL (default `http://localhost:8080/api`).
- Store name and tagline: `src/config.js`.
- Store: `src/store` (products, cart, ui slices).
- API calls: `src/api.js`. Search and category filtering use `GET /product?query=<term>` on the backend.
- Shop: `/`. Admin dashboard (add / edit / delete): `/admin`.

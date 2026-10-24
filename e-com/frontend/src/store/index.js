import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./productsSlice";
import searchReducer from "./searchSlice";
import cartReducer, { CART_KEY } from "./cartSlice";
import uiReducer, { THEME_KEY } from "./uiSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    search: searchReducer,
    cart: cartReducer,
    ui: uiReducer,
  },
});

const persist = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    return;
  }
};

let lastLines;
let lastTheme;

store.subscribe(() => {
  const { cart, ui } = store.getState();
  if (cart.lines !== lastLines) {
    lastLines = cart.lines;
    persist(CART_KEY, JSON.stringify(cart.lines));
  }
  if (ui.theme !== lastTheme) {
    lastTheme = ui.theme;
    document.documentElement.dataset.theme = ui.theme;
    persist(THEME_KEY, ui.theme);
  }
});

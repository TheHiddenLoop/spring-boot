import { createSelector, createSlice } from "@reduxjs/toolkit";
import { deleteProduct, fetchProducts } from "./productsSlice";
import { notify } from "./uiSlice";
import { isPurchasable } from "../utils";

export const CART_KEY = "novacart.cart";

function loadLines() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY));
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((line) => line && line.id && Number(line.qty) > 0)
      .map((line) => ({ id: String(line.id), qty: Number(line.qty) }));
  } catch {
    return [];
  }
}

const cartSlice = createSlice({
  name: "cart",
  initialState: { lines: loadLines() },
  reducers: {
    lineSet(state, { payload: { id, qty } }) {
      const line = state.lines.find((l) => l.id === id);
      if (line) line.qty = qty;
      else state.lines.push({ id, qty });
    },
    lineRemoved(state, { payload }) {
      state.lines = state.lines.filter((line) => line.id !== payload);
    },
    cartCleared(state) {
      state.lines = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, { payload }) => {
        const byId = new Map(payload.map((product) => [product.id, product]));
        state.lines = state.lines.filter((line) => byId.has(line.id));
        state.lines.forEach((line) => {
          const { stock } = byId.get(line.id);
          if (stock > 0) line.qty = Math.min(line.qty, stock);
        });
      })
      .addCase(deleteProduct.fulfilled, (state, { payload }) => {
        state.lines = state.lines.filter((line) => line.id !== payload);
      });
  },
});

export const { lineSet, lineRemoved, cartCleared } = cartSlice.actions;

export const selectLines = (state) => state.cart.lines;

export const selectQtyInCart = (id) => (state) =>
  state.cart.lines.find((line) => line.id === id)?.qty ?? 0;

export const selectCartCount = createSelector([selectLines], (lines) =>
  lines.reduce((sum, line) => sum + line.qty, 0)
);

export const selectCartItems = createSelector(
  [selectLines, (state) => state.products.items, (state) => state.products.status],
  (lines, products, status) => {
    if (status !== "ready") return [];
    const byId = new Map(products.map((product) => [product.id, product]));
    return lines
      .map((line) => {
        const product = byId.get(line.id);
        return product
          ? { product, qty: line.qty, unavailable: !isPurchasable(product) }
          : null;
      })
      .filter(Boolean);
  }
);

export const selectCartTotal = createSelector([selectCartItems], (items) =>
  items.reduce((sum, item) => (item.unavailable ? sum : sum + item.product.price * item.qty), 0)
);

export const addToCart = (product, amount = 1) => (dispatch, getState) => {
  if (!isPurchasable(product)) {
    dispatch(notify(`${product.name} is out of stock`));
    return false;
  }
  const current = selectQtyInCart(product.id)(getState());
  if (current >= product.stock) {
    dispatch(notify(`Only ${product.stock} of ${product.name} in stock`));
    return false;
  }
  dispatch(lineSet({ id: product.id, qty: Math.min(current + amount, product.stock) }));
  dispatch(notify(`${product.name} added to cart`, { label: "View cart", to: "/cart" }));
  return true;
};

export const changeQty = (product, qty) => (dispatch) => {
  if (qty > product.stock) {
    dispatch(notify(`Only ${product.stock} of ${product.name} in stock`));
    return;
  }
  dispatch(lineSet({ id: product.id, qty: Math.max(1, qty) }));
};

export default cartSlice.reducer;

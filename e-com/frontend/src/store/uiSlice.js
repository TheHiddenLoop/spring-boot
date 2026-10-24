import { createSlice } from "@reduxjs/toolkit";

export const THEME_KEY = "novacart.theme";

let nextToastId = 0;

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    theme: document.documentElement.dataset.theme || "light",
    toasts: [],
  },
  reducers: {
    themeToggled(state) {
      state.theme = state.theme === "dark" ? "light" : "dark";
    },
    toastAdded(state, { payload }) {
      state.toasts = [...state.toasts.slice(-2), payload];
    },
    toastDismissed(state, { payload }) {
      state.toasts = state.toasts.filter((toast) => toast.id !== payload);
    },
  },
});

export const { themeToggled, toastAdded, toastDismissed } = uiSlice.actions;

export const notify = (message, action) => (dispatch) => {
  const id = ++nextToastId;
  dispatch(toastAdded({ id, message, action }));
  setTimeout(() => dispatch(toastDismissed(id)), 3200);
};

export default uiSlice.reducer;

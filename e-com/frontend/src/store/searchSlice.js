import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../api";
import { deleteProduct } from "./productsSlice";

const searchThunk = (type) =>
  createAsyncThunk(type, async (query, { rejectWithValue, signal }) => {
    try {
      return await api.getProducts(query, signal);
    } catch (error) {
      return rejectWithValue(api.getErrorMessage(error));
    }
  });

export const searchProducts = searchThunk("search/results");
export const fetchSuggestions = searchThunk("search/suggestions");

const emptySuggestions = { query: "", items: [], error: "" };

const searchSlice = createSlice({
  name: "search",
  initialState: {
    results: { query: "", items: [], status: "idle", error: "" },
    suggestions: emptySuggestions,
  },
  reducers: {
    suggestionsCleared(state) {
      state.suggestions = emptySuggestions;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state, { meta }) => {
        state.results = { query: meta.arg, items: [], status: "loading", error: "" };
      })
      .addCase(searchProducts.fulfilled, (state, { payload, meta }) => {
        state.results = { query: meta.arg, items: payload, status: "ready", error: "" };
      })
      .addCase(searchProducts.rejected, (state, { payload, meta, error }) => {
        if (meta.aborted) return;
        state.results = { query: meta.arg, items: [], status: "error", error: payload ?? error.message };
      })
      .addCase(fetchSuggestions.fulfilled, (state, { payload, meta }) => {
        state.suggestions = { query: meta.arg, items: payload.slice(0, 5), error: "" };
      })
      .addCase(fetchSuggestions.rejected, (state, { payload, meta, error }) => {
        if (meta.aborted) return;
        state.suggestions = { query: meta.arg, items: [], error: payload ?? error.message };
      })
      .addCase(deleteProduct.fulfilled, (state, { payload }) => {
        state.results.items = state.results.items.filter((product) => product.id !== payload);
        state.suggestions.items = state.suggestions.items.filter((product) => product.id !== payload);
      });
  },
});

export const { suggestionsCleared } = searchSlice.actions;

export default searchSlice.reducer;

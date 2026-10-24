import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../api";

export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await api.getProducts();
    } catch (error) {
      return rejectWithValue(api.getErrorMessage(error));
    }
  }
);

export const saveProduct = createAsyncThunk(
  "products/save",
  async ({ id, values, image, imageUrl }, { dispatch, rejectWithValue }) => {
    try {
      if (id) await api.updateProduct(id, values, image, imageUrl);
      else await api.createProduct(values, image);
      await dispatch(fetchProducts()).unwrap();
    } catch (error) {
      return rejectWithValue(typeof error === "string" ? error : api.getErrorMessage(error));
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteProduct(id);
      return id;
    } catch (error) {
      return rejectWithValue(api.getErrorMessage(error));
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: { items: [], status: "idle", error: "" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        if (state.status !== "ready") state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, { payload }) => {
        state.items = payload;
        state.status = "ready";
        state.error = "";
      })
      .addCase(fetchProducts.rejected, (state, { payload, error }) => {
        state.status = "error";
        state.error = payload ?? error.message;
      })
      .addCase(deleteProduct.fulfilled, (state, { payload }) => {
        state.items = state.items.filter((product) => product.id !== payload);
      });
  },
});

export const selectProducts = (state) => state.products.items;
export const selectProductsStatus = (state) => state.products.status;
export const selectProductsError = (state) => state.products.error;
export const selectProductById = (id) => (state) =>
  state.products.items.find((product) => product.id === id);

export default productsSlice.reducer;

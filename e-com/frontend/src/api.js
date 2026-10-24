import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  timeout: 15000,
});

const unwrap = (res) =>
  res.data && typeof res.data === "object" && "data" in res.data ? res.data.data : res.data;

const normalizeProduct = (p) => ({
  id: String(p.id),
  name: p.name ?? "Untitled product",
  description: p.description ?? "",
  brand: p.brand ?? "",
  price: Number(p.price) || 0,
  category: p.category ?? "Other",
  createdAt: p.createdAt ?? null,
  available: p.available ?? true,
  stock: Number(p.quantity) || 0,
  imageUrl: p.imageUrl || null,
});

function productForm(values, imageFile, imageUrl) {
  const payload = {
    name: values.name,
    description: values.description,
    brand: values.brand,
    price: Number(values.price),
    category: values.category,
    quantity: Number(values.quantity),
    available: values.available,
  };
  if (imageUrl) payload.imageUrl = imageUrl;
  const form = new FormData();
  form.append("product", new Blob([JSON.stringify(payload)], { type: "application/json" }));
  if (imageFile) form.append("imageFile", imageFile);
  return form;
}

export async function getProducts(query, signal) {
  const list = unwrap(await api.get("/product", { params: query ? { query } : undefined, signal }));
  return Array.isArray(list) ? list.map(normalizeProduct) : [];
}

export async function getProduct(id) {
  return normalizeProduct(unwrap(await api.get(`/product/${id}`)));
}

export async function createProduct(values, imageFile) {
  return unwrap(await api.post("/product/add", productForm(values, imageFile)));
}

export async function updateProduct(id, values, imageFile, currentImageUrl) {
  return unwrap(await api.put(`/product/update/${id}`, productForm(values, imageFile, currentImageUrl)));
}

export async function deleteProduct(id) {
  await api.delete(`/product/${id}`);
}

export async function placeOrder() {
  await new Promise((resolve) => setTimeout(resolve, 700));
  return { orderId: "NC-" + Math.random().toString(36).slice(2, 8).toUpperCase() };
}

export function getErrorMessage(error) {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.code === "ERR_NETWORK" || error?.code === "ECONNABORTED") {
    return "Can't reach the server. Check that the backend is running on localhost:8080.";
  }
  return error?.message || "Something went wrong.";
}

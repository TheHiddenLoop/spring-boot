const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const parseDate = (iso) => new Date(String(iso ?? "").replace(/(\.\d{3})\d+/, "$1"));

export const LOW_STOCK_AT = 10;

export const formatPrice = (value) => inr.format(Number(value) || 0);

export function formatDate(iso) {
  const date = parseDate(iso);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export const timeOf = (iso) => {
  const time = parseDate(iso).getTime();
  return Number.isNaN(time) ? 0 : time;
};

export const isPurchasable = (product) => product.available && product.stock > 0;

export function stockStatus(product) {
  if (!product.available) return "off";
  if (product.stock <= 0) return "out";
  if (product.stock <= LOW_STOCK_AT) return "low";
  return "ok";
}

export const STATUS_LABEL = {
  ok: "In stock",
  low: "Low stock",
  out: "Out of stock",
  off: "Not for sale",
};

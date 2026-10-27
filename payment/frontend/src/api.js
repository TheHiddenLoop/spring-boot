const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CREATE_ORDER_PATH = import.meta.env.VITE_CREATE_ORDER_PATH;
const VERIFY_PAYMENT_PATH = import.meta.env.VITE_VERIFY_PAYMENT_PATH;

async function postJson(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Backend returned ${res.status} for ${path}`);
  }
  return res.json();
}

export async function createOrder(product) {
  // TODO: PLACEHOLDER request body. Change to whatever your backend expects.
  const requestBody = {
    productId: product.id,
  };

  const data = await postJson(CREATE_ORDER_PATH, requestBody);

  return {
    orderId: data.orderId,  
    amount: data.amount,    
    currency: data.currency, 
    keyId: data.keyId,      
  };
}

export async function verifyPayment(razorpayResponse) {

  const requestBody = {
    razorpay_payment_id: razorpayResponse.razorpay_payment_id,
    razorpay_order_id: razorpayResponse.razorpay_order_id,
    razorpay_signature: razorpayResponse.razorpay_signature,
  };

  const data = await postJson(VERIFY_PAYMENT_PATH, requestBody);

  const status = String(data.status || "").toUpperCase();

  if (status === "SUCCESS") return "success";
  if (status === "PENDING") return "pending";
  return "failed";
}

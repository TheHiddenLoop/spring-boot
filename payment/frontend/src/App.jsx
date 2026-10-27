import { useState } from "react";
import { products } from "./data/products";
import { createOrder, verifyPayment } from "./api";

const MESSAGES = {
  success: "Payment Successful",
  failed: "Payment Failed",
  pending: "Payment Pending",
};

export default function App() {
  const [result, setResult] = useState(null); 
  const [detail, setDetail] = useState("");  
  const [busyId, setBusyId] = useState(null); 

  function showResult(type, extra = "") {
    setResult(type);
    setDetail(extra);
    setBusyId(null);
  }

  async function handleBuyNow(product) {
    setResult(null);
    setDetail("");
    setBusyId(product.id);

    try {
      
      const order = await createOrder(product);

      if (!window.Razorpay) {
        throw new Error("Razorpay script not loaded");
      }

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: product.name,

        handler: async (response) => {
          try {
            const verified = await verifyPayment(response);
            console.log(verified);
            
            showResult(verified);
          } catch (err) {
            showResult("failed", err.message);
          }
        },

        modal: { ondismiss: () => setBusyId(null) },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (resp) => {
        showResult("failed", resp?.error?.description || "");
      });

      rzp.open();
    } catch (err) {
      showResult("failed", err.message);
    }
  }

  return (
    <div className="page">
      <h1>Razorpay Backend Test</h1>

      {result && (
        <div className={`message ${result}`}>
          <strong>{MESSAGES[result]}</strong>
          {detail && <div className="detail">{detail}</div>}
        </div>
      )}

      <div className="grid">
        {products.map((p) => (
          <div className="card" key={p.id}>
            <img src={p.image} alt={p.name} />
            <div className="name">{p.name}</div>
            <div className="price">₹{p.price}</div>
            <button onClick={() => handleBuyNow(p)} disabled={busyId !== null}>
              {busyId === p.id ? "Processing..." : "Buy Now"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button, { IconButton } from "./ui/Button";
import Icon from "./ui/Icon";
import Modal from "./ui/Modal";
import ProductImage from "./ProductImage";
import { placeOrder, getErrorMessage } from "../api";
import { cartCleared, selectCartItems, selectCartTotal } from "../store/cartSlice";
import { formatPrice } from "../utils";

export default function CheckoutModal({ onClose }) {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const items = cartItems.filter((item) => !item.unavailable);

  const confirm = async () => {
    setPlacing(true);
    setError("");
    try {
      const { orderId } = await placeOrder(items);
      setOrder({ id: orderId, total, count: items.reduce((sum, item) => sum + item.qty, 0) });
      dispatch(cartCleared());
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPlacing(false);
    }
  };

  return (
    <Modal onClose={onClose} locked={placing} labelledBy="checkout-title">
      {order ? (
        <div className="grid justify-items-center gap-3 px-2 pt-4 pb-2 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-ok-soft text-ok">
            <Icon name="check" size={30} strokeWidth={2.4} />
          </span>
          <h2 id="checkout-title" className="text-2xl font-bold">Order placed</h2>
          <p className="text-ink-3">
            {order.count} {order.count === 1 ? "item" : "items"} &middot; {formatPrice(order.total)}
          </p>
          <p>Your order number is <strong>{order.id}</strong>.</p>
          <Button to="/" block onClick={onClose}>Continue shopping</Button>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h2 id="checkout-title" className="text-2xl font-bold">Review your order</h2>
            <IconButton onClick={onClose} disabled={placing} aria-label="Close"><Icon name="close" /></IconButton>
          </div>
          <ul className="mb-4 grid gap-3">
            {items.map(({ product, qty }) => (
              <li key={product.id} className="grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-3 font-semibold">
                <span className="relative size-14 overflow-hidden rounded-xl"><ProductImage product={product} /></span>
                <span className="grid min-w-0">
                  <strong className="truncate">{product.name}</strong>
                  <small className="font-normal text-ink-3">Qty {qty}</small>
                </span>
                <span>{formatPrice(product.price * qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="flex justify-between gap-4 border-t border-line pt-4 font-display text-xl font-bold">
            <dt>Total</dt>
            <dd>{formatPrice(total)}</dd>
          </dl>
          {error && <p role="alert" className="mt-3 font-medium text-bad">{error}</p>}
          <div className="mt-5 flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose} disabled={placing}>Back to cart</Button>
            <Button onClick={confirm} disabled={placing}>{placing ? "Placing order\u2026" : "Place order"}</Button>
          </div>
        </>
      )}
    </Modal>
  );
}

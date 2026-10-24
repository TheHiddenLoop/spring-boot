import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import Icon from "../components/ui/Icon";
import Skeleton from "../components/ui/Skeleton";
import StateBlock from "../components/ui/StateBlock";
import Stepper from "../components/ui/Stepper";
import CheckoutModal from "../components/CheckoutModal";
import ProductImage from "../components/ProductImage";
import { changeQty, lineRemoved, selectCartCount, selectCartItems, selectCartTotal } from "../store/cartSlice";
import { fetchProducts, selectProductsError, selectProductsStatus } from "../store/productsSlice";
import { formatPrice } from "../utils";

const removeButton = "inline-flex items-center gap-1.5 py-1 text-sm font-medium text-ink-2 hover:text-bad";

function CartLine({ item }) {
  const dispatch = useDispatch();
  const { product, qty, unavailable } = item;
  const remove = (
    <button type="button" className={removeButton} onClick={() => dispatch(lineRemoved(product.id))}>
      <Icon name="trash" size={16} /> Remove
    </button>
  );

  return (
    <li className="grid grid-cols-[72px_minmax(0,1fr)] gap-4 border-b border-line py-5 last:border-b-0 sm:grid-cols-[96px_minmax(0,1fr)_auto]">
      <Link to={`/product/${product.id}`} tabIndex={-1} aria-hidden="true" className={`relative size-18 overflow-hidden rounded-[14px] sm:size-24 ${unavailable ? "opacity-50" : ""}`}>
        <ProductImage product={product} />
      </Link>
      <div className="grid min-w-0 content-start justify-items-start gap-1">
        <Link to={`/product/${product.id}`} className="font-display text-[1.1rem] font-semibold hover:text-accent">{product.name}</Link>
        <p className="text-ink-3">{product.brand} &middot; {formatPrice(product.price)} each</p>
        {unavailable ? (
          <>
            <p className="text-sm font-medium text-bad">Out of stock. Remove it to check out.</p>
            {remove}
          </>
        ) : (
          <div className="mt-1.5 flex flex-wrap items-center gap-4">
            <Stepper small value={qty} max={product.stock} onChange={(next) => dispatch(changeQty(product, next))} label={`Quantity of ${product.name}`} />
            {remove}
          </div>
        )}
      </div>
      <p className="col-start-2 font-display text-[1.15rem] font-bold sm:col-start-3 sm:text-right">
        {unavailable ? "\u2014" : formatPrice(product.price * qty)}
      </p>
    </li>
  );
}

export default function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const count = useSelector(selectCartCount);
  const total = useSelector(selectCartTotal);
  const status = useSelector(selectProductsStatus);
  const error = useSelector(selectProductsError);
  const [checkingOut, setCheckingOut] = useState(false);

  const available = items.filter((item) => !item.unavailable);
  const units = available.reduce((sum, item) => sum + item.qty, 0);
  const hasUnavailable = items.some((item) => item.unavailable);

  let body;
  if (status === "error") {
    body = (
      <StateBlock role="alert" icon="alert" title="Couldn't load your cart" text={error}>
        <Button onClick={() => dispatch(fetchProducts())}>Try again</Button>
      </StateBlock>
    );
  } else if (status !== "ready" && count > 0) {
    body = <Skeleton className="h-70 rounded-[18px]" />;
  } else if (items.length === 0) {
    body = (
      <StateBlock icon="cart" title="Your cart is empty" text="Products you add will show up here.">
        <Button to="/">Browse products</Button>
      </StateBlock>
    );
  } else {
    body = (
      <>
        <h1 className="mb-5 text-[clamp(1.7rem,3.4vw,2.3rem)] font-bold">Your cart</h1>
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <ul className="rounded-[20px] border border-line bg-surface px-5">
            {items.map((item) => <CartLine key={item.product.id} item={item} />)}
          </ul>

          <aside className="grid gap-4 rounded-[20px] border border-line bg-surface p-5.5 lg:sticky lg:top-23">
            <h2 className="text-xl font-bold">Order summary</h2>
            <dl className="flex justify-between gap-4 text-ink-2">
              <dt>Items ({units})</dt>
              <dd>{formatPrice(total)}</dd>
            </dl>
            <dl className="flex justify-between gap-4 border-t border-line pt-4 font-display text-xl font-bold">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </dl>
            <Button size="lg" block disabled={hasUnavailable || units === 0} onClick={() => setCheckingOut(true)}>Checkout</Button>
            {hasUnavailable && <p className="text-sm font-medium text-bad">Remove out-of-stock items to continue.</p>}
            <Link to="/" className="text-center font-medium text-ink-2 hover:text-accent">Continue shopping</Link>
          </aside>
        </div>
      </>
    );
  }

  return (
    <Container>
      {body}
      {checkingOut && <CheckoutModal onClose={() => setCheckingOut(false)} />}
    </Container>
  );
}

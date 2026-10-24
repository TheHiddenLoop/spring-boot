import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import Icon from "../components/ui/Icon";
import Pill from "../components/ui/Pill";
import Skeleton from "../components/ui/Skeleton";
import StateBlock from "../components/ui/StateBlock";
import Stepper from "../components/ui/Stepper";
import ProductCard from "../components/ProductCard";
import ProductImage from "../components/ProductImage";
import { getProduct } from "../api";
import { addToCart, selectQtyInCart } from "../store/cartSlice";
import {
  fetchProducts,
  selectProductById,
  selectProducts,
  selectProductsStatus,
} from "../store/productsSlice";
import { STATUS_LABEL, formatDate, formatPrice, isPurchasable, stockStatus } from "../utils";

export default function ProductPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const status = useSelector(selectProductsStatus);
  const fromStore = useSelector(selectProductById(id));
  const inCart = useSelector(selectQtyInCart(id));
  const [fetched, setFetched] = useState(null);
  const [missing, setMissing] = useState(false);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setQty(1);
    setFetched(null);
    setMissing(false);
  }, [id]);

  useEffect(() => {
    if (status === "idle" || status === "loading" || fromStore) return;
    let cancelled = false;
    getProduct(id)
      .then((product) => !cancelled && setFetched(product))
      .catch(() => !cancelled && setMissing(true));
    return () => {
      cancelled = true;
    };
  }, [id, status, fromStore]);

  const product = fromStore ?? fetched;

  if (!product) {
    if (status === "error" || missing) {
      return (
        <Container>
          <StateBlock
            role="alert"
            icon="alert"
            title={missing ? "Product not found" : "Couldn't load this product"}
            text={missing ? "It may have been removed from the store." : "Check that the backend is running."}
          >
            {missing ? <Button to="/">Back to products</Button> : <Button onClick={() => dispatch(fetchProducts())}>Try again</Button>}
          </StateBlock>
        </Container>
      );
    }
    return (
      <Container className="grid gap-8 md:grid-cols-2">
        <Skeleton className="aspect-square rounded-3xl" />
        <div className="grid content-start gap-3.5">
          <Skeleton className="h-4 w-1/2 rounded-lg" />
          <Skeleton className="h-11 rounded-lg" />
          <Skeleton className="h-4 rounded-lg" />
          <Skeleton className="h-4 w-1/2 rounded-lg" />
        </div>
      </Container>
    );
  }

  const purchasable = isPurchasable(product);
  const state = stockStatus(product);
  const room = Math.max(product.stock - inCart, 0);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const stockText = state === "ok" ? `In stock (${product.stock} available)` : state === "low" ? `Only ${product.stock} left` : STATUS_LABEL[state];

  return (
    <Container>
      <Link to="/" className="mb-4 inline-flex items-center gap-1.5 font-medium text-ink-2 hover:text-accent">
        <Icon name="back" size={18} /> All products
      </Link>

      <div className="grid items-start gap-8 md:grid-cols-[1.05fr_1fr] md:gap-14">
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-line bg-white">
          <ProductImage product={product} />
        </div>

        <div className="grid justify-items-start gap-3.5">
          <Link to={`/?category=${encodeURIComponent(product.category)}`} className="font-semibold text-accent hover:underline">
            {product.category}
          </Link>
          <h1 className="text-[clamp(2rem,4.4vw,3rem)] font-bold tracking-tighter">{product.name}</h1>
          {product.brand && <p className="-mt-1.5 text-[1.05rem] text-ink-2">by {product.brand}</p>}
          <p className="font-display text-4xl font-bold tracking-tight">{formatPrice(product.price)}</p>
          <Pill tone={state}>{stockText}</Pill>
          <p className="max-w-[56ch] text-[1.05rem] text-ink-2">{product.description}</p>

          <div className="mt-1 flex flex-wrap items-center gap-3.5">
            <Stepper value={qty} min={1} max={Math.max(room, 1)} onChange={(next) => setQty(Math.max(1, next))} label="Quantity" />
            <Button
              size="lg"
              disabled={!purchasable || room === 0}
              onClick={() => dispatch(addToCart(product, qty)) && setQty(1)}
            >
              {!purchasable ? "Out of stock" : room === 0 ? "Max quantity in cart" : "Add to cart"}
            </Button>
          </div>
          {inCart > 0 && (
            <p className="-mt-1 text-ink-3">
              {inCart} in your cart. <Link to="/cart" className="font-semibold text-accent">View cart</Link>
            </p>
          )}

          <dl className="mt-3 grid w-full max-w-105 grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t border-line pt-4">
            <dt className="text-ink-3">Category</dt><dd className="font-medium">{product.category}</dd>
            {product.brand && (<><dt className="text-ink-3">Brand</dt><dd className="font-medium">{product.brand}</dd></>)}
            {formatDate(product.createdAt) && (<><dt className="text-ink-3">Listed on</dt><dd className="font-medium">{formatDate(product.createdAt)}</dd></>)}
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-5 text-2xl font-bold">More in {product.category}</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3.5 sm:grid-cols-[repeat(auto-fill,minmax(236px,1fr))] sm:gap-5">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </Container>
  );
}

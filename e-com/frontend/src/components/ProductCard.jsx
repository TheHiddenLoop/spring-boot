import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Button from "./ui/Button";
import ProductImage from "./ProductImage";
import { addToCart } from "../store/cartSlice";
import { LOW_STOCK_AT, formatPrice, isPurchasable } from "../utils";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const purchasable = isPurchasable(product);
  const low = purchasable && product.stock <= LOW_STOCK_AT;
  const badge = "absolute top-3 left-3 z-10 rounded-full px-2.5 py-0.5 text-sm font-semibold";

  return (
    <article className="flex flex-col overflow-hidden rounded-[18px] border border-line bg-surface hover:border-ink-3">
      <Link to={`/product/${product.id}`} tabIndex={-1} aria-hidden="true" className="relative block aspect-4/3">
        <span className={`absolute inset-0 ${purchasable ? "" : "opacity-60"}`}>
          <ProductImage product={product} />
        </span>
        {!purchasable && <span className={`${badge} bg-ink text-canvas`}>Out of stock</span>}
        {low && <span className={`${badge} bg-sun text-sun-ink`}>Only {product.stock} left</span>}
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-4 pb-4.5">
        <p className="text-[0.9rem] text-ink-3">{product.brand || product.category}</p>
        <h3 className="text-[1.12rem] font-semibold">
          <Link to={`/product/${product.id}`} className="hover:text-accent">{product.name}</Link>
        </h3>
        <p className="line-clamp-2 text-[0.92rem] text-ink-2">{product.description}</p>
        <div className="mt-auto flex flex-col gap-3 pt-3.5 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-display text-xl font-bold tracking-tight">{formatPrice(product.price)}</span>
          <Button size="sm" disabled={!purchasable} onClick={() => dispatch(addToCart(product))}>
            {purchasable ? "Add to cart" : "Unavailable"}
          </Button>
        </div>
      </div>
    </article>
  );
}

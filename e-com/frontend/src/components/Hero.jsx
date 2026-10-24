import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Button from "./ui/Button";
import ProductImage from "./ProductImage";
import { addToCart } from "../store/cartSlice";
import { formatPrice, isPurchasable } from "../utils";

export default function Hero({ product }) {
  const dispatch = useDispatch();
  const purchasable = isPurchasable(product);

  return (
    <section
      aria-label="Latest arrival"
      className="mb-7 grid items-center gap-8 overflow-hidden rounded-[28px] bg-brand p-6 text-white sm:p-10 lg:grid-cols-[1.1fr_0.9fr]"
    >
      <div className="grid justify-items-start gap-4">
        <span className="rounded-full bg-sun px-3 py-1 text-sm font-semibold text-sun-ink">Just added</span>
        <h1 className="text-[clamp(2.2rem,5.4vw,4rem)] leading-none font-extrabold tracking-tighter">{product.name}</h1>
        <p className="max-w-[46ch] text-[1.08rem] text-white/85">{product.description}</p>
        <p className="font-display text-3xl font-bold">{formatPrice(product.price)}</p>
        <div className="flex flex-wrap gap-3">
          <Button to={`/product/${product.id}`} variant="light">View details</Button>
          <Button variant="outlineLight" disabled={!purchasable} onClick={() => dispatch(addToCart(product))}>
            {purchasable ? "Add to cart" : "Out of stock"}
          </Button>
        </div>
      </div>
      <Link
        to={`/product/${product.id}`}
        tabIndex={-1}
        aria-hidden="true"
        className="relative aspect-video max-h-60 w-full overflow-hidden rounded-[22px] lg:aspect-square lg:max-h-85 lg:justify-self-end"
      >
        <ProductImage product={product} />
      </Link>
    </section>
  );
}

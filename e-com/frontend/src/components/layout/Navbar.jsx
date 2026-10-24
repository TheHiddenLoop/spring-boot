import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import Icon from "../ui/Icon";
import Container from "../ui/Container";
import { IconButton } from "../ui/Button";
import ProductImage from "../ProductImage";
import useDebouncedValue from "../../hooks/useDebouncedValue";
import { selectCartCount } from "../../store/cartSlice";
import { fetchSuggestions, suggestionsCleared } from "../../store/searchSlice";
import { themeToggled } from "../../store/uiSlice";
import { formatPrice } from "../../utils";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();
  const suggestions = useSelector((state) => state.search.suggestions);
  const cartCount = useSelector(selectCartCount);
  const theme = useSelector((state) => state.ui.theme);
  const [query, setQuery] = useState(new URLSearchParams(search).get("q") ?? "");
  const [open, setOpen] = useState(false);
  const wrapper = useRef(null);

  useEffect(() => {
    setQuery(new URLSearchParams(search).get("q") ?? "");
  }, [search]);

  useEffect(() => {
    const close = (event) => {
      if (wrapper.current && !wrapper.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  const term = useDebouncedValue(query.trim());

  useEffect(() => {
    if (!term) {
      dispatch(suggestionsCleared());
      return;
    }
    const request = dispatch(fetchSuggestions(term));
    return () => request.abort();
  }, [dispatch, term]);

  const submit = (event) => {
    event.preventDefault();
    const term = query.trim();
    setOpen(false);
    navigate(term ? `/?q=${encodeURIComponent(term)}` : "/");
  };

  const dark = theme === "dark";

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/90 backdrop-blur-md">
      <Container className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2.5 py-2.5 md:min-h-17 md:grid-cols-[auto_1fr_auto] md:py-0">
        <div className="col-start-1 row-start-1">
          <Logo />
        </div>

        <div
          ref={wrapper}
          className="relative col-span-2 row-start-2 w-full md:col-span-1 md:col-start-2 md:row-start-1 md:mx-auto md:max-w-140"
        >
          <form onSubmit={submit} role="search" className="relative">
            <Icon name="search" size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
            <input
              type="search"
              value={query}
              placeholder="Search phones, laptops, brands"
              aria-label="Search products"
              onChange={(event) => {
                setQuery(event.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={(event) => event.key === "Escape" && setOpen(false)}
              className="h-11 w-full rounded-xl border border-line bg-surface-2 pr-4 pl-10.5 placeholder:text-ink-3 focus:border-accent focus:bg-surface focus:outline-none focus:ring-3 focus:ring-accent-soft"
            />
          </form>

          {open && query.trim() && (
            <ul className="absolute inset-x-0 top-[calc(100%+8px)] z-60 rounded-2xl border border-line bg-surface p-1.5 shadow-xl">
              {suggestions.query !== query.trim() ? (
                <li className="p-3.5 text-ink-3">Searching&hellip;</li>
              ) : suggestions.error ? (
                <li className="p-3.5 text-bad">Search is unavailable right now</li>
              ) : suggestions.items.length === 0 ? (
                <li className="p-3.5 text-ink-3">No products match &ldquo;{query.trim()}&rdquo;</li>
              ) : (
                suggestions.items.map((product) => (
                  <li key={product.id}>
                    <Link
                      to={`/product/${product.id}`}
                      onClick={() => setOpen(false)}
                      className="grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl p-2 hover:bg-surface-2"
                    >
                      <span className="relative size-11 overflow-hidden rounded-xl">
                        <ProductImage product={product} />
                      </span>
                      <span className="grid min-w-0">
                        <strong className="truncate font-semibold">{product.name}</strong>
                        <small className="text-ink-3">{product.brand} &middot; {product.category}</small>
                      </span>
                      <span className="text-sm font-semibold">{formatPrice(product.price)}</span>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        <nav aria-label="Main" className="col-start-2 row-start-1 flex items-center gap-2 md:col-start-3">
          <IconButton onClick={() => dispatch(themeToggled())} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}>
            <Icon name={dark ? "sun" : "moon"} />
          </IconButton>
          <Link
            to="/cart"
            aria-label={`Cart, ${cartCount} items`}
            className="relative grid size-11 place-items-center rounded-xl border border-line hover:bg-surface-2"
          >
            <Icon name="cart" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-sun px-1.5 text-xs leading-none font-bold text-sun-ink">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>
      </Container>
    </header>
  );
}

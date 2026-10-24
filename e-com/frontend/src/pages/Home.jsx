import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Button from "../components/ui/Button";
import Chip from "../components/ui/Chip";
import Container from "../components/ui/Container";
import Skeleton from "../components/ui/Skeleton";
import StateBlock from "../components/ui/StateBlock";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import useProductSearch from "../hooks/useProductSearch";
import { selectProducts, selectProductsStatus } from "../store/productsSlice";
import { timeOf } from "../utils";

const SORTS = {
  featured: { label: "Featured", compare: null },
  "price-asc": { label: "Price: low to high", compare: (a, b) => a.price - b.price },
  "price-desc": { label: "Price: high to low", compare: (a, b) => b.price - a.price },
  newest: { label: "Newest first", compare: (a, b) => timeOf(b.createdAt) - timeOf(a.createdAt) },
};

const gridClass = "grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3.5 sm:grid-cols-[repeat(auto-fill,minmax(236px,1fr))] sm:gap-5";

export default function Home() {
  const products = useSelector(selectProducts);
  const catalogueStatus = useSelector(selectProductsStatus);
  const [params, setParams] = useSearchParams();

  const query = (params.get("q") ?? "").trim();
  const category = params.get("category") ?? "";
  const sort = SORTS[params.get("sort")] ? params.get("sort") : "featured";
  const { items, status, error, retry } = useProductSearch(query || category);

  const update = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
    setParams(next);
  };

  const categories = useMemo(() => {
    const counts = new Map();
    products.forEach((p) => counts.set(p.category, (counts.get(p.category) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [products]);

  const visible = useMemo(() => {
    const list = category ? items.filter((p) => p.category.toLowerCase() === category.toLowerCase()) : items;
    const { compare } = SORTS[sort];
    return compare ? [...list].sort(compare) : list;
  }, [items, category, sort]);

  const newest = useMemo(
    () => [...products].sort((a, b) => timeOf(b.createdAt) - timeOf(a.createdAt))[0],
    [products]
  );

  if (status === "error") {
    return (
      <Container>
        <StateBlock role="alert" icon="alert" title="Couldn't load products" text={error}>
          <Button onClick={retry}>Try again</Button>
        </StateBlock>
      </Container>
    );
  }

  const ready = status === "ready";
  const filtering = Boolean(query || category);
  const heading = query ? `Results for \u201c${query}\u201d` : category || "All products";

  return (
    <Container>
      {ready && !filtering && newest && <Hero product={newest} />}

      {catalogueStatus === "ready" && categories.length > 0 && (
        <div role="group" aria-label="Filter by category" className="flex gap-2 overflow-x-auto pb-3">
          <Chip active={!category} count={products.length} onClick={() => update({ category: "" })}>All</Chip>
          {categories.map(([name, count]) => (
            <Chip key={name} active={category.toLowerCase() === name.toLowerCase()} count={count} onClick={() => update({ category: name })}>
              {name}
            </Chip>
          ))}
        </div>
      )}

      <div className="mt-3 mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">{heading}</h2>
          {ready && <p className="text-ink-3">{visible.length} {visible.length === 1 ? "product" : "products"}</p>}
        </div>
        <label>
          <span className="sr-only">Sort products</span>
          <select
            value={sort}
            onChange={(event) => update({ sort: event.target.value === "featured" ? "" : event.target.value })}
            className="h-10.5 rounded-xl border border-line bg-surface px-3.5"
          >
            {Object.entries(SORTS).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </label>
      </div>

      {!ready ? (
        <div className={gridClass} aria-hidden="true">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="overflow-hidden rounded-[18px] border border-line bg-surface">
              <Skeleton className="aspect-4/3" />
              <div className="grid gap-2.5 p-4">
                <Skeleton className="h-4 w-1/2 rounded-lg" />
                <Skeleton className="h-4 rounded-lg" />
                <Skeleton className="h-4 w-1/2 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : visible.length === 0 ? (
        <StateBlock
          icon="search"
          title={filtering ? "Nothing matches that" : "No products yet"}
          text={filtering ? "Try a different search or clear the filters." : "Products added in the admin dashboard will show up here."}
        >
          {!filtering ? (
            <Button to="/admin/new">Add product</Button>
          ) : (
            <Button onClick={() => setParams({})}>Clear filters</Button>
          )}
        </StateBlock>
      ) : (
        <div className={gridClass}>
          {visible.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </Container>
  );
}

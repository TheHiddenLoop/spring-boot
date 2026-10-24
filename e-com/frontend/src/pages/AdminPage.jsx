import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Button, { IconButton } from "../components/ui/Button";
import Chip from "../components/ui/Chip";
import Container from "../components/ui/Container";
import Icon from "../components/ui/Icon";
import Pill from "../components/ui/Pill";
import Skeleton from "../components/ui/Skeleton";
import StateBlock from "../components/ui/StateBlock";
import DeleteDialog from "../components/DeleteDialog";
import ProductImage from "../components/ProductImage";
import useDebouncedValue from "../hooks/useDebouncedValue";
import useProductSearch from "../hooks/useProductSearch";
import { selectProducts } from "../store/productsSlice";
import { STATUS_LABEL, formatPrice, stockStatus, timeOf } from "../utils";

const TABS = [
  ["all", "All"],
  ["ok", "In stock"],
  ["low", "Low stock"],
  ["out", "Out of stock"],
];

const bucketOf = (product) => {
  const status = stockStatus(product);
  return status === "off" ? "out" : status;
};

const th = "px-4 py-3 font-semibold";
const mobileLabel = "text-ink-3 md:hidden";

export default function AdminPage() {
  const catalogue = useSelector(selectProducts);
  const [query, setQuery] = useState("");
  const term = useDebouncedValue(query.trim());
  const { items: products, status, error, retry } = useProductSearch(term);
  const [tab, setTab] = useState("all");
  const [toDelete, setToDelete] = useState(null);

  const counts = useMemo(() => {
    const result = { all: products.length, ok: 0, low: 0, out: 0 };
    products.forEach((product) => {
      result[bucketOf(product)] += 1;
    });
    return result;
  }, [products]);

  const rows = useMemo(
    () =>
      products
        .filter((p) => tab === "all" || bucketOf(p) === tab)
        .sort((a, b) => timeOf(b.createdAt) - timeOf(a.createdAt)),
    [products, tab]
  );

  return (
    <Container>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.7rem,3.4vw,2.3rem)] font-bold">Inventory</h1>
          <p className="mt-1 text-ink-3">Add, edit and remove the products shown in the store.</p>
        </div>
        <div className="flex gap-2.5">
          <Button to="/" variant="ghost">View store</Button>
          <Button to="/admin/new"><Icon name="plus" size={18} /> Add product</Button>
        </div>
      </div>

      {status === "error" ? (
        <StateBlock role="alert" icon="alert" title="Couldn't load products" text={error}>
          <Button onClick={retry}>Try again</Button>
        </StateBlock>
      ) : (
        <>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
            <div role="group" aria-label="Filter by stock" className="flex gap-2 overflow-x-auto">
              {TABS.map(([key, label]) => (
                <Chip key={key} active={tab === key} count={counts[key]} onClick={() => setTab(key)}>{label}</Chip>
              ))}
            </div>
            <div className="relative w-full sm:w-85">
              <Icon name="search" size={18} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-3" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter by name, brand or category"
                aria-label="Filter inventory"
                className="h-10.5 w-full rounded-xl border border-line bg-surface pr-4 pl-10.5 placeholder:text-ink-3 focus:border-accent focus:outline-none focus:ring-3 focus:ring-accent-soft"
              />
            </div>
          </div>

          {status !== "ready" ? (
            <Skeleton className="h-70 rounded-[20px]" />
          ) : rows.length === 0 ? (
            <StateBlock
              icon="box"
              title={catalogue.length === 0 ? "No products yet" : "Nothing matches"}
              text={catalogue.length === 0 ? "Add your first product to fill the store." : "Try another filter or search."}
            >
              {catalogue.length === 0 && <Button to="/admin/new">Add product</Button>}
            </StateBlock>
          ) : (
            <div className="overflow-x-auto rounded-[20px] border border-line bg-surface">
              <table className="w-full border-collapse">
                <thead className="max-md:hidden">
                  <tr className="border-b border-line bg-surface-2 text-left text-sm text-ink-3">
                    <th scope="col" className={th}>Product</th>
                    <th scope="col" className={th}>Category</th>
                    <th scope="col" className={`${th} text-right`}>Price</th>
                    <th scope="col" className={`${th} text-right`}>Stock</th>
                    <th scope="col" className={th}>Status</th>
                    <th scope="col" className={th}><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((product) => {
                    const state = stockStatus(product);
                    return (
                      <tr key={product.id} className="border-b border-line last:border-b-0 max-md:flex max-md:flex-wrap max-md:items-center max-md:gap-x-4 max-md:gap-y-1 max-md:px-4 max-md:py-3.5">
                        <td className="px-4 py-3 max-md:basis-full max-md:p-0">
                          <div className="flex items-center gap-3 md:min-w-60">
                            <span className="relative size-13 flex-none overflow-hidden rounded-xl"><ProductImage product={product} /></span>
                            <span className="grid min-w-0">
                              <Link to={`/product/${product.id}`} className="font-semibold hover:text-accent">{product.name}</Link>
                              <small className="text-ink-3">{product.brand}</small>
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 max-md:p-0"><span className={mobileLabel}>Category: </span>{product.category}</td>
                        <td className="px-4 py-3 tabular-nums max-md:p-0 md:text-right"><span className={mobileLabel}>Price: </span>{formatPrice(product.price)}</td>
                        <td className="px-4 py-3 tabular-nums max-md:p-0 md:text-right"><span className={mobileLabel}>Stock: </span>{product.stock}</td>
                        <td className="px-4 py-3 max-md:p-0"><Pill tone={state}>{STATUS_LABEL[state]}</Pill></td>
                        <td className="px-4 py-3 max-md:basis-full max-md:p-0 max-md:pt-1">
                          <div className="flex items-center gap-2 whitespace-nowrap md:justify-end">
                            <Button to={`/admin/edit/${product.id}`} variant="ghost" size="sm" aria-label={`Edit ${product.name}`}>
                              <Icon name="pencil" size={16} /> Edit
                            </Button>
                            <IconButton danger className="size-9.5" onClick={() => setToDelete(product)} aria-label={`Delete ${product.name}`}>
                              <Icon name="trash" size={18} />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {toDelete && <DeleteDialog product={toDelete} onClose={() => setToDelete(null)} />}
    </Container>
  );
}

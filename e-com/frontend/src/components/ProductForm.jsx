import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Button from "./ui/Button";
import Field, { inputClass } from "./ui/Field";
import Icon from "./ui/Icon";
import { saveProduct, selectProducts } from "../store/productsSlice";
import { notify } from "../store/uiSlice";

const EMPTY = { name: "", brand: "", description: "", price: "", category: "", quantity: "", available: true };

const toValues = (product) => ({
  name: product.name,
  brand: product.brand,
  description: product.description,
  price: String(product.price),
  category: product.category,
  quantity: String(product.stock),
  available: product.available,
});

export default function ProductForm({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector(selectProducts);
  const editing = Boolean(product);
  const [values, setValues] = useState(product ? toValues(product) : EMPTY);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const categories = useMemo(() => [...new Set(products.map((p) => p.category))].sort(), [products]);

  useEffect(() => {
    if (!image) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const change = (event) => setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  const shownImage = preview || product?.imageUrl || "";

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!(Number(values.price) > 0)) {
      setError("Enter a price greater than 0.");
      return;
    }
    if (values.quantity === "" || !(Number(values.quantity) >= 0)) {
      setError("Enter how many units are in stock.");
      return;
    }

    const clean = {
      ...values,
      name: values.name.trim(),
      brand: values.brand.trim(),
      category: values.category.trim(),
    };
    setSaving(true);
    try {
      await dispatch(saveProduct({ id: product?.id, values: clean, image, imageUrl: product?.imageUrl })).unwrap();
      dispatch(notify(editing ? `${clean.name} updated` : `${clean.name} added to the store`));
      navigate("/admin");
    } catch (message) {
      setError(String(message));
      setSaving(false);
    }
  };

  return (
    <>
      <Link to="/admin" className="mb-4 inline-flex items-center gap-1.5 font-medium text-ink-2 hover:text-accent">
        <Icon name="back" size={18} /> Inventory
      </Link>
      <h1 className="mb-5 text-[clamp(1.7rem,3.4vw,2.3rem)] font-bold">{editing ? "Edit product" : "Add product"}</h1>

      <form onSubmit={submit} className="grid gap-5 rounded-[22px] border border-line bg-surface p-5 sm:grid-cols-2 sm:p-8">
        <Field label="Product name" htmlFor="name">
          <input id="name" name="name" required value={values.name} onChange={change} placeholder="iPhone 16" className={inputClass} />
        </Field>
        <Field label="Brand" htmlFor="brand">
          <input id="brand" name="brand" required value={values.brand} onChange={change} placeholder="Apple" className={inputClass} />
        </Field>
        <Field label="Description" htmlFor="description" full>
          <textarea id="description" name="description" rows={3} value={values.description} onChange={change} placeholder="One or two lines on what makes it worth buying" className={`${inputClass} resize-y`} />
        </Field>
        <Field label="Price (₹)" htmlFor="price">
          <input id="price" name="price" type="number" min="1" step="any" inputMode="decimal" required value={values.price} onChange={change} placeholder="79999" className={inputClass} />
        </Field>
        <Field label="Units in stock" htmlFor="quantity">
          <input id="quantity" name="quantity" type="number" min="0" step="1" inputMode="numeric" required value={values.quantity} onChange={change} placeholder="15" className={inputClass} />
        </Field>
        <Field label="Category" htmlFor="category" full>
          <input id="category" name="category" list="category-options" required value={values.category} onChange={change} placeholder="Pick one or type a new category" className={inputClass} />
          <datalist id="category-options">
            {categories.map((category) => <option key={category} value={category} />)}
          </datalist>
        </Field>

        <div className="grid content-start gap-1.5 sm:col-span-2">
          <span className="text-[0.95rem] font-semibold">Product image</span>
          <label
            className={`relative grid cursor-pointer place-items-center gap-1 overflow-hidden rounded-2xl border-[1.5px] bg-surface-2 text-center focus-within:border-accent hover:border-accent ${
              shownImage ? "border-line" : "min-h-44 border-dashed border-ink-3 p-5"
            }`}
          >
            <input type="file" accept="image/*" onChange={(event) => setImage(event.target.files?.[0] ?? null)} className="absolute inset-0 cursor-pointer opacity-0" />
            {shownImage ? (
              <img src={shownImage} alt="Product preview" className="max-h-70 w-full bg-white object-contain" />
            ) : (
              <>
                <Icon name="upload" size={30} className="text-ink-3" />
                <strong>Choose an image</strong>
                <small className="text-ink-3">PNG or JPG. Optional, a placeholder is shown without one.</small>
              </>
            )}
          </label>
          {editing && product.imageUrl && !image && <p className="text-ink-3">Current image. Choose a file to replace it.</p>}
          {image && (
            <button type="button" onClick={() => setImage(null)} className="inline-flex items-center gap-1.5 justify-self-start py-1 text-sm font-medium text-ink-2 hover:text-bad">
              <Icon name="trash" size={16} /> {editing ? "Keep current image" : "Remove image"}
            </button>
          )}
        </div>

        <label className="inline-flex cursor-pointer items-center gap-3 font-medium sm:col-span-2">
          <input
            type="checkbox"
            checked={values.available}
            onChange={(event) => setValues((prev) => ({ ...prev, available: event.target.checked }))}
            className="peer sr-only"
          />
          <span className="relative h-6.5 w-11 flex-none rounded-full bg-line transition-colors after:absolute after:top-[3px] after:left-[3px] after:size-5 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-accent peer-checked:after:translate-x-[18px] peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent" />
          <span>Available for purchase</span>
        </label>

        {error && (
          <p role="alert" className="flex items-center gap-2 rounded-xl bg-bad-soft px-3.5 py-2.5 font-medium text-bad sm:col-span-2">
            <Icon name="alert" size={18} /> {error}
          </p>
        )}

        <div className="flex justify-end gap-3 sm:col-span-2">
          <Button variant="ghost" onClick={() => navigate("/admin")} disabled={saving}>Cancel</Button>
          <Button type="submit" size="lg" disabled={saving}>{saving ? "Saving\u2026" : editing ? "Save changes" : "Add product"}</Button>
        </div>
      </form>
    </>
  );
}

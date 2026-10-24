import { useState } from "react";
import { useDispatch } from "react-redux";
import Button from "./ui/Button";
import Modal from "./ui/Modal";
import { deleteProduct } from "../store/productsSlice";
import { notify } from "../store/uiSlice";

export default function DeleteDialog({ product, onClose }) {
  const dispatch = useDispatch();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const confirm = async () => {
    setDeleting(true);
    setError("");
    try {
      await dispatch(deleteProduct(product.id)).unwrap();
      dispatch(notify(`${product.name} deleted`));
      onClose();
    } catch (message) {
      setError(String(message));
      setDeleting(false);
    }
  };

  return (
    <Modal onClose={onClose} locked={deleting} role="alertdialog" labelledBy="delete-title" className="max-w-105">
      <div className="grid gap-3">
        <h2 id="delete-title" className="text-2xl font-bold">Delete {product.name}?</h2>
        <p className="text-ink-3">It will be removed from the store and from any cart that has it. This can&apos;t be undone.</p>
        {error && <p role="alert" className="font-medium text-bad">{error}</p>}
        <div className="mt-2 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={deleting}>Cancel</Button>
          <Button variant="danger" onClick={confirm} disabled={deleting}>{deleting ? "Deleting\u2026" : "Delete product"}</Button>
        </div>
      </div>
    </Modal>
  );
}

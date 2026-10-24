import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import Skeleton from "../components/ui/Skeleton";
import StateBlock from "../components/ui/StateBlock";
import ProductForm from "../components/ProductForm";
import {
  fetchProducts,
  selectProductById,
  selectProductsError,
  selectProductsStatus,
} from "../store/productsSlice";

export default function ProductFormPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = useSelector(selectProductById(id));
  const status = useSelector(selectProductsStatus);
  const error = useSelector(selectProductsError);

  let content;
  if (!id) {
    content = <ProductForm />;
  } else if (product) {
    content = <ProductForm key={product.id} product={product} />;
  } else if (status === "idle" || status === "loading") {
    content = <Skeleton className="h-96 rounded-[22px]" />;
  } else if (status === "error") {
    content = (
      <StateBlock role="alert" icon="alert" title="Couldn't load products" text={error}>
        <Button onClick={() => dispatch(fetchProducts())}>Try again</Button>
      </StateBlock>
    );
  } else {
    content = (
      <StateBlock role="alert" icon="alert" title="Product not found" text="It may have been deleted.">
        <Button to="/admin">Back to inventory</Button>
      </StateBlock>
    );
  }

  return <Container className="max-w-190">{content}</Container>;
}

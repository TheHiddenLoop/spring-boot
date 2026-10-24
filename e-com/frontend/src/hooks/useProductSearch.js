import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  selectProducts,
  selectProductsError,
  selectProductsStatus,
} from "../store/productsSlice";
import { searchProducts } from "../store/searchSlice";

export default function useProductSearch(term) {
  const dispatch = useDispatch();
  const catalogue = useSelector(selectProducts);
  const catalogueStatus = useSelector(selectProductsStatus);
  const catalogueError = useSelector(selectProductsError);
  const results = useSelector((state) => state.search.results);

  useEffect(() => {
    if (!term) return;
    const request = dispatch(searchProducts(term));
    return () => request.abort();
  }, [dispatch, term]);

  if (!term) {
    return {
      items: catalogue,
      status: catalogueStatus,
      error: catalogueError,
      retry: () => dispatch(fetchProducts()),
    };
  }

  const current = results.query === term;
  return {
    items: current ? results.items : [],
    status: current ? results.status : "loading",
    error: current ? results.error : "",
    retry: () => dispatch(searchProducts(term)),
  };
}

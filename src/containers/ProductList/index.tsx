import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import "./index.scss";
const API_URL = "https://dummyjson.com/products";
const PAGE_LIMIT = 20;

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnail: string;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

const useIntersectionObserver = (
  callback: () => void,
  options: IntersectionObserverInit,
) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  useEffect(() => {
    const node = targetRef.current;
    if (!node) {
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        callbackRef.current();
      }
    }, options);
    observer.observe(node);

    return () => observer.disconnect();
  }, [options]);

  return targetRef;
};

interface ProductListProps {
  products: Product[];
  onLoadMore: () => void;
  loading: boolean;
  error: string;
  hasMore: boolean;
}

const ProductList = ({
  products,
  onLoadMore,
  loading,
  error,
}: ProductListProps) => {
  const options = useMemo<IntersectionObserverInit>(
    () => ({
      root: null,
      rootMargin: "200px",
      threshold: 0,
    }),
    [],
  );

  const sentinelRef = useIntersectionObserver(onLoadMore, options);
  return (
    <>
      {loading && (
        <p role="status" className="status">
          {" "}
          Loading Products...
        </p>
      )}
      {error && (
        <div className="status" role="alert">
          <p>{error}</p>
          <button type="button" onClick={onLoadMore} disabled={loading}>
            Retry
          </button>
        </div>
      )}
      <ul className="product-grid">
        {products.map((product) => (
          <li className="product-card" key={product.id}>
            <img
              src={product.thumbnail}
              alt={product.title}
              loading="lazy"
              width="240"
              height="180"
            />

            <div className="product-info">
              <span className="product-category">{product.category}</span>
              <h2>{product.title}</h2>
              <p>{product.description}</p>
              <strong>${product.price.toFixed(2)}</strong>
            </div>
          </li>
        ))}
      </ul>
      <div ref={sentinelRef} aria-hidden="true" />
    </>
  );
};
const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const skipRef = useRef<number>(0);
  const loadingRef = useRef<boolean>(false);
  const getProducts = useCallback(async () => {
    if (loadingRef.current || !hasMore) {
      return;
    }
    loadingRef.current = true;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${API_URL}?limit=${PAGE_LIMIT}&skip=${skipRef.current}`,
      );
      if (!res.ok) {
        throw new Error(`Request failed : ${res.status}`);
      }
      const data: ProductsResponse = await res.json();
      setProducts((prev) => [...prev, ...data.products]);
      skipRef.current += data.products.length;
      setHasMore(skipRef.current < data.total);
    } catch (err) {
      setError((err as Error).message || "Unable to load products");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [hasMore]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return (
    <>
      <ProductList
        products={products}
        onLoadMore={getProducts}
        loading={loading}
        error={error}
        hasMore={hasMore}
      />
    </>
  );
};
export default ProductPage;

import { useEffect, useState, useMemo } from "react";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import SearchBar from "../components/SearchBar";
import { useCart } from "../context/CartContext";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [modalProduct, setModalProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    setError(null);

    const url =
      selectedCategory === "all"
        ? "https://dummyjson.com/products?limit=100"
        : `https://dummyjson.com/products/category/${selectedCategory}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load products");
        return res.json();
      })
      .then((data) => {
        setProducts(data.products || []);
      })
      .catch((err) => setError(err.message || "Failed to fetch products"))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const filtered = useMemo(() => {
    if (!query.trim()) return products;
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }, [products, query]);

  const categories = [
    "all",
    "smartphones",
    "laptops",
    "mobile-accessories",
    "tablets",
    "fragrances",
  ];

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>All Products</h1>
        <SearchBar value={query} onChange={setQuery} />
      </div>

      <div className="products-controls">
        <div className="category-filter">
          <label htmlFor="category-select">Category:</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace("-", " ").toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <p className="products-count">{filtered.length} products found</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : filtered.length === 0 ? (
        <div className="no-results">No products found matching your search.</div>
      ) : (
        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onView={() => setModalProduct(product)}
            />
          ))}
        </div>
      )}

      {modalProduct && (
        <ProductModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
          onAddToCart={() => {
            addToCart(modalProduct);
            setModalProduct(null);
          }}
        />
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { formatINR } from "../utils/currency";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("title");

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch("https://dummyjson.com/products?limit=100")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load products");
        return res.json();
      })
      .then((data) => setProducts(data.products || []))
      .catch((err) => setError(err.message || "Failed to fetch products"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleEdit = (id) => {
    alert(`Edit product ${id} - Not implemented yet`);
  };

  const handleAddProduct = () => {
    alert("Add product - Not implemented yet");
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "title") return a.title.localeCompare(b.title);
    if (sortBy === "price") return a.price - b.price;
    if (sortBy === "stock") return (b.stock || 0) - (a.stock || 0);
    return 0;
  });

  const filteredProducts =
    filter === "all"
      ? sortedProducts
      : sortedProducts.filter((p) => p.category === filter);

  const categories = ["all", ...new Set(products.map((p) => p.category))];

  const stats = {
    total: products.length,
    outOfStock: products.filter((p) => p.stock === 0 || !p.stock).length,
    totalValue: products.reduce((sum, p) => sum + p.price * (p.stock || 0), 0),
    avgPrice: products.length > 0
      ? products.reduce((sum, p) => sum + p.price, 0) / products.length
      : 0,
  };

  if (loading) return <div className="loading">Loading admin panel...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="primary-button" onClick={handleAddProduct}>
          + Add Product
        </button>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Products</h3>
          <p className="stat-value">{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Out of Stock</h3>
          <p className="stat-value">{stats.outOfStock}</p>
        </div>
        <div className="stat-card">
          <h3>Average Price</h3>
          <p className="stat-value">{formatINR(stats.avgPrice)}</p>
        </div>
        <div className="stat-card">
          <h3>Inventory Value</h3>
          <p className="stat-value">{formatINR(stats.totalValue)}</p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-controls">
        <div className="control-group">
          <label htmlFor="category-filter">Filter by Category:</label>
          <select
            id="category-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="sort-by">Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="title">Title</option>
            <option value="price">Price</option>
            <option value="stock">Stock</option>
          </select>
        </div>

        <p className="results-count">{filteredProducts.length} products</p>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className={product.stock === 0 ? "out-of-stock" : ""}>
                <td>{product.id}</td>
                <td className="title-cell">{product.title}</td>
                <td>{product.category}</td>
                <td>{formatINR(product.price)}</td>
                <td className={product.stock === 0 ? "zero-stock" : ""}>
                  {product.stock || 0}
                </td>
                <td>
                  <span className="rating-badge">{product.rating || "N/A"}</span>
                </td>
                <td className="actions-cell">
                  <button
                    className="action-button edit"
                    onClick={() => handleEdit(product.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="action-button delete"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

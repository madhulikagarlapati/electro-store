import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatINR } from "../utils/currency";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) {
      navigate("/products");
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`https://dummyjson.com/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => setProduct(data))
      .catch((err) => setError(err.message || "Failed to load product"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert(`Added ${quantity} item(s) to cart`);
  };

  if (loading) return <div className="loading">Loading product details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!product) return <div className="error-message">Product not found</div>;

  return (
    <div className="product-details-page">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>

      <div className="product-details-container">
        <div className="product-details-gallery">
          <img
            src={product.thumbnail || product.images?.[0]}
            alt={product.title}
            className="main-image"
          />
          {product.images && product.images.length > 1 && (
            <div className="thumbnail-gallery">
              {product.images.slice(0, 4).map((img, idx) => (
                <img key={idx} src={img} alt={`${product.title} ${idx}`} />
              ))}
            </div>
          )}
        </div>

        <div className="product-details-info">
          <h1>{product.title}</h1>
          <p className="product-brand">{product.brand || "Unknown Brand"}</p>
          <p className="product-category">{product.category}</p>

          <div className="product-rating">
            <span className="stars">★★★★★</span>
            <span className="rating-text">{product.rating || "4.5"} / 5</span>
            <span className="review-count">({product.reviews?.length || 0} reviews)</span>
          </div>

          <div className="product-price">
            <span className="price-label">Price:</span>
            <span className="price-value">{formatINR(product.price)}</span>
            <span className="discount">-{product.discountPercentage}% off</span>
          </div>

          <p className="product-description">{product.description}</p>

          <div className="product-details-meta">
            <div className="meta-item">
              <span className="meta-label">SKU:</span>
              <span>SKU-{String(product.id).padStart(4, "0")}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Stock:</span>
              <span>{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Delivery:</span>
              <span>2–4 business days</span>
            </div>
          </div>

          <div className="product-actions">
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <input
                id="quantity"
                type="number"
                min="1"
                max={product.stock || 10}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>
            <button
              className="primary-button"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      {product.reviews && product.reviews.length > 0 && (
        <div className="product-reviews">
          <h2>Customer Reviews</h2>
          <ul className="reviews-list">
            {product.reviews.slice(0, 3).map((review, idx) => (
              <li key={idx} className="review-item">
                <div className="review-header">
                  <strong>{review.reviewerName}</strong>
                  <span className="review-rating">★ {review.rating}</span>
                </div>
                <p className="review-text">{review.comment}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

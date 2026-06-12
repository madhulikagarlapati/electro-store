import React from "react";
import { useCart } from "../context/CartContext";
import { formatINR } from "../utils/currency";

export default function ProductCard({ product, onView }) {
  const { addToCart } = useCart();
  const sku = `SKU-${String(product.id).padStart(4, "0")}`;
  const delivery = "2–4 business days";

  return (
    <article className="product-card">
      <figure>
        <img src={product.thumbnail || product.images?.[0]} alt={product.title} />
        <figcaption>{product.brand || product.category}</figcaption>
      </figure>
      <div className="product-card-body">
        <h3 title={product.title}>{product.title}</h3>
        <p>{product.description}</p>
        <div className="product-card-meta">
          <span className="meta-code">{sku}</span>
          <span className="meta-delivery">Delivery: {delivery}</span>
        </div>
        <div className="product-card-footer">
          <span>{formatINR(product.price)}</span>
          <div className="card-actions">
            <button type="button" onClick={() => onView?.(product)}>
              View details
            </button>
            <button type="button" className="primary-button small" onClick={() => addToCart(product)}>
              Add — {formatINR(product.price)}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

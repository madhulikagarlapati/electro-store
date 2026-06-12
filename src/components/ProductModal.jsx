import React from "react";
import { formatINR } from "../utils/currency";

export default function ProductModal({ product, onClose, onAdd }) {
  if (!product) return null;

  const image = product.thumbnail || product.images?.[0];
  const sku = `SKU-${String(product.id).padStart(4, "0")}`;
  const delivery = "2–4 business days";

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="modal-body">
          <div className="modal-media">
            <img src={image} alt={product.title} />
          </div>
          <div className="modal-content">
            <h3>{product.title}</h3>
            <div className="modal-meta">
              <span>Code: {sku}</span>
              <span>Delivery: {delivery}</span>
            </div>
            <p className="modal-price">{formatINR(product.price)}</p>
            <p className="modal-desc">{product.description}</p>
            <div className="modal-actions">
              <button className="primary-button" onClick={() => onAdd(product)}>
                Add to cart — {formatINR(product.price)}
              </button>
              <button className="secondary-button" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

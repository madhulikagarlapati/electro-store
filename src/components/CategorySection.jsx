import React from "react";
import ProductCard from "./ProductCard";

export default function CategorySection({ title, items = [], onView }) {
  return (
    <section className="category-section" aria-labelledby={`${title}-heading`}>
      <div className="section-header">
        <div>
          <p className="eyebrow">{title}</p>
          <h2 id={`${title}-heading`}>{title}</h2>
        </div>
        <p className="section-copy">Latest & popular {title.toLowerCase()}.</p>
      </div>

      {items.length === 0 ? (
        <p className="status-text">No items found.</p>
      ) : (
        <div className="product-grid">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} onView={onView} />
          ))}
        </div>
      )}
    </section>
  );
}

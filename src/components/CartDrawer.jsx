import React from "react";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import { formatINR } from "../utils/currency";

export default function CartDrawer({ open, onClose }) {
  const { items, removeFromCart, clearCart } = useCart();

  const total = items.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0);
  const { createOrder } = useOrders();

  return (
    <div className={`cart-drawer ${open ? "open" : ""}`} role="dialog" aria-hidden={!open}>
      <div className="drawer-inner">
        <header className="drawer-header">
          <h3>Your cart</h3>
          <button onClick={onClose} className="modal-close">✕</button>
        </header>

        <div className="drawer-body">
          {items.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul className="cart-list">
              {items.map((it) => (
                <li key={it.id} className="cart-item">
                  <img src={it.thumbnail || it.images?.[0]} alt={it.title} />
                  <div>
                    <div className="cart-item-title">{it.title}</div>
                    <div className="cart-item-meta">
                      Code: SKU-{String(it.id).padStart(4, "0")} · Qty: {it.qty} · {formatINR(it.price)}
                    </div>
                    <div className="cart-item-meta">Delivery: 2–4 business days · Subtotal: {formatINR((it.price || 0) * (it.qty || 1))}</div>
                  </div>
                  <button className="secondary-button" onClick={() => removeFromCart(it.id)}>Remove</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="drawer-footer">
          <div className="drawer-total">Total: <strong>{formatINR(total)}</strong></div>
          <div className="drawer-actions">
            <button className="secondary-button" onClick={clearCart}>Clear</button>
            <button
              className="primary-button"
              onClick={() => {
                if (items.length === 0) return;
                const order = createOrder(items);
                clearCart();
                // open orders drawer by dispatching event (App will handle)
                window.dispatchEvent(new CustomEvent("es:order-created", { detail: order }));
                alert(`Order placed — ID: ${order.id}`);
              }}
            >
              Checkout
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

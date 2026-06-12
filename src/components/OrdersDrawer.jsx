import React, { useEffect } from "react";
import { useOrders } from "../context/OrderContext";
import { formatINR } from "../utils/currency";

export default function OrdersDrawer({ open, onClose, initialOrderId }) {
  const { orders } = useOrders();

  useEffect(() => {
    if (!open && initialOrderId) {
      // noop
    }
  }, [open, initialOrderId]);

  return (
    <div className={`cart-drawer ${open ? "open" : ""}`} role="dialog" aria-hidden={!open}>
      <div className="drawer-inner">
        <header className="drawer-header">
          <h3>Orders</h3>
          <button onClick={onClose} className="modal-close">✕</button>
        </header>

        <div className="drawer-body">
          {orders.length === 0 ? (
            <p>No orders yet.</p>
          ) : (
            <ul className="cart-list">
              {orders.map((o) => (
                  <li key={o.id} className="cart-item">
                    <div style={{ flex: 1 }}>
                      <div className="cart-item-title">Order #{o.id}</div>
                      <div className="cart-item-meta">{new Date(o.date).toLocaleString()}</div>
                      <div style={{ marginTop: 6 }}>Items: {o.items.length} · Total: {formatINR(o.total)}</div>
                      <details style={{ marginTop: 8 }}>
                        <summary>View items</summary>
                        <ul>
                          {o.items.map((it) => (
                            <li key={it.id} style={{ marginTop: 8 }}>
                              <strong>{it.title}</strong><br />
                              Code: SKU-{String(it.id).padStart(4, "0")} · Qty: {it.qty} · {formatINR(it.price)}<br />
                              Delivery: 2–4 business days
                            </li>
                          ))}
                        </ul>
                      </details>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>

        <footer className="drawer-footer">
          <div className="drawer-actions">
            <button className="secondary-button" onClick={onClose}>Close</button>
          </div>
        </footer>
      </div>
    </div>
  );
}

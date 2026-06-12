import { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import { formatINR } from "../utils/currency";

export default function Cart() {
  const { items, removeFromCart, clearCart } = useCart();
  const { createOrder } = useOrders();

  const total = items.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0);

  const handleCheckout = () => {
    if (items.length === 0) {
      alert("Your cart is empty");
      return;
    }

    const order = createOrder(items);
    clearCart();
    window.dispatchEvent(new CustomEvent("es:order-created", { detail: order }));
    alert(`Order placed successfully! Order ID: ${order.id}`);
  };

  const handleQuantityChange = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
    } else {
      // Note: CartContext doesn't have updateQuantity, so we remove and re-add
      removeFromCart(id);
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <h1>Your Cart</h1>
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <p>Start shopping to add items to your cart.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      <div className="cart-container">
        <div className="cart-items-section">
          <h2>Cart Items ({items.length})</h2>
          <ul className="cart-items-list">
            {items.map((item) => (
              <li key={item.id} className="cart-item-full">
                <img
                  src={item.thumbnail || item.images?.[0]}
                  alt={item.title}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{item.title}</h3>
                  <p className="item-sku">SKU: SKU-{String(item.id).padStart(4, "0")}</p>
                  <p className="item-price">{formatINR(item.price)}</p>
                </div>
                <div className="cart-item-quantity">
                  <label htmlFor={`qty-${item.id}`}>Qty:</label>
                  <span>{item.qty}</span>
                </div>
                <div className="cart-item-subtotal">
                  <p className="subtotal-label">Subtotal</p>
                  <p className="subtotal-value">
                    {formatINR((item.price || 0) * (item.qty || 1))}
                  </p>
                </div>
                <button
                  className="remove-button"
                  onClick={() => removeFromCart(item.id)}
                  aria-label={`Remove ${item.title}`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="cart-summary-section">
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatINR(total)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>Included</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>{formatINR(total)}</span>
              </div>
            </div>

            <div className="cart-actions">
              <button className="primary-button" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
              <button className="secondary-button" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          </div>

          <div className="shipping-info">
            <h3>Shipping Information</h3>
            <ul>
              <li>✓ Free shipping on all orders</li>
              <li>✓ Delivery in 2-4 business days</li>
              <li>✓ Easy returns within 30 days</li>
              <li>✓ Secure checkout</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

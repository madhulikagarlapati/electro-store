import React from "react";

export default function Header({ user, onToggleCart, cartCount, onToggleOrders, theme, onToggleTheme }) {
  return (
    <header className="site-top">
      <div className="site-top-inner">
        <div className="brand">
          <img src="/favicon.svg" alt="Electronic Store logo" className="brand-logo" />
          <div>
            <strong className="brand-name">Electronic Store</strong>
            <div className="brand-tag">Electronics · Gadgets · Accessories</div>
          </div>
        </div>

        <div className="top-actions">
          <button className="secondary-button" onClick={onToggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
          {user && (
            <>
              <button className="secondary-button" onClick={onToggleOrders} aria-label="Open orders">
                Orders
              </button>
              <button className="secondary-button" onClick={onToggleCart} aria-label="Open cart">
                Cart <span className="cart-count">{cartCount}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

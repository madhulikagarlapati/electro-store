
import { useEffect, useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { CartProvider, useCart } from "./context/CartContext";
import Header from "./components/Header";
import CartDrawer from "./components/CartDrawer";
import OrdersDrawer from "./components/OrdersDrawer";
import { OrderProvider } from "./context/OrderContext";

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("es_theme") || "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    document.body.classList.toggle("light-theme", theme === "light");
    try {
      localStorage.setItem("es_theme", theme);
    } catch {}
  }, [theme]);

  const handleLogin = (profile) => {
    setUser(profile);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <CartProvider>
      <OrderProvider>
        <AppInner
          user={user}
          onLogin={handleLogin}
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
        />
      </OrderProvider>
    </CartProvider>
  );
}

export default App;

function AppInner({ user, onLogin, onLogout, theme, onToggleTheme }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const { items } = useCart();

  // Open orders drawer when an order is created elsewhere
  useEffect(() => {
    const handler = (e) => setOrdersOpen(true);
    window.addEventListener("es:order-created", handler);
    return () => window.removeEventListener("es:order-created", handler);
  }, []);

  return (
    <>
      <Header user={user} onToggleCart={() => setDrawerOpen((s) => !s)} onToggleOrders={() => setOrdersOpen((s) => !s)} cartCount={items.length} theme={theme} onToggleTheme={onToggleTheme} />
      {user ? <Home user={user} onLogout={onLogout} /> : <Login onLogin={onLogin} />}
      {user && <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />}
      {user && <OrdersDrawer open={ordersOpen} onClose={() => setOrdersOpen(false)} />}
    </>
  );
}
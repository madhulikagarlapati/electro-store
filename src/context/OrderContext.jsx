import { createContext, useContext, useEffect, useState } from "react";

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    try {
      const raw = localStorage.getItem("es_orders");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("es_orders", JSON.stringify(orders));
    } catch {}
  }, [orders]);

  const createOrder = (items) => {
    const total = items.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0);
    const order = {
      id: Date.now(),
      items,
      total,
      date: new Date().toISOString(),
      status: "placed",
    };
    setOrders((prev) => [order, ...prev]);
    return order;
  };

  return <OrderContext.Provider value={{ orders, createOrder }}>{children}</OrderContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
}

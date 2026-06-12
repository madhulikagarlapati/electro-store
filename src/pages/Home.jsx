import { useEffect, useState, useMemo } from "react";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import { useCart } from "../context/CartContext";
import CategorySection from "../components/CategorySection";
import SkeletonCard from "../components/SkeletonCard";

function Home({ user, onLogout }) {
  const [categories, setCategories] = useState({
    smartphones: [],
    laptops: [],
    mobileAccessories: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const endpoints = {
      smartphones: "https://dummyjson.com/products/category/smartphones",
      laptops: "https://dummyjson.com/products/category/laptops",
      mobileAccessories: "https://dummyjson.com/products/category/mobile-accessories",
    };

    Promise.all(
      Object.entries(endpoints).map(([key, url]) =>
        fetch(url)
          .then((res) => {
            if (!res.ok) throw new Error(`Failed to load ${key}`);
            return res.json();
          })
          .then((data) => ({ key, items: data.products || [] }))
      )
    )
      .then((results) => {
        const next = { smartphones: [], laptops: [], mobileAccessories: [] };
        results.forEach(({ key, items }) => {
          if (key === "mobileAccessories" || key === "mobile-accessories") {
            next.mobileAccessories = items;
          } else if (key === "smartphones") {
            next.smartphones = items;
          } else if (key === "laptops") {
            next.laptops = items;
          }
        });
        setCategories(next);
      })
      .catch((err) => setError(err.message || "Failed to fetch categories"))
      .finally(() => setLoading(false));
  }, []);

  const [activeTab, setActiveTab] = useState("all");
  const [visible, setVisible] = useState({ smartphones: 6, laptops: 6, mobileAccessories: 6 });
  const [modalProduct, setModalProduct] = useState(null);
  const { addToCart, items: cartItems } = useCart();

  const filtered = categories;

  return (
    <div className="home-page">
      <header className="site-header home-header">
        <div>
          <p className="eyebrow">Electronic Store</p>
          <h1>Electronics for every room.</h1>
        </div>

        <div className="user-panel">
          <p>Signed in as <strong>{user.username}</strong></p>
          <button type="button" onClick={onLogout} className="secondary-button">
            Logout
          </button>
        </div>
      </header>

      <main>
        <section className="hero-block">
          <div className="hero-content">
            <div className="hero-image">
              <img src="/hero.png" alt="Premium headphones" />
            </div>
          </div>
        </section>

        <div className="tabs">
          <button className={activeTab === "all" ? "active" : ""} onClick={() => setActiveTab("all")}>
            All
          </button>
          <button className={activeTab === "smartphones" ? "active" : ""} onClick={() => setActiveTab("smartphones")}>
            Smartphones
          </button>
          <button className={activeTab === "laptops" ? "active" : ""} onClick={() => setActiveTab("laptops")}>
            Laptops
          </button>
          <button className={activeTab === "accessories" ? "active" : ""} onClick={() => setActiveTab("accessories")}>
            Accessories
          </button>
        </div>

        {error && <p className="status-text error">{error}</p>}
        {loading && (
          <section className="category-section">
            <div className="section-header">
              <div>
                <p className="eyebrow">Loading...</p>
                <h2>Products</h2>
              </div>
            </div>
            <div className="product-grid">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </section>
        )}

        {!loading && !error && (
          <>
            {activeTab === "all" || activeTab === "smartphones" ? (
              <section>
                <CategorySection
                  title="Smartphones"
                  items={filtered.smartphones.slice(0, visible.smartphones)}
                  onView={(p) => setModalProduct(p)}
                />
                {filtered.smartphones.length > visible.smartphones && (
                  <div className="load-more-wrap">
                    <button onClick={() => setVisible((v) => ({ ...v, smartphones: v.smartphones + 6 }))} className="secondary-button">
                      Load more smartphones
                    </button>
                  </div>
                )}
              </section>
            ) : null}

            {activeTab === "all" || activeTab === "laptops" ? (
              <section>
                <CategorySection
                  title="Laptops"
                  items={filtered.laptops.slice(0, visible.laptops)}
                  onView={(p) => setModalProduct(p)}
                />
                {filtered.laptops.length > visible.laptops && (
                  <div className="load-more-wrap">
                    <button onClick={() => setVisible((v) => ({ ...v, laptops: v.laptops + 6 }))} className="secondary-button">
                      Load more laptops
                    </button>
                  </div>
                )}
              </section>
            ) : null}

            {activeTab === "all" || activeTab === "accessories" ? (
              <section>
                <CategorySection
                  title="Mobile accessories"
                  items={filtered.mobileAccessories.slice(0, visible.mobileAccessories)}
                  onView={(p) => setModalProduct(p)}
                />
                {filtered.mobileAccessories.length > visible.mobileAccessories && (
                  <div className="load-more-wrap">
                    <button onClick={() => setVisible((v) => ({ ...v, mobileAccessories: v.mobileAccessories + 6 }))} className="secondary-button">
                      Load more accessories
                    </button>
                  </div>
                )}
              </section>
            ) : null}
          </>
        )}

        {modalProduct && (
          <ProductModal
            product={modalProduct}
            onClose={() => setModalProduct(null)}
            onAdd={(p) => {
              addToCart(p);
              setModalProduct(null);
            }}
          />
        )}
      </main>
    </div>
  );
}

export default Home;
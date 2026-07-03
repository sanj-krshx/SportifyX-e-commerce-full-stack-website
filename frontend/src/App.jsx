import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, Route, Routes, useParams } from "react-router-dom";

import "./App.css";

import CategoryCard from "./components/CategoryCard";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import LoginModal from "./components/LoginModal";
import Navbar from "./components/Navbar";
import Notification from "./components/Notification";
import ProductCard from "./components/ProductCard";
import SignupModal from "./components/SignupModal";
import TestimonialCard from "./components/TestimonialCard";
import AdminLogin from "./admin/pages/AdminLogin";
import Dashboard from "./admin/pages/Dashboard";
import fallbackProducts from "./data/products";
import {
  addCartItem,
  assetUrl,
  getCartItems,
  getCategoryProducts,
} from "./services/api";

const categories = [
  { id: "volleyball", title: "Volleyball", image: "/images/vollyball.webp" },
  { id: "football", title: "Football", image: "/images/football.webp" },
  { id: "cricket", title: "Cricket", image: "/images/cricket-bat.webp" },
  { id: "basketball", title: "Basketball", image: "/images/basketball.webp" },
  { id: "tennis", title: "Tennis", image: "/images/Tennis.webp" },
];

const apiCategories = ["football", "cricket", "basketball", "tennis", "volleyball"];

const getSearchText = (product) =>
  [
    product.name,
    product.category,
    product.price,
    product.rating,
    product.stock,
    product.quantity,
  ]
    .filter((value) => value !== undefined && value !== null)
    .join(" ")
    .toLowerCase();

function StoreShell({
  children,
  cartCount,
  darkMode,
  handleLogout,
  notice,
  setDarkMode,
  setShowLogin,
  setShowSignup,
  setUser,
  showLogin,
  showNotice,
  showSignup,
  user,
}) {
  return (
    <div className={darkMode ? "app-shell dark" : "app-shell"}>
      <Navbar
        cartCount={cartCount}
        user={user}
        setUser={handleLogout}
        openLogin={() => setShowLogin(true)}
        openSignup={() => setShowSignup(true)}
      />

      {children}

      {showLogin && (
        <LoginModal
          closeModal={() => setShowLogin(false)}
          setUser={setUser}
          showNotice={showNotice}
        />
      )}

      {showSignup && (
        <SignupModal
          closeModal={() => setShowSignup(false)}
          showNotice={showNotice}
        />
      )}

      <button
        className="floating-theme-btn"
        type="button"
        aria-label="Toggle theme"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? "Light" : "Dark"}
      </button>

      <Notification message={notice} />
      <Footer />
    </div>
  );
}

function HomePage({
  addToCart,
  clearSearch,
  filteredProducts,
  handleSearchChange,
  loadingProducts,
  searchTerm,
  shellProps,
  showNotice,
}) {
  return (
    <StoreShell {...shellProps}>
      <main>
        <Hero />

        <section id="categories" className="categories">
          <div className="section-heading">
            <p>Shop by sport</p>
            <h2 className="section-title">Find the right gear faster</h2>
          </div>

          <div className="category-grid">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                image={category.image}
                title={category.title}
                to={`/sports/${category.id}`}
              />
            ))}
          </div>
        </section>

        <section id="products" className="products">
          <div className="products-toolbar">
            <div className="search-field" role="search">
              <label className="sr-only" htmlFor="product-search">Search products</label>

              <div className="search-control">
                <input
                  id="product-search"
                  type="search"
                  placeholder="Search by product, sport or price"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />

                {searchTerm && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={clearSearch}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {loadingProducts ? (
            <div className="empty-state">Loading products...</div>
          ) : filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={`${product.category}-${product.id}`}
                  id={product.id}
                  image={assetUrl(product.image)}
                  name={product.name}
                  price={product.price}
                  rating={product.rating || 4.8}
                  category={product.category}
                  stock={product.stock || product.quantity}
                  addToCart={addToCart}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              No products match your search.
              <button type="button" onClick={clearSearch}>
                Clear search
              </button>
            </div>
          )}
        </section>

        <section className="testimonials">
          <div className="section-heading">
            <p>Customer trust</p>
            <h2 className="section-title">What Customers Say</h2>
          </div>

          <div className="testimonial-container">
            <TestimonialCard
              name="Rahul Sharma"
              review="Good quality gear and quick delivery."
            />
            <TestimonialCard
              name="Arjun Patel"
              review="The product photos matched what arrived."
            />
            <TestimonialCard
              name="Vikram Singh"
              review="A clean store with simple checkout flow."
            />
          </div>
        </section>

        <section className="newsletter">
          <h2>Stay updated</h2>
          <p>Get new arrivals and sports offers in your inbox.</p>

          <form
            className="newsletter-form"
            onSubmit={(event) => {
              event.preventDefault();
              event.currentTarget.reset();
              showNotice("Thanks for subscribing.");
            }}
          >
            <input type="email" placeholder="Enter your email" required />
            <button type="submit">Subscribe</button>
          </form>
        </section>
      </main>
    </StoreShell>
  );
}

function SportProductsPage({
  addToCart,
  loadingProducts,
  products,
  shellProps,
}) {
  const { sportId } = useParams();
  const sport = categories.find((category) => category.id === sportId);
  const sportProducts = products.filter((product) => product.category === sportId);

  return (
    <StoreShell {...shellProps}>
      <main>
        <section className="sport-products-page">
          <Link className="back-link" to="/#categories">
            Back to sports
          </Link>

          <div className="sport-page-heading">
            <div>
              <p>Shop by sport</p>
              <h1>{sport?.title || "Sport"} Products</h1>
            </div>

            {sport && <img src={sport.image} alt={`${sport.title} products`} />}
          </div>

          {loadingProducts ? (
            <div className="empty-state">Loading products...</div>
          ) : sportProducts.length > 0 ? (
            <div className="product-grid">
              {sportProducts.map((product) => (
                <ProductCard
                  key={`${product.category}-${product.id}`}
                  id={product.id}
                  image={assetUrl(product.image)}
                  name={product.name}
                  price={product.price}
                  rating={product.rating || 4.8}
                  category={product.category}
                  stock={product.stock || product.quantity}
                  addToCart={addToCart}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              No products found for this sport yet.
            </div>
          )}
        </section>
      </main>
    </StoreShell>
  );
}

function App() {
  const [cartCount, setCartCount] = useState(() =>
    Number(localStorage.getItem("cartCount") || 0)
  );
  const [darkMode, setDarkMode] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("sportifyUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState(fallbackProducts);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [notice, setNotice] = useState("");
  const noticeTimer = useRef();

  const showNotice = useCallback((message) => {
    setNotice(message);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(""), 2200);
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setLoadingProducts(true);

      try {
        const categoryProducts = await Promise.all(
          apiCategories.map((category) => getCategoryProducts(category))
        );

        const apiProducts = categoryProducts.flat();

        if (apiProducts.length > 0) {
          setProducts(apiProducts);
        }
      } catch {
        setProducts(fallbackProducts);
        showNotice("Showing sample products while the server is unavailable.");
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, [showNotice]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("sportifyUser", JSON.stringify(user));
      getCartItems(user.id)
        .then((items) => {
          setCartCount(items.length);
          localStorage.setItem("cartCount", String(items.length));
        })
        .catch(() => {
          const savedCount = Number(localStorage.getItem("cartCount") || 0);
          setCartCount(savedCount);
        });
    } else {
      localStorage.removeItem("sportifyUser");
    }
  }, [user]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch = !normalizedSearch || getSearchText(product).includes(normalizedSearch);

      return matchesSearch;
    });
  }, [products, searchTerm]);

  const handleSearchChange = (event) => {
    const value = event.target.value;

    setSearchTerm(value);

  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const addToCart = async (productId) => {
    if (!user) {
      setShowLogin(true);
      showNotice("Please login before adding items to cart.");
      return;
    }

    try {
      const data = await addCartItem({
        user_id: user.id,
        product_id: productId,
        quantity: 1,
      });

      const nextCount = cartCount + 1;
      setCartCount(nextCount);
      localStorage.setItem("cartCount", String(nextCount));
      showNotice(data.message || "Product added to cart.");
    } catch (error) {
      console.error(error);
      const nextCount = cartCount + 1;
      setCartCount(nextCount);
      localStorage.setItem("cartCount", String(nextCount));
      showNotice("Added to cart for this session.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCartCount(0);
    localStorage.setItem("cartCount", "0");
    showNotice("Logged out successfully.");
  };

  const shellProps = {
    cartCount,
    darkMode,
    handleLogout,
    notice,
    setDarkMode,
    setShowLogin,
    setShowSignup,
    setUser,
    showLogin,
    showNotice,
    showSignup,
    user,
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomePage
            addToCart={addToCart}
            clearSearch={clearSearch}
            filteredProducts={filteredProducts}
            handleSearchChange={handleSearchChange}
            loadingProducts={loadingProducts}
            searchTerm={searchTerm}
            shellProps={shellProps}
            showNotice={showNotice}
          />
        }
      />
      <Route
        path="/sports/:sportId"
        element={
          <SportProductsPage
            addToCart={addToCart}
            loadingProducts={loadingProducts}
            products={products}
            shellProps={shellProps}
          />
        }
      />

      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;

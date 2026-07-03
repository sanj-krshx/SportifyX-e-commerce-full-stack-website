import { Link } from "react-router-dom";

function Navbar({ cartCount, user, setUser, openLogin, openSignup }) {
  return (
    <nav className="navbar">
      <a className="logo" href="#home">
        SportifyX
      </a>

      <ul className="nav-links">
        <li>
          <a href="#home">Home</a>
        </li>
        <li>
          <a href="#categories">Categories</a>
        </li>
        <li>
          <a href="#products">Products</a>
        </li>
        <li>
          <a href="#contact">Contact</a>
        </li>
        <li>
          <Link to="/admin">Admin</Link>
        </li>
      </ul>

      <div className="nav-actions">
        {user ? (
          <>
            <span className="welcome-user">Hi, {user.fullname}</span>
            <button className="logout-btn" type="button" onClick={setUser}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="login-btn" type="button" onClick={openLogin}>
              Login
            </button>
            <button className="signup-btn" type="button" onClick={openSignup}>
              Sign Up
            </button>
          </>
        )}

        <div className="cart-counter" aria-label={`${cartCount} cart items`}>
          Cart {cartCount}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

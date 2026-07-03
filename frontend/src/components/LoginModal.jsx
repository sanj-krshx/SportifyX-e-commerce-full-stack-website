import { useState } from "react";
import { loginUser } from "../services/api";

function LoginModal({
  closeModal,
  setUser,
  showNotice
}) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  const handleLogin = async () => {

    // Email validation
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {

      setMessage(
        "Please enter a valid email"
      );

      setTimeout(() => {
        setMessage("");
      }, 2000);

      return;
    }

    // Password validation
    if (password.length < 6) {

      setMessage(
        "Password must be at least 6 characters"
      );

      setTimeout(() => {
        setMessage("");
      }, 2000);

      return;
    }

    try {
      const data = await loginUser({
        email,
        password
      });

      if (data.success) {

        setMessage("Login successful");

        setUser(data.user);
        showNotice?.(`Welcome, ${data.user.fullname}`);

        setTimeout(() => {

          setMessage("");

          closeModal();

        }, 1500);

      } else {

        setMessage(
          data.message
        );

        setTimeout(() => {
          setMessage("");
        }, 2000);

      }

    } catch (error) {

      console.error(error);

      setMessage(
        "Login failed. Please try again."
      );

      setTimeout(() => {
        setMessage("");
      }, 2000);

    }
  };

  return (

    <div className="modal-overlay">

      <div className="modal">

        <button
          className="close-btn"
          type="button"
          onClick={closeModal}
        >
          ✕
        </button>

        <h2>
          Login
        </h2>

        {/* Status Message */}

        {message && (

          <div
            className="form-message"
          >
            {message}
          </div>

        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <button
          type="button"
          onClick={handleLogin}
        >
          Login
        </button>

      </div>

    </div>
  );
}

export default LoginModal;

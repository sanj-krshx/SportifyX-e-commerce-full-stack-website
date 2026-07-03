import { useState } from "react";
import { signupUser } from "../services/api";

function SignupModal({ closeModal, showNotice }) {

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const showMessage = (msg) => {

    setMessage(msg);

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  const handleSignup = async () => {

    // Full name validation
    if (formData.fullname.trim() === "") {

      showMessage(
        "Please enter your full name"
      );

      return;
    }

    // Email validation
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {

      showMessage(
        "Please enter a valid email"
      );

      return;
    }

    // Mobile validation
    if (formData.mobile.length !== 10) {

      showMessage(
        "Mobile number must contain exactly 10 digits"
      );

      return;
    }

    // Password validation
    if (formData.password.length < 6) {

      showMessage(
        "Password must be at least 6 characters"
      );

      return;
    }

    try {
      const data = await signupUser(formData);

      if (data.success) {

        setMessage(
          "Signup successful"
        );
        showNotice?.("Account created. You can login now.");

        setTimeout(() => {

          setMessage("");

          closeModal();

        }, 1500);

      } else {

        showMessage(
          data.message
        );

      }

    } catch (error) {

      console.error(error);

      showMessage(
        "Signup failed. Please try again."
      );

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
          Create Account
        </h2>

        {/* Status Message */}
        {message && (

          <div className="form-message">
            {message}
          </div>

        )}

        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          value={formData.fullname}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="mobile"
          placeholder="Mobile Number"
          value={formData.mobile}
          maxLength={10}
          onChange={(e) => {

            const value =
              e.target.value.replace(
                /\D/g,
                ""
              );

            setFormData({
              ...formData,
              mobile: value,
            });

          }}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <button
          type="button"
          onClick={handleSignup}
        >
          Sign Up
        </button>

      </div>

    </div>
  );
}

export default SignupModal;

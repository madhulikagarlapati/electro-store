import { useState } from "react";

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", username: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!form.username.trim()) {
      newErrors.username = "Username is required.";
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    return newErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      onLogin({ username: form.username, email: form.email });
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <main className="login-page" aria-labelledby="login-heading">
      <section className="login-card">
        <header>
          <h1 id="login-heading">Welcome to Electronic Store</h1>
          <p className="login-intro">Access Electronic Store with your account details. Enter your email and password to continue.</p>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <fieldset>
            <legend>Login information</legend>

            <label htmlFor="email-input">
              Email
              <input
                id="email-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </label>

            <label htmlFor="username-input">
              Username
              <input
                id="username-input"
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Username"
                required
              />
              {errors.username && <span className="field-error">{errors.username}</span>}
            </label>

            <label htmlFor="password-input">
              Password
              <input
                id="password-input"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </label>

            <label htmlFor="confirm-password-input">
              Confirm Password
              <input
                id="confirm-password-input"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
              />
              {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
            </label>
          </fieldset>

          <button type="submit">Login</button>
        </form>

        <p className="login-note">New to Electronic Store? Use your business email and choose a strong password to get started.</p>
      </section>
    </main>
  );
}

export default Login;
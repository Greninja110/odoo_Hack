// rewear/client/src/components/auth/Login.jsx

import React, { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Formik } from "formik";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// Validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  rememberMe: Yup.boolean(),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Create a logger
      console.log("Login attempt:", { email: values.email });

      // Call login function from auth context
      await login(values.email, values.password, values.rememberMe);

      // Redirect to dashboard on success
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || "Failed to login. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <h2
        className="text-center mb-4"
        style={{
          fontSize: "2rem",
          fontWeight: "600",
          color: "#263238",
          marginBottom: "1.5rem",
        }}
      >
        Login to ReWear
      </h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Formik
        initialValues={{ email: "", password: "", rememberMe: false }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: "500", color: "#455a64" }}>
                Email/Username
              </Form.Label>
              <Form.Control
                type="text"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.email && errors.email}
                placeholder="Enter email or username"
                style={{
                  borderRadius: "8px",
                  padding: "0.6rem 1rem",
                  border: "1px solid #e0e0e0",
                  transition: "all 0.3s ease",
                }}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: "500", color: "#455a64" }}>
                Password
              </Form.Label>
              <div className="input-group">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.password && errors.password}
                  placeholder="Enter password"
                  style={{
                    borderRadius: "8px 0 0 8px",
                    padding: "0.6rem 1rem",
                    border: "1px solid #e0e0e0",
                    transition: "all 0.3s ease",
                  }}
                />
                <Button
                  variant="outline-secondary"
                  onClick={togglePasswordVisibility}
                  style={{
                    borderRadius: "0 8px 8px 0",
                    borderLeft: "none",
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="rememberMe"
                label="Remember Me"
                checked={values.rememberMe}
                onChange={handleChange}
                style={{ color: "#455a64" }}
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 mb-3 auth-btn"
              disabled={isSubmitting}
              style={{
                borderRadius: "30px",
                padding: "0.6rem 1.5rem",
                fontWeight: "500",
                transition: "all 0.3s ease",
                background: "linear-gradient(135deg, #4db6ac, #26a69a)",
                border: "none",
                boxShadow: "0 4px 10px rgba(38, 166, 154, 0.2)",
              }}
            >
              {isSubmitting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  <span className="ms-2">Logging in...</span>
                </>
              ) : (
                "Login"
              )}
            </Button>

            <div className="text-center mb-3">
              <Link
                to="/forgot-password"
                className="auth-link"
                style={{
                  color: "#4db6ac",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  fontWeight: "500",
                }}
              >
                Forgot Password?
              </Link>
            </div>

            <div className="text-center mb-3">
              <Button
                variant="outline-secondary"
                className="w-100 social-auth-btn"
                disabled
                style={{
                  borderRadius: "30px",
                  padding: "0.6rem 1.5rem",
                  fontWeight: "500",
                  transition: "all 0.3s ease",
                  borderWidth: "1px",
                }}
              >
                Continue with Google
              </Button>
              <small className="text-muted">
                (Will be enabled in next phase)
              </small>
            </div>

            <div className="text-center">
              <p>
                New to ReWear?{" "}
                <Link
                  to="/register"
                  className="auth-link"
                  style={{
                    color: "#4db6ac",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    fontWeight: "500",
                  }}
                >
                  Register
                </Link>
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;

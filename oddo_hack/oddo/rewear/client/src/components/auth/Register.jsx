// rewear/client/src/components/auth/Register.jsx

import React, { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Formik } from "formik";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// Validation schema
const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores"
    )
    .required("Username is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
  gender: Yup.string()
    .oneOf(
      ["male", "female", "prefer_not_to_say"],
      "Please select a valid option"
    )
    .required("Gender is required"),
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Create a logger
      console.log("Registration attempt:", {
        email: values.email,
        username: values.username,
      });

      // Call register function from auth context
      await register(
        values.email,
        values.username,
        values.password,
        values.gender
      );

      // Redirect to login on success
      navigate("/login", {
        state: {
          success: true,
          message: "Registration successful. Please login.",
        },
      });
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message || "Failed to register. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <h2
        className="text-center mb-4"
        style={{
          fontSize: "2rem",
          fontWeight: "600",
          color: "#263238",
          marginBottom: "1.5rem",
        }}
      >
        Create a ReWear Account
      </h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Formik
        initialValues={{
          email: "",
          username: "",
          password: "",
          confirmPassword: "",
          gender: "",
        }}
        validationSchema={RegisterSchema}
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
                Email
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.email && errors.email}
                placeholder="Enter email"
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
                Username
              </Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.username && errors.username}
                placeholder="Choose a username"
                style={{
                  borderRadius: "8px",
                  padding: "0.6rem 1rem",
                  border: "1px solid #e0e0e0",
                  transition: "all 0.3s ease",
                }}
              />
              <Form.Control.Feedback type="invalid">
                {errors.username}
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
                  placeholder="Create a password"
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
              <Form.Label style={{ fontWeight: "500", color: "#455a64" }}>
                Confirm Password
              </Form.Label>
              <div className="input-group">
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.confirmPassword && errors.confirmPassword}
                  placeholder="Confirm your password"
                  style={{
                    borderRadius: "8px 0 0 8px",
                    padding: "0.6rem 1rem",
                    border: "1px solid #e0e0e0",
                    transition: "all 0.3s ease",
                  }}
                />
                <Button
                  variant="outline-secondary"
                  onClick={toggleConfirmPasswordVisibility}
                  style={{
                    borderRadius: "0 8px 8px 0",
                    borderLeft: "none",
                  }}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: "500", color: "#455a64" }}>
                Gender
              </Form.Label>
              <Form.Select
                name="gender"
                value={values.gender}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.gender && errors.gender}
                style={{
                  borderRadius: "8px",
                  padding: "0.6rem 1rem",
                  border: "1px solid #e0e0e0",
                  transition: "all 0.3s ease",
                }}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.gender}
              </Form.Control.Feedback>
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
                  <span className="ms-2">Registering...</span>
                </>
              ) : (
                "Register"
              )}
            </Button>

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
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="auth-link"
                  style={{
                    color: "#4db6ac",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    fontWeight: "500",
                  }}
                >
                  Login
                </Link>
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;

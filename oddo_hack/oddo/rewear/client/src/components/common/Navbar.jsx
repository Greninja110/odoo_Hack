// rewear/client/src/components/common/Navbar.jsx

import React, { useState, useEffect } from "react";
import {
  Navbar as BootstrapNavbar,
  Nav,
  Container,
  Button,
} from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
// Import the logo
import logo from "./logo.png"; // Adjust if needed

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <BootstrapNavbar
      bg="dark"
      variant="dark"
      expand="lg"
      className={`navbar-custom py-2 ${scrolled ? "scrolled" : ""}`}
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        transition: "all 0.3s ease",
      }}
    >
      <Container>
        <BootstrapNavbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center"
        >
          {/* Fixed size logo container without rotation effect */}
          <div
            className="logo-container"
            style={{ width: "60px", height: "60px", marginRight: "10px" }}
          >
            <img
              src={logo}
              alt="ReWear Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.3))",
                // Removed transition for rotation effect
              }}
              onError={(e) => {
                console.error("Logo failed to load");
                e.target.style.display = "none";
              }}
            />
          </div>
          <span
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              letterSpacing: "0.5px",
              background: "linear-gradient(135deg, #4db6ac, #26a69a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }}
          >
            ReWear
          </span>
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link
              as={Link}
              to="/"
              className={`nav-link-custom px-3 mx-1 ${location.pathname === "/" ? "active" : ""}`}
              style={{
                fontSize: "1.05rem",
                fontWeight: "500",
                borderRadius: "4px",
                transition: "all 0.3s ease",
              }}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/items"
              className={`nav-link-custom px-3 mx-1 ${location.pathname === "/items" ? "active" : ""}`}
              style={{
                fontSize: "1.05rem",
                fontWeight: "500",
                borderRadius: "4px",
                transition: "all 0.3s ease",
              }}
            >
              Browse Items
            </Nav.Link>
          </Nav>
          <Nav>
            {user ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/dashboard"
                  className={`nav-link-custom ${location.pathname === "/dashboard" ? "active" : ""}`}
                >
                  Dashboard
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/items/new"
                  className={`nav-link-custom ${location.pathname === "/items/new" ? "active" : ""}`}
                >
                  List Item
                </Nav.Link>
                <Nav.Link as={Link} to="/catalog" className="nav-link-custom">
                  Catalog
                </Nav.Link>
                {user.role === "admin" && (
                  <Nav.Link
                    as={Link}
                    to="/admin"
                    className={`nav-link-custom ${location.pathname === "/admin" ? "active" : ""}`}
                  >
                    Admin
                  </Nav.Link>
                )}
                <Button
                  variant="outline-light"
                  onClick={logout}
                  className="ms-3 action-btn"
                  style={{
                    borderRadius: "24px",
                    padding: "0.375rem 1.25rem",
                    borderWidth: "1.5px",
                    fontWeight: "500",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                    background:
                      "linear-gradient(135deg, rgba(77, 182, 172, 0.1), rgba(38, 166, 154, 0.1))",
                    transition: "all 0.3s ease",
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                {/* Changed Button to a styled Link to remove the blue underline */}
                <Link
                  to="/login"
                  className="login-link mx-3"
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: "500",
                    color: "rgba(255,255,255,0.8)",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    padding: "0.5rem 0",
                  }}
                >
                  Login
                </Link>
                <Button
                  as={Link}
                  to="/register"
                  variant="outline-light"
                  className="action-btn"
                  style={{
                    borderRadius: "24px",
                    padding: "0.5rem 1.5rem",
                    fontWeight: "500",
                    borderWidth: "1.5px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                    background:
                      "linear-gradient(135deg, rgba(77, 182, 172, 0.2), rgba(38, 166, 154, 0.2))",
                    transition: "all 0.3s ease",
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;

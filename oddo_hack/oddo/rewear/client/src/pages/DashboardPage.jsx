// rewear/client/src/pages/DashboardPage.jsx

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Nav,
  Tab,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FaUser,
  FaUpload,
  FaEdit,
  FaClipboardList,
  FaExchangeAlt,
  FaTshirt,
  FaCheck,
} from "react-icons/fa";
import { Formik } from "formik";
import * as Yup from "yup";
import ItemCard from "../components/items/ItemCard";
import Loader from "../components/common/Loader";

// Validation schema for profile update
const ProfileSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .required("Username is required"),
  city: Yup.string().max(50, "City name is too long"),
  address: Yup.string().max(200, "Address is too long"),
  bio: Yup.string().max(500, "Bio must be less than 500 characters"),
  swapPreference: Yup.string().oneOf(
    ["swap", "sale", "both"],
    "Invalid preference"
  ),
});

const DashboardPage = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch additional user data here
        // For now, we'll just simulate loading
        setTimeout(() => {
          setLoading(false);
        }, 500);

        // Fetch user items
        setItemsLoading(true);
        // This would be an actual API call in a real app
        setTimeout(() => {
          // Dummy data for demo
          setUserItems([
            {
              id: 1,
              title: "Blue Denim Jacket",
              description: "Lightly worn denim jacket, size M",
              imageUrl:
                "https://via.placeholder.com/300x400?text=Blue+Denim+Jacket",
              category: "Jackets",
              size: "M",
              condition: "Good",
              status: "Available",
            },
            {
              id: 2,
              title: "Red T-Shirt",
              description: "Cotton t-shirt, like new",
              imageUrl: "https://via.placeholder.com/300x400?text=Red+T-Shirt",
              category: "Shirts",
              size: "L",
              condition: "Excellent",
              status: "Available",
            },
          ]);
          setItemsLoading(false);
        }, 700);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data. Please try again later.");
        setLoading(false);
        setItemsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (values) => {
    try {
      setSubmitting(true);
      // In a real app, you would send the profile data and image to an API
      console.log("Updating profile with values:", values);
      console.log("Profile image:", profileImage);

      // Simulating an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update profile in auth context
      await updateProfile({
        ...values,
        profileImage: profileImagePreview, // In a real app, this would be a URL from your backend
      });

      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-center text-danger my-5">{error}</div>;

  return (
    <>
      {/* Dashboard Hero Section */}
      <section className="dashboard-hero-section text-center text-white">
        <Container>
          <h1 className="display-5">My Dashboard</h1>
          <p className="lead">Manage your profile, listings, and exchanges</p>
        </Container>
      </section>

      <Container className="py-5">
        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
          <Row>
            <Col md={3}>
              <Card
                className="mb-4 dashboard-sidebar"
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "none",
                  boxShadow: "0 5px 20px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Card.Body className="p-0">
                  <div
                    className="user-profile-section text-center p-4"
                    style={{
                      background: "linear-gradient(135deg, #4db6ac, #26a69a)",
                    }}
                  >
                    <div
                      className="profile-image-container mx-auto mb-3"
                      style={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: "4px solid rgba(255, 255, 255, 0.2)",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      <img
                        src={
                          profileImagePreview ||
                          user.profileImage ||
                          "https://via.placeholder.com/150?text=User"
                        }
                        alt="Profile"
                        className="img-fluid"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <h5
                      className="text-white mb-1"
                      style={{ fontWeight: "600" }}
                    >
                      {user.username}
                    </h5>
                    <p className="text-white-50 mb-0">
                      {user.city || "Location not set"}
                    </p>
                  </div>

                  <Nav variant="pills" className="flex-column p-3">
                    <Nav.Item className="mb-2">
                      <Nav.Link
                        eventKey="profile"
                        className="d-flex align-items-center dashboard-nav-link"
                        style={{
                          padding: "0.8rem 1rem",
                          borderRadius: "8px",
                          color: activeTab === "profile" ? "#fff" : "#455a64",
                          background:
                            activeTab === "profile"
                              ? "linear-gradient(135deg, #4db6ac, #26a69a)"
                              : "transparent",
                          transition: "all 0.3s ease",
                        }}
                      >
                        <FaUser className="me-2" /> Profile
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="mb-2">
                      <Nav.Link
                        eventKey="wardrobe"
                        className="d-flex align-items-center dashboard-nav-link"
                        style={{
                          padding: "0.8rem 1rem",
                          borderRadius: "8px",
                          color: activeTab === "wardrobe" ? "#fff" : "#455a64",
                          background:
                            activeTab === "wardrobe"
                              ? "linear-gradient(135deg, #4db6ac, #26a69a)"
                              : "transparent",
                          transition: "all 0.3s ease",
                        }}
                      >
                        <FaTshirt className="me-2" /> My Listings
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="mb-2">
                      <Nav.Link
                        eventKey="swaps"
                        className="d-flex align-items-center dashboard-nav-link"
                        style={{
                          padding: "0.8rem 1rem",
                          borderRadius: "8px",
                          color: activeTab === "swaps" ? "#fff" : "#455a64",
                          background:
                            activeTab === "swaps"
                              ? "linear-gradient(135deg, #4db6ac, #26a69a)"
                              : "transparent",
                          transition: "all 0.3s ease",
                        }}
                      >
                        <FaExchangeAlt className="me-2" /> My Swaps
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Body>
              </Card>

              <Link to="/items/new" className="text-decoration-none">
                <Button
                  variant="primary"
                  className="w-100 add-item-btn"
                  style={{
                    borderRadius: "10px",
                    padding: "0.8rem",
                    fontWeight: "500",
                    background: "linear-gradient(135deg, #4db6ac, #26a69a)",
                    border: "none",
                    boxShadow: "0 4px 10px rgba(38, 166, 154, 0.3)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <FaUpload className="me-2" /> List New Item
                </Button>
              </Link>
            </Col>

            <Col md={9}>
              <Card
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "none",
                  boxShadow: "0 5px 20px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Card.Body className="p-4">
                  <Tab.Content>
                    <Tab.Pane eventKey="profile">
                      <h2
                        className="mb-4"
                        style={{ fontWeight: "600", color: "#263238" }}
                      >
                        My Profile
                      </h2>

                      {updateSuccess && (
                        <Alert
                          variant="success"
                          dismissible
                          style={{
                            borderRadius: "10px",
                            boxShadow: "0 4px 10px rgba(38, 166, 154, 0.1)",
                            border: "none",
                            background: "rgba(38, 166, 154, 0.1)",
                            borderLeft: "4px solid #26a69a",
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <FaCheck className="me-2 text-success" />
                            Profile updated successfully!
                          </div>
                        </Alert>
                      )}

                      <Formik
                        initialValues={{
                          username: user.username || "",
                          city: user.city || "",
                          address: user.address || "",
                          bio: user.bio || "",
                          swapPreference: user.swapPreference || "both",
                        }}
                        validationSchema={ProfileSchema}
                        onSubmit={handleProfileUpdate}
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
                            <Row>
                              <Col md={4}>
                                <Form.Group className="mb-3">
                                  <Form.Label
                                    style={{
                                      fontWeight: "500",
                                      color: "#455a64",
                                    }}
                                  >
                                    Profile Picture
                                  </Form.Label>
                                  <div className="profile-upload-container mb-2">
                                    <div
                                      className="profile-preview"
                                      style={{
                                        width: "150px",
                                        height: "150px",
                                        border: "2px dashed #ced4da",
                                        borderRadius: "50%",
                                        overflow: "hidden",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        cursor: "pointer",
                                        position: "relative",
                                        margin: "0 auto",
                                      }}
                                      onClick={() =>
                                        document
                                          .getElementById("profileImageUpload")
                                          .click()
                                      }
                                    >
                                      {profileImagePreview ||
                                      user.profileImage ? (
                                        <img
                                          src={
                                            profileImagePreview ||
                                            user.profileImage
                                          }
                                          alt="Profile Preview"
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                          }}
                                        />
                                      ) : (
                                        <div className="text-center text-muted">
                                          <FaUser size={40} />
                                          <p className="mt-2 mb-0 small">
                                            Click to upload
                                          </p>
                                        </div>
                                      )}
                                      <div
                                        className="edit-overlay"
                                        style={{
                                          position: "absolute",
                                          top: 0,
                                          left: 0,
                                          width: "100%",
                                          height: "100%",
                                          backgroundColor: "rgba(0, 0, 0, 0.3)",
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center",
                                          opacity: 0,
                                          transition: "opacity 0.2s",
                                          borderRadius: "50%",
                                        }}
                                        onMouseOver={(e) =>
                                          (e.currentTarget.style.opacity = 1)
                                        }
                                        onMouseOut={(e) =>
                                          (e.currentTarget.style.opacity = 0)
                                        }
                                      >
                                        <FaEdit size={30} color="white" />
                                      </div>
                                    </div>
                                    <Form.Control
                                      id="profileImageUpload"
                                      type="file"
                                      accept="image/*"
                                      onChange={handleProfileImageChange}
                                      style={{ display: "none" }}
                                    />
                                  </div>
                                  <Form.Text className="text-muted text-center d-block">
                                    Recommended size: 300x300 pixels
                                  </Form.Text>
                                </Form.Group>
                              </Col>

                              <Col md={8}>
                                <Form.Group className="mb-3">
                                  <Form.Label
                                    style={{
                                      fontWeight: "500",
                                      color: "#455a64",
                                    }}
                                  >
                                    Username
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="username"
                                    value={values.username}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={
                                      touched.username && errors.username
                                    }
                                    style={{
                                      borderRadius: "8px",
                                      padding: "0.6rem 1rem",
                                      border: "1px solid #e0e0e0",
                                      boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                                    }}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {errors.username}
                                  </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                  <Form.Label
                                    style={{
                                      fontWeight: "500",
                                      color: "#455a64",
                                    }}
                                  >
                                    City/Location
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="city"
                                    value={values.city}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.city && errors.city}
                                    style={{
                                      borderRadius: "8px",
                                      padding: "0.6rem 1rem",
                                      border: "1px solid #e0e0e0",
                                      boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                                    }}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {errors.city}
                                  </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                  <Form.Label
                                    style={{
                                      fontWeight: "500",
                                      color: "#455a64",
                                    }}
                                  >
                                    Address
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="address"
                                    value={values.address}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={
                                      touched.address && errors.address
                                    }
                                    style={{
                                      borderRadius: "8px",
                                      padding: "0.6rem 1rem",
                                      border: "1px solid #e0e0e0",
                                      boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                                    }}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {errors.address}
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Col>
                            </Row>

                            <Form.Group className="mb-3">
                              <Form.Label
                                style={{ fontWeight: "500", color: "#455a64" }}
                              >
                                Bio/Style Preference
                              </Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={3}
                                name="bio"
                                value={values.bio}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.bio && errors.bio}
                                placeholder="Tell others about your style preferences and what you're looking for..."
                                style={{
                                  borderRadius: "8px",
                                  padding: "0.6rem 1rem",
                                  border: "1px solid #e0e0e0",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                                }}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.bio}
                              </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                              <Form.Label
                                style={{ fontWeight: "500", color: "#455a64" }}
                              >
                                Swap/Sale Preference
                              </Form.Label>
                              <Form.Select
                                name="swapPreference"
                                value={values.swapPreference}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={
                                  touched.swapPreference &&
                                  errors.swapPreference
                                }
                                style={{
                                  borderRadius: "8px",
                                  padding: "0.6rem 1rem",
                                  border: "1px solid #e0e0e0",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                                }}
                              >
                                <option value="swap">Swap Only</option>
                                <option value="sale">Sale Only</option>
                                <option value="both">Both Swap and Sale</option>
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                {errors.swapPreference}
                              </Form.Control.Feedback>
                            </Form.Group>

                            <div className="d-flex justify-content-end">
                              <Button
                                type="submit"
                                variant="primary"
                                disabled={submitting}
                                style={{
                                  borderRadius: "30px",
                                  padding: "0.6rem 1.5rem",
                                  fontWeight: "500",
                                  background:
                                    "linear-gradient(135deg, #4db6ac, #26a69a)",
                                  border: "none",
                                  boxShadow:
                                    "0 4px 10px rgba(38, 166, 154, 0.3)",
                                  transition: "all 0.3s ease",
                                }}
                              >
                                {submitting ? (
                                  <>
                                    <Spinner
                                      as="span"
                                      animation="border"
                                      size="sm"
                                      role="status"
                                      aria-hidden="true"
                                    />
                                    <span className="ms-2">Updating...</span>
                                  </>
                                ) : (
                                  "Update Profile"
                                )}
                              </Button>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </Tab.Pane>

                    <Tab.Pane eventKey="wardrobe">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 style={{ fontWeight: "600", color: "#263238" }}>
                          My Listings
                        </h2>
                        <Link to="/items/new">
                          <Button
                            variant="primary"
                            style={{
                              borderRadius: "30px",
                              padding: "0.6rem 1.2rem",
                              fontWeight: "500",
                              background:
                                "linear-gradient(135deg, #4db6ac, #26a69a)",
                              border: "none",
                              boxShadow: "0 4px 10px rgba(38, 166, 154, 0.3)",
                              transition: "all 0.3s ease",
                            }}
                          >
                            <FaUpload className="me-2" /> Add New Item
                          </Button>
                        </Link>
                      </div>

                      {itemsLoading ? (
                        <div className="text-center py-5">
                          <Spinner
                            animation="border"
                            role="status"
                            style={{ color: "#4db6ac" }}
                          >
                            <span className="visually-hidden">Loading...</span>
                          </Spinner>
                        </div>
                      ) : userItems.length > 0 ? (
                        <Row>
                          {userItems.map((item) => (
                            <Col
                              key={item.id}
                              xs={12}
                              sm={6}
                              md={6}
                              className="mb-4"
                            >
                              <ItemCard
                                item={item}
                                showControls={true}
                                onEdit={() =>
                                  console.log("Edit item:", item.id)
                                }
                                onDelete={() =>
                                  console.log("Delete item:", item.id)
                                }
                              />
                            </Col>
                          ))}
                        </Row>
                      ) : (
                        <div
                          className="text-center py-5"
                          style={{ color: "#757575" }}
                        >
                          <div
                            style={{
                              fontSize: "3rem",
                              marginBottom: "1rem",
                              opacity: "0.5",
                            }}
                          >
                            <FaTshirt />
                          </div>
                          <p className="mb-3">
                            You haven't listed any items yet.
                          </p>
                          <Link to="/items/new">
                            <Button
                              variant="primary"
                              style={{
                                borderRadius: "30px",
                                padding: "0.6rem 1.5rem",
                                fontWeight: "500",
                                background:
                                  "linear-gradient(135deg, #4db6ac, #26a69a)",
                                border: "none",
                                boxShadow: "0 4px 10px rgba(38, 166, 154, 0.3)",
                                transition: "all 0.3s ease",
                              }}
                            >
                              List Your First Item
                            </Button>
                          </Link>
                        </div>
                      )}
                    </Tab.Pane>

                    <Tab.Pane eventKey="swaps">
                      <h2
                        className="mb-4"
                        style={{ fontWeight: "600", color: "#263238" }}
                      >
                        My Swaps
                      </h2>

                      <div
                        className="text-center py-5"
                        style={{ color: "#757575" }}
                      >
                        <div
                          style={{
                            fontSize: "3rem",
                            marginBottom: "1rem",
                            opacity: "0.5",
                          }}
                        >
                          <FaExchangeAlt />
                        </div>
                        <p className="mb-0">
                          You don't have any active swaps yet.
                        </p>
                        <p className="text-muted mt-2">
                          Browse items and request swaps to get started!
                        </p>
                        <Link to="/items">
                          <Button
                            variant="primary"
                            style={{
                              borderRadius: "30px",
                              padding: "0.6rem 1.5rem",
                              fontWeight: "500",
                              background:
                                "linear-gradient(135deg, #4db6ac, #26a69a)",
                              border: "none",
                              boxShadow: "0 4px 10px rgba(38, 166, 154, 0.3)",
                              transition: "all 0.3s ease",
                            }}
                          >
                            Browse Items
                          </Button>
                        </Link>
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </>
  );
};

export default DashboardPage;

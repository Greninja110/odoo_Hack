// rewear/client/src/components/items/AddItem.jsx

import React, { useState } from "react";
import { Form, Button, Card, Row, Col, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { FaUpload, FaTrash, FaTshirt, FaInfoCircle } from "react-icons/fa";

// Validation schema
const ItemSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters")
    .required("Title is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters")
    .required("Description is required"),
  category: Yup.string().required("Category is required"),
  size: Yup.string().required("Size is required"),
  condition: Yup.string().required("Condition is required"),
  tags: Yup.string(),
});

const AddItem = () => {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      setError("You can only upload up to 5 images");
      return;
    }

    setImages([...images, ...files]);

    // Create previews
    const newPreviews = [...previews];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        setPreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (images.length === 0) {
        setError("Please upload at least one image");
        setSubmitting(false);
        return;
      }

      setError(null);

      // Prepare form data for upload
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("category", values.category);
      formData.append("size", values.size);
      formData.append("condition", values.condition);
      formData.append("tags", values.tags);

      images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });

      // Submit the form
      console.log("Submitting item with values:", values);
      console.log("Images to upload:", images);

      // In a real app, you would call the API here
      // Using formData with an actual API call

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirect to the item page or dashboard
      // rewear/client/src/components/items/AddItem.jsx (continued)

      // Redirect to the item page or dashboard
      navigate("/dashboard", {
        state: {
          success: true,
          message:
            "Item added successfully! It will be visible once approved by an admin.",
        },
      });
    } catch (err) {
      console.error("Error adding item:", err);
      setError(
        err.response?.data?.message || "Failed to add item. Please try again."
      );
      setSubmitting(false);
    }
  };

  return (
    <Card
      style={{
        borderRadius: "12px",
        overflow: "hidden",
        border: "none",
        boxShadow: "0 5px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Card.Body className="p-4">
        <h2 className="mb-4" style={{ fontWeight: "600", color: "#263238" }}>
          <FaTshirt className="me-2" style={{ color: "#4db6ac" }} />
          Add New Item
        </h2>

        {error && (
          <Alert
            variant="danger"
            dismissible
            onClose={() => setError(null)}
            style={{
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(244, 67, 54, 0.1)",
              border: "none",
              background: "rgba(244, 67, 54, 0.1)",
              borderLeft: "4px solid #f44336",
            }}
          >
            {error}
          </Alert>
        )}

        <Formik
          initialValues={{
            title: "",
            description: "",
            category: "",
            size: "",
            condition: "Good",
            tags: "",
          }}
          validationSchema={ItemSchema}
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
              <div
                className="mb-4 p-3"
                style={{
                  background: "rgba(38, 166, 154, 0.05)",
                  borderRadius: "10px",
                  border: "1px solid rgba(38, 166, 154, 0.2)",
                }}
              >
                <h5 style={{ fontWeight: "600", color: "#455a64" }}>
                  Item Images
                </h5>
                <p className="text-muted small mb-3">
                  <FaInfoCircle className="me-1" />
                  Upload up to 5 images. First image will be the main display
                  image.
                </p>

                <div className="image-upload-container mb-3">
                  <Row>
                    {previews.map((preview, index) => (
                      <Col key={index} xs={6} md={4} lg={3} className="mb-3">
                        <div className="position-relative">
                          <div
                            style={{
                              width: "100%",
                              paddingTop: "100%", // 1:1 Aspect Ratio
                              borderRadius: "10px",
                              overflow: "hidden",
                              position: "relative",
                              boxShadow: "0 3px 10px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            <img
                              src={preview}
                              alt={`Preview ${index}`}
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                          <Button
                            variant="danger"
                            size="sm"
                            className="position-absolute top-0 end-0 m-1"
                            style={{
                              borderRadius: "50%",
                              width: "28px",
                              height: "28px",
                              padding: "0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                            }}
                            onClick={() => removeImage(index)}
                          >
                            <FaTrash size={12} />
                          </Button>
                          {index === 0 && (
                            <div
                              className="position-absolute bottom-0 start-0 m-1 px-2 py-1"
                              style={{
                                background: "rgba(38, 166, 154, 0.8)",
                                color: "white",
                                borderRadius: "5px",
                                fontSize: "0.7rem",
                                fontWeight: "500",
                              }}
                            >
                              Main
                            </div>
                          )}
                        </div>
                      </Col>
                    ))}

                    {previews.length < 5 && (
                      <Col xs={6} md={4} lg={3} className="mb-3">
                        <div
                          className="upload-placeholder"
                          style={{
                            width: "100%",
                            paddingTop: "100%", // 1:1 Aspect Ratio
                            border: "2px dashed #ced4da",
                            borderRadius: "10px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                            background: "#f8f9fa",
                            position: "relative",
                          }}
                          onClick={() =>
                            document.getElementById("imageUpload").click()
                          }
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <FaUpload size={30} className="text-muted mb-2" />
                            <p className="text-muted mb-0 small">Add Image</p>
                          </div>
                        </div>
                        <Form.Control
                          id="imageUpload"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          style={{ display: "none" }}
                        />
                      </Col>
                    )}
                  </Row>
                </div>
              </div>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: "500", color: "#455a64" }}>
                      Title
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.title && errors.title}
                      placeholder="Enter a descriptive title"
                      style={{
                        borderRadius: "8px",
                        padding: "0.6rem 1rem",
                        border: "1px solid #e0e0e0",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.title}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: "500", color: "#455a64" }}>
                      Category
                    </Form.Label>
                    <Form.Select
                      name="category"
                      value={values.category}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.category && errors.category}
                      style={{
                        borderRadius: "8px",
                        padding: "0.6rem 1rem",
                        border: "1px solid #e0e0e0",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                      }}
                    >
                      <option value="">Select category</option>
                      <option value="shirts">Shirts</option>
                      <option value="tshirts">T-Shirts</option>
                      <option value="pants">Pants</option>
                      <option value="jeans">Jeans</option>
                      <option value="dresses">Dresses</option>
                      <option value="skirts">Skirts</option>
                      <option value="jackets">Jackets</option>
                      <option value="hoodies">Hoodies</option>
                      <option value="sweaters">Sweaters</option>
                      <option value="shoes">Shoes</option>
                      <option value="accessories">Accessories</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.category}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: "500", color: "#455a64" }}>
                      Size
                    </Form.Label>
                    <Form.Select
                      name="size"
                      value={values.size}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.size && errors.size}
                      style={{
                        borderRadius: "8px",
                        padding: "0.6rem 1rem",
                        border: "1px solid #e0e0e0",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                      }}
                    >
                      <option value="">Select size</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                      <option value="XXXL">XXXL</option>
                      <option value="other">
                        Other (specify in description)
                      </option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.size}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: "500", color: "#455a64" }}>
                      Condition
                    </Form.Label>
                    <Form.Select
                      name="condition"
                      value={values.condition}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.condition && errors.condition}
                      style={{
                        borderRadius: "8px",
                        padding: "0.6rem 1rem",
                        border: "1px solid #e0e0e0",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                      }}
                    >
                      <option value="New">New (with tags)</option>
                      <option value="Like New">Like New (no tags)</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.condition}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: "500", color: "#455a64" }}>
                  Description
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.description && errors.description}
                  placeholder="Provide detailed description including brand, material, measurements, etc."
                  style={{
                    borderRadius: "8px",
                    padding: "0.6rem 1rem",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label style={{ fontWeight: "500", color: "#455a64" }}>
                  Tags (comma separated)
                </Form.Label>
                <Form.Control
                  type="text"
                  name="tags"
                  value={values.tags}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.tags && errors.tags}
                  placeholder="e.g., vintage, summer, casual"
                  style={{
                    borderRadius: "8px",
                    padding: "0.6rem 1rem",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                  }}
                />
                <Form.Text className="text-muted">
                  Add relevant tags to help others find your item.
                </Form.Text>
                <Form.Control.Feedback type="invalid">
                  {errors.tags}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="d-grid">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  style={{
                    borderRadius: "30px",
                    padding: "0.8rem",
                    fontWeight: "500",
                    background: "linear-gradient(135deg, #4db6ac, #26a69a)",
                    border: "none",
                    boxShadow: "0 4px 10px rgba(38, 166, 154, 0.3)",
                    transition: "all 0.3s ease",
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
                      <span className="ms-2">Submitting...</span>
                    </>
                  ) : (
                    "Submit Listing"
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
};

export default AddItem;

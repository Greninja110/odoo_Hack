// File: rewear/client/src/components/products/CategoryBrowser.jsx

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Nav, Breadcrumb } from "react-bootstrap";
import axios from "axios";
import Loader from "../common/Loader";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const CategoryBrowser = () => {
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/images/categories`);

        if (response.data.status === "success") {
          setCategories(response.data.data.categories);

          // Group categories by parent
          const categoriesByParent = {};
          response.data.data.categories.forEach((category) => {
            const parent = category.parent || "root";
            if (!categoriesByParent[parent]) {
              categoriesByParent[parent] = [];
            }
            categoriesByParent[parent].push(category);
          });

          // Set top-level categories for initial display
          if (
            categoriesByParent["root"] &&
            categoriesByParent["root"].length > 0
          ) {
            setSelectedCategory(categoriesByParent["root"][0].path);
          }
        } else {
          setError("Failed to load categories");
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Error loading categories. Please try again.");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch images when selected category changes
  useEffect(() => {
    if (selectedCategory) {
      const fetchImages = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
            `${API_URL}/images/category/${selectedCategory}`
          );

          if (response.data.status === "success") {
            setImages(response.data.data.images);

            // Update breadcrumbs
            const parts = selectedCategory.split("/");
            const crumbs = [];
            let currentPath = "";

            parts.forEach((part, index) => {
              currentPath = currentPath ? `${currentPath}/${part}` : part;
              crumbs.push({
                text: part,
                path: currentPath,
                active: index === parts.length - 1,
              });
            });

            setBreadcrumbs(crumbs);
          } else {
            setError("Failed to load images");
          }

          setLoading(false);
        } catch (err) {
          console.error("Error fetching images:", err);
          setError("Error loading images. Please try again.");
          setLoading(false);
        }
      };

      fetchImages();
    }
  }, [selectedCategory]);

  // Get child categories for the current selected category
  const getChildCategories = () => {
    if (!selectedCategory) return [];

    return categories.filter((cat) => {
      return cat.parent === selectedCategory;
    });
  };

  // Handle category selection
  const handleCategorySelect = (categoryPath) => {
    setSelectedCategory(categoryPath);
  };

  // Handle breadcrumb navigation
  const handleBreadcrumbClick = (path) => {
    setSelectedCategory(path);
  };

  if (loading && !categories.length) return <Loader />;
  if (error) return <div className="text-center text-danger my-5">{error}</div>;

  return (
    <Container className="py-4">
      <h1 className="mb-4">Product Catalog</h1>

      {/* Breadcrumb navigation */}
      {breadcrumbs.length > 0 && (
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item
            onClick={() => handleBreadcrumbClick(breadcrumbs[0].path)}
          >
            Home
          </Breadcrumb.Item>
          {breadcrumbs.map((crumb, index) => (
            <Breadcrumb.Item
              key={index}
              active={crumb.active}
              onClick={() => !crumb.active && handleBreadcrumbClick(crumb.path)}
            >
              {crumb.text}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      )}

      <Row>
        {/* Category sidebar */}
        <Col md={3} className="mb-4">
          <Card>
            <Card.Header>Categories</Card.Header>
            <Card.Body className="p-0">
              <Nav className="flex-column">
                {getChildCategories().length > 0
                  ? getChildCategories().map((category, index) => (
                      <Nav.Link
                        key={index}
                        className="py-2 px-3 border-bottom"
                        onClick={() => handleCategorySelect(category.path)}
                        active={selectedCategory === category.path}
                      >
                        {category.name}
                      </Nav.Link>
                    ))
                  : categories
                      .filter((cat) => !cat.parent)
                      .map((category, index) => (
                        <Nav.Link
                          key={index}
                          className="py-2 px-3 border-bottom"
                          onClick={() => handleCategorySelect(category.path)}
                          active={selectedCategory === category.path}
                        >
                          {category.name}
                        </Nav.Link>
                      ))}
              </Nav>
            </Card.Body>
          </Card>
        </Col>

        {/* Image grid */}
        <Col md={9}>
          {loading ? (
            <Loader />
          ) : (
            <>
              <h2 className="mb-3">
                {breadcrumbs.length > 0
                  ? breadcrumbs[breadcrumbs.length - 1].text
                  : "Products"}
              </h2>

              {/* Subcategories if any */}
              {getChildCategories().length > 0 && (
                <div className="mb-4">
                  <h5>Subcategories</h5>
                  <Row>
                    {getChildCategories().map((category, index) => (
                      <Col key={index} xs={6} md={4} lg={3} className="mb-3">
                        <Card
                          className="h-100 category-card"
                          onClick={() => handleCategorySelect(category.path)}
                          style={{ cursor: "pointer" }}
                        >
                          <Card.Body className="text-center">
                            <Card.Title>{category.name}</Card.Title>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}

              {/* Images */}
              {images.length > 0 ? (
                <Row>
                  {images.map((image, index) => (
                    <Col key={index} xs={6} md={4} lg={3} className="mb-4">
                      <Card className="h-100 product-card">
                        <Card.Img
                          variant="top"
                          src={image.url}
                          alt={image.metadata.original_name}
                          style={{ height: "200px", objectFit: "cover" }}
                        />
                        <Card.Body>
                          <Card.Title className="h6">
                            {image.metadata.gender
                              ? `${image.metadata.gender === "men" ? "Men's" : "Women's"} `
                              : ""}
                            {image.metadata.color
                              ? `${image.metadata.color} `
                              : ""}
                            {image.metadata.product_type || "Product"}
                          </Card.Title>
                          {image.metadata.fit && (
                            <Card.Text className="small text-muted">
                              {image.metadata.fit.charAt(0).toUpperCase() +
                                image.metadata.fit.slice(1)}
                            </Card.Text>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="text-center py-5">
                  <p>
                    No images found in this category. Select a subcategory or
                    browse other categories.
                  </p>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CategoryBrowser;

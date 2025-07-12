// rewear/client/src/pages/HomePage.jsx

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Carousel,
  Pagination,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { itemsService } from "../services/items.service";
import ItemCard from "../components/items/ItemCard";
import Loader from "../components/common/Loader";

const HomePage = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        // Fetch featured items
        const featuredResponse = await itemsService.getFeaturedItems();
        setFeaturedItems(featuredResponse.data);

        // Fetch categories
        const categoriesResponse = await itemsService.getCategories();
        setCategories(categoriesResponse.data);

        // Fetch items for first page
        const itemsResponse = await itemsService.getItems({
          page: currentPage,
          limit: itemsPerPage,
        });

        setItems(itemsResponse.data.items);
        setTotalPages(Math.ceil(itemsResponse.data.total / itemsPerPage));

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-center text-danger my-5">{error}</div>;

  return (
    <>
      {/* Enhanced Hero Section */}
      <section className="hero-section text-center text-white">
        <Container>
          <h1 className="display-4">ReWear - Community Clothing Exchange</h1>
          <p className="lead mb-4">
            Exchange unused clothing through direct swaps or our point-based
            redemption system. Join our sustainable fashion movement and help
            reduce textile waste!
          </p>
          <div className="d-flex justify-content-center flex-wrap">
            <Link to="/items">
              <Button variant="primary" size="lg" className="me-2 mb-2">
                Browse Items
              </Button>
            </Link>
            <Link to="/items/new">
              <Button variant="success" size="lg" className="mb-2">
                List an Item
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      <Container>
        {/* Featured Items Carousel */}
        <section className="featured-items mb-5">
          <div className="text-center">
            <h2 className="section-title">Featured Items</h2>
          </div>

          {featuredItems.length > 0 ? (
            <Carousel interval={5000} className="shadow">
              {featuredItems.map((item) => (
                <Carousel.Item key={item.id}>
                  <img
                    className="d-block w-100"
                    src={item.imageUrl}
                    alt={item.title}
                  />
                  <Carousel.Caption>
                    <h3>{item.title}</h3>
                    <p>{item.description.substring(0, 100)}...</p>
                    <Link to={`/items/${item.id}`}>
                      <Button variant="outline-light" className="mb-3">
                        View Details
                      </Button>
                    </Link>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            <Card className="text-center py-5">
              <Card.Body>
                <p className="mb-0">
                  No featured items available at the moment.
                </p>
              </Card.Body>
            </Card>
          )}
        </section>

        {/* Categories Section */}
        <section className="categories mb-5">
          <div className="text-center">
            <h2 className="section-title">Categories</h2>
          </div>
          <Row>
            {categories.map((category) => (
              <Col key={category.id} xs={6} md={4} lg={2} className="mb-4">
                <Card className="category-card text-center h-100">
                  <Card.Body>
                    <Card.Title>{category.name}</Card.Title>
                    <Link to={`/items?category=${category.id}`}>
                      <Button variant="link" className="p-0">
                        View Items
                      </Button>
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Recent Items */}
        <section className="recent-items mb-5">
          <div className="text-center">
            <h2 className="section-title">Recent Items</h2>
          </div>

          {items.length > 0 ? (
            <Row>
              {items.map((item) => (
                <Col
                  key={item.id}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  className="mb-4"
                >
                  <ItemCard item={item} />
                </Col>
              ))}
            </Row>
          ) : (
            <Card className="text-center py-5">
              <Card.Body>
                <p className="mb-0">No items available at the moment.</p>
              </Card.Body>
            </Card>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.Prev
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                />

                {Array.from({ length: totalPages }, (_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === currentPage}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}

                <Pagination.Next
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </section>
      </Container>
    </>
  );
};

export default HomePage;

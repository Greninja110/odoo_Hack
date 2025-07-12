import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Spinner,
} from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { itemsService } from "../services/items.service";
import Loader from "../components/common/Loader";
import ItemCard from "../components/items/ItemCard";

const ItemDetailPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [similarItems, setSimilarItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        setLoading(true);
        const response = await itemsService.getItemById(id);
        setItem(response.data);

        // Fetch similar items
        const similarResponse = await itemsService.getSimilarItems(id);
        setSimilarItems(similarResponse.data);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching item details:", err);
        setError("Failed to load item details. Please try again later.");
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [id]);

  const handleSwapRequest = async () => {
    try {
      setSubmitting(true);
      // In Phase 1, this is just a placeholder for future functionality
      console.log("Swap request initiated for item:", id);
      setTimeout(() => {
        alert("Swap functionality will be implemented in the next phase.");
        setSubmitting(false);
      }, 1000);
    } catch (err) {
      console.error("Error requesting swap:", err);
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-center text-danger my-5">{error}</div>;
  if (!item) return <div className="text-center my-5">Item not found</div>;

  return (
    <Container className="py-5">
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Img
              variant="top"
              src={item.imageUrl}
              alt={item.title}
              className="img-fluid"
            />
          </Card>
        </Col>

        <Col md={6}>
          <h1>{item.title}</h1>

          <div className="mb-3">
            <Badge bg="primary" className="me-2">
              {item.category}
            </Badge>
            <Badge bg="secondary" className="me-2">
              {item.size}
            </Badge>
            <Badge bg={item.condition === "New" ? "success" : "warning"}>
              {item.condition}
            </Badge>
          </div>

          <div className="mb-4">
            <h5>Description</h5>
            <p>{item.description}</p>
          </div>

          <div className="mb-4">
            <h5>Details</h5>
            <ul className="list-unstyled">
              <li>
                <strong>Status:</strong> {item.status}
              </li>
              <li>
                <strong>Listed by:</strong> {item.uploader.username}
              </li>
              <li>
                <strong>Location:</strong>{" "}
                {item.uploader.city || "Not specified"}
              </li>
              <li>
                <strong>Listed on:</strong>{" "}
                {new Date(item.createdAt).toLocaleDateString()}
              </li>
            </ul>
          </div>

          <div className="d-grid gap-2">
            <Button
              variant="primary"
              size="lg"
              onClick={handleSwapRequest}
              disabled={submitting}
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
                  <span className="ms-2">Processing...</span>
                </>
              ) : (
                "Request to Swap"
              )}
            </Button>
          </div>
        </Col>
      </Row>

      {/* Similar Items Section */}
      <section className="similar-items mt-5">
        <h2 className="section-title mb-4">Similar Items</h2>
        <Row>
          {similarItems.length > 0 ? (
            similarItems.map((similarItem) => (
              <Col key={similarItem.id} xs={12} sm={6} md={3} className="mb-4">
                <ItemCard item={similarItem} />
              </Col>
            ))
          ) : (
            <Col xs={12}>
              <div className="text-center py-4">
                <p>No similar items found.</p>
              </div>
            </Col>
          )}
        </Row>
      </section>
    </Container>
  );
};

export default ItemDetailPage;

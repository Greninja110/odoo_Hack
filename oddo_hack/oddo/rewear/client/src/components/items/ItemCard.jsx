import React from "react";
import { Card, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const ItemCard = ({ item, showControls = false, onEdit, onDelete }) => {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={
          item.imageUrl || "https://via.placeholder.com/300x200?text=No+Image"
        }
        alt={item.title}
        style={{ height: "200px", objectFit: "cover" }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{item.title}</Card.Title>

        <div className="mb-2">
          {item.category && (
            <Badge bg="primary" className="me-1">
              {item.category}
            </Badge>
          )}
          {item.size && (
            <Badge bg="secondary" className="me-1">
              {item.size}
            </Badge>
          )}
          {item.condition && (
            <Badge bg={item.condition === "New" ? "success" : "warning"}>
              {item.condition}
            </Badge>
          )}
        </div>

        <Card.Text className="flex-grow-1">
          {item.description && item.description.length > 80
            ? `${item.description.substring(0, 80)}...`
            : item.description}
        </Card.Text>

        <div className="d-flex justify-content-between mt-auto">
          <Link to={`/items/${item.id}`}>
            <Button variant="outline-primary" size="sm">
              View Details
            </Button>
          </Link>

          {showControls && (
            <div>
              {onEdit && (
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="me-1"
                  onClick={() => onEdit(item.id)}
                >
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onDelete(item.id)}
                >
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ItemCard;

// rewear/client/src/pages/AddItemPage.jsx

import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import AddItem from "../components/items/AddItem";

const AddItemPage = () => {
  return (
    <>
      {/* Add Item Hero Section */}
      <section className="add-item-hero-section text-center text-white">
        <Container>
          <h1 className="display-5">List a New Item</h1>
          <p className="lead">
            Share your clothing items with the community for swapping or selling
          </p>
        </Container>
      </section>

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={10}>
            <AddItem />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AddItemPage;

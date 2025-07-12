// rewear/client/src/pages/RegisterPage.jsx

import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import Register from "../components/auth/Register";

const RegisterPage = () => {
  return (
    <>
      {/* Add matching hero section */}
      <section className="auth-hero-section text-center text-white">
        <Container>
          <h1 className="display-5">Join the ReWear Community</h1>
          <p className="lead">
            Create an account to start swapping and reducing textile waste
          </p>
        </Container>
      </section>

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="auth-card">
              <Card.Body className="p-4">
                <Register />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default RegisterPage;

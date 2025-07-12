// rewear/client/src/pages/LoginPage.jsx

import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import Login from "../components/auth/Login";

const LoginPage = () => {
  return (
    <>
      {/* Add matching hero section */}
      <section className="auth-hero-section text-center text-white">
        <Container>
          <h1 className="display-5">Welcome Back to ReWear</h1>
          <p className="lead">
            Sign in to continue your sustainable fashion journey
          </p>
        </Container>
      </section>

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="auth-card">
              <Card.Body className="p-4">
                <Login />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default LoginPage;

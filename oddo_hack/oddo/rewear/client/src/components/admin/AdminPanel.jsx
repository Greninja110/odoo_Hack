// rewear/client/src/components/admin/AdminPanel.jsx

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Nav,
  Tab,
  Table,
  Button,
  Badge,
  Form,
  Alert,
} from "react-bootstrap";
import {
  FaUsers,
  FaBoxOpen,
  FaExchangeAlt,
  FaUserCheck,
  FaUserTimes,
  FaCheck,
  FaTimes,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import Loader from "../common/Loader";
import Pagination from "../common/Pagination";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [actionSuccess, setActionSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // In a real app, you would fetch data from your API
        // For now, we'll simulate loading with mock data
        setTimeout(() => {
          // Mock users data
          const mockUsers = Array(25)
            .fill()
            .map((_, idx) => ({
              id: idx + 1,
              username: `user${idx + 1}`,
              email: `user${idx + 1}@example.com`,
              status: idx % 3 === 0 ? "pending" : "approved",
              registeredAt: new Date(
                Date.now() -
                  Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
              ).toISOString(),
            }));

          // Mock items data
          const mockItems = Array(30)
            .fill()
            .map((_, idx) => ({
              id: idx + 1,
              title: `Item ${idx + 1}`,
              category: ["Shirts", "Pants", "Jackets", "Shoes"][idx % 4],
              status: ["pending", "approved", "rejected"][idx % 3],
              owner: `user${Math.floor(Math.random() * 25) + 1}`,
              listedAt: new Date(
                Date.now() -
                  Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
              ).toISOString(),
            }));

          setUsers(mockUsers);
          setItems(mockItems);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError("Failed to load data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, [itemsPerPage]);

  // Handle search filter
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle status filter
  const handleStatusFilter = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1); // Reset to first page on new filter
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle user approval/rejection
  const handleUserAction = (userId, action) => {
    // In a real app, you would call your API here
    console.log(`User ${userId} ${action}`);

    // Update local state to reflect the change
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          return {
            ...user,
            status: action === "approve" ? "approved" : "rejected",
          };
        }
        return user;
      })
    );

    // Show success message
    setActionSuccess(
      `User ${action === "approve" ? "approved" : "rejected"} successfully!`
    );
    setTimeout(() => setActionSuccess(null), 3000);
  };

  // Handle item approval/rejection
  const handleItemAction = (itemId, action) => {
    // In a real app, you would call your API here
    console.log(`Item ${itemId} ${action}`);

    // Update local state to reflect the change
    setItems(
      items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            status: action === "approve" ? "approved" : "rejected",
          };
        }
        return item;
      })
    );

    // Show success message
    setActionSuccess(
      `Item ${action === "approve" ? "approved" : "rejected"} successfully!`
    );
    setTimeout(() => setActionSuccess(null), 3000);
  };

  // Filter data based on search term and status filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Paginate data
  const paginateData = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  // Calculate total pages for pagination
  const userTotalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const itemTotalPages = Math.ceil(filteredItems.length / itemsPerPage);

  if (loading) return <Loader />;
  if (error) return <div className="text-center text-danger my-5">{error}</div>;

  return (
    <>
      {/* Admin Panel Hero Section */}
      <section className="admin-hero-section text-center text-white">
        <Container>
          <h1 className="display-5">Administration Panel</h1>
          <p className="lead">
            Manage users, listings, and platform operations
          </p>
        </Container>
      </section>

      <Container className="py-4">
        {actionSuccess && (
          <Alert
            variant="success"
            dismissible
            onClose={() => setActionSuccess(null)}
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
              {actionSuccess}
            </div>
          </Alert>
        )}

        <Card
          className="admin-card"
          style={{
            borderRadius: "12px",
            overflow: "hidden",
            border: "none",
            boxShadow: "0 5px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Card.Body className="p-0">
            <Tab.Container
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
            >
              <Row className="g-0">
                <Col
                  md={3}
                  className="admin-sidebar"
                  style={{ background: "#263238" }}
                >
                  <div className="p-4">
                    <h4
                      className="text-white mb-4"
                      style={{ fontWeight: "600" }}
                    >
                      Admin Controls
                    </h4>
                    <Nav variant="pills" className="flex-column">
                      <Nav.Item className="mb-2">
                        <Nav.Link
                          eventKey="users"
                          className="d-flex align-items-center admin-nav-link"
                          style={{
                            padding: "0.8rem 1rem",
                            borderRadius: "8px",
                            color:
                              activeTab === "users"
                                ? "#fff"
                                : "rgba(255,255,255,0.7)",
                            background:
                              activeTab === "users"
                                ? "linear-gradient(135deg, #4db6ac, #26a69a)"
                                : "transparent",
                            transition: "all 0.3s ease",
                          }}
                        >
                          <FaUsers className="me-2" /> Manage Users
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item className="mb-2">
                        <Nav.Link
                          eventKey="items"
                          className="d-flex align-items-center admin-nav-link"
                          style={{
                            padding: "0.8rem 1rem",
                            borderRadius: "8px",
                            color:
                              activeTab === "items"
                                ? "#fff"
                                : "rgba(255,255,255,0.7)",
                            background:
                              activeTab === "items"
                                ? "linear-gradient(135deg, #4db6ac, #26a69a)"
                                : "transparent",
                            transition: "all 0.3s ease",
                          }}
                        >
                          <FaBoxOpen className="me-2" /> Manage Listings
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item className="mb-2">
                        <Nav.Link
                          eventKey="orders"
                          className="d-flex align-items-center admin-nav-link"
                          style={{
                            padding: "0.8rem 1rem",
                            borderRadius: "8px",
                            color:
                              activeTab === "orders"
                                ? "#fff"
                                : "rgba(255,255,255,0.7)",
                            background:
                              activeTab === "orders"
                                ? "linear-gradient(135deg, #4db6ac, #26a69a)"
                                : "transparent",
                            transition: "all 0.3s ease",
                          }}
                        >
                          <FaExchangeAlt className="me-2" /> Manage Orders
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </div>
                </Col>

                <Col md={9}>
                  <Tab.Content>
                    {/* Users Tab */}
                    <Tab.Pane eventKey="users" className="p-4">
                      <h2
                        className="mb-4"
                        style={{ fontWeight: "600", color: "#263238" }}
                      >
                        Manage Users
                      </h2>

                      <Row className="mb-4 align-items-center">
                        <Col md={6} className="mb-3 mb-md-0">
                          <div
                            className="search-container"
                            style={{ position: "relative" }}
                          >
                            <Form.Control
                              type="text"
                              placeholder="Search by username or email"
                              value={searchTerm}
                              onChange={handleSearch}
                              style={{
                                borderRadius: "30px",
                                padding: "0.6rem 1rem 0.6rem 2.5rem",
                                border: "1px solid #e0e0e0",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                              }}
                            />
                            <FaSearch
                              style={{
                                position: "absolute",
                                left: "1rem",
                                top: "0.85rem",
                                color: "#9e9e9e",
                              }}
                            />
                          </div>
                        </Col>

                        <Col md={6}>
                          <div
                            className="filter-container"
                            style={{ position: "relative" }}
                          >
                            <Form.Select
                              value={filterStatus}
                              onChange={handleStatusFilter}
                              style={{
                                borderRadius: "30px",
                                padding: "0.6rem 1rem 0.6rem 2.5rem",
                                border: "1px solid #e0e0e0",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                              }}
                            >
                              <option value="all">All Statuses</option>
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                              <option value="rejected">Rejected</option>
                            </Form.Select>
                            <FaFilter
                              style={{
                                position: "absolute",
                                left: "1rem",
                                top: "0.85rem",
                                color: "#9e9e9e",
                              }}
                            />
                          </div>
                        </Col>
                      </Row>

                      <div
                        className="table-responsive"
                        style={{
                          borderRadius: "10px",
                          overflow: "hidden",
                          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                        }}
                      >
                        <Table hover className="align-middle mb-0">
                          <thead style={{ background: "#f5f5f5" }}>
                            <tr>
                              <th className="py-3">#</th>
                              <th className="py-3">Username</th>
                              <th className="py-3">Email</th>
                              <th className="py-3">Status</th>
                              <th className="py-3">Registered</th>
                              <th className="py-3">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginateData(filteredUsers).map((user) => (
                              <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>
                                  <span style={{ fontWeight: "500" }}>
                                    {user.username}
                                  </span>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                  {user.status === "pending" && (
                                    <Badge
                                      bg="warning"
                                      style={{
                                        fontWeight: "500",
                                        borderRadius: "30px",
                                        padding: "0.35em 0.8em",
                                      }}
                                    >
                                      Pending
                                    </Badge>
                                  )}
                                  {user.status === "approved" && (
                                    <Badge
                                      bg="success"
                                      style={{
                                        fontWeight: "500",
                                        borderRadius: "30px",
                                        padding: "0.35em 0.8em",
                                      }}
                                    >
                                      Approved
                                    </Badge>
                                  )}
                                  {user.status === "rejected" && (
                                    <Badge
                                      bg="danger"
                                      style={{
                                        fontWeight: "500",
                                        borderRadius: "30px",
                                        padding: "0.35em 0.8em",
                                      }}
                                    >
                                      Rejected
                                    </Badge>
                                  )}
                                </td>
                                <td>
                                  {new Date(
                                    user.registeredAt
                                  ).toLocaleDateString()}
                                </td>
                                <td>
                                  {user.status === "pending" && (
                                    <div className="d-flex">
                                      <Button
                                        variant="success"
                                        size="sm"
                                        className="me-2"
                                        onClick={() =>
                                          handleUserAction(user.id, "approve")
                                        }
                                        style={{
                                          borderRadius: "6px",
                                          padding: "0.25rem 0.5rem",
                                          fontWeight: "500",
                                          boxShadow:
                                            "0 2px 4px rgba(38, 166, 154, 0.2)",
                                        }}
                                      >
                                        <FaUserCheck className="me-1" /> Approve
                                      </Button>
                                      <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() =>
                                          handleUserAction(user.id, "reject")
                                        }
                                        style={{
                                          borderRadius: "6px",
                                          padding: "0.25rem 0.5rem",
                                          fontWeight: "500",
                                          boxShadow:
                                            "0 2px 4px rgba(244, 67, 54, 0.2)",
                                        }}
                                      >
                                        <FaUserTimes className="me-1" /> Reject
                                      </Button>
                                    </div>
                                  )}
                                  {user.status !== "pending" && (
                                    <Button
                                      variant="outline-secondary"
                                      size="sm"
                                      disabled
                                      style={{
                                        borderRadius: "6px",
                                        padding: "0.25rem 0.75rem",
                                      }}
                                    >
                                      Already {user.status}
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            ))}

                            {filteredUsers.length === 0 && (
                              <tr>
                                <td colSpan="6" className="text-center py-4">
                                  <div
                                    style={{
                                      color: "#9e9e9e",
                                      fontWeight: "500",
                                    }}
                                  >
                                    No users found matching your criteria.
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </div>

                      {filteredUsers.length > 0 && userTotalPages > 1 && (
                        <div className="mt-4">
                          <Pagination
                            currentPage={currentPage}
                            totalPages={userTotalPages}
                            onPageChange={handlePageChange}
                          />
                        </div>
                      )}
                    </Tab.Pane>

                    {/* Items Tab */}
                    <Tab.Pane eventKey="items" className="p-4">
                      <h2
                        className="mb-4"
                        style={{ fontWeight: "600", color: "#263238" }}
                      >
                        Manage Listings
                      </h2>

                      <Row className="mb-4 align-items-center">
                        <Col md={6} className="mb-3 mb-md-0">
                          <div
                            className="search-container"
                            style={{ position: "relative" }}
                          >
                            <Form.Control
                              type="text"
                              placeholder="Search by title, owner, or category"
                              value={searchTerm}
                              onChange={handleSearch}
                              style={{
                                borderRadius: "30px",
                                padding: "0.6rem 1rem 0.6rem 2.5rem",
                                border: "1px solid #e0e0e0",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                              }}
                            />
                            <FaSearch
                              style={{
                                position: "absolute",
                                left: "1rem",
                                top: "0.85rem",
                                color: "#9e9e9e",
                              }}
                            />
                          </div>
                        </Col>

                        <Col md={6}>
                          <div
                            className="filter-container"
                            style={{ position: "relative" }}
                          >
                            <Form.Select
                              value={filterStatus}
                              onChange={handleStatusFilter}
                              style={{
                                borderRadius: "30px",
                                padding: "0.6rem 1rem 0.6rem 2.5rem",
                                border: "1px solid #e0e0e0",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                              }}
                            >
                              <option value="all">All Statuses</option>
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                              <option value="rejected">Rejected</option>
                            </Form.Select>
                            <FaFilter
                              style={{
                                position: "absolute",
                                left: "1rem",
                                top: "0.85rem",
                                color: "#9e9e9e",
                              }}
                            />
                          </div>
                        </Col>
                      </Row>

                      <div
                        className="table-responsive"
                        style={{
                          borderRadius: "10px",
                          overflow: "hidden",
                          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                        }}
                      >
                        <Table hover className="align-middle mb-0">
                          <thead style={{ background: "#f5f5f5" }}>
                            <tr>
                              <th className="py-3">#</th>
                              <th className="py-3">Title</th>
                              <th className="py-3">Category</th>
                              <th className="py-3">Owner</th>
                              <th className="py-3">Status</th>
                              <th className="py-3">Listed</th>
                              <th className="py-3">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginateData(filteredItems).map((item) => (
                              <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>
                                  <span style={{ fontWeight: "500" }}>
                                    {item.title}
                                  </span>
                                </td>
                                <td>
                                  <Badge
                                    bg="primary"
                                    style={{
                                      fontWeight: "500",
                                      borderRadius: "30px",
                                      padding: "0.35em 0.8em",
                                      background: "#4db6ac",
                                    }}
                                  >
                                    {item.category}
                                  </Badge>
                                </td>
                                <td>{item.owner}</td>
                                <td>
                                  {item.status === "pending" && (
                                    <Badge
                                      bg="warning"
                                      style={{
                                        fontWeight: "500",
                                        borderRadius: "30px",
                                        padding: "0.35em 0.8em",
                                      }}
                                    >
                                      Pending
                                    </Badge>
                                  )}
                                  {item.status === "approved" && (
                                    <Badge
                                      bg="success"
                                      style={{
                                        fontWeight: "500",
                                        borderRadius: "30px",
                                        padding: "0.35em 0.8em",
                                      }}
                                    >
                                      Approved
                                    </Badge>
                                  )}
                                  {item.status === "rejected" && (
                                    <Badge
                                      bg="danger"
                                      style={{
                                        fontWeight: "500",
                                        borderRadius: "30px",
                                        padding: "0.35em 0.8em",
                                      }}
                                    >
                                      Rejected
                                    </Badge>
                                  )}
                                </td>
                                <td>
                                  {new Date(item.listedAt).toLocaleDateString()}
                                </td>
                                <td>
                                  {item.status === "pending" && (
                                    <div className="d-flex">
                                      <Button
                                        variant="success"
                                        size="sm"
                                        className="me-2"
                                        onClick={() =>
                                          handleItemAction(item.id, "approve")
                                        }
                                        style={{
                                          borderRadius: "6px",
                                          padding: "0.25rem 0.5rem",
                                          fontWeight: "500",
                                          boxShadow:
                                            "0 2px 4px rgba(38, 166, 154, 0.2)",
                                        }}
                                      >
                                        <FaCheck className="me-1" /> Approve
                                      </Button>
                                      <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() =>
                                          handleItemAction(item.id, "reject")
                                        }
                                        style={{
                                          borderRadius: "6px",
                                          padding: "0.25rem 0.5rem",
                                          fontWeight: "500",
                                          boxShadow:
                                            "0 2px 4px rgba(244, 67, 54, 0.2)",
                                        }}
                                      >
                                        <FaTimes className="me-1" /> Reject
                                      </Button>
                                    </div>
                                  )}
                                  {item.status !== "pending" && (
                                    <Button
                                      variant="outline-secondary"
                                      size="sm"
                                      disabled
                                      style={{
                                        borderRadius: "6px",
                                        padding: "0.25rem 0.75rem",
                                      }}
                                    >
                                      Already {item.status}
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            ))}

                            {filteredItems.length === 0 && (
                              <tr>
                                <td colSpan="7" className="text-center py-4">
                                  <div
                                    style={{
                                      color: "#9e9e9e",
                                      fontWeight: "500",
                                    }}
                                  >
                                    No items found matching your criteria.
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </div>

                      {filteredItems.length > 0 && itemTotalPages > 1 && (
                        <div className="mt-4">
                          <Pagination
                            currentPage={currentPage}
                            totalPages={itemTotalPages}
                            onPageChange={handlePageChange}
                          />
                        </div>
                      )}
                    </Tab.Pane>

                    {/* Orders Tab */}
                    <Tab.Pane eventKey="orders" className="p-4">
                      <h2
                        className="mb-4"
                        style={{ fontWeight: "600", color: "#263238" }}
                      >
                        Manage Orders
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
                        <p className="mb-0" style={{ fontSize: "1.1rem" }}>
                          Order management will be implemented in the next
                          phase.
                        </p>
                        <p
                          className="text-muted mt-2"
                          style={{ fontSize: "0.9rem" }}
                        >
                          You'll be able to track and manage all clothing
                          exchanges from here.
                        </p>
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default AdminPanel;

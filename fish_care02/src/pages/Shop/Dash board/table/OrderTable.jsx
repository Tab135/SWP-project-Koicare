import React from "react";
import { Table, Dropdown } from "react-bootstrap";

const OrderTable = ({ orders, onUpdateStatus, orderStatuses }) => {
  // Define the order workflow sequence
  const statusWorkflow = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];

  // Helper function to get the next allowed status
  const getNextStatusOptions = (currentStatus) => {
    const currentIndex = statusWorkflow.indexOf(currentStatus);
    if (currentIndex === -1) return []; // If status is not found in the workflow
    if (currentIndex < statusWorkflow.length - 1) {
      return [statusWorkflow[currentIndex + 1], "CANCELED"]; // Next status and "CANCELED" are allowed
    }
    return []; // No more statuses allowed, only "CANCELED"
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>User Name</th>
          <th>User Address</th>
          <th>Order Status</th>
          <th>Update Status</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.userName}</td>
            <td>{order.address}</td>
            <td>{order.orderStatus}</td>
            <td>
              {order.orderStatus !== "SHIPPED" && (
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Update Status
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {getNextStatusOptions(order.orderStatus).map(
                      (nextStatus) => (
                        <Dropdown.Item
                          key={nextStatus}
                          onClick={() => onUpdateStatus(order.id, nextStatus)}
                        >
                          {nextStatus}
                        </Dropdown.Item>
                      )
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default OrderTable;

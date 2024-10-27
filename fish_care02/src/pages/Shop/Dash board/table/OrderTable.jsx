import React from "react";
import { Table, Button, Dropdown } from "react-bootstrap";

const OrderTable = ({ orders, onUpdateStatus, orderStatuses }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>User ID</th>
          <th>Order Status</th>
          <th>Update Status</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.userId}</td>
            <td>{order.orderStatus}</td>
            <td>
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  Select Order Status
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {orderStatuses.map((orderStatus) => (
                    <Dropdown.Item
                      key={orderStatus}
                      onClick={() => onUpdateStatus(order.id, orderStatus)} // Use orderStatus here
                    >
                      {orderStatus}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default OrderTable;

import React from "react";
import { Button } from "react-bootstrap"; // Import Button from react-bootstrap if you're using it

const AddToCart = ({ userId, productId, onAdd }) => {
  const handleClick = () => {
    onAdd(productId); // Calls the onAdd function with productId
  };

  return <Button onClick={handleClick}>Add to Cart</Button>;
};

export default AddToCart;

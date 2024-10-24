// StarRating.jsx
import React from "react";
import { FaStar } from "react-icons/fa";
import "./StarRating.scss"; // Import star icon from react-icons

const StarRating = ({ rating, onRatingChange }) => {
  const stars = [1, 2, 3, 4, 5]; // Assuming a 5-star rating system

  return (
    <div>
      {stars.map((star) => (
        <span
          key={star}
          onClick={() => onRatingChange(star)}
          style={{ cursor: "pointer", color: star <= rating ? "gold" : "gray" }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;

// StarRating.jsx
import React from "react";
import "./StarRating.scss"; // Create a CSS file for styling

const StarRating = ({ rating, onRatingChange }) => {
  const stars = [1, 2, 3, 4, 5]; // Array for five stars

  return (
    <div className="star-rating">
      {stars.map((star) => (
        <span
          key={star}
          className={`star ${star <= rating ? "filled" : ""}`}
          onClick={() => onRatingChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;

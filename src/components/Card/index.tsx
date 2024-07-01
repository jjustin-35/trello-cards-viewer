import React from "react";
import { format } from "date-fns";
import { DisplayCard } from "../../apis/useTrelloCards";
import "./styles.css";

const Card: React.FC<{ card: DisplayCard }> = ({ card }) => {
  return (
    <div key={card.id} className="card">
      <h2 className="card-title">{card.name}</h2>
      <div className="card-tags">
        {card.labels.map((label, index) => (
          <span key={index} className="tag">
            {label.name}
          </span>
        ))}
      </div>
      <p className="card-desc">{card.desc || card.name}</p>
      <p className="card-date">
        {card.due ? format(new Date(card.due), "MMMM d, yyyy") : "No due date"}
      </p>
      <p className="card-hours">Hours: {card.hours}</p>
    </div>
  );
};

export default Card;

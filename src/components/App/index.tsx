import React, { useState } from "react";
import { format, parse, isSameDay } from "date-fns";
import useTrelloCards from "../../apis/trelloCards";
import "./styles.css";

const App: React.FC = () => {
  const { data: cards } = useTrelloCards();
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );

  const getCardsForSelectedDate = () => {
    const selectedCards = cards?.filter(
      (card) =>
        card.due &&
        isSameDay(
          parse(selectedDate, "yyyy-MM-dd", new Date()),
          new Date(card.due)
        )
    );

    if (!selectedCards) {
      return [];
    }

    // Adjust hours to sum up to 8
    const totalHours = selectedCards.reduce((sum, card) => sum + card.hours, 0);
    if (totalHours !== 8) {
      const adjustmentFactor = 8 / totalHours;
      return selectedCards.map((card) => ({
        ...card,
        hours: Math.round(card.hours * adjustmentFactor),
      }));
    }

    return selectedCards;
  };

  const cardsData = getCardsForSelectedDate();

  return (
    <div className="App">
      <h1>Trello Card Viewer</h1>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />
      <div>
        {cardsData.map((card) => (
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
              {card.due
                ? format(new Date(card.due), "MMMM d, yyyy")
                : "No due date"}
            </p>
            <p className="card-hours">Hours: {card.hours}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;

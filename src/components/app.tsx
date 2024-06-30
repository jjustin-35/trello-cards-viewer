import React, { useState } from "react";
import { format, parse, isSameDay } from "date-fns";
import useTrelloCards from "../apis/trelloCards";

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

  return (
    <div className="App">
      <h1>Trello Card Viewer</h1>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />
      <div>
        {getCardsForSelectedDate().map((card) => (
          <div key={card.id} className="card">
            <h2>{card.name}</h2>
            <p>Tags: {card.labels.map((label) => label.name).join(", ")}</p>
            <p>Description: {card.desc || card.name}</p>
            <p>Hours: {card.hours}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;

import React, { useState } from "react";
import { format, parse, isSameDay } from "date-fns";
import useTrelloCards from "../../apis/trelloCards";
import Card from "../Card";
import "./styles.css";

const dateFormat = "yyy-MM-dd";

const App: React.FC = () => {
  const { data: cards } = useTrelloCards();
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), dateFormat)
  );

  const getCardsForSelectedDate = () => {
    const selectedCards = cards?.filter(
      (card) =>
        card.due &&
        isSameDay(
          parse(selectedDate, dateFormat, new Date()),
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
      <h1 className="title">Trello Card Viewer</h1>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />
      <div>
        {cardsData.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
};

export default App;

import React, { useState } from "react";
import { format, parse, isSameDay } from "date-fns";
import useTrelloCards from "../../apis/useTrelloCards";
import setMetrics from "../../apis/metrics";
import Card from "../Card";
import "./styles.css";

const dateFormat = "yyyy-MM-dd";

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
      return selectedCards.map((card) => {
        const hours = Math.round(card.hours * adjustmentFactor) || 0.5;
        return {
          ...card,
          hours,
        };
      });
    }

    return selectedCards;
  };

  const cardsData = getCardsForSelectedDate();

  const onClick = async () => {
    if (!cardsData.length) {
      return;
    }

    cardsData.forEach(async (card) => {
      await setMetrics({
        subject_id: 1888,
        work_date: selectedDate,
        hours: card.hours,
        description: card.name,
      });
    });
  };

  return (
    <div className="App">
      <h1 className="title">Trello Card Viewer</h1>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => {
          setSelectedDate(e.target.value);
        }}
      />
      <div className="card-container">
        <div className="card-wrapper">
          {cardsData.map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </div>
      </div>
      <button className="app-button" onClick={onClick}>
        Add to Metrics
      </button>
    </div>
  );
};

export default App;

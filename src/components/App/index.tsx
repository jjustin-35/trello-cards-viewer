import React, { useState } from "react";
import { format, parse, isSameDay } from "date-fns";
import useTrelloCards from "../../apis/useTrelloCards";
import Card from "../Card";
import "./styles.css";
import { urgent } from "../../constants/labels";

const dateFormat = "yyyy-MM-dd";

type ApiCardData = {
  labels: string[];
  work_date: string;
  hours: number;
  description: string;
};

const App: React.FC = () => {
  const { data: cards } = useTrelloCards();
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), dateFormat)
  );

  const cardsData = (() => {
    const selectedCards = cards?.filter(
      (card) =>
        card.due &&
        isSameDay(
          parse(selectedDate, dateFormat, new Date()),
          new Date(card.due)
        )
    );

    if (!selectedCards?.length) {
      return [];
    }

    // Adjust hours to sum up to 8
    let totalHours = selectedCards.reduce((sum, card) => sum + card.hours, 0);
    if (totalHours !== 8) {
      const adjustmentFactor = 8 / totalHours;
      const adjustedCards = selectedCards.map((card) => {
        const hours = Math.round(card.hours * adjustmentFactor) || 0.5;
        return {
          ...card,
          hours,
        };
      });

      totalHours = adjustedCards.reduce((sum, card) => sum + card.hours, 0);

      if (totalHours !== 8) {
        const remainingHours = 8 - totalHours;
        let maxCard = adjustedCards[0];
        let minCard = adjustedCards[0];

        for (let card of adjustedCards) {
          if (card.hours > maxCard.hours) {
            maxCard = card;
          } else if (card.hours < minCard.hours) {
            minCard = card;
          }
        }

        if (remainingHours < 0) {
          maxCard.hours += remainingHours;
        } else {
          minCard.hours += remainingHours;
        }
      }

      return adjustedCards;
    }

    return selectedCards;
  })();

  const handleSubmit = async (data: ApiCardData) => {
    try {
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tabs[0]?.id) {
        throw new Error("No active tab found");
      }

      // 確保目標頁面是 Trello 或 Metrics
      const tab = tabs[0];
      if (
        !tab.url?.includes("trello.com") &&
        !tab.url?.includes("kdan-metrics.kdanmobile.com")
      ) {
        throw new Error("Please open Trello or Metrics page first");
      }

      const response = await chrome.tabs.sendMessage(tabs[0].id, {
        type: "SET_METRICS",
        data,
      });

      if (response?.success) {
        console.log("Metrics set successfully");
      } else {
        console.error("Failed to set metrics:", response?.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const onClick = async () => {
    if (!cardsData.length) {
      return;
    }

    cardsData.forEach(async (card) => {
      const labels = card.labels
        .map((label) => label.name)
        .filter((label) => !urgent.includes(label));
      await handleSubmit({
        labels,
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

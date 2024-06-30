import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, subMonths, parse, isSameDay } from 'date-fns';

interface TrelloCard {
  id: string;
  name: string;
  desc: string;
  labels: { name: string }[];
  due: string | null;
}

interface DisplayCard extends TrelloCard {
  hours: number;
}

const API_KEY = 'YOUR_API_KEY';
const TOKEN = 'YOUR_TOKEN';
const BOARD_ID = 'YOUR_BOARD_ID';

const App: React.FC = () => {
  const [cards, setCards] = useState<DisplayCard[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  
  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await axios.get(
        `https://api.trello.com/1/boards/${BOARD_ID}/cards`,
        {
          params: {
            key: API_KEY,
            token: TOKEN,
            fields: 'name,desc,due,labels',
          },
        }
      );

      const oneMonthAgo = subMonths(new Date(), 1);
      const filteredCards = response.data
        .filter((card: TrelloCard) => card.due && new Date(card.due) >= oneMonthAgo)
        .map((card: TrelloCard) => ({
          ...card,
          hours: Math.floor(Math.random() * 8) + 1,
        }));

      setCards(filteredCards);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };

  const getCardsForSelectedDate = () => {
    const selectedCards = cards.filter((card) =>
      card.due && isSameDay(parse(selectedDate, 'yyyy-MM-dd', new Date()), new Date(card.due))
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
            <p>Tags: {card.labels.map((label) => label.name).join(', ')}</p>
            <p>Description: {card.desc || card.name}</p>
            <p>Hours: {card.hours}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
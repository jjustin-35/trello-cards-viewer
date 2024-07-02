import useSWR from "swr";
import axios from "axios";
import { subMonths } from "date-fns";
import config from "../config";
import { apiPaths } from "../constants/apisPath";

interface TrelloCard {
  id: string;
  name: string;
  desc: string;
  labels: { name: string }[];
  due: string | null;
  dueComplete: boolean;
}

export interface DisplayCard extends TrelloCard {
  hours: number;
}

const fetchCards = async (url: string) => {
  try {
    const response = await axios.get<TrelloCard[]>(url, {
      params: {
        key: process.env.TRELLO_API_KEY,
        token: process.env.TRELLO_API_TOKEN,
        fields: "name,desc,due,dueComplete,labels",
      },
    });

    const oneMonthAgo = subMonths(new Date(), 1);
    const filteredCards: DisplayCard[] = response.data
      .filter(
        (card) =>
          card.due && new Date(card.due) >= oneMonthAgo && card.dueComplete
      )
      .map((card) => ({
        ...card,
        hours: Math.floor(Math.random() * 8) + 1,
      }));

    return filteredCards;
  } catch (error) {
    console.error("Error fetching cards:", error);
  }
};

const useTrelloCards = () =>
  useSWR<DisplayCard[]>(
    `${config.TRELLO}${apiPaths.GET_BOARD_CARDS}`,
    fetchCards
  );

export default useTrelloCards;

import config from "../config";

export enum apiPaths {
  GET_BOARD_CARDS = `/boards/${config.BOARD_ID}/cards`,
  GET_TRELLO_CREDENTIALS = "/getTrelloCredentials"
}

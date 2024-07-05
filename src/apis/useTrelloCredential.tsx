import useSWR from "swr";
import axios from "axios";
import config from "../config";
import { apiPaths } from "../constants/apisPath";

const fetcher = async (url: string) => {
  try {
    const resp = await axios.get(url);

    return resp.data;
  } catch (error) {
    console.error("Error fetching trello auth data:", error);
  }
};

const useTrelloCredential = () =>
  useSWR(`${config.TRELLO_VIEWER_CENTER}${apiPaths.GET_TRELLO_CREDENTIALS}`, fetcher);

export default useTrelloCredential;
import useSWR from "swr";
import axios from "axios";
import config from "../config";

const fetcher = (url: string) => {
  const data = axios.post(url, {});
};

const useMetrics = useSWR(`${config.METRICS}/metrics`, fetcher);

export default useMetrics;

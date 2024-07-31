import axios from "axios";
import config from "../config";
import { ApiResponse } from "../constants/types";

export interface MetricsData {
  subject_id: number;
  work_date: string;
  hours: number;
  description: string;
  labels?: string;
}

const setMetrics = async (data: MetricsData) => {
  const url = `${config.METRICS}/work_histories`;
  const accessToken = await chrome.cookies.get({
    url: config.METRICS_CLIENT,
    name: "access_token",
  });

  if (!accessToken?.value) {
    console.error("No token found");
    return;
  }

  try {
    const { data: respData } = await axios.post<
      ApiResponse<Record<string, string>>
    >(url, data, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    });

    if (respData.error_code) {
      console.log("Error setting metrics:", respData.error_code);
    }
  } catch (error) {
    console.error("Error fetching metrics:", error);
  }
};

export default setMetrics;

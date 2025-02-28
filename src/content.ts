import setMetrics from "./apis/metrics";
import { MetricsData } from "./apis/metrics";

// 監聽來自 extension 的訊息
chrome.runtime.onMessage.addListener(
  async (
    request: { type: string; data: MetricsData },
    _,
    sendResponse
  ) => {
    if (request.type === "SET_METRICS") {
      try {
        await setMetrics(request.data);
        sendResponse({ success: true });
      } catch (error) {
        console.error("Error setting metrics:", error);
        sendResponse({ success: false, error: error.message });
      }
      return true; // 表示我們會非同步回應
    }
  }
);

import setMetrics, { Subject, getSubjects, getSubjectId } from "./apis/metrics";
import { MetricsData } from "./apis/metrics";
import { projectsTransform } from "./constants/labels";

let subjects: Subject[] = [];
(async () => {
  subjects = await getSubjects();
})();

// 監聽來自 extension 的訊息
chrome.runtime.onMessage.addListener(
  (request: { type: string; data: MetricsData }, _, sendResponse) => {
    if (request.type === "SET_METRICS") {
      (async () => {
        try {
          const { labels } = request.data;
          const subjectIds = labels
            .map((label) => getSubjectId(label, subjects))
            .filter(Boolean);
          const subject_id = subjectIds?.[0] || projectsTransform.other;

          const data = {
            ...request.data,
            subject_id,
          };

          const result = await setMetrics(data);
          sendResponse({ success: !result.error });
        } catch (error) {
          console.error("Error setting metrics:", error);
          sendResponse({ success: false, error: error.message });
        }
      })();
      return true; // 表示我們會非同步回應
    }
  }
);

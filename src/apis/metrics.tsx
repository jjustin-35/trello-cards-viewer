import axios from "axios";
import config from "../config";
import { ApiResponse, isRespError } from "../constants/types";
import Cookies from "js-cookie";
import { projectsTransform, urgent } from "../constants/labels";

export interface MetricsData {
  subject_id: number;
  work_date: string;
  hours: number;
  description: string;
  labels?: string[];
}

export interface Subject {
  children: Subject[];
  id: number;
  name: string;
}

const findMatchedSubjectId = (
  label: string,
  subjects: Subject[]
): number | null => {
  if (!subjects?.length) return null;

  for (let subject of subjects) {
    if (subject.name === label) return subject.id;
    const matchedId = findMatchedSubjectId(label, subject.children);
    if (matchedId) return matchedId;
  }
  return null;
};

export const getSubjects = async () => {
  const url = `${config.METRICS}/courtyard/subject_tree?lang=zh-tw`;
  const accessToken = Cookies.get("access_token");

  if (!accessToken) {
    console.error("No token found");
    return;
  }

  try {
    const { data: respData } = await axios.get<ApiResponse<Subject[]>>(url);

    if (isRespError(respData)) {
      console.error("Error fetching subjects:", respData.error_code);
      return;
    }

    return respData.data;
  } catch (error) {
    console.error("Error fetching subjects:", error);
  }
};

export const getSubjectId = (
  label: string,
  subjects?: Subject[]
): number | null => {
  const accessToken = Cookies.get("access_token");

  if (!accessToken) {
    console.error("No token found");
    return;
  }

  if (urgent.includes(label)) return;
  if (projectsTransform[label]) return projectsTransform[label];

  const subjectId = findMatchedSubjectId(label, subjects);
  return subjectId;
};

const setMetrics = async (data: MetricsData) => {
  const url = `${config.METRICS}/work_histories`;
  const accessToken = Cookies.get("access_token");

  if (!accessToken) {
    console.error("No token found");
    return { error: true };
  }

  try {
    const { data: respData } = await axios.post<
      ApiResponse<Record<string, string>>
    >(url, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (isRespError(respData)) {
      console.log("Error setting metrics:", respData.error_code);
      return { error: true };
    }

    return { error: false };
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return { error: true };
  }
};

export default setMetrics;

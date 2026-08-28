import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";


export const fetchTodayOverview = createAsyncThunk(
  "teacherTimetable/fetchTodayOverview",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/timetable/today-overview");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch overview"
      );
    }
  }
);


export const fetchWeeklyTimetable = createAsyncThunk(
  "teacherTimetable/fetchWeeklyTimetable",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/timetable/weekly");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch timetable"
      );
    }
  }
);


export const downloadTimetablePDF = createAsyncThunk(
  "teacherTimetable/downloadPDF",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/timetable/export", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      const contentDisposition = response.headers["content-disposition"];
      let fileName = "timetable.pdf";

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (fileNameMatch?.[1]) fileName = fileNameMatch[1];
      }

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();

      return true;
    } catch (error) {
      return rejectWithValue("Failed to download timetable");
    }
  }
);

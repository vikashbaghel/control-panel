import { attendance } from "../constant";

const initialState = {
  data: "",
};
export const reportAttendanceReducer = (state = initialState, action) => {
  switch (action.type) {
    case attendance.SET_REPORT_ATTENDANCE:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const createReportAttendanceReducer = (state = initialState, action) => {
  switch (action.type) {
    case attendance.SET_CREATE_REPORT_ATTENDANCE:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};
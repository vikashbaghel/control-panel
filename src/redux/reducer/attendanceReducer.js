import { attendance } from "../constant";

const initialState = {
  data: "",
};

export const getAttendanceReducer = (state = initialState, action) => {
  switch (action.type) {
    case attendance.GET_ATTENDANCE:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const updateAttendanceReducer = (state = initialState, action) => {
  switch (action.type) {
    case attendance.UPDATE_ATTENDANCE:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const deleteAttendanceReducer = (state = initialState, action) => {
  switch (action.type) {
    case attendance.DELETE_ATTENDANCE:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

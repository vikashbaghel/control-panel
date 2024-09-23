import { order } from "../constant";

const initialState = {
  data: "",
};
export const reportOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case order.SET_REPORT_ORDER:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const createReportOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case order.SET_CREATE_REPORT_ORDER:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const supportReportFieldReducer = (state = initialState, action) => {
  switch (action.type) {
    case order.SUPPORT_REPORT_FIELD:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

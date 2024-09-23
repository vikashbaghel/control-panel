import {  reportPayment } from "../constant";

const initialState = {
  data: "",
};
export const reportPaymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case reportPayment.SET_REPORT_PAYMENT:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const createReportPaymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case reportPayment.SET_CREATE_REPORT_PAYMENT:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};
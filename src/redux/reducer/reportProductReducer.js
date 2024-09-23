import { reportProduct } from "../constant";

const initialState = {
  data: "",
};

export const reportProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case reportProduct.SET_REPORT_PRODUCT:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const createReportProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case reportProduct.SET_CREATE_REPORT_PRODUCT:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

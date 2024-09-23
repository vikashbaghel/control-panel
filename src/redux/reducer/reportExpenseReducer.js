import { expense } from "../constant";

const initialState = {
  data: "",
};
export const reportExpenseReducer = (state = initialState, action) => {
  switch (action.type) {
    case expense.SET_REPORT_EXPENSE:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const createReportExpenseReducer = (state = initialState, action) => {
  switch (action.type) {
    case expense.SET_CREATE_REPORT_EXPENSE:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};
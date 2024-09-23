import { customer } from "../constant";

const initialState = {
  data: "",
};
export const distributionDetialReducer = (state = initialState, action) => {
  switch (action.type) {
    case customer.CUSTOMER_DETAILS:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

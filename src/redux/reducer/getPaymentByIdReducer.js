import { payment } from "../constant";

const initialState = {
  data: "",
};
export const paymentGetByIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case payment.GET_PAYMENT_BY_ID:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};
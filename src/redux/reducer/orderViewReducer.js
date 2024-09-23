import { order } from "../constant";

const initialState = {
  data: "",
};
export const orderViewReducer = (state = initialState, action) => {
  switch (action.type) {
    case order.SET_ORDER_VIEW:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};
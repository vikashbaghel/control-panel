import { order } from "../constant";

const initialState = {
  data: "",
};
export const orderDetaisGetByIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case order.GET_ORDER_DETAILS_BYID:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

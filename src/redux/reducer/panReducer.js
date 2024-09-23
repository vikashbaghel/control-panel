import { pan } from "../constant";

const initialState = {
  data: "",
};
export const panReducer = (state = initialState, action) => {
  switch (action.type) {
    case pan.GET_PAN_DETAILS:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};
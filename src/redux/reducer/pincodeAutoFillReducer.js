import { PINCODE_API } from "../constant";

const initialState = {
  data: "",
};
export const pincodeAutoFillReducer = (state = initialState, action) => {
  switch (action.type) {
    case PINCODE_API:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

import { gst } from "../constant";

const initialState = {
  data: "",
};
export const gstReducer = (state = initialState, action) => {
  switch (action.type) {
    case gst.GET_GST_DETAILS:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};
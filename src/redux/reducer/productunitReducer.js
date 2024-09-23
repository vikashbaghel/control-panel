import { productUnit } from "../constant";

const initialState = {
  data: "",
};
export const productUnitReducer = (state = initialState, action) => {
  switch (action.type) {
    case productUnit.SET_PRODUCT_UNIT:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const productUnitAddReducer = (state = initialState, action) => {
  switch (action.type) {
    case productUnit.SET_PRODUCT_UNIT_ADD:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const productUnitDeleteReducer = (state = initialState, action) => {
  switch (action.type) {
    case productUnit.SET_PRODUCT_UNIT_DELETE:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

import { product } from "../constant";

const initialState = {
  data: "",
};

export const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case product.PRODUCT:;
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const getProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case product.GET_PRODUCT:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const productViewReducer = (state = initialState, action) => {
  switch (action.type) {
    case product.PRODUCT_VIEW:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const searchProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case product.SEARCH_PRODUCTS:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const addProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case product.ADD_PRODUCT:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const deleteProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case product.DELETE_PRODUCT:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

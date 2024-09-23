import { productCategory } from "../constant";

const initialState = {
  data: "",
};

export const productCategoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case productCategory.SET_PRODUCT_CATEGORY:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const productCategoryDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case productCategory.SET_PRODUCT_CATEGORY_DETAILS:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const addProductCategoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case productCategory.SET_PRODUCT_CATEGORY:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const editProductCategoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case productCategory.SET_EDIT_PRODUCT_CATEGORY:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};


export const deleteProductCategoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case productCategory.DELETE_PRODUCT_CATEGORY:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};
import { customerCategory } from "../constant";

const initialState = {
  data: "",
};

export const customerCategoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case customerCategory.SET_CUSTOMER_CATEGORY:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};

export const addNewCustomerCategoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case customerCategory.CREATE_PRODUCT_CATEGORY:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const editCustomerCategoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case customerCategory.SET_EDIT_CUSTOMER_CATEGORY:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

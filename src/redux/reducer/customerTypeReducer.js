import { customerType } from "../constant";

const initialState = {
  data: "",
};

export const customerTypeReducer = (state = initialState, action) => {
  switch (action.type) {
    case customerType.GET_CUSTOMER_TYPE:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const addCustomerTypeReducer = (state = initialState, action) => {
  switch (action.type) {
    case customerType.SET_ADD_CUSTOMER_TYPE:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const editCustomerTypeReducer = (state = initialState, action) => {
  switch (action.type) {
    case customerType.SET_EDIT_CUSTOMER_TYPE:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const deleteCustomerTypeReducer = (state = initialState, action) => {
  switch (action.type) {
    case customerType.DELETE_CUSTOMER_TYPE:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

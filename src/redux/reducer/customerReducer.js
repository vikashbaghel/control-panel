import { customer } from "../constant";

const initialState = {
  data: "",
};

export const customerDistributorReducer = (state = initialState, action) => {
  switch (action.type) {
    case customer.CUSTOMER_DISTRIBUTOR:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const customerLevelDistributorSearchReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case customer.CUSTOMER_LEVEL_DISTRIBUTOR_LIST:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const customerDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case customer.CUSTOMER_DETAILS:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const getStaffAssignMappingReducer = (state = initialState, action) => {
  switch (action.type) {
    case customer.STAFF_ASSIGN_MAPPING:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const getSearchCategoryMappingAssignReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case customer.SEARCH_CUSTOMER_CATEGORY_ASSIGN:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const AddCustomerReducer = (state = initialState, action) => {
  switch (action.type) {
    case customer.CUSTOMER_ADD_DISTRIBUTOR:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const customerEditReducer = (state = initialState, action) => {
  switch (action.type) {
    case customer.CUSTOMER_EDIT_DISTRIBUTOR:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const deleteCustomerReducer = (state = initialState, action) => {
  switch (action.type) {
    case customer.DELETE_CUSTOMER:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const searchStaffAssignReducer = (state = initialState, action) => {
  switch (action.type) {
    case customer.SEARCH_STAFF_ASSIGN:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const customerClientsReducer = (state = initialState, action) => {
  if (action.type === customer.CUSTOMER_CLIENTS)
    return { ...state, data: action.payload };
  return { ...state };
};

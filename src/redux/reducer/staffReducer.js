import { staff } from "../constant";

const initialState = {
  data: "",
};

export const staffReducer = (state = initialState, action) => {
  switch (action.type) {
    case staff.STAFF:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const AddStaffReducer = (state = initialState, action) => {
  switch (action.type) {
    case staff.STAFF_ADD:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const staffEditReducer = (state = initialState, action) => {
  switch (action.type) {
    case staff.STAFF_EDIT:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const staffDeleteReducer = (state = initialState, action) => {
  switch (action.type) {
    case staff.STAFF_DELETE:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const staffOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case staff.STAFF_ORDER:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const staffPaymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case staff.STAFF_PAYMENT:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const getStaffDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case staff.STAFF_DETAILS:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const searchCustomerAssignReducer = (state = initialState, action) => {
  switch (action.type) {
    case staff.SEARCH_CUSTOMER_ASSIGN:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};

export const staffDetailsByIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case staff.STAFF_DETAILS_BY_ID:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const staffListReducer = (state = initialState, action) => {
  switch (action.type) {
    case staff.STAFF_LIST:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const staffCustomerAssignedReducer = (state = initialState, action) => {
  if (action.type === "STAFF_CUSTOMER_ASSIGNED")
    return { ...state, data: action.payload };
  else return { ...state };
};

export const staffBeatsAssignedReducer = (state = initialState, action) => {
  if (action.type === "STAFF_BEATS_ASSIGNED")
    return { ...state, data: action.payload };
  else return { ...state };
};

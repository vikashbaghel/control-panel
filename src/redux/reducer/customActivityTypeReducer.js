import { customActivity } from "../constant";

const initialState = {
  data: "",
};

export const customActivityListReducer = (state = initialState, action) => {
  switch (action.type) {
    case customActivity.ACTIVITY_TYPE_LIST:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};

export const detailCustomActivityReducer = (state = initialState, action) => {
  switch (action.type) {
    case customActivity.DETAIL_ACTIVITY_TYPE:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};

export const createCustomActivityReducer = (state = initialState, action) => {
  switch (action.type) {
    case customActivity.CREATE_ACTIVITY_TYPE:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};

export const updateCustomActivityReducer = (state = initialState, action) => {
  switch (action.type) {
    case customActivity.UPDATE_ACTIVITY_TYPE:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};

export const deleteCustomActivityReducer = (state = initialState, action) => {
  switch (action.type) {
    case customActivity.DELETE_ACTIVITY_TYPE:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};

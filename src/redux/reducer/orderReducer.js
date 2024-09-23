import { order } from "../constant";

const initialState = {
  data: "",
};
export const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case order.SET_ORDER:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const updateStatusReducer = (state = initialState, action) => {
  switch (action.type) {
    case order.UPDATE_STATUS:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const dispatchOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case order.DISPATCH_ORDER:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const dispatchHistoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case order.DISPATCH_HISTORY:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const lrUpdateOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case order.LR_UPDATE_ORDER:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const deleteOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case order.DELETE_ORDER:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

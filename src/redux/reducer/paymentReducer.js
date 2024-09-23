import { payment } from "../constant";

const initialState = {
  data: "",
};
export const paymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case payment.SET_PAYMENT:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};
export const paymentByIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case payment.PAYMENT_RECORD_BY_ID:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const paymentActionAddPaymentReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case payment.ADD_PAYMENT:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};
export const paymentActionUpdateStatusReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case payment.PAYMENT_UPDATE_STATUS:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const deletePaymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case payment.DELETE_PAYMENT:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

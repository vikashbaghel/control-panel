import { checkout } from "../constant";

const initialState = {
  data: "",
};
export const addressListReducer = (state = initialState, action) => {
  switch (action.type) {
    case checkout.ADDRESS_LIST:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};
export const addressDetailReducer = (state = initialState, action) => {
  switch (action.type) {
    case checkout.ADDRESS_DETAILS:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};

export const updateNewAddressReducer = (state = initialState, action) => {
  switch (action.type) {
    case checkout.UPDATE_NEW_ADDRESS:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const updateOldAddressReducer = (state = initialState, action) => {
  switch (action.type) {
    case checkout.UPDATE_OLD_ADDRESS:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const submitOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case checkout.SUBMIT_ORDER:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const whatsappRequiredReducer = (state = initialState, action) => {
  switch (action.type) {
    case checkout.WHATSAPP_REQUIRED:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const updateOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case checkout.UPDATE_ORDER:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

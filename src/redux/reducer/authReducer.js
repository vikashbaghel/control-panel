import { auth } from "../constant";

const initialState = {
  data: "",
};

export const authLoginReducer = (state = initialState, action) => {
  switch (action.type) {
    case auth.LOGIN:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const authVarifyOTPReducer = (state = initialState, action) => {
  switch (action.type) {
    case auth.VARIFY_OTP:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const contactUsReducer = (state = initialState, action) => {
  switch (action.type) {
    case auth.CONTACT_US:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const fcmPushNotificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case auth.FCM_NOTIFICATION:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const underMaintenanceReducer = (state = initialState, action) => {
  switch (action.type) {
    case auth.UNDER_MAINTENANCE:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

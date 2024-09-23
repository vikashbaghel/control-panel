import { adminSetting } from "../constant";

const initialState = {
  data: "",
};

export const createAdminReducer = (state = initialState, action) => {
  switch (action.type) {
    case adminSetting.CREATE_NEW_ADMIN:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};
export const veifyAdminOTPReducer = (state = initialState, action) => {
  switch (action.type) {
    case adminSetting.VERIFY_ADMIN_OTP:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};
export const adminListReducer = (state = initialState, action) => {
  switch (action.type) {
    case adminSetting.ADMIN_LIST:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};
export const deleteAdminReducer = (state = initialState, action) => {
  switch (action.type) {
    case adminSetting.DELETE_ADMIN:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};

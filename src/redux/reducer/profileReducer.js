import { profileDetails } from "../constant";

const initialState = {
  data: "",
};

export const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case profileDetails.SET_PROFILE_DETAILS:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const staffProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case profileDetails.SET_STAFF_PROFILE_DETAILS:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const userProfileDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case profileDetails.SET_USER_PROFILE_DETAILS:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};


export const editStaffProfileDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case profileDetails.SET_EDIT_STAFF_PROFILE_DETAILS:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const editUserProfileDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case profileDetails.SET_EDIT_USER_PROFILE_DETAILS:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const profileEditReducer = (state = initialState, action) => {
    switch (action.type) {
      case profileDetails.SET_EDIT_PROFILE_DETAILS:
        return { ...state, data: action.payload };
  
      default:
        return { ...state };
    }
  };
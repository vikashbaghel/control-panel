import { notifications, profileDetails } from "../constant";

const initialState = {
  data: "",
};

export const getNotificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case notifications.GET_NOTIFICATIONS:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const updateNotificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case notifications.UPDATE_NOTIFICATIONS:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

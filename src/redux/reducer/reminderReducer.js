import { reminder } from "../constant";

const initialState = {
  data: "",
};

export const followUpReminderDetailsReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case reminder.LIST_FOLLOW_UP_REMINDER:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const deleteFollowUpReminderReducer = (state = initialState, action) => {
  switch (action.type) {
    case reminder.DELETE_FOLLOW_UP_REMINDER:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

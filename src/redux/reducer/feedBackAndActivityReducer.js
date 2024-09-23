import { feedbackAndActivity } from "../constant";

const initialState = {
  data: "",
};

export const feedBackAndActivityReducer = (state = initialState, action) => {
  switch (action.type) {
    case feedbackAndActivity.GET_CUSTOMER_ACTIVITY:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const AddFeedBackAndActivityReducer = (state = initialState, action) => {
  switch (action.type) {
    case feedbackAndActivity.ADD_CUSTOMER_ACTIVITY:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const EditFeedBackAndActivityReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case feedbackAndActivity.EDIT_CUSTOMER_ACTIVITY:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const getStaffActivityReducer = (state = initialState, action) => {
  switch (action.type) {
    case feedbackAndActivity.GET_STAFF_ACTIVITY:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

//my activity reducer
export const myActivityReducer = (state = initialState, action) => {
  switch (action.type) {
    case feedbackAndActivity.GET_MY_ACTIVITY:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const getTeamActivityReducer = (state = initialState, action) => {
  switch (action.type) {
    case feedbackAndActivity.GET_TEAM_ACTIVITY:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const checkInReducer = (state = initialState, action) => {
  switch (action.type) {
    case feedbackAndActivity.CHECK_IN:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const feedbackActivityByIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case feedbackAndActivity.GET_FEEDBACK_ACTIVITY:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

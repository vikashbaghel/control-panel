import { goal } from "../constant";

const initialState = {
  data: "",
};

export const getGoalTemplateReducer = (state = initialState, action) => {
  switch (action.type) {
    case goal.GET_GOAL_TEMPLATE:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};

export const getGoalByIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case goal.GET_GOAL_BY_ID:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};

export const createGoalTemplateReducer = (state = initialState, action) => {
  switch (action.type) {
    case goal.CREATE_GOAL_TEMPLATE:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};

export const updateGoalTemplateReducer = (state = initialState, action) => {
  switch (action.type) {
    case goal.UPDATE_GOAL_TEMPLATE:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};

export const deleteGoalsReducer = (state = initialState, action) => {
  switch (action.type) {
    case goal.DELETE_GOAL:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};

export const customAssignGoalsReducer = (state = initialState, action) => {
  switch (action.type) {
    case goal.CUSTOM_ASSIGN_GOAL:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};

export const getUserGoalDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case goal.GET_USER_TARGET_ID:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};

export const deleteUserTargetReducer = (state = initialState, action) => {
  switch (action.type) {
    case goal.DELETE_USER_TARGET:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};

export const getSelfTargetDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case goal.GET_SELF_TARGET_DETAILS:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};

export const updateStaffTargetReducer = (state = initialState, action) => {
  switch (action.type) {
    case goal.UPDATE_STAFF_TARGET:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};

export const searchGoalTemplateReducer = (state = initialState, action) => {
  switch (action.type) {
    case goal.SEARCH_GOAL_TEMPLATE:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};

export const getSatffGoalReducer = (state = initialState, action) => {
  if (action.type === goal.GET_STAFF_GOAL_DETAILS) {
    return { ...state, data: action.payload };
  }
  return { ...state };
};

export const getTargetDetailsByIdReducer = (state = initialState, action) => {
  if (action.type === goal.GET_TARGET_DETAILS_BY_ID)
    return { ...state, data: action.payload };
  return { ...state };
};

//     TEAM TARGETS
export const getTeamTargetListReducer = (state = initialState, action) => {
  if (action.type === goal.GET_TEAM_TARGET_LIST)
    return { ...state, data: action.payload };
  return { ...state };
};

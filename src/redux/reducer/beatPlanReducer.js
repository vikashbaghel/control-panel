import { beatPlan } from "../constant";

const initialState = {
  data: "",
};

// Get Beat Plan Reducer
export const beatPlanRootReducer = (state = initialState, action) => {
  switch (action.type) {
    case beatPlan.BEAT_PLAN_LIST:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

// Add Beat Plan Reducer
export const AddBeatPlanReducer = (state = initialState, action) => {
  switch (action.type) {
    case beatPlan.ADD_BEAT_PLAN:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

// Add Beat Plan Daily Reducer
export const AddBeatPlanDailyReducer = (state = initialState, action) => {
  switch (action.type) {
    case beatPlan.ADD_BEAT_PLAN_DAILY:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const beatPlanEditReducer = (state = initialState, action) => {
  switch (action.type) {
    case beatPlan.EDIT_BEAT_PLAN:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

// Delete Beat Plan Reducer
export const deleteBeatPlanReducer = (state = initialState, action) => {
  switch (action.type) {
    case beatPlan.BEAT_PLAN_DELETE:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

// Active Beat Plan Details
export const activeBeatPlanDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case beatPlan.ACTIVE_BEAT_PLAN_DETAILS:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

// Active Beat Plan Details
export const getStaffActiveBeatPlanDetailsReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case beatPlan.STAFF_ACTIVE_BEAT_PLAN_DETAILS:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

// Beat Plan Details
export const beatPlanDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case beatPlan.BEAT_PLAN_DETAILS:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const beatPlanDetailByIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case beatPlan.BEAT_PLAN_DETAIL_BY_ID:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const beatPlanCustomerReducer = (state = initialState, action) => {
  switch (action.type) {
    case beatPlan.BEAT_PLAN_CUSTOMER_DETAILS:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

// Add Beat Plan Reducer
export const approvalBeatPlanDetailsReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case beatPlan.BEAT_PLAN_APPROVAL:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

// Get Beat Plan Approval Reducer
export const approvalBeatPlanListReducer = (state = initialState, action) => {
  switch (action.type) {
    case beatPlan.APPROVAL_BEAT_PLAN_LIST:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

import { reimbursement } from "../constant";

const initialState = {
  data: "",
};

export const reimbursementReducer = (state = initialState, action) => {
  switch (action.type) {
    case reimbursement.GET_REIMBURSEMENT_TRACKER:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const reimbursementTrackerDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case reimbursement.GET_REIMBURSEMENT_TRACKER_DETAILS:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const AddReimbursementReducer = (state = initialState, action) => {
  switch (action.type) {
    case reimbursement.REIBURSEMENT_TRACKER_ADD:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const AddReibursementItemReducer = (state = initialState, action) => {
  switch (action.type) {
    case reimbursement.REIBURSEMENT_ITEM_ADD:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const reibursementItemDetailsReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case reimbursement.GET_REIBURSEMENT_ITEM_DETAILS:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const reibursementItemEditReducer = (state = initialState, action) => {
  switch (action.type) {
    case reimbursement.REIBURSEMENT_ITEM_EDIT:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const reibursementEditReducer = (state = initialState, action) => {
  switch (action.type) {
    case reimbursement.REIBURSEMENT_TRACKER_EDIT:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const reibursementListReducer = (state = initialState, action) => {
  switch (action.type) {
    case reimbursement.GET_REIBURSEMENT_LIST:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const reibursementDeleteReducer = (state = initialState, action) => {
  switch (action.type) {
    case reimbursement.REIBURSEMENT_DELETE:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const reibursementItemDeleteReducer = (state = initialState, action) => {
  switch (action.type) {
    case reimbursement.REIBURSEMENT_ITEM_DELETE:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

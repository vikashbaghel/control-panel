import { ApprovalReimbursement } from "../constant";

const initialState = {
  data: "",
};

export const approvalReimbursementReducer = (state = initialState, action) => {
  switch (action.type) {
    case ApprovalReimbursement.GET_APPROVAL_REIMBURSEMENT_TRACKER:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const approvalReimbursementStatusReducer = (state = initialState, action) => {
  switch (action.type) {
    case ApprovalReimbursement.APPROVED_REIMBURSEMENT_TRACKER:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

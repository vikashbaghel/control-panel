import { lead, leadCategory } from "../constant";

const initialState = {
  data: "",
};

export const leadCategoryListReducer = (state = initialState, action) => {
  switch (action.type) {
    case leadCategory.LEAD_CATEGORY_LIST:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};

export const searchLeadCategoryListReducer = (state = initialState, action) => {
  switch (action.type) {
    case leadCategory.SEARCH_LEAD_CATEGORY:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};

export const addLeadCategoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case leadCategory.ADD_LEAD_CATEGORY:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};

export const leadCategoryDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case leadCategory.LEAD_CATEGORY_DETAILS:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};

export const updateLeadCategoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case leadCategory.UPDATE_LEAD_CATEGORY:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};

export const deleteLeadCategoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case leadCategory.DELETE_LEAD_CATEGORY:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};

export const leadListReducer = (state = initialState, action) => {
  switch (action.type) {
    case lead.LEAD_LIST:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};

export const searchLeadListReducer = (state = initialState, action) => {
  switch (action.type) {
    case lead.SEARCH_LEAD:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};

export const createLeadReducer = (state = initialState, action) => {
  switch (action.type) {
    case lead.CREATE_LEAD:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};
export const updateLeadReducer = (state = initialState, action) => {
  switch (action.type) {
    case lead.UPDATE_LEAD:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};

export const deleteLeadReducer = (state = initialState, action) => {
  switch (action.type) {
    case lead.DELETE_LEAD:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};

export const updateLeadStatusReducer = (state = initialState, action) => {
  switch (action.type) {
    case lead.UPDATE_LEAD_STATUS:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};
export const mobileNumberCheckReducer = (state = initialState, action) => {
  switch (action.type) {
    case lead.MOBLIE_NUMBER_CHECK:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};

export const singleLeadDataActionReducer = (state = initialState, action) => {
  switch (action.type) {
    case lead.SINGLE_LEAD_DATA:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};

export const leadReportReducer = (state = initialState, action) => {
  switch (action.type) {
    case lead.LEAD_REPORT:
      return { ...state, data: action.payload };
    default:
      return { ...state };
  }
};

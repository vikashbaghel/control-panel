import { reportTemplate } from "../constant";

const initialState = {
  data: "",
};

export const getReportTemplateListReducer = (state = initialState, action) => {
  switch (action.type) {
    case reportTemplate.GET_REPORT_TEMPLATE_LIST:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const getReportTemplateReducer = (state = initialState, action) => {
  switch (action.type) {
    case reportTemplate.GET_REPORT_TEMPLATE:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const createTemplateReducer = (state = initialState, action) => {
  switch (action.type) {
    case reportTemplate.CREATE_TEMPLATE:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const deleteTemplateReducer = (state = initialState, action) => {
  switch (action.type) {
    case reportTemplate.DELETE_REPORT_TEMPLATE:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

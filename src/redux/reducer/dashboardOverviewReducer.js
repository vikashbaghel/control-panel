import { dashboardOverview } from "../constant";

const initialState = {
  data: "",
};
export const dashboardOverviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case dashboardOverview.DASHBOARD_OVERVIEW:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

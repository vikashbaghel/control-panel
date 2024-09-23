import { categoryanalytics, chart, customeranalytics, productanalytics, staffanalytics } from "../constant";

const initialState = {
    data: "",
};

//Customer Reduce
export const customerAnalyticsReducer = (state = initialState, action) => {
    switch (action.type) {
        case customeranalytics.CUSTOMER_ANALYTICS:
            return { ...state, data: action.payload };

        default:
            return { ...state };
    }
};

//category Reduce
export const categoryAnalyticsReducer = (state = initialState, action) => {
    switch (action.type) {
        case categoryanalytics.CATEGORY_ANALYTICS:
            return { ...state, data: action.payload };

        default:
            return { ...state };
    }
};

//staff Reduce
export const staffAnalyticsReducer = (state = initialState, action) => {
    switch (action.type) {
        case staffanalytics.STAFF_ANALYTICS:
            return { ...state, data: action.payload };

        default:
            return { ...state };
    }
};

//product Reduce
export const productAnalyticsReducer = (state = initialState, action) => {
    switch (action.type) {
        case productanalytics.PRODUCT_ANALYTICS:
            return { ...state, data: action.payload };

        default:
            return { ...state };
    }
};

//chart Reduce
export const chartAnalyticsReducer = (state = initialState, action) => {
    switch (action.type) {
        case chart.ANALYTICS_CHART:
            return { ...state, data: action.payload };

        default:
            return { ...state };
    }
};
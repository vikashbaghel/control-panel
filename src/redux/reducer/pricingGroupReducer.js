import { pricingGroup, teleScopicPricing } from "../constant";

const initialState = {
  data: "",
};

//get pricing group
export const pricingGroupReducer = (state = initialState, action) => {
  switch (action.type) {
    case pricingGroup.GET_PRICING_GROUP:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

//get pricing group list
export const pricingGroupListReducer = (state = initialState, action) => {
  switch (action.type) {
    case pricingGroup.GET_PRICING_GROUP_LIST:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

//Add Pricing Group
export const addPricingGroupReducer = (state = initialState, action) => {
  switch (action.type) {
    case pricingGroup.ADD_PRICING_GROUP:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

//Edit Pricing Group
export const editPricingGroupReducer = (state = initialState, action) => {
  switch (action.type) {
    case pricingGroup.EDIT_PRICING_GROUP:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

//Add Product Pricing
export const addProductPricingReducer = (state = initialState, action) => {
  switch (action.type) {
    case pricingGroup.ADD_PRODUCT_PRICING:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

//Edit Telescopic Pricing group
export const editTelescopicPricingGroupReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case pricingGroup.EDIT_TELESCOPIC_PRICING_GROUP:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

//get telescopicPricingList
export const telescopicPricingListReducer = (state = initialState, action) => {
  switch (action.type) {
    case teleScopicPricing.GET_TELESCOPIC_LIST:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

//Delete Pricing Group
export const deletePricingGroupReducer = (state = initialState, action) => {
  switch (action.type) {
    case pricingGroup.DELETE_PRICING_GROUP:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

//update Pricing Group
export const updateTelescopicPricingGroupReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case teleScopicPricing.UPDATE_TELESCOPIC_PRICING_GROUP:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

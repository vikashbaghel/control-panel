import { beat } from "../constant";

const initialState = {
  data: "",
};

export const beatReducer = (state = initialState, action) => {
  switch (action.type) {
    case beat.BEAT_LIST:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const beatDetailsByBeatPlanIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case beat.BEAT_DETAILS_BY_BEAT_PLAN_ID:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

// Add Beat Reducer
export const AddBeatReducer = (state = initialState, action) => {
  switch (action.type) {
    case beat.BEAT_ADD:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

// Edit Beat Reducer
export const EditBeatReducer = (state = initialState, action) => {
  switch (action.type) {
    case beat.BEAT_EDIT:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const beatMappingReducer = (state = initialState, action) => {
  switch (action.type) {
    case beat.BEAT_MAPPING_SERVICE:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const beatDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case beat.BEAT_DETAILS:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

// Delete Beat Reducer
export const DeleteBeatReducer = (state = initialState, action) => {
  switch (action.type) {
    case beat.BEAT_DELETE:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

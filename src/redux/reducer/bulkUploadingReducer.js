import { bulkUploadingCsv } from "../constant";

const initialState = {
  data: "",
};

export const bulkUploadingReducer = (state = initialState, action) => {
  switch (action.type) {
    case bulkUploadingCsv.BULK_UPLOADING_CSV:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};

export const bulkNewUploadingReducer = (state = initialState, action) => {
  switch (action.type) {
    case bulkUploadingCsv.BULK_NEW_UPLOADING_CSV:
      return { ...state, data: action.payload };

    default:
      return { ...state };
  }
};
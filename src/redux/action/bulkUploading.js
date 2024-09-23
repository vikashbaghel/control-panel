import axios from "axios";
import Cookies from "universal-cookie";
import { BASE_URL_V2, org_id } from "../../config.js";
import SessionExpireError from "../../helpers/sessionExpireError.js";
import { bulkUploadingCsv } from "../constant";
import { notification } from "antd";

export const bulkUploadingService = (module, pageCount) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/csvuploadlog/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const params = { module: module, page_no: pageCount };
  axios
    .get(url, { headers, params })
    .then((response) => {
      dispatch({
        type: bulkUploadingCsv.BULK_UPLOADING_CSV,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

export const bulkNewUploadService = (formInput) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/csvuploadlog/`;
  const data = formInput;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .post(url, data, { headers })
    .then((response) => {
      if (response.status === 200) {
        notification.success({
          message: `${response.data.message}`,
        });
      }
      dispatch({
        type: bulkUploadingCsv.BULK_NEW_UPLOADING_CSV,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: bulkUploadingCsv.BULK_NEW_UPLOADING_CSV,
          payload: "",
        });
      }, 200);
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

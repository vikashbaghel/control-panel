import { notification } from "antd";
import axios from "axios";
import { auth_token, BASE_URL_V1, BASE_URL_V2, org_id } from "../../config.js";
import SessionExpireError from "../../helpers/sessionExpireError.js";
import { reportProduct } from "../constant";

export const reportProductAction = (pageCount, filter_status) => (dispatch) => {
  const url = `${BASE_URL_V2}/organization/${org_id}/csvdownloadlog/?module=PRODUCTS`;
  const headers = { Authorization: auth_token };
  const params = {
    page_no: pageCount,
    status: filter_status,
  };
  axios
    .get(url, { headers, params })
    .then((response) => {
      dispatch({
        type: reportProduct.SET_REPORT_PRODUCT,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

export const createReportProductAction = async (data) => {
  const url = `${BASE_URL_V1}/organization/${org_id}/product/reports/`;
  const headers = { Authorization: auth_token };
  try {
    const response = await axios.post(url, data, { headers });
    if (response.status === 200) {
      notification.success({
        message: `${response.data.message}`,
      });
    }
    return response;
  } catch (err) {
    SessionExpireError(err.response);
    notification.warning({
      message: `${err.response.data.message}`,
    });
  }
};

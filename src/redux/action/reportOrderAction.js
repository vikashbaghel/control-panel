import { notification } from "antd";
import axios from "axios";
import Cookies from "universal-cookie";
import { BASE_URL_V2, org_id } from "../../config.js";
import SessionExpireError from "../../helpers/sessionExpireError.js";
import { order } from "../constant";

export const reportOrderAction =
  (filter_status, pageCount, name) => (dispatch) => {
    const cookies = new Cookies();
    const url = `${BASE_URL_V2}/organization/${org_id}/csvdownloadlog/?module=ORDER_DETAILS,ORDERS`;
    const headers = {
      Authorization: cookies.get("rupyzToken"),
    };
    const params = {
      page_no: pageCount,
      status: filter_status,
      name: name,
    };
    axios
      .get(url, { headers, params })
      .then((response) => {
        dispatch({
          type: order.SET_REPORT_ORDER,
          payload: response,
        });
      })
      .catch((error) => {
        SessionExpireError(error.response);
      });
  };

export const createReportOrderAction = async (formInput) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/order/reports/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  try {
    const response = await axios.post(url, formInput, { headers });
    if (response.status === 200) {
      notification.success({
        message: `${response.data.message}`,
      });
    }
    return response;
  } catch (err) {
    notification.warning({
      message: `${err.response.data.message}`,
    });
  }
};

export const supportReportField = (filter_status) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/csvdownloadlog/`;
  const headers = {
    Authorization: cookies.get("rupyzToken"),
  };
  const params = { get_module_fields: filter_status };
  axios
    .get(url, { headers, params })
    .then((response) => {
      dispatch({
        type: order.SUPPORT_REPORT_FIELD,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

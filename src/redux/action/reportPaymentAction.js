import { notification } from "antd";
import axios from "axios";
import Cookies from "universal-cookie";
import { BASE_URL_V2, org_id } from "../../config.js";
import SessionExpireError from "../../helpers/sessionExpireError.js";
import { reportPayment } from "../constant";

export const reportPaymentAction = (pageCount, filter_status) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/csvdownloadlog/?module=PAYMENTS`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const params = {
    page_no: pageCount,
    status: filter_status,
  };
  axios
    .get(url, { headers, params })
    .then((response) => {
      dispatch({
        type: reportPayment.SET_REPORT_PAYMENT,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

export const createReportPaymentAction = async (data) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/record-payment/reports/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
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

import { notification } from "antd";
import axios from "axios";
import Cookies from "universal-cookie";
import { BASE_URL_V2, org_id } from "../../config.js";
import SessionExpireError from "../../helpers/sessionExpireError.js";
import { expense } from "../constant.js";

export const reportExpenseAction =
  (filter_status, pageCount, name) => (dispatch) => {
    const cookies = new Cookies();
    const url = `${BASE_URL_V2}/organization/${org_id}/csvdownloadlog/?module=EXPENSES_ALL_USER,EXPENSES_DETAIL_USER`;
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
          type: expense.SET_REPORT_EXPENSE,
          payload: response,
        });
      })
      .catch((error) => {
        SessionExpireError(error.response);
      });
  };

export const createReportExpenseAction = (formInput) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/reimbursement/reports/`;
  const headers = { Authorization: cookies.get("rupyzToken") };

  try {
    const response = axios.post(url, formInput, { headers });
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

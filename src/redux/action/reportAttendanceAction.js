import { notification } from "antd";
import axios from "axios";
import Cookies from "universal-cookie";
import { BASE_URL_V2, org_id } from "../../config.js";
import SessionExpireError from "../../helpers/sessionExpireError.js";
import { attendance } from "../constant.js";

export const reportAttendanceAction =
  (filter_status, pageCount, name) => (dispatch) => {
    const cookies = new Cookies();
    const url = `${BASE_URL_V2}/organization/${org_id}/csvdownloadlog/?module=ATTENDANCE_AGGREGATED,ATTENDANCE_LISTING_USER`;
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
          type: attendance.SET_REPORT_ATTENDANCE,
          payload: response,
        });
      })
      .catch((error) => {
        SessionExpireError(error.response);
      });
  };

export const createReportAttendanceAction = async (formInput) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/attendance/reports/`;
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

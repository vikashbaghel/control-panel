import Cookies from "universal-cookie";
import { BASE_URL_V2, org_id } from "../../config";
import { attendance } from "../constant";
import axios from "axios";
import SessionExpireError from "../../helpers/sessionExpireError";
import { notification } from "antd";

export const getAttendance = (month, year) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/attendance/?month=${month}&year=${year}`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: attendance.GET_ATTENDANCE,
        payload: response,
      });
    })
    .catch((err) => {
      SessionExpireError(err.response);
      notification.warning({
        message: `${err.response.data.message}`,
      });
    });
};

export const updateAttendance = (formData) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/attendance/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const data = formData;
  axios
    .post(url, data, { headers })
    .then((response) => {
      if (response.status == 200) {
        notification.success({
          message: `${response.data.message}`,
        });
      }
      dispatch({
        type: attendance.UPDATE_ATTENDANCE,
        payload: response,
      });
    })
    .catch((err) => {
      SessionExpireError(err.response);
      notification.warning({
        message: `${err.response.data.message}`,
      });
    });
};

export const deleteAttendance = (id) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/attendance/${id}/delete/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const data = {};
  axios
    .post(url, data, { headers })
    .then((response) => {
      if (response.status == 200) {
        notification.success({
          message: `${response.data.message}`,
        });
      }
      dispatch({
        type: attendance.DELETE_ATTENDANCE,
        payload: response,
      });
    })
    .catch((err) => {
      SessionExpireError(err.response);
      notification.warning({
        message: `${err.response.data.message}`,
      });
    });
};

export const updateStartEndAttendance = async (data) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/activity/attendance/check/`;
  const headers = { Authorization: cookies.get("rupyzToken") };

  return await axios
    .post(url, data, { headers })
    .then((response) => {
      if (response.status == 200) {
        notification.success({
          message: `${response.data.message}`,
        });
      }
      return !response.data.error;
    })
    .catch((err) => {
      SessionExpireError(err.response);
      notification.warning({
        message: `${err.response.data.message}`,
      });
    });
};

export const getattandanceDetail = async (id) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/activity/attendance/${
    id || "check"
  }/`;
  const headers = { Authorization: cookies.get("rupyzToken") };

  return await axios
    .get(url, { headers })
    .then((response) => {
      return response.data.data;
    })
    .catch((err) => {
      SessionExpireError(err.response);
      notification.warning({
        message: `${err.response?.data?.message}`,
      });
    });
};

export const getStartEndDayAttandanceDetail = async (id) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/attendance/${id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };

  return await axios
    .get(url, { headers })
    .then((response) => {
      return response.data.data;
    })
    .catch((err) => {
      SessionExpireError(err.response);
      notification.warning({
        message: `${err.response.data.message}`,
      });
    });
};

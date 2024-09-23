import Cookies from "universal-cookie";
import { BASE_URL_V2, org_id } from "../../config";
import { attendance, customActivity, customerType } from "../constant";
import axios from "axios";
import SessionExpireError from "../../helpers/sessionExpireError";
import { notification } from "antd";

export const customActivityList = (page_no, name) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/activity/followup/?dd=true`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const params = { page_no, name };
  axios
    .get(url, { headers, params })
    .then((response) => {
      dispatch({
        type: customActivity.ACTIVITY_TYPE_LIST,
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

export const detailCustomActivity = (id) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/activity/followup/${id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };

  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: customActivity.DETAIL_ACTIVITY_TYPE,
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

export const createCustomActivity = (name) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/activity/followup/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const data = { name };

  axios
    .post(url, data, { headers })
    .then((response) => {
      dispatch({
        type: customActivity.CREATE_ACTIVITY_TYPE,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: customActivity.CREATE_ACTIVITY_TYPE,
          payload: "",
        });
      }, 100);
    })
    .catch((err) => {
      SessionExpireError(err.response);
      notification.warning({
        message: `${err.response.data.message}`,
      });
    });
};

export const updateCustomActivity = (id, name) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/activity/followup/${id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const data = { name };

  axios
    .post(url, data, { headers })
    .then((response) => {
      dispatch({
        type: customActivity.UPDATE_ACTIVITY_TYPE,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: customActivity.UPDATE_ACTIVITY_TYPE,
          payload: "",
        });
      }, 100);
    })
    .catch((err) => {
      SessionExpireError(err.response);
      notification.warning({
        message: `${err.response.data.message}`,
      });
    });
};

export const deleteCustomActivity = (id) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/activity/followup/${id}/delete/`;
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
        type: customActivity.DELETE_ACTIVITY_TYPE,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: customActivity.DELETE_ACTIVITY_TYPE,
          payload: "",
        });
      }, 100);
    })
    .catch((err) => {
      SessionExpireError(err.response);
      notification.warning({
        message: `${err.response.data.message}`,
      });
    });
};

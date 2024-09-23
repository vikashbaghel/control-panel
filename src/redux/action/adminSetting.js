import { notification } from "antd";
import Cookies from "universal-cookie";
import { BASE_URL_V1, BASE_URL_V2, org_id } from "../../config";
import axios from "axios";
import { adminSetting } from "../constant";
import SessionExpireError from "../../helpers/sessionExpireError";

export const createAdmin = (formData) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/associate/profile/`;
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
        type: adminSetting.CREATE_NEW_ADMIN,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: adminSetting.CREATE_NEW_ADMIN,
          payload: "",
        });
      }, 1000);
    })
    .catch((err) => {
      SessionExpireError(err.response);
      notification.warning({
        message: `${err.response.data.message}`,
      });
    });
};

export const veifyAdminOTP = (formData) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/associate/profile/verify/`;
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
        type: adminSetting.VERIFY_ADMIN_OTP,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: adminSetting.VERIFY_ADMIN_OTP,
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

export const adminList = (name, page_no) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/organization/profiles-with-org/${org_id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const params = { page_no: page_no, name: name };
  axios
    .get(url, { headers, params })
    .then((response) => {
      dispatch({
        type: adminSetting.ADMIN_LIST,
        payload: response,
      });
    })
    .catch((err) => {
      SessionExpireError(err.response);
      notification.warning({
        message: `${err.response.data?.message}`,
      });
    });
};

export const deleteAdmin = (id) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/disassociate/profile/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const data = { id: id };
  axios
    .post(url, data, { headers })
    .then((response) => {
      if (response.status == 200) {
        notification.success({
          message: `${response.data.message}`,
        });
      }
      dispatch({
        type: adminSetting.DELETE_ADMIN,
        payload: response,
      });
    })
    .catch((err) => {
      SessionExpireError(err.response);
      notification.warning({
        message: `${err.response.data?.message}`,
      });
    });
};

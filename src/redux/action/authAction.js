import axios from "axios";
import { BASE_URL_V1 } from "../../config";
import { auth } from "../constant";
import { notification } from "antd";
import Cookies from "universal-cookie";

export const authLogin = (formInput) => (dispatch) => {
  const url = `${BASE_URL_V1}/user/initiate_login/`;
  const data = formInput;

  axios
    .post(url, data)
    .then((response) => {
      dispatch({
        type: auth.LOGIN,
        payload: response,
      });
    })
    .catch((err) => {
      notification.warning({
        message: `${err.response?.data?.message}`,
      });
    });
};

export const authVarifyOTP = (formInput) => (dispatch) => {
  const url = `${BASE_URL_V1}/user/logged_in/`;
  const data = formInput;

  axios
    .post(url, data)
    .then((response) => {
      dispatch({
        type: auth.VARIFY_OTP,
        payload: response,
      });
    })
    .catch((err) => {
      if (err.response.status === 400) {
        notification.warning({
          message: "Invalid OTP",
        });
      }
      // notification.warning({
      //   message: `${err.response.data.message}`,
      // });
    });
};

export const contactUs = (formInput) => (dispatch) => {
  const url = `${BASE_URL_V1}/masterapp/contactus/public/`;
  const data = formInput;

  axios
    .post(url, data)
    .then((response) => {
      if (response.status === 200) {
        notification.success({
          message: `${response.data.message}`,
        });
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
      dispatch({
        type: auth.CONTACT_US,
        payload: response,
      });
    })
    .catch((err) => {
      notification.warning({
        message: `${err.response.data.message}`,
      });
    });
};

export const fcmPushNotification = (formInput) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/notification/fcm-device/`;
  const data = formInput;
  const headers = { Authorization: cookies.get("rupyzToken") };

  axios
    .post(url, data, { headers })
    .then((response) => {
      dispatch({
        type: auth.FCM_NOTIFICATION,
        payload: response,
      });
    })
    .catch((err) => {
      notification.warning({
        message: `${err.response.data.message}`,
      });
    });
};

export const underMaintenance = async () => {
  const url = `${BASE_URL_V1}/masterapp/maintenance/`;
  return axios.get(url).then((response) => {
    return response;
  });
};

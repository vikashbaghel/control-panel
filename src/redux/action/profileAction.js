import axios from "axios";
import { BASE_URL_V1, BASE_URL_V2, org_id, accessType } from "../../config";
import { profileDetails } from "../constant";
import { notification } from "antd";
import SessionExpireError from "../../helpers/sessionExpireError";
import Cookies from "universal-cookie";

//get profile list details
export const profileAction = () => (dispatch) => {
  const cookies = new Cookies();
  if (accessType === "WEB_SARE360") {
    const url = `${BASE_URL_V1}/organization/${org_id}/info/`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    axios
      .get(url, { headers })
      .then((response) => {
        dispatch({
          type: profileDetails.SET_PROFILE_DETAILS,
          payload: response,
        });
      })
      .catch((error) => {
        SessionExpireError(error.response);
      });
  }
};

//get profile details
export const profileDetailsAction = () => (dispatch) => {
  const cookies = new Cookies();
  if (accessType === "WEB_SARE360") {
    const url = `${BASE_URL_V1}/user/profile/`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    axios
      .get(url, { headers })
      .then((response) => {
        dispatch({
          type: profileDetails.SET_USER_PROFILE_DETAILS,
          payload: response,
        });
      })
      .catch((error) => {
        SessionExpireError(error.response);
      });
  }
};

//get profile details
export const staffProfileDetailsAction = () => (dispatch) => {
  const cookies = new Cookies();
  if (accessType === "WEB_STAFF") {
    const url = `${BASE_URL_V2}/organization/staff/profile/`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    axios
      .get(url, { headers })
      .then((response) => {
        cookies.set("rupyzPermissionType", response.data.data.permissions, {
          path: "/",
        });
        dispatch({
          type: profileDetails.SET_STAFF_PROFILE_DETAILS,
          payload: response,
        });
      })
      .catch((error) => {
        SessionExpireError(error.response);
      });
  }
};

//post profile Image
export const editProfileDetailsService = (formInput) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/user/profile/`;
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
        type: profileDetails.SET_EDIT_USER_PROFILE_DETAILS,
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

//post Staff profile Image
export const editStaffProfileDetailsService = (formInput) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/staff/profile/`;
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
        type: profileDetails.SET_EDIT_STAFF_PROFILE_DETAILS,
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

//post edit profile details
export const profileEditService = async (formInput) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };

  try {
    const res = await axios.post(url, formInput, { headers });
    if (res.status === 200)
      notification.success({
        message: res.data.message,
      });
    return res;
  } catch (err) {
    SessionExpireError(err.response);
    notification.warning({
      message: err.response.data.message,
    });
  }
};

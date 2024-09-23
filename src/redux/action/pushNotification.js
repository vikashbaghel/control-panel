import axios from "axios";
import Cookies from "universal-cookie";
import { BASE_URL_V1, org_id } from "../../config";
import SessionExpireError from "../../helpers/sessionExpireError";
import { notifications } from "../constant";

export const getNotification = (pageNo) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/notification/fcm/?page_no=${pageNo}&org_id=${org_id}`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: notifications.GET_NOTIFICATIONS,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

export const updateNotification = (id) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/notification/fcm/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const data = {
    id: id,
    is_seen: true,
    mark_all_as_read: id ? false : true,
    org_id: parseInt(org_id),
  };

  axios.post(url, data, { headers }).then((response) => {
    dispatch({
      type: notifications.UPDATE_NOTIFICATIONS,
      payload: response,
    });
  });
};

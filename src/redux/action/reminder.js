import axios from "axios";
import Cookies from "universal-cookie";
import { BASE_URL_V2, org_id } from "../../config";
import SessionExpireError from "../../helpers/sessionExpireError";
import { reminder } from "../constant";

export const followUpReminderDetails = (id) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/activity/reminder/${id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };

  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: reminder.LIST_FOLLOW_UP_REMINDER,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: reminder.LIST_FOLLOW_UP_REMINDER,
          payload: "",
        });
      }, 100);
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

export const deleteFollowUpReminder = (id) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/activity/reminder/${id}/delete/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const data = {};
  axios
    .post(url, data, { headers })
    .then((response) => {
      dispatch({
        type: reminder.DELETE_FOLLOW_UP_REMINDER,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: reminder.DELETE_FOLLOW_UP_REMINDER,
          payload: "",
        });
      }, 100);
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

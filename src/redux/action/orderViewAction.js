import axios from "axios";
import Cookies from "universal-cookie";
import { BASE_URL_V2, org_id } from "../../config.js";
import SessionExpireError from "../../helpers/sessionExpireError.js";
import { order } from "../constant";
import { notification } from "antd";

export const orderViewAction = (id) => (dispatch) => {
  if (!id) return;
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/order/${id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: order.SET_ORDER_VIEW,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
      notification.warning({
        message: `${error.response?.data.message}`,
      });
    });
};

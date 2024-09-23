import { notification } from "antd";
import axios from "axios";
import Cookies from "universal-cookie";
import { BASE_URL_V2, org_id } from "../../config.js";
import SessionExpireError from "../../helpers/sessionExpireError.js";
import { gst } from "../constant";

export const gstAction = (primary_gstin) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/gstin-info/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const params = {
    primary_gstin: primary_gstin,
  };
  axios
    .get(url, { headers, params })
    .then((response) => {
      dispatch({
        type: gst.GET_GST_DETAILS,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: gst.GET_GST_DETAILS,
          payload: "",
        });
      }, 100);
    })
    .catch((error) => {
      SessionExpireError(error.response);
      notification.warning({
        message: `${error.response.data.message}`,
      });
    });
};

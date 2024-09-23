import axios from "axios";
import Cookies from "universal-cookie";
import { BASE_URL_V2 } from "../../config.js";
import SessionExpireError from "../../helpers/sessionExpireError.js";
import { pan } from "../constant";
export const panAction = (pan_no) => (dispatch) => {
  const cookies = new Cookies();
  let data = {
    pan_id: pan_no,
    in_details: true,
  };

  const url = `${BASE_URL_V2}/organization/pan/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .post(url, data, { headers })
    .then((response) => {
      dispatch({
        type: pan.GET_PAN_DETAILS,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

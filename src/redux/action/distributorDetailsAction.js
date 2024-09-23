import { notification } from "antd";
import axios from "axios";
import { Navigate } from "react-router";
import Cookies from "universal-cookie";
import { BASE_URL_V2, org_id } from "../../config.js";
import SessionExpireError from "../../helpers/sessionExpireError.js";
import { customer } from "../constant";

// get distribution details by id
export const customerDetailsByIdAction = (id) => (dispatch) => {
  const cookies = new Cookies();

  const url = `${BASE_URL_V2}/organization/${org_id}/customer/${id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: customer.CUSTOMER_DETAILS,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

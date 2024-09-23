import axios from "axios";
import Cookies from "universal-cookie";
import { BASE_URL_V2, org_id } from "../../config";
import SessionExpireError from "../../helpers/sessionExpireError";
import { payment } from "../constant";

//get payment list details
export const paymentActionByIDAction = (id) => (dispatch) => {
  if (!id) return;
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/record-payment/?customer_id=${id}`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: payment.GET_PAYMENT_BY_ID,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

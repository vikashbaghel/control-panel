import axios from "axios";
import Cookies from "universal-cookie";
import { BASE_URL_V2, org_id } from "../../config.js";
import SessionExpireError from "../../helpers/sessionExpireError.js";
import { order } from "../constant";

export const orderActionDetailsBYId =
  (customer_id, search, status, fullfilled_by_ids, customer_level, staff_id) =>
  (dispatch) => {
    const cookies = new Cookies();
    if (customer_id === undefined) return;
    const url = `${BASE_URL_V2}/organization/${org_id}/order/`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    const params = {
      customer_id: customer_id,
      search,
      delivery_status: status,
      fullfilled_by_ids,
      customer_level,
      staff_id,
    };
    axios
      .get(url, { headers, params })
      .then((response) => {
        dispatch({
          type: order.GET_ORDER_DETAILS_BYID,
          payload: response,
        });
      })
      .catch((error) => {
        SessionExpireError(error.response);
      });
  };

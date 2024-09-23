import axios from "axios";
import Cookies from "universal-cookie";
import { BASE_URL_V2, org_id } from "../../config.js";
import SessionExpireError from "../../helpers/sessionExpireError.js";
import { dashboardOverview, order } from "../constant";

export const dashboardService = () => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/order/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: order.SET_ORDER,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

export const fetchOverview = async () => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/sales/dashboard/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  return axios
    .get(url, { headers })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      SessionExpireError(error.response);
      return {};
    });
};

export const analyticsReportParams = async () => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/analytics/power-bi/`;
  const headers = { Authorization: cookies.get("rupyzToken") };

  try {
    const response = await axios.get(url, { headers });
    return response;
  } catch (error) {
    console.log(error);
  }
};

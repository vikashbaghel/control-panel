import axios from "axios";
import moment from "moment";
import Cookies from "universal-cookie";
import { BASE_URL_V2, org_id } from "../../config.js";
import SessionExpireError from "../../helpers/sessionExpireError.js";
import {
  categoryanalytics,
  chart,
  customeranalytics,
  productanalytics,
  staffanalytics,
} from "../constant";

//category analytics
export const categoryAction = (formInput) => (dispatch) => {
  const cookies = new Cookies();
  if (!formInput) {
    const url = `${BASE_URL_V2}/organization/${org_id}/analytics/product/?get_category=true&interval_type=MONTHLY&start=${moment()
      .subtract(3, "months")
      .format("MM-YYYY")}&end=${moment().format("MM-YYYY")}`;
    const headers = {
      Authorization: cookies.get("rupyzToken"),
    };
    axios
      .get(url, { headers })
      .then((response) => {
        dispatch({
          type: categoryanalytics.CATEGORY_ANALYTICS,
          payload: response,
        });
      })
      .catch((error) => {
        SessionExpireError(error.response);
      });
    return;
  }

  const url = `${BASE_URL_V2}/organization/${org_id}/analytics/product/?get_category=true&interval_type=MONTHLY&start=${moment(
    formInput.start
  ).format("MM-YYYY")}&end=${moment().format("MM-YYYY")}`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: categoryanalytics.CATEGORY_ANALYTICS,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

//staff analytics
export const staffAction = (formInput) => (dispatch) => {
  const cookies = new Cookies();
  if (!formInput) {
    const url = `${BASE_URL_V2}/organization/${org_id}/analytics/staff/?interval_type=MONTHLY&start=${moment()
      .subtract(3, "months")
      .format("MM-YYYY")}&end=${moment().format("MM-YYYY")}`;
    const headers = {
      Authorization: cookies.get("rupyzToken"),
    };
    axios
      .get(url, { headers })
      .then((response) => {
        dispatch({
          type: staffanalytics.STAFF_ANALYTICS,
          payload: response,
        });
      })
      .catch((error) => {
        window.innerWidth(error.response);
      });
    return;
  }

  const url = `${BASE_URL_V2}/organization/${org_id}/analytics/staff/?interval_type=${
    formInput.interval_type !== "" ? formInput.interval_type : "MONTHLY"
  }&start=${moment(formInput.start).format("MM-YYYY")}&end=${moment(
    formInput.end
  ).format("MM-YYYY")}`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: staffanalytics.STAFF_ANALYTICS,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

//product analytics
export const productAction = (formInput) => (dispatch) => {
  const cookies = new Cookies();
  if (!formInput) {
    const url = `${BASE_URL_V2}/organization/${org_id}/analytics/product/?interval_type=MONTHLY&start=${moment()
      .subtract(3, "months")
      .format("MM-YYYY")}&end=${moment().format("MM-YYYY")}`;
    const headers = {
      Authorization: cookies.get("rupyzToken"),
    };
    axios
      .get(url, { headers })
      .then((response) => {
        dispatch({
          type: productanalytics.PRODUCT_ANALYTICS,
          payload: response,
        });
      })
      .catch((error) => {
        SessionExpireError(error.response);
      });
    return;
  }

  const url = `${BASE_URL_V2}/organization/${org_id}/analytics/product/?interval_type=MONTHLY&start=${moment(
    formInput.start
  ).format("MM-YYYY")}&end=${moment().format("MM-YYYY")}`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: productanalytics.PRODUCT_ANALYTICS,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

//customer analytics
export const customerAction = (formInput) => (dispatch) => {
  const cookies = new Cookies();
  if (!formInput) {
    const url = `${BASE_URL_V2}/organization/${org_id}/analytics/customer/?interval_type=MONTHLY&start=${moment()
      .subtract(3, "months")
      .format("MM-YYYY")}&end=${moment().format("MM-YYYY")}`;
    const headers = {
      Authorization: cookies.get("rupyzToken"),
    };
    axios
      .get(url, { headers })
      .then((response) => {
        dispatch({
          type: customeranalytics.CUSTOMER_ANALYTICS,
          payload: response,
        });
      })
      .catch((error) => {
        SessionExpireError(error.response);
      });
    return;
  }

  const url = `${BASE_URL_V2}/organization/${org_id}/analytics/customer/?interval_type=${
    formInput.interval_type !== "" ? formInput.interval_type : "MONTHLY"
  }&start=${moment(formInput.start).format("MM-YYYY")}&end=${moment(
    formInput.end
  ).format("MM-YYYY")}`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: customeranalytics.CUSTOMER_ANALYTICS,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

//chart analytics
export const chartAction = (formInput) => (dispatch) => {
  const cookies = new Cookies();
  if (!formInput) {
    const url = `${BASE_URL_V2}/organization/${org_id}/analytics/organization/?interval_type=MONTHLY&start=${moment()
      .subtract(3, "months")
      .format("MM-YYYY")}&end=${moment().format("MM-YYYY")}`;
    const headers = {
      Authorization: cookies.get("rupyzToken"),
    };
    axios
      .get(url, { headers })
      .then((response) => {
        dispatch({
          type: chart.ANALYTICS_CHART,
          payload: response,
        });
      })
      .catch((error) => {
        SessionExpireError(error.response);
      });
    return;
  }

  const url = `${BASE_URL_V2}/organization/${org_id}/analytics/organization/?interval_type=${formInput.interval_type}&start=${formInput.start}&end=${formInput.end}`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: chart.ANALYTICS_CHART,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

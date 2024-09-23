import axios from "axios";
import { notification } from "antd";
import { BASE_URL_V2, org_id } from "../../config.js";
import { order } from "../constant";
import SessionExpireError from "../../helpers/sessionExpireError.js";
import Cookies from "universal-cookie";

// const navigate=useHistory()
export const orderAction = (filters) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/order/`;
  const params = {
    page_no: filters?.page || 1,
    delivery_status: filters?.status,
    customer: filters?.query,
    fullfilled_by_ids: filters?.search_term_id,
    customer_level: filters?.customer_level,
    customer_ids: filters?.customer_ids,
    staff_id: filters?.staff_id,
    sort_by: filters?.sort_by,
    sort_order: filters?.sort_order,
    platform: filters?.platform,
    payment_options: filters?.payment_options,
    start_date: filters?.start_date,
    end_date: filters?.end_date,
    user_ids: [filters?.user_ids || "", filters?.admin_user_ids || ""]
      .filter(Boolean)
      .join(","),
  };
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers, params })
    .then((response) => {
      dispatch({
        type: order.SET_ORDER,
        payload: response,
      });
    })
    .catch((err) => {
      SessionExpireError(err.response);
      notification.warning({
        message: `${err.response.data.message}`,
      });
    });
};

//post api
export const orderActionUpdateStatus = (id, status) => (dispatch) => {
  const cookies = new Cookies();
  let data = {
    delivery_status: status,
  };
  const url = `${BASE_URL_V2}/organization/${org_id}/order/${Number(id)}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };

  axios.post(url, data, { headers }).then((response) => {
    if (response.status == 200) {
      notification.success({
        message: `${response.data.message}`,
      });
    }
    dispatch({
      type: order.SET_ORDER,
      payload: response,
    }).catch((err) => {
      SessionExpireError(err.response);
      notification.warning({
        message: `${err.response.data.message}`,
      });
    });
  });
};

// search order
export const orderActionSearch = (namesearch) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/order/?order_id=${namesearch}`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      if (response.data.data.length === 0) {
        notification.warning({
          message: `${response.data.message}`,
        });
      }
      dispatch({
        type: order.SET_ORDER,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
      notification.warning({
        message: `${error.response.data.message}`,
      });
    });
};

export const updateStatus = (order_id, formData) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/order/${order_id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const data = formData;

  axios
    .post(url, data, { headers })
    .then((response) => {
      if (response.status == 200) {
        notification.success({
          message: `${response.data.message}`,
        });
      }
      dispatch({
        type: order.UPDATE_STATUS,
        payload: response,
      });
    })
    .catch((err) => {
      SessionExpireError(err.response);
      notification.warning({
        message: `${err.response.data.message}`,
      });
    });
};

export const dispatchOrder = (order_id, formData) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/order/${order_id}/dispatch/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const data = formData;

  axios
    .post(url, data, { headers })
    .then((response) => {
      if (response.status == 200) {
        notification.success({
          message: `${response.data.message}`,
        });
      }
      dispatch({
        type: order.DISPATCH_ORDER,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: order.DISPATCH_ORDER,
          payload: "",
        });
      }, 100);
    })
    .catch((err) => {
      SessionExpireError(err.response);
      notification.warning({
        message: `${err.response.data.message}`,
      });
    });
};

export const dispatchHistory = (order_id, dispatch_id) => (dispatch) => {
  const cookies = new Cookies();
  if (dispatch_id === "" || order_id === undefined) return;
  const url = `${BASE_URL_V2}/organization/${org_id}/order/${order_id}/dispatch/${dispatch_id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };

  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: order.DISPATCH_HISTORY,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: order.DISPATCH_HISTORY,
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

export const lrUpdateOrder =
  (formData, order_id, dispatch_id) => (dispatch) => {
    const cookies = new Cookies();
    const url = `${BASE_URL_V2}/organization/${org_id}/order/${order_id}/dispatch/${dispatch_id}/lr-update/`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    const data = formData;
    axios
      .post(url, data, { headers })
      .then((response) => {
        if (response.status == 200) {
          notification.success({
            message: `${response.data.message}`,
          });
        }
        dispatch({
          type: order.LR_UPDATE_ORDER,
          payload: response,
        });
        setTimeout(() => {
          dispatch({
            type: order.LR_UPDATE_ORDER,
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

export const deleteOrder = (formData, order_id) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/order/${order_id}/archived/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const data = formData;
  axios
    .post(url, data, { headers })
    .then((response) => {
      if (response.status == 200) {
        notification.success({
          message: `${response.data.message}`,
        });
      }
      dispatch({
        type: order.DELETE_ORDER,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
      notification.warning({
        message: `${error.response.data.message}`,
      });
    });
};

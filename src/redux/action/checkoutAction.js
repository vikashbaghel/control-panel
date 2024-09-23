import { notification } from "antd";
import axios from "axios";
import Cookies from "universal-cookie";
import { BASE_URL_V2, org_id } from "../../config";
import SessionExpireError from "../../helpers/sessionExpireError";
import { checkout } from "../constant";

export const addressList = (customerId) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/customer/${customerId}/address/`;
  const headers = { Authorization: cookies.get("rupyzToken") };

  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: checkout.ADDRESS_LIST,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

export const addressDetail = (customerId, id) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/customer/${customerId}/address/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const params = { id, is_default: id ? false : true };

  axios
    .get(url, { headers, params })
    .then((response) => {
      dispatch({
        type: checkout.ADDRESS_DETAILS,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: checkout.ADDRESS_DETAILS,
          payload: "",
        });
      }, 100);
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

export const updateAddress = async (customer_id, formData) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/customer/${customer_id}/address/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  try {
    const response = await axios.post(url, formData, { headers });
    if (response.status === 200) {
      notification.success({
        message: `Address saved successfully`,
      });
    }
    return response;
  } catch (error) {
    SessionExpireError(error.response);
  }
};

export const updateNewAddress = (formData) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/customer/${cookies.get(
    "rupyzDistributorId"
  )}/address/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const data = formData;

  axios
    .post(url, data, { headers })
    .then((response) => {
      dispatch({
        type: checkout.UPDATE_NEW_ADDRESS,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: checkout.UPDATE_NEW_ADDRESS,
          payload: "",
        });
      }, 1000);
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

export const submitOrder = async (formData) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/order/`;
  const headers = { Authorization: cookies.get("rupyzToken") };

  try {
    const response = await axios.post(url, formData, { headers });
    if (response.status == 200) {
      notification.success({
        message: `${response.data.message}`,
      });
    }
    return response;
  } catch (err) {
    SessionExpireError(err.response);
    notification.warning({
      message: `${err.response?.data?.message}`,
    });
  }
};

export const whatsappRequired = (formData) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/order/${cookies.get(
    "rupOrderId"
  )}/customer-consent/`;
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
        type: checkout.WHATSAPP_REQUIRED,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: checkout.WHATSAPP_REQUIRED,
          payload: "",
        });
      }, 500);
    })
    .catch((err) => {
      SessionExpireError(err.response);
      notification.warning({
        message: `${err.response.data.message}`,
      });
    });
};

export const updateOrder = async (formData, orderId) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/order-update/${orderId}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const data = formData;

  try {
    const response = await axios.post(url, data, { headers });
    if (response.status == 200) {
      notification.success({
        message: `${response.data.message}`,
      });
    }
    return response;
  } catch (err) {
    SessionExpireError(err.response);
    notification.warning({
      message: `${err.response?.data?.message}`,
    });
  }
};

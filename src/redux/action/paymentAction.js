import axios from "axios";
import { BASE_URL_V2, org_id } from "../../config";
import { payment } from "../constant";
import { Navigate } from "react-router-dom";
import { notification } from "antd";
import SessionExpireError from "../../helpers/sessionExpireError";
import Cookies from "universal-cookie";

//get payment list details
export const paymentAction = (filters) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/record-payment/`;
  const params = {
    page_no: filters?.page || 1,
    status: filters?.status,
    customer: filters?.query,
    customer_id: filters?.customer_id,
    staff_id: filters?.staff_id,
  };
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers, params })
    .then((response) => {
      if (filters?.query && response.data.data.length === 0) {
        notification.warning({
          message: "Payment do not Match ",
        });
      }
      dispatch({
        type: payment.SET_PAYMENT,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: payment.SET_PAYMENT,
          payload: "",
        });
      }, 200);
    })
    .catch((error) => {
      SessionExpireError(error.response);
      notification.warning({
        message: `${error.response.data.message}`,
      });
    });
};

export const paymentActionById = (id) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/record-payment/${id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: payment.PAYMENT_RECORD_BY_ID,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: payment.PAYMENT_RECORD_BY_ID,
          payload: "",
        });
      }, 200);
    })
    .catch((error) => {
      SessionExpireError(error.response);
      notification.warning({
        message: `${error.response.data.message}`,
      });
    });
};

//update status
export const paymentActionUpdateStatus =
  (id, status, rejectReason) => (dispatch) => {
    const cookies = new Cookies();
    let data = {
      status: status,
      reject_reason: rejectReason,
    };
    const url = `${BASE_URL_V2}/organization/${org_id}/record-payment/${Number(
      id
    )}/`;
    const headers = {
      Authorization: cookies.get("rupyzToken"),
    };
    axios
      .post(url, data, { headers })
      .then((response) => {
        if (response.status == 200) {
          notification.success({
            message: `${response.data.message}`,
          });
        }
        dispatch({
          type: payment.PAYMENT_UPDATE_STATUS,
          payload: response,
        });
        setTimeout(() => {
          dispatch({
            type: payment.PAYMENT_UPDATE_STATUS,
            payload: "",
          });
        }, 500);
      })
      .catch((err) => {
        SessionExpireError(err.response);
        notification.warning({
          message: `${err?.response?.data?.message}`,
        });
      });
  };

//Addpayment status
export const paymentActionAddPayment = async (data) => {
  const cookies = new Cookies();

  const url = `${BASE_URL_V2}/organization/${org_id}/record-payment/`;
  const headers = { Authorization: cookies.get("rupyzToken") };

  try {
    const response = await axios.post(url, data, { headers });
    if (response.status === 200) {
      notification.success({
        message: `${response.data.message}`,
      });
    }
    return response;
  } catch (err) {
    SessionExpireError(err.response);
    notification.warning({
      message: `${err.response.data.message}`,
    });
  }
};

export const deletePayment = (formData, payment_id) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/record-payment/${payment_id}/archived/`;
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
        type: payment.DELETE_PAYMENT,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
      notification.success({
        message: `${error.response.data.message}`,
      });
    });
};

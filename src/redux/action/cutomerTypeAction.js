import { notification } from "antd";
import axios from "axios";
import Cookies from "universal-cookie";
import { BASE_URL_V2, org_id } from "../../config.js";
import SessionExpireError from "../../helpers/sessionExpireError.js";
import { customerType } from "../constant";

export const customerTypeAction = (name, page_no) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/customer/type/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const params = { name: name, page_no: page_no };
  axios
    .get(url, { headers, params })
    .then((response) => {
      dispatch({
        type: customerType.GET_CUSTOMER_TYPE,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

//add customer category
export const addNewCustomerTypeAction = (formData) => (dispatch) => {
  const cookies = new Cookies();
  let data = formData;
  const url = `${BASE_URL_V2}/organization/${org_id}/customer/type/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .post(url, data, { headers })
    .then((response) => {
      if (response.status == 200) {
        notification.success({
          message: `${response.data.message}`,
        });
      }
      dispatch({
        type: customerType.SET_ADD_CUSTOMER_TYPE,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: customerType.SET_ADD_CUSTOMER_TYPE,
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

//edit customer category
export const editCustomerTypeAction = (formData) => (dispatch) => {
  const cookies = new Cookies();
  let data = formData;
  const url = `${BASE_URL_V2}/organization/${org_id}/customer/type/${formData.id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .post(url, data, { headers })
    .then((response) => {
      if (response.status == 200) {
        notification.success({
          message: `${response.data.message}`,
        });
      }
      dispatch({
        type: customerType.SET_EDIT_CUSTOMER_TYPE,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: customerType.SET_EDIT_CUSTOMER_TYPE,
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

// Delete Api
export const deleteCustomerType =
  (id, new_customer_type_id, is_delete_customer_type) => (dispatch) => {
    const cookies = new Cookies();
    const url = `${BASE_URL_V2}/organization/${org_id}/customer/type/${id}/delete/`;
    const data = { new_customer_type_id, is_delete_customer_type };
    const headers = { Authorization: cookies.get("rupyzToken") };
    axios
      .post(url, data, { headers })
      .then((response) => {
        if (response.status == 200) {
          notification.success({
            message: `${response.data.message}`,
          });
        }
        dispatch({
          type: customerType.DELETE_CUSTOMER_TYPE,
          payload: response,
        });
        setTimeout(() => {
          dispatch({
            type: customerType.DELETE_CUSTOMER_TYPE,
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

import { notification } from "antd";
import axios from "axios";
import Cookies from "universal-cookie";
import { BASE_URL_V2, org_id } from "../../config.js";
import SessionExpireError from "../../helpers/sessionExpireError.js";
import { customerCategory } from "../constant";

export const customerCategoryAction = (page_no) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/segment/?page_no=${page_no}`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: customerCategory.SET_CUSTOMER_CATEGORY,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

//add customer category
export const addNewCustomerCategoryAction = (formData) => (dispatch) => {
  const cookies = new Cookies();
  let data = formData;
  const url = `${BASE_URL_V2}/organization/${org_id}/segment/`;
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
        type: customerCategory.CREATE_PRODUCT_CATEGORY,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: customerCategory.CREATE_PRODUCT_CATEGORY,
          payload: "",
        });
      }, 2000);
    })
    .catch((err) => {
      SessionExpireError(err.response);
      notification.warning({
        message: `${err.response.data.message}`,
      });
    });
};

//edit customer category
export const editCustomerCategoryAction = (formData) => (dispatch) => {
  const cookies = new Cookies();
  let data = formData;
  const url = `${BASE_URL_V2}/organization/${org_id}/segment/${formData.id}/`;
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
        type: customerCategory.SET_EDIT_CUSTOMER_CATEGORY,
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

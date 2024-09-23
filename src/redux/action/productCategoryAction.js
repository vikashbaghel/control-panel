import axios from "axios";
import { BASE_URL_V1, org_id } from "../../config.js";
import SessionExpireError from "../../helpers/sessionExpireError.js";
import { notification } from "antd";
import { productCategory } from "../constant";
import Cookies from "universal-cookie";

export const productCategoryAction = (name, page_no) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/organization/${org_id}/category/`;
  const params = { page_no: page_no, name: name };
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers, params })
    .then((response) => {
      dispatch({
        type: productCategory.SET_PRODUCT_CATEGORY,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

export const productCategoryDetailsAction = (id) => (dispatch) => {
  const cookies = new Cookies();
  if (id === undefined) return;
  const url = `${BASE_URL_V1}/organization/${org_id}/category/?id=${id}`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: productCategory.SET_PRODUCT_CATEGORY_DETAILS,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

//add customer category
export const addNewProductCategoryAction = (formData) => (dispatch) => {
  const cookies = new Cookies();
  let data = formData;
  const url = `${BASE_URL_V1}/organization/${org_id}/category/`;
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
        type: productCategory.SET_CUSTOMER_CATEGORY,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: productCategory.SET_CUSTOMER_CATEGORY,
          payload: "",
        });
      }, 2000);
    })
    .catch((err) => {
      SessionExpireError(err.response);
      if (err.response) {
        notification.warning({
          message: `${err.response.data.message}`,
        });
      }
    });
};

//edit customer category
export const editProductCategoryAction = (formData) => (dispatch) => {
  const cookies = new Cookies();
  let data = formData;
  const url = `${BASE_URL_V1}/organization/${org_id}/category/`;
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
        type: productCategory.SET_EDIT_PRODUCT_CATEGORY,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: productCategory.SET_EDIT_PRODUCT_CATEGORY,
          payload: "",
        });
      }, 400);
    })
    .catch((err) => {
      if (err.response) {
        notification.warning({
          message: `${err.response.data.message}`,
        });
      }
      SessionExpireError(err.response);
    });
};

// Delete Api
export const deleteProductCategoryAction =
  (id, is_category_delete, is_delete_all_products, new_category_id) =>
  (dispatch) => {
    const cookies = new Cookies();
    const url = `${BASE_URL_V1}/organization/${org_id}/category/delete/`;
    const data = {
      id,
      is_category_delete,
      is_delete_all_products,
      new_category_id,
    };
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
          type: productCategory.DELETE_PRODUCT_CATEGORY,
          payload: response,
        });
        setTimeout(() => {
          dispatch({
            type: productCategory.DELETE_PRODUCT_CATEGORY,
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

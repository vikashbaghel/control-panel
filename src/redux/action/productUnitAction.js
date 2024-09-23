import axios from "axios";
import { BASE_URL_V1, org_id } from "../../config";
import { notification } from "antd";
import { productUnit } from "../constant";
import SessionExpireError from "../../helpers/sessionExpireError";
import Cookies from "universal-cookie";

//get staff roles list details
export const productUnitAction = (name, page_no) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/organization/${org_id}/productunit/?dd=true`;
  const params = { name: name, page_no: page_no };
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers, params })
    .then((response) => {
      dispatch({
        type: productUnit.SET_PRODUCT_UNIT,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

//post add new product unit
export const productUnitAddService = (formInput, unitId) => (dispatch) => {
  const cookies = new Cookies();
  const url = unitId
    ? `${BASE_URL_V1}/organization/${org_id}/productunit/${unitId}/`
    : `${BASE_URL_V1}/organization/${org_id}/productunit/`;
  const data = formInput;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .post(url, data, { headers })
    .then((response) => {
      if (response.status === 200) {
        if (response.data.data.id) {
          notification.success({
            message: `${response.data.message}`,
          });
        } else {
          notification.warning({
            message: `${response.data.message}`,
          });
        }
      }
      dispatch({
        type: productUnit.SET_PRODUCT_UNIT_ADD,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: productUnit.SET_PRODUCT_UNIT_ADD,
          payload: "",
        });
      }, 100);
    })
    .catch((err) => {
      SessionExpireError(err.response);
      notification.warning({
        message: `${err.response?.data?.message}`,
      });
    });
};

//delete product unit
export const productUnitDeleteService = (formInput) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/organization/${org_id}/productunit/delete/`;
  const data = formInput;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .post(url, data, { headers })
    .then((response) => {
      if (response.status === 200) {
        notification.success({
          message: `${response.data.message}`,
        });
      }
      dispatch({
        type: productUnit.SET_PRODUCT_UNIT_DELETE,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: productUnit.SET_PRODUCT_UNIT_DELETE,
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

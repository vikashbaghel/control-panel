import axios from "axios";
import { BASE_URL_V2, org_id } from "../../config.js";
import { pricingGroup, teleScopicPricing } from "../constant.js";
import { notification } from "antd";
import SessionExpireError from "../../helpers/sessionExpireError.js";
import Cookies from "universal-cookie";

//get pricingGroup
export const pricingGroupService = () => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/pricing-group/?is_with_id=true`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: pricingGroup.GET_PRICING_GROUP,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

//get pricingGroup List
export const pricingGroupListService =
  (page_no, searchName, dd) => (dispatch) => {
    const cookies = new Cookies();
    const url = `${BASE_URL_V2}/organization/${org_id}/pricing-group/`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    const params = { page_no: page_no, name: searchName, dd: dd };
    axios
      .get(url, { headers, params })
      .then((response) => {
        dispatch({
          type: pricingGroup.GET_PRICING_GROUP_LIST,
          payload: response,
        });
      })
      .catch((error) => {
        SessionExpireError(error.response);
      });
  };

//add new pricing group
export const addPricingGroup = (formData) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/pricing-group/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const data = formData;

  axios
    .post(url, data, { headers })
    .then((response) => {
      if (response.status === 200) {
        notification.success({
          message: `${response.data.message}`,
        });
      }
      dispatch({
        type: pricingGroup.ADD_PRICING_GROUP,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: pricingGroup.ADD_PRICING_GROUP,
          payload: "",
        });
      }, 1000);
    })
    .catch((err) => {
      SessionExpireError(err.response);
      notification.warning({
        message: `${err.response.data.message}`,
      });
    });
};

//edit new pricing group
export const editPricingGroup = (formData) => (dispatch) => {
  const cookies = new Cookies();
  if (formData.id === undefined) {
    return;
  }
  const url = `${BASE_URL_V2}/organization/${org_id}/pricing-group/${formData.id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const data = formData;

  axios
    .post(url, data, { headers })
    .then((response) => {
      if (response.status === 200) {
        notification.success({
          message: `${response.data.message}`,
        });
      }
      dispatch({
        type: pricingGroup.EDIT_PRICING_GROUP,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: pricingGroup.EDIT_PRICING_GROUP,
          payload: "",
        });
      }, 1000);
    })
    .catch((err) => {
      SessionExpireError(err.response);
      notification.warning({
        message: `${err.response.data.message}`,
      });
    });
};

//add new product pricing
export const addProductPricingGroup = (formData) => (dispatch) => {
  const cookies = new Cookies();
  if (formData === undefined) return;
  const url = `${BASE_URL_V2}/organization/${org_id}/ppgm/${formData.id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const data = formData;

  axios
    .post(url, data, { headers })
    .then((response) => {
      if (response.status === 200) {
        notification.success({
          message: `${response.data.message}`,
        });
      }
      dispatch({
        type: pricingGroup.ADD_PRODUCT_PRICING,
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

//edit Telescopic Pricing group
export const editTelescopicPricingGroup = (formData) => (dispatch) => {
  const cookies = new Cookies();
  if (formData === undefined) {
    return;
  }
  const url = `${BASE_URL_V2}/organization/${org_id}/ppgm/${formData.id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const data = formData;

  axios
    .post(url, data, { headers })
    .then((response) => {
      if (response.status === 200) {
        notification.success({
          message: `${response.data.message}`,
        });
      }
      dispatch({
        type: pricingGroup.EDIT_TELESCOPIC_PRICING_GROUP,
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

// update the pricing group
export const updateTelescopicPricingGroup =
  (pg_id, ppgm_id, formData) => (dispatch) => {
    const cookies = new Cookies();
    if (formData === undefined) {
      return;
    }
    const url = `${BASE_URL_V2}/organization/${org_id}/ppgm/${pg_id}/update/${ppgm_id}/`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    const data = formData;

    axios
      .post(url, data, { headers })
      .then((response) => {
        if (response.status === 200) {
          notification.success({
            message: `${response.data.message}`,
          });
        }
        dispatch({
          type: teleScopicPricing.UPDATE_TELESCOPIC_PRICING_GROUP,
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

export const telescopicPricingList = (id) => (dispatch) => {
  const cookies = new Cookies();
  if (id === undefined || id === null) return;
  const url = `${BASE_URL_V2}/organization/${org_id}/ppgm/${id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: teleScopicPricing.GET_TELESCOPIC_LIST,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

//delete pricing group
export const deletePricingGroup = (id, is_forced) => (dispatch) => {
  const cookies = new Cookies();
  if (id === undefined) return;
  const url = `${BASE_URL_V2}/organization/${org_id}/pricing-group/${id}/delete/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const data = { id, is_forced };

  axios
    .post(url, data, { headers })
    .then((response) => {
      if (response.status === 200) {
        notification.success({
          message: `${response.data.message}`,
        });
      }
      dispatch({
        type: pricingGroup.DELETE_PRICING_GROUP,
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

//delete product from pricing group
export const deleteProductFromPricingGroup = (id, product_id) => (dispatch) => {
  const cookies = new Cookies();
  if (id === undefined) return;
  const url = `${BASE_URL_V2}/organization/${org_id}/ppgm/${id}/delete/${product_id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const data = {};

  axios
    .post(url, data, { headers })
    .then((response) => {
      dispatch({
        type: pricingGroup.DELETE_PRODUCT_FROM_PRICING_GROUP,
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

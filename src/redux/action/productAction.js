import { notification } from "antd";
import axios from "axios";
import Cookies from "universal-cookie";
import { BASE_URL_V1, org_id } from "../../config.js";
import SessionExpireError from "../../helpers/sessionExpireError.js";
import { product } from "../constant";

export const fetchProducts = async (params) => {
  const cookies = new Cookies();
  const headers = { Authorization: cookies.get("rupyzToken") };
  return await axios
    .get(`${BASE_URL_V1}/organization/${org_id}/product/`, { headers, params })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      SessionExpireError(error.response);
      return {};
    });
};

export const productService =
  (pageCount, filters = {}) =>
  (dispatch) => {
    const cookies = new Cookies();
    if (pageCount === undefined) return;
    const headers = { Authorization: cookies.get("rupyzToken") };
    let url;
    if (Object.keys(filters)?.length > 0) {
      url = `${BASE_URL_V1}/organization/${org_id}/product/es/`;
    } else {
      url = `${BASE_URL_V1}/organization/${org_id}/product/`;
    }

    const params = {
      page_no: pageCount,
      sort_by: filters?.sort_by,
      sort_order: filters?.sort_order,
      category: filters?.category,
      brand: filters?.brand,
      name: filters?.query,
    };
    axios
      .get(url, { headers, params })
      .then((response) => {
        dispatch({
          type: product.PRODUCT,
          payload: response,
        });
      })
      .catch((error) => {
        SessionExpireError(error.response);
      });
  };

export const getProductAction =
  (pageCount, filter_status, productData) => (dispatch) => {
    const cookies = new Cookies();
    if (filter_status !== "") {
      pageCount = "";
    }
    const url = `${BASE_URL_V1}/organization/${org_id}/product/?category=${
      filter_status !== "" ? filter_status : productData ? productData : ""
    }&page_no=${pageCount}`;

    const headers = {
      Authorization: cookies.get("rupyzToken"),
    };
    axios
      .get(url, { headers })
      .then((response) => {
        dispatch({
          type: product.GET_PRODUCT,
          payload: response,
        });
      })
      .catch((error) => {
        SessionExpireError(error.response);
      });
  };

export const productView = (id, customer_id) => (dispatch) => {
  const cookies = new Cookies();
  const params = { customer_id: customer_id };
  const url = `${BASE_URL_V1}/organization/${org_id}/product/${id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers, params })
    .then((response) => {
      dispatch({
        type: product.PRODUCT_VIEW,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: product.PRODUCT_VIEW,
          payload: "",
        });
      }, 2000);
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

export const searchProduct = (data) => (dispatch) => {
  const cookies = new Cookies();
  if (data.page_no === undefined) {
    return;
  }
  const url =
    data.customer_id !== undefined
      ? `${BASE_URL_V1}/organization/${org_id}/product/es/?name=${data.name}&customer_id=${data.customer_id} `
      : data.name
      ? `${BASE_URL_V1}/organization/${org_id}/product/es/?name=${data.name}`
      : `${BASE_URL_V1}/organization/${org_id}/product/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const params = {
    name: data.category,
    brand: data.brand,
  };
  axios
    .get(url, { headers, params })
    .then((response) => {
      dispatch({
        type: product.SEARCH_PRODUCTS,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

export const searchProductPricing = (data) => (dispatch) => {
  const cookies = new Cookies();
  data = data ? data : "";
  const url = `${BASE_URL_V1}/organization/${org_id}/product/es/?name=${data}&is_published=true`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: product.SEARCH_PRODUCTS,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: product.SEARCH_PRODUCTS,
          payload: "",
        });
      }, 2000);
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

export const addProduct = (formData, id) => (dispatch) => {
  const cookies = new Cookies();
  let url;
  if (id) {
    url = `${BASE_URL_V1}/organization/${org_id}/product/${id}/`;
  } else {
    url = `${BASE_URL_V1}/organization/${org_id}/product/`;
  }
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
        type: product.ADD_PRODUCT,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: product.ADD_PRODUCT,
          payload: "",
        });
      }, 200);
    })
    .catch((err) => {
      SessionExpireError(err.response);
      notification.warning({
        message: `${err.response.data.message}`,
      });
    });
};

export const deleteProduct = async (data) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/organization/${org_id}/product/delete/${data.id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };

  return axios
    .post(url, data, { headers })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      notification.warning({ message: error?.response?.data?.message });
      SessionExpireError(error.response);
    });
};

export const getTelescopingPricing = async (data = {}) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/organization/${org_id}/product/${data?.product_id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };

  const params = {
    customer_id: data.customer_id,
    get_telescope_pricing_only: true,
  };

  return axios
    .get(url, { params, headers })
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

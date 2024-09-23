import { notification } from "antd";
import axios from "axios";
import Cookies from "universal-cookie";
import { BASE_URL_V2, org_id } from "../../config.js";
import SessionExpireError from "../../helpers/sessionExpireError.js";
import { customer } from "../constant";

const cookies = new Cookies();

export const customerDistributor =
  (
    customerLevel,
    page,
    staff_id,
    customer_parent_id,
    search,
    sort_by,
    sort_order,
    customer_type,
    downLevelCustomersList,
    dd = false
  ) =>
  (dispatch) => {
    const cookies = new Cookies();
    if (customerLevel === undefined || page === undefined) return;
    const url = `${BASE_URL_V2}/organization/${org_id}/customer/`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    const params = {
      customer_level: customerLevel,
      page_no: page,
      staff_id: staff_id || "",
      customer_parent_id: customer_parent_id || "",
      name: search,
      sort_by,
      sort_order,
      customer_type,
      dd,
    };
    axios
      .get(url, { headers, params })
      .then((response) => {
        dispatch({
          type: downLevelCustomersList
            ? customer.CUSTOMER_CLIENTS
            : customer.CUSTOMER_DISTRIBUTOR,
          payload: response,
        });
      })
      .catch((error) => {
        SessionExpireError(error.response);
      });
  };

export const customerDetails = (id) => (dispatch) => {
  const cookies = new Cookies();
  if (id === undefined) return;
  const url = `${BASE_URL_V2}/organization/${org_id}/customer/${id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: customer.CUSTOMER_DETAILS,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: customer.CUSTOMER_DETAILS,
          payload: "",
        });
      }, 100);
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

export const getStaffAssignMapping =
  (id, page_no = 1) =>
  (dispatch) => {
    if (id === undefined) return;
    const cookies = new Cookies();
    const url = `${BASE_URL_V2}/organization/${org_id}/customer/${id}/mapping/`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    const params = { page_no: page_no };
    axios
      .get(url, { headers, params })
      .then((response) => {
        dispatch({
          type: customer.STAFF_ASSIGN_MAPPING,
          payload: response,
        });
      })
      .catch((error) => {
        SessionExpireError(error.response);
      });
  };

//pagination distributor
export const customerDistributorPagination = (filters) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/customer/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const params = {
    page_no: filters?.page,
    customer_level: filters?.customer_level,
    name: filters?.query,
    staff_id: filters?.staff_id,
    customer_parent_id: filters?.customer_parent_id,
    customer_type: filters?.customer_type,
    sort_by: filters?.sort_by,
    sort_order: filters?.sort_order,
    beat_ids: filters?.beat_ids,
    customer_levels: filters?.customer_levels,
    staff_ids: filters?.staff_ids,
    dd: filters?.dd || false,
  };
  axios
    .get(url, { headers, params })
    .then((response) => {
      dispatch({
        type: customer.CUSTOMER_DISTRIBUTOR,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

// distributor search
export const customerDistributorSearch = (name) => (dispatch) => {
  const cookies = new Cookies();
  const path = window.location.pathname === "/web/order/order-list";
  const url = `${BASE_URL_V2}/organization/${org_id}/customer/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const params = {
    name: path ? name : name === "LEVEL-2" ? "LEVEL-1" : "LEVEL-2",
    for_listing: path,
  };
  axios
    .get(url, { headers, params })
    .then((response) => {
      dispatch({
        type: customer.CUSTOMER_DISTRIBUTOR,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

// distributor search
export const customerLevelDistributorSearch =
  (name, customerLevel, dd) => (dispatch) => {
    const cookies = new Cookies();
    const url = `${BASE_URL_V2}/organization/${org_id}/customer/`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    const params = {
      name: name,
      for_listing: true,
      customer_level:
        customerLevel === "LEVEL-2"
          ? "LEVEL-1"
          : customerLevel === "LEVEL-3"
          ? "LEVEL-2"
          : "",
      dd: dd,
    };
    axios
      .get(url, { headers, params })
      .then((response) => {
        dispatch({
          type: customer.CUSTOMER_LEVEL_DISTRIBUTOR_LIST,
          payload: response,
        });
      })
      .catch((error) => {
        SessionExpireError(error.response);
      });
  };

// distributor search
export const customerRetailerSearch = (name) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/customer/?customer_type=RETAILER&name=${name}`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: customer.CUSTOMER_DISTRIBUTOR,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

//pagination ratailer
export const customerRetailerPagination = (pageCount) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/customer/?customer_type=RETAILER&page_no=${pageCount}`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: customer.CUSTOMER_DISTRIBUTOR,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

//add distributor
export const customerAddDistributor = async (formdata, id) => {
  const cookies = new Cookies();
  let data = formdata;
  const url = !id
    ? `${BASE_URL_V2}/organization/${org_id}/customer/`
    : `${BASE_URL_V2}/organization/${org_id}/customer/${id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };

  try {
    const response = await axios.post(url, data, { headers });
    if (response.status === 200) {
      notification.success({
        message: `${response.data.message}`,
      });
    }
    return response;
  } catch (error) {
    SessionExpireError(error.response);
    notification.warning({
      message: `${error.response.data.message}`,
    });
  }
};

//add distributor
export const customerAddRetailer = (formdata) => (dispatch) => {
  const cookies = new Cookies();
  let data = formdata;
  const url = `${BASE_URL_V2}/organization/${org_id}/customer/?customer_type=RETAILER`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .post(url, data, { headers })
    .then((response) => {
      if (response.status == 200) {
        notification.success({
          message: `${response.data.message}`,
        });
        // Navigate('/web')
        // Navigate('dashboard/distributor')
        // setAdddistrationOpen(false)
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }

      dispatch({
        type: customer.CUSTOMER_ADD_DISTRIBUTOR,
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

//update distributor

export const customerEditDistributor = (apiData) => (dispatch) => {
  const cookies = new Cookies();
  let data = apiData;
  const url = `${BASE_URL_V2}/organization/${org_id}/customer/${apiData.id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .post(url, data, { headers })
    .then((response) => {
      if (response.status === 200) {
        notification.success({
          message: `${response.data.message}`,
        });
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }

      dispatch({
        type: customer.CUSTOMER_EDIT_DISTRIBUTOR,
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

export const deleteCustomer =
  (customer_id, is_active, formData) => (dispatch) => {
    const cookies = new Cookies();
    let data = { ...formData, is_active };

    const url = `${BASE_URL_V2}/organization/${org_id}/customer/${customer_id}/delete/`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    axios
      .post(url, data, { headers })
      .then((response) => {
        if (response.status === 200 && !formData?.check_children) {
          notification.success({
            message: response.data.message,
          });
        }

        dispatch({
          type: customer.DELETE_CUSTOMER,
          payload: {
            params: formData,
            is_used: false,
            ...response,
          },
        });
        setTimeout(() => {
          dispatch({
            type: customer.DELETE_CUSTOMER,
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

export const searchStaffAssign = (id, name) => (dispatch) => {
  if (name.length < 3) return;
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/customer/${id}/mapping/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const params = { name: name };
  axios
    .get(url, { headers, params })
    .then((response) => {
      dispatch({
        type: customer.SEARCH_STAFF_ASSIGN,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

export const searchCategoryMappingAssign = (id, name) => (dispatch) => {
  if (name.length < 3) return;

  const url = `${BASE_URL_V2}/organization/${org_id}/customer/${id}/mapping/pc/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const params = { name: name };
  axios
    .get(url, { headers, params })
    .then((response) => {
      dispatch({
        type: customer.SEARCH_CUSTOMER_CATEGORY_ASSIGN,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

export const customerNumberValidator = async (mobile) => {
  const url = `${BASE_URL_V2}/organization/${org_id}/validate/mobile/CUSTOMER/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const params = { mobile };
  try {
    const response = await axios.get(url, { headers, params });
    return response.data;
  } catch (error) {
    SessionExpireError(error.response);
    return error.response.data;
  }
};

// service for customer API without redux
export const customerDistributorDetail = async (
  customerLevel,
  page,
  staff_id,
  customer_parent_id,
  search,
  sort_by,
  sort_order,
  customer_type,
  downLevelCustomersList
) => {
  const cookies = new Cookies();
  if (customerLevel === undefined || page === undefined) return;
  const url = `${BASE_URL_V2}/organization/${org_id}/customer/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const params = {
    customer_level: customerLevel,
    page_no: page,
    staff_id: staff_id,
    customer_parent_id: customer_parent_id,
    name: search,
    sort_by,
    sort_order,
    customer_type,
  };
  return await axios
    .get(url, { headers, params })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

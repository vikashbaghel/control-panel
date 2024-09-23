import axios from "axios";
import { BASE_URL_V1, BASE_URL_V2, org_id } from "../../config.js";
import { staff } from "../constant";
import { notification } from "antd";
import SessionExpireError from "../../helpers/sessionExpireError.js";
import Cookies from "universal-cookie";

//get staff details
export const staffService = (filters) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/staff/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const params = {
    name: filters?.query,
    page_no: filters?.page || 1,
    dd: filters?.dd || false,
  };
  axios
    .get(url, { headers, params })
    .then((response) => {
      dispatch({
        type: staff.STAFF,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

//get staff pagination
export const staffDetailsById = (id) => (dispatch) => {
  if (id === undefined) return;
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/staff/${id}/`;

  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: staff.STAFF,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

// get staff beats assigned
export const staffBeatsAssigned =
  (staffId, pageCount = 1) =>
  (dispatch) => {
    const cookies = new Cookies();
    const headers = { Authorization: cookies.get("rupyzToken") };
    const url = `${BASE_URL_V2}/organization/${org_id}/beat/?page_no=${pageCount}&staff_id=${staffId}`;

    axios
      .get(url, { headers })
      .then((response) => {
        dispatch({ type: staff.STAFF_BEATS_ASSIGNED, payload: response });
      })
      .catch((error) => {
        SessionExpireError(error.response);
      });
  };

// get staff customer assigned
export const staffCustomersAssigned =
  (staffId, pageCount = 1) =>
  (dispatch) => {
    const cookies = new Cookies();
    const headers = { Authorization: cookies.get("rupyzToken") };
    const url = `${BASE_URL_V2}/organization/${org_id}/customer/?page_no=${pageCount}&staff_id=${staffId}`;

    axios
      .get(url, { headers })
      .then((response) => {
        dispatch({ type: staff.STAFF_CUSTOMER_ASSIGNED, payload: response });
      })
      .catch((error) => {
        SessionExpireError(error.response);
      });
  };

export const updateStaff = async (formData) => {
  const cookies = new Cookies();

  const url = formData?.id
    ? `${BASE_URL_V2}/organization/${org_id}/staff/${formData.id}/`
    : `${BASE_URL_V2}/organization/${org_id}/staff/`;

  const headers = { Authorization: cookies.get("rupyzToken") };
  try {
    const response = await axios.post(url, formData, { headers });

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

//post add new staff details
export const staffAddService = (formInput) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/staff/`;
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
        type: staff.STAFF_ADD,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: staff.STAFF_ADD,
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

//post edit staff details
export const staffEditService = (formInput) => (dispatch) => {
  const cookies = new Cookies();
  if (formInput.id === undefined) return;
  const url = `${BASE_URL_V2}/organization/${org_id}/staff/${formInput.id}/`;
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
        type: staff.STAFF_EDIT,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: staff.STAFF_EDIT,
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

//delete staff details
export const staffDeleteService = (id) => (dispatch) => {
  const cookies = new Cookies();
  if (id === undefined) return;
  const url = `${BASE_URL_V2}/organization/${org_id}/staff/${id}/delete/`;
  const data = id;
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
        type: staff.STAFF_DELETE,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: staff.STAFF_DELETE,
          payload: "",
        });
      }, 2000);
    })
    .catch((err) => {
      SessionExpireError(err.response);
      notification.success({
        message: `${err.response.data.message}`,
      });
    });
};

//get staff orders details
export const staffOrderService =
  (id = "") =>
  (dispatch) => {
    const cookies = new Cookies();
    const url = `${BASE_URL_V2}/organization/${org_id}/order/`;
    const headers = {
      Authorization: cookies.get("rupyzToken"),
    };
    const params = { staff_id: id };
    axios.get(url, { headers, params }).then((response) => {
      dispatch({
        type: staff.STAFF_ORDER,
        payload: response,
      });
    });
  };

//get staff payment details
export const staffPaymentService = (id) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/record-payment/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const params = { staff_id: id };
  axios
    .get(url, { headers, params })
    .then((response) => {
      dispatch({
        type: staff.STAFF_PAYMENT,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

export const getStaffDetails = () => (dispatch) => {
  const cookies = new Cookies();
  let url;
  if (cookies.get("rupyzAccessType") === "WEB_SARE360") {
    url = `${BASE_URL_V1}/user/profile/`;
  } else {
    // "/staff/0/" is to get the data of staff base on Token if user want its own data
    url = `${BASE_URL_V2}/organization/staff/profile/`;
  }
  const headers = { Authorization: cookies.get("rupyzToken") };
  const params = { org_id: org_id };
  axios
    .get(url, { headers, params })
    .then((response) => {
      dispatch({
        type: staff.STAFF_DETAILS,
        payload: response,
      });
      cookies.set(
        "checkIn",
        response.data.data.checkin_time === ""
          ? ""
          : response.data.data.checkin_time !== "" &&
            response.data.data.checkout_time !== ""
          ? "Check Out"
          : response.data.data.checkin_time !== "" &&
            response.data.data.checkout_time === "" &&
            "Check In",
        { path: "/" }
      );
      cookies.set("rupyzPermissionType", response.data.data.permissions, {
        path: "/",
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

export const searchCustomerAssign = (id, name) => (dispatch) => {
  const cookies = new Cookies();
  if (name.length < 3) return;
  const url = `${BASE_URL_V2}/organization/${org_id}/staff/${id}/mapping/?name=${name}`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: staff.SEARCH_CUSTOMER_ASSIGN,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

//get staff details
export const staffDetailByIdService = (id) => (dispatch) => {
  if (id === undefined) return;
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/staff/${id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: staff.STAFF_DETAILS_BY_ID,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: staff.STAFF_DETAILS_BY_ID,
          payload: "",
        });
      }, 500);
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

//dropdown staff list
export const fetchStaffList =
  (params = {}) =>
  (dispatch) => {
    const cookies = new Cookies();
    const url = `${BASE_URL_V2}/organization/${org_id}/staff/`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    axios
      .get(url, { headers, params })
      .then((response) => {
        dispatch({
          type: staff.STAFF_LIST,
          payload: response,
        });
      })
      .catch((error) => {
        SessionExpireError(error.response);
      });
  };

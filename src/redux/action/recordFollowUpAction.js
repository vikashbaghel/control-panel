import axios from "axios";
import { BASE_URL_V2, BASE_URL_V3, org_id } from "../../config.js";
import { feedbackAndActivity } from "../constant";
import { notification } from "antd";
import SessionExpireError from "../../helpers/sessionExpireError.js";
import Cookies from "universal-cookie";

//get feedback And Activity
export const feedbackAndActivityService =
  (id, lead_id, is_all_true, date, pageCount) => (dispatch) => {
    if (id === undefined || lead_id === undefined) return;
    const cookies = new Cookies();
    const url = `${BASE_URL_V2}/organization/${org_id}/activity/feedback/`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    const params = {
      customer_id: id,
      module_id: lead_id,
      is_all_true: is_all_true,
      date: date,
      page_no: pageCount,
    };
    axios
      .get(url, { headers, params })
      .then((response) => {
        dispatch({
          type: feedbackAndActivity.GET_CUSTOMER_ACTIVITY,
          payload: response,
        });
      })
      .catch((error) => {
        SessionExpireError(error.response);
      });
  };

//Add new feedback And Activity
export const feedbackAndActivityAddService = (formInput, id) => (dispatch) => {
  const cookies = new Cookies();
  let url;
  if (id) {
    url = `${BASE_URL_V2}/organization/${org_id}/activity/feedback/${id}/`;
  } else {
    url = `${BASE_URL_V2}/organization/${org_id}/activity/feedback/`;
  }
  const data = formInput;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .post(url, data, { headers })
    .then((response) => {
      cookies.set("checkIn", formInput.action, { path: "/" });
      if (response.status === 200) {
        notification.success({
          message: `${response.data.message}`,
        });
      }
      dispatch({
        type: feedbackAndActivity.ADD_CUSTOMER_ACTIVITY,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: feedbackAndActivity.ADD_CUSTOMER_ACTIVITY,
          payload: "",
        });
        if (id)
          dispatch({
            type: feedbackAndActivity.GET_FEEDBACK_ACTIVITY,
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

// add/edit activity
export const updateActivity = async (formInput, id) => {
  const cookies = new Cookies();
  let url;
  if (id) {
    url = `${BASE_URL_V2}/organization/${org_id}/activity/feedback/${id}/`;
  } else {
    url = `${BASE_URL_V2}/organization/${org_id}/activity/feedback/`;
  }
  const data = formInput;
  const headers = { Authorization: cookies.get("rupyzToken") };
  try {
    const res = await axios.post(url, data, { headers });
    cookies.set("checkIn", formInput.action, { path: "/" });
    if (res.status === 200) {
      notification.success({
        message: `Activity has been ${id ? "updated" : "created"} successfully`,
      });
    }
    return res;
  } catch (err) {
    SessionExpireError(err.response);
    notification.warning({
      message: `${err.response.data.message}`,
    });
  }
};

//Edit feedback And Activity
export const feedbackAndActivityEditService = (formInput, id) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/activity/feedback/${id}/`;
  const data = formInput;
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
        type: feedbackAndActivity.EDIT_CUSTOMER_ACTIVITY,
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

//get staff Activity
export const staffAllActivityService =
  (id, searchDate, page_no) => (dispatch) => {
    const cookies = new Cookies();
    const url = `${BASE_URL_V2}/organization/${org_id}/activity/logs/`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    const params = { user_id: id, date: searchDate, page_no };
    axios
      .get(url, { headers, params })
      .then((response) => {
        dispatch({
          type: feedbackAndActivity.GET_STAFF_ACTIVITY,
          payload: response,
        });
      })
      .catch((error) => {
        SessionExpireError(error.response);
      });
  };

//get staff Activity
export const myActivityService = (searchDate, page_no) => (dispatch) => {
  if (searchDate === undefined) return;
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/activity/logs/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const params = {
    date: searchDate,
    page_no: page_no || 1,
  };
  axios
    .get(url, { headers, params })
    .then((response) => {
      dispatch({
        type: feedbackAndActivity.GET_MY_ACTIVITY,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

//get team Activity
export const teamActivityService = (searchDate, name, pageNo) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/activity/logs/team/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const params = { date: searchDate, name: name, page_no: pageNo };
  axios
    .get(url, { headers, params })
    .then((response) => {
      dispatch({
        type: feedbackAndActivity.GET_TEAM_ACTIVITY,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

// CHECK-IN AND CHECK-OUT needed to changes soon
export const checkInAction =
  (params = {}, checkIn = null) =>
  (dispatch) => {
    const cookies = new Cookies();
    const url = `${BASE_URL_V2}/organization/${org_id}/activity/attendance/check/`;
    const checkState = checkIn === null ? cookies.get("checkIn") : checkIn;
    const action = checkState === "Check In" ? "Check Out" : "Check In";
    const data = {
      module_type: "Attendance",
      action,
      ...params,
    };
    const headers = { Authorization: cookies.get("rupyzToken") };
    axios
      .post(url, data, { headers })
      .then((response) => {
        cookies.set("checkIn", action, { path: "/" });
        if (response.status === 200) {
          notification.success({
            message: `${response.data.message}`,
          });
        }
        dispatch({
          type: feedbackAndActivity.CHECK_IN,
          payload: response,
        });
        setTimeout(() => {
          dispatch({
            type: feedbackAndActivity.CHECK_IN,
            payload: "",
          });
        }, 100);
      })
      .catch((err) => {
        SessionExpireError(err.response);
        notification.warning({
          message: `${err.response?.data.message}`,
        });
      });
  };

// lead and coustomer feedback
export const feedbackActivityById = (id) => (dispatch) => {
  if (id === undefined) return;
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/activity/feedback/${id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: feedbackAndActivity.GET_FEEDBACK_ACTIVITY,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};
export const fetchFeedbackActivityById = async (id) => {
  if (id === undefined) return;
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/activity/feedback/${id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  return axios
    .get(url, { headers })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

export const getActivityFormByType = async (activityTypeId) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/custom-forms/activity/${activityTypeId}/`;

  const headers = { Authorization: cookies.get("rupyzToken") };
  try {
    const res = await axios.get(url, { headers });
    return res;
  } catch (err) {
    SessionExpireError(err.response);
    notification.warning({
      message: `${err.response.data.message}`,
    });
  }
};

//       team - activity services
export const getAggregatedStatusCounts = async (params = {}) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/activity/team/status/`;

  const headers = { Authorization: cookies.get("rupyzToken") };

  try {
    const res = await axios.get(url, { headers, params });
    return res.data.data;
  } catch (err) {
    SessionExpireError(err.response);
    notification.warning({
      message: `${err.response.data.message}`,
    });
  }
};

export const getStaffDashboardDetails = async (params = {}) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/activity/team/dashboard/`;
  const headers = { Authorization: cookies.get("rupyzToken") };

  try {
    const res = await axios.get(url, { headers, params });
    return res.data.data;
  } catch (err) {
    SessionExpireError(err.response);
  }
};

export const createStaffDashboardReport = async (filters = {}) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/staff/dashboard/reports/`;
  const headers = { Authorization: cookies.get("rupyzToken") };

  try {
    const response = await axios.post(
      url,
      { report_module: "STAFF_DASHBOARD", ...filters },
      { headers }
    );
    if (response.status === 200) {
      notification.success({
        message: `${response.data.message}`,
      });
    }
  } catch (err) {
    SessionExpireError(err.response);
  }
};

export const getTCPCLogsList = async (params = {}) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/activity/tcpc/logs/`;
  const headers = { Authorization: cookies.get("rupyzToken") };

  try {
    const res = await axios.get(url, { headers, params });
    return res.data.data;
  } catch (err) {
    SessionExpireError(err.response);
    notification.warning({
      message: `${err.response.data.message}`,
    });
  }
};

export const getActivityMapLogs = async (params) => {
  if (!params?.user_id) return;

  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/activity/logs/`;
  const headers = { Authorization: cookies.get("rupyzToken") };

  try {
    const res = await axios.get(url, { headers, params });
    return res.data.data;
  } catch (error) {
    SessionExpireError(error.response);
  }
};

export const getDSRDetails = async (params) => {
  if (!params?.user_id) return;

  const cookies = new Cookies();

  const url = `${BASE_URL_V2}/organization/${org_id}/activity/details/`;
  const headers = { Authorization: cookies.get("rupyzToken") };

  try {
    const res = await axios.get(url, { headers, params });
    return res.data.data;
  } catch (error) {
    SessionExpireError(error.response);
  }
};

export const getDeviceLogs = async (user_id, date) => {
  if (!user_id) return;

  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/activity/devicelogs/${user_id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const params = { date };
  try {
    const res = await axios.get(url, { headers, params });
    return res.data.data;
  } catch (error) {
    SessionExpireError(error.response);
  }
};

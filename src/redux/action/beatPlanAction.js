import { notification } from "antd";
import axios from "axios";
import Cookies from "universal-cookie";
import { BASE_URL_V2, org_id } from "../../config.js";
import SessionExpireError from "../../helpers/sessionExpireError.js";
import { beatPlan } from "../constant.js";

// // Beat Plan fetch list
export const fetchBeatPlan = (id, name, status, user_id) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/beatroute/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const params = { page_no: id, name: name, status: status, user_id: user_id };
  axios
    .get(url, { headers, params })
    .then((response) => {
      dispatch({
        type: beatPlan.BEAT_PLAN_LIST,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

// Add Beat Plan
export const addBeatPlanService = (formInput) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/beatroute/`;
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
        type: beatPlan.ADD_BEAT_PLAN,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: beatPlan.ADD_BEAT_PLAN,
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

export const beatPlanEditService = (formInput) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/beatroute/${formInput.id}/`;
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
        type: beatPlan.EDIT_BEAT_PLAN,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: beatPlan.EDIT_BEAT_PLAN,
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

// // Add Beat Plan Daily
export const addBeatPlanDaily = (formInput, beatId) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/beatroute/${beatId}/plan/`;
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
        type: beatPlan.ADD_BEAT_PLAN_DAILY,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: beatPlan.ADD_BEAT_PLAN_DAILY,
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

//delete beat Plan
export const beatPlanDeleteService = (delete_id) => (dispatch) => {
  const cookies = new Cookies();
  if (delete_id === undefined) return;
  const url = `${BASE_URL_V2}/organization/${org_id}/beatroute/${delete_id.id}/delete/`;
  const data = delete_id;
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
        type: beatPlan.BEAT_PLAN_DELETE,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: beatPlan.BEAT_PLAN_DELETE,
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

// Active Beat Plan Details
export const activeBeatPlanDetailsAction = (date) => (dispatch) => {
  const cookies = new Cookies();
  if (!date) return;
  const url = `${BASE_URL_V2}/organization/${org_id}/beatroute/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const params = { date: date, is_active: true };
  axios
    .get(url, { headers, params })
    .then((response) => {
      dispatch({
        type: beatPlan.ACTIVE_BEAT_PLAN_DETAILS,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

export const getStaffActiveBeatPlanDetailsAction =
  (date, user_id) => (dispatch) => {
    const cookies = new Cookies();
    if (date === undefined) return;
    const url = `${BASE_URL_V2}/organization/${org_id}/beatroute/`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    const params = { date: date, is_active: true, user_id: user_id };
    axios
      .get(url, { headers, params })
      .then((response) => {
        dispatch({
          type: beatPlan.STAFF_ACTIVE_BEAT_PLAN_DETAILS,
          payload: response,
        });
      })
      .catch((error) => {
        SessionExpireError(error.response);
      });
  };

// Beat Plan Details
export const beatPlanDetailsAction = (id, date) => (dispatch) => {
  const cookies = new Cookies();
  if (id === "" || date === "") return;
  const url = `${BASE_URL_V2}/organization/${org_id}/beatroute/${id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const params = { date: date };
  axios
    .get(url, { headers, params })
    .then((response) => {
      dispatch({
        type: beatPlan.BEAT_PLAN_DETAILS,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

export const beatPlanDetailById = (id, search) => (dispatch) => {
  const cookies = new Cookies();
  if (id === undefined) return;
  const url = `${BASE_URL_V2}/organization/${org_id}/beatroute/${id}/plan/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const params = { name: search };
  axios
    .get(url, { headers, params })
    .then((response) => {
      dispatch({
        type: beatPlan.BEAT_PLAN_DETAIL_BY_ID,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

// Approval Beat Plan
export const approvalBeatPlanDetailsAction = (formdata) => (dispatch) => {
  const cookies = new Cookies();
  if (formdata === undefined) return;
  const url = `${BASE_URL_V2}/organization/${org_id}/beatroute/${formdata.id}/approval/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const data = formdata;
  axios
    .post(url, data, { headers })
    .then((response) => {
      if (response.status === 200) {
        notification.success({
          message: `${response.data.message}`,
        });
      }
      dispatch({
        type: beatPlan.BEAT_PLAN_APPROVAL,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: beatPlan.BEAT_PLAN_APPROVAL,
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

export const BeatPlanCustomer =
  (beat_plan_id, page, date, type, search) => (dispatch) => {
    const cookies = new Cookies();
    if (beat_plan_id === "" || date === "") return;
    const url = `${BASE_URL_V2}/organization/${org_id}/beatroute/${beat_plan_id}/customerlist/`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    const params = { page_no: page, date: date, list_type: type, name: search };
    axios
      .get(url, { headers, params })
      .then((response) => {
        dispatch({
          type: beatPlan.BEAT_PLAN_CUSTOMER_DETAILS,
          payload: response,
        });
      })
      .catch((error) => {
        SessionExpireError(error.response);
      });
  };

// Beat Plan Approval list
export const approvalBeatPlanListAction =
  (id, name, status, user_id) => (dispatch) => {
    const cookies = new Cookies();
    let url;
    if (user_id) {
      url = `${BASE_URL_V2}/organization/${org_id}/beatroute/`;
    } else {
      url = `${BASE_URL_V2}/organization/${org_id}/beatroute/approval/`;
    }
    const headers = { Authorization: cookies.get("rupyzToken") };
    if (status === "All") status = "";
    else if (status === "Approval Pending") status = "Pending";
    else if (status === "Closed") status = "completed,rejected";

    const params = {
      page_no: id,
      name: name,
      status: status?.toUpperCase(),
      user_id,
    };
    axios
      .get(url, { headers, params })
      .then((response) => {
        dispatch({
          type: beatPlan.APPROVAL_BEAT_PLAN_LIST,
          payload: response,
        });
      })
      .catch((error) => {
        SessionExpireError(error.response);
      });
  };

import axios from "axios";
import { BASE_URL_V1, BASE_URL_V2, org_id } from "../../config.js";
import { beat } from "../constant.js";
import { notification } from "antd";
import SessionExpireError from "../../helpers/sessionExpireError.js";
import Cookies from "universal-cookie";

//get beat list
export const beatService =
  (page_no, name, beat_id, parent_customer_id, staff_id, sort_by, sort_order) =>
  (dispatch) => {
    const cookies = new Cookies();
    let url;
    if (beat_id) {
      url = `${BASE_URL_V2}/organization/${org_id}/staff/${beat_id}/mapping/beats/?dd=true`;
    } else {
      url = `${BASE_URL_V2}/organization/${org_id}/beat/`;
    }
    const headers = { Authorization: cookies.get("rupyzToken") };
    let params = {
      page_no: page_no || 1,
      name: name,
      parent_customer_id,
      staff_id,
    };
    if (sort_by && sort_order) params = { ...params, sort_by, sort_order };
    axios
      .get(url, { headers, params })
      .then((response) => {
        dispatch({
          type: beat.BEAT_LIST,
          payload: response,
        });
      })
      .catch((error) => {
        SessionExpireError(error.response);
        notification.warning({
          message: `${error.response.data.message}`,
        });
      });
  };

// //post add new beat details
export const beatAddService = (formInput) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/beat/`;
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
        type: beat.BEAT_ADD,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: beat.BEAT_ADD,
          payload: "",
        });
      }, 400);
    })
    .catch((err) => {
      SessionExpireError(err.response);
      notification.warning({
        message: `${err.response.data.message}`,
      });
    });
};

//post edit beat details
export const beatEditService = (formInput) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/beat/${formInput.id}/`;
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
        type: beat.BEAT_EDIT,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: beat.BEAT_EDIT,
          payload: "",
        });
      }, 400);
    })
    .catch((err) => {
      SessionExpireError(err.response);
      notification.warning({
        message: `${err.response.data.message}`,
      });
    });
};

//get beat details
export const beatDetailsService = (id) => (dispatch) => {
  const cookies = new Cookies();
  if (id === undefined) return;
  const url = `${BASE_URL_V2}/organization/${org_id}/beat/${id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: beat.BEAT_DETAILS,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
      notification.warning({
        message: `${error.response.data.message}`,
      });
    });
};

export const beatDetailsByBeatPlanIdService =
  (beat_id, beat_plan_id, date_filter) => (dispatch) => {
    const cookies = new Cookies();
    if (
      beat_id === undefined ||
      beat_plan_id === undefined ||
      date_filter === undefined
    )
      return;
    const url = `${BASE_URL_V2}/organization/${org_id}/beat/${
      beat_id && beat_id
    }/mapping/`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    const params = { beatrouteplan_id: beat_plan_id, date: date_filter };
    axios
      .get(url, { headers, params })
      .then((response) => {
        dispatch({
          type: beat.BEAT_DETAILS_BY_BEAT_PLAN_ID,
          payload: response,
        });
      })
      .catch((error) => {
        SessionExpireError(error.response);
        notification.warning({
          message: `${error.response.data.message}`,
        });
      });
  };

//get beat details
export const beatMappingService =
  (id, page_no = 1) =>
  (dispatch) => {
    const cookies = new Cookies();
    if (!id) return;
    const url = `${BASE_URL_V2}/organization/${org_id}/beat/${id}/mapping/`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    const params = { page_no: page_no };
    axios
      .get(url, { headers, params })
      .then((response) => {
        dispatch({
          type: beat.BEAT_MAPPING_SERVICE,
          payload: response,
        });
      })
      .catch((error) => {
        SessionExpireError(error.response);
        notification.warning({
          message: `${error.response.data.message}`,
        });
      });
  };

//delete beat
export const beatDeleteService = (formInput) => (dispatch) => {
  const cookies = new Cookies();
  if (formInput === undefined) return;
  const url = `${BASE_URL_V2}/organization/${org_id}/beat/${formInput.id}/delete/`;
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
        type: beat.BEAT_DELETE,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: beat.BEAT_DELETE,
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

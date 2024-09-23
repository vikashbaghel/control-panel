import axios from "axios";
import { BASE_URL_V2, BASE_URL_V3, org_id } from "../../config.js";
import { reimbursement } from "../constant";
import { notification } from "antd";
import SessionExpireError from "../../helpers/sessionExpireError.js";
import Cookies from "universal-cookie";

//get reimbursment List
export const reibursementListService = (id) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/reimbursement/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const params = { rt_id: id };
  axios
    .get(url, { headers, params })
    .then((response) => {
      dispatch({
        type: reimbursement.GET_REIBURSEMENT_LIST,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

//get reimbursment
export const reibursementService =
  (status, page_no, userid, id) => (dispatch) => {
    const cookies = new Cookies();
    const url = `${BASE_URL_V2}/organization/${org_id}/reimbursement-tracker/`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    const params = {
      page_no: page_no,
      status: status,
      user_id: userid,
      id: id,
    };
    axios
      .get(url, { headers, params })
      .then((response) => {
        dispatch({
          type: reimbursement.GET_REIMBURSEMENT_TRACKER,
          payload: response,
        });
      })
      .catch((error) => {
        SessionExpireError(error.response);
      });
  };

//get reimbursment tracker details
export const reibursementTrackerDetailsService = (id) => (dispatch) => {
  if (id === undefined) return;
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/reimbursement-tracker/${id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: reimbursement.GET_REIMBURSEMENT_TRACKER_DETAILS,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

//Add new Reimbursement-Tracker
export const reimbursementAddService = (formInput) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/reimbursement-tracker/`;
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
        type: reimbursement.REIBURSEMENT_TRACKER_ADD,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: reimbursement.REIBURSEMENT_TRACKER_ADD,
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

//Add new Reimbursement-Item
export const addReimbursementItemService = (formInput) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/reimbursement/`;
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
        type: reimbursement.REIBURSEMENT_ITEM_ADD,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: reimbursement.REIBURSEMENT_ITEM_ADD,
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

//get reimbursment item details
export const reibursementItemDetailsService = (id) => (dispatch) => {
  const cookies = new Cookies();
  if (!id) return;
  const url = `${BASE_URL_V2}/organization/${org_id}/reimbursement/${id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: reimbursement.GET_REIBURSEMENT_ITEM_DETAILS,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

//post edit reimbursment details
export const reimbursementEditService = (formInput) => (dispatch) => {
  // if(formInput.id === undefined) return
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/reimbursement-tracker/${formInput.id}/`;
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
        type: reimbursement.REIBURSEMENT_TRACKER_EDIT,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: reimbursement.REIBURSEMENT_TRACKER_EDIT,
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

//post edit reimbursement details
export const reimbursementItemEditService = (formInput, id) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/reimbursement/${id}/`;
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
        type: reimbursement.REIBURSEMENT_ITEM_EDIT,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: reimbursement.REIBURSEMENT_ITEM_EDIT,
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

//delete reimbursement details
export const reimbursementDeleteService = (id) => (dispatch) => {
  if (id === undefined) return;
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/reimbursement-tracker/${id}/delete/`;
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
        type: reimbursement.REIBURSEMENT_DELETE,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: reimbursement.REIBURSEMENT_DELETE,
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

//delete reimbursement item details
export const reimbursementItemDeleteService = (id) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/reimbursement/${id}/delete/`;
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
        type: reimbursement.REIBURSEMENT_ITEM_DELETE,
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

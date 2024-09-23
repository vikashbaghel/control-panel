import { BASE_URL_V2, org_id } from "../../config";
import axios from "axios";
import Cookies from "universal-cookie";
import { goal } from "../constant";
import SessionExpireError from "../../helpers/sessionExpireError.js";
import { notification } from "antd";

export const getGoalTemplate = (pageCount, name) => (dispatch) => {
  const cookies = new Cookies();
  if (typeof pageCount !== "number") return;
  const url = `${BASE_URL_V2}/organization/${org_id}/target/template/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const params = { page_no: pageCount, name: name };
  axios
    .get(url, { headers, params })
    .then((response) => {
      dispatch({
        type: goal.GET_GOAL_TEMPLATE,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

export const getGoalById = (id) => (dispatch) => {
  if (id === undefined) return;
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/target/template/${id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: goal.GET_GOAL_BY_ID,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: goal.GET_GOAL_BY_ID,
          payload: "",
        });
      }, 200);
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

export const createGoalTemplate = (id, formData) => (dispatch) => {
  const cookies = new Cookies();
  let url;
  if (id) {
    url = `${BASE_URL_V2}/organization/${org_id}/target/template/${id}/`;
  } else {
    url = `${BASE_URL_V2}/organization/${org_id}/target/template/`;
  }
  const data = formData;
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
        type: goal.CREATE_GOAL_TEMPLATE,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: goal.CREATE_GOAL_TEMPLATE,
          payload: "",
        });
      }, 200);
    })
    .catch((error) => {
      SessionExpireError(error.response);
      notification.warning({
        message: `${error.response.data.message}`,
      });
    });
};

export const updateGoalTemplate = (id, formData) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/target/template/${id}/`;
  const data = formData;
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
        type: goal.UPDATE_GOAL_TEMPLATE,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: goal.UPDATE_GOAL_TEMPLATE,
          payload: "",
        });
      }, 200);
    })
    .catch((error) => {
      SessionExpireError(error.response);
      notification.warning({
        message: `${error.response.data.message}`,
      });
    });
};

export const deleteGoals = (id) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/target/template/${id}/delete/`;
  const data = {};
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
        type: goal.DELETE_GOAL,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: goal.DELETE_GOAL,
          payload: "",
        });
      }, 2000);
    })
    .catch((error) => {
      SessionExpireError(error.response);
      notification.warning({
        message: `${error.response.data.message}`,
      });
    });
};

export const customAssignGoals = (formData) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/target/set/`;
  const data = formData;
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
        type: goal.CUSTOM_ASSIGN_GOAL,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: goal.CUSTOM_ASSIGN_GOAL,
          payload: "",
        });
      }, 200);
    })
    .catch((error) => {
      SessionExpireError(error.response);
      notification.warning({
        message: `${error.response.data.message}`,
      });
    });
};

// GOAL RELATED TO USER
export const getUserGoalDetails = (id) => (dispatch) => {
  const cookies = new Cookies();
  if (id === undefined) return;
  const url = `${BASE_URL_V2}/organization/${org_id}/target/set/?user_id=${id}`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: goal.GET_USER_TARGET_ID,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

export const deleteUserTarget = (id, formData) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/target/set/${id}/delete/`;
  const data = formData;
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
        type: goal.DELETE_USER_TARGET,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: goal.DELETE_USER_TARGET,
          payload: "",
        });
      }, 500);
    })
    .catch((error) => {
      SessionExpireError(error.response);
      notification.warning({
        message: `${error.response.data.message}`,
      });
    });
};

// GET SELF TARGET DETAILS
export const getSelfTargetDetails = (active) => (dispatch) => {
  const cookies = new Cookies();
  if (!active) return;
  const url = `${BASE_URL_V2}/organization/${org_id}/target/?is_active=${active}`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: goal.GET_SELF_TARGET_DETAILS,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

export const updateStaffTarget = (id, formData) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/target/set/${id}/`;
  const data = formData;
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
        type: goal.UPDATE_STAFF_TARGET,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: goal.UPDATE_STAFF_TARGET,
          payload: "",
        });
      }, 500);
    })
    .catch((error) => {
      SessionExpireError(error.response);
      notification.warning({
        message: `${error.response.data.message}`,
      });
    });
};

export const searchGoalTemplate = (name) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/target/template/?name=${name}`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: goal.SEARCH_GOAL_TEMPLATE,
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

// staff targets details
export const getStaffGoalDetails = (staffId) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/target/?id=${staffId}`;
  const headers = { Authorization: cookies.get("rupyzToken") };

  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: goal.GET_STAFF_GOAL_DETAILS,
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

export const getTargetDetailsById = (id) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/target/set/${id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };

  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: goal.GET_TARGET_DETAILS_BY_ID,
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

//  team targets
export const getTeamTargetsList =
  (page_no, target, searchKey) => (dispatch) => {
    const cookies = new Cookies();
    const url = `${BASE_URL_V2}/organization/${org_id}/target/set/`;
    const headers = { Authorization: cookies.get("rupyzToken") };

    const params = {
      page_no,
      [target]: true,
      name: searchKey,
    };
    axios
      .get(url, { headers, params })
      .then((response) => {
        dispatch({
          type: goal.GET_TEAM_TARGET_LIST,
          payload: response,
        });
      })
      .catch((error) => {
        SessionExpireError(error.response);
        notification.warning({
          message: `${error?.response?.data?.message}`,
        });
      });
  };

import { notification } from "antd";
import axios from "axios";
import Cookies from "universal-cookie";
import { BASE_URL_V1, BASE_URL_V2, org_id } from "../../config.js";
import SessionExpireError from "../../helpers/sessionExpireError.js";
import { lead, leadCategory } from "../constant";

export const leadCategoryAction = (name, pageCount) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/leadcategory/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const params = { page_no: pageCount, name: name };
  axios
    .get(url, { headers, params })
    .then((response) => {
      dispatch({
        type: leadCategory.LEAD_CATEGORY_LIST,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

export const searchLeadCategoryAction = (pageCount, name) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/leadcategory/?page_no=${pageCount}&name=${name}`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: leadCategory.SEARCH_LEAD_CATEGORY,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

export const addLeadCategory = (formData) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/leadcategory/`;
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
        type: leadCategory.ADD_LEAD_CATEGORY,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: leadCategory.ADD_LEAD_CATEGORY,
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

export const leadCategoryDetails = (id) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/leadcategory/${id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: leadCategory.LEAD_CATEGORY_DETAILS,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

export const updateLeadCategory = (id, formData) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/leadcategory/${id}/`;
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
        type: leadCategory.UPDATE_LEAD_CATEGORY,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: leadCategory.UPDATE_LEAD_CATEGORY,
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

export const deleteLeadCategory = (id) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/leadcategory/${id}/delete/`;
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
        type: leadCategory.DELETE_LEAD_CATEGORY,
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

export const leadAction = (filters) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/leadform/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const params = {
    page_no: filters?.page,
    name: filters?.query,
    lead_category: filters?.category,
  };
  axios
    .get(url, { headers, params })
    .then((response) => {
      dispatch({
        type: lead.LEAD_LIST,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

export const singleLeadDataAction = (id) => (dispatch) => {
  const cookies = new Cookies();
  if (!id) return;
  const url = `${BASE_URL_V2}/organization/${org_id}/leadform/${id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      cookies.set("leadData", response.data.data, { path: "/" });
      dispatch({
        type: lead.SINGLE_LEAD_DATA,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: lead.SINGLE_LEAD_DATA,
          payload: "",
        });
      }, 400);
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

export const searchLeadAction = (pageCount, name) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/leadform/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const params = { page_no: pageCount, name: name };
  axios
    .get(url, { headers, params })
    .then((response) => {
      dispatch({
        type: lead.SEARCH_LEAD,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

export const createLead = (formData) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/leadform/`;
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
        type: lead.CREATE_LEAD,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: lead.CREATE_LEAD,
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

export const updateLead = async (id, formData) => {
  const cookies = new Cookies();
  let url;
  if (id) {
    url = `${BASE_URL_V2}/organization/${org_id}/leadform/${id}/`;
  } else {
    url = `${BASE_URL_V2}/organization/${org_id}/leadform/`;
  }
  const data = formData;
  const headers = { Authorization: cookies.get("rupyzToken") };
  try {
    const response = await axios.post(url, data, { headers });

    if (response.status == 200) {
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

export const deleteLead = (id) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/leadform/${id}/delete/`;
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
        type: lead.DELETE_LEAD,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: lead.DELETE_LEAD,
          payload: "",
        });
      }, 100);
    })
    .catch((error) => {
      SessionExpireError(error.response);
      notification.warning({
        message: `${error.response.data.message}`,
      });
    });
};

export const updateLeadStatus = (id, status) => (dispatch) => {
  const cookies = new Cookies();
  if (id === undefined) return;
  const url = `${BASE_URL_V2}/organization/${org_id}/leadform/${id}/approval/`;
  const data = { status: status };
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
        type: lead.UPDATE_LEAD_STATUS,
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

export const mobileNumberCheck = (mobile) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/leadform/mobile/?mobile=${mobile}`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: lead.MOBLIE_NUMBER_CHECK,
        payload: response,
      });

      setTimeout(() => {
        dispatch({
          type: lead.MOBLIE_NUMBER_CHECK,
          payload: "",
        });
      }, 100);
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

export const leadReport = async (data) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/leadform/reports/`;
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

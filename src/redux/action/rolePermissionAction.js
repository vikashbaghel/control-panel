import axios from "axios";
import { BASE_URL_V1, org_id } from "../../config";
import { rolesPermission } from "../constant";
import { notification } from "antd";
import SessionExpireError from "../../helpers/sessionExpireError";
import Cookies from "universal-cookie";

//get staff roles list details
export const staffRolesPermissionAction = (name) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/RBAC/${org_id}/role/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const params = { name: name };
  axios
    .get(url, { headers, params })
    .then((response) => {
      dispatch({
        type: rolesPermission.SET_STAFF_ROLES_PERMISSION,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

//get staff permission list details
export const permissionAction = () => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/RBAC/permission/org-list/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: rolesPermission.SET_PERMISSION,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

//post add new staff details
export const staffRoleAddService = (formInput) => (dispatch) => {
  const cookies = new Cookies();
  const url = formInput.id
    ? `${BASE_URL_V1}/RBAC/${org_id}/role/${formInput.id}/`
    : `${BASE_URL_V1}/RBAC/${org_id}/role/`;
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
        type: rolesPermission.SET_STAFF_ROLE_ADD,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: rolesPermission.SET_STAFF_ROLE_ADD,
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

//post add new staff details
export const staffRoleEditService = (formInput) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/RBAC/${org_id}/role/${formInput.id}/`;
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
        type: rolesPermission.SET_STAFF_ROLE_EDIT,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: rolesPermission.SET_STAFF_ROLE_EDIT,
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

//delete staff role
export const staffRoleDeleteService = (id) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/RBAC/${org_id}/role/${id}/delete/`;
  const data = id;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .post(url, data, { headers })
    .then((response) => {
      if (response.data.error === 200) {
        notification.success({
          message: `${response.data.message}`,
        });
      }
      dispatch({
        type: rolesPermission.SET_STAFF_ROLE_DELETE,
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

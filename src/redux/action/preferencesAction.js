import { notification } from "antd";
import axios from "axios";
import Cookies from "universal-cookie";
import { BASE_URL_V2, org_id } from "../../config.js";
import SessionExpireError from "../../helpers/sessionExpireError.js";
import { preferences } from "../constant";
import { preference } from "../../services/preference-service.js";

//get preferences
export const preferencesAction = () => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/preferences/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      preference.set(response.data.data);
      cookies.set(
        "rupyzCustomerLevelConfig",
        response.data.data.customer_level_config,
        { path: "/" }
      );
      cookies.set(
        "rupyzStaffEnable",
        response.data.data.staff_customer_mapping,
        { path: "/" }
      );
      cookies.set(
        "rupyzRolePermissionEnable",
        response.data.data.enable_roles_permission,
        { path: "/" }
      );
      cookies.set("rupyzLocationEnable", response.data.data.location_tracking, {
        path: "/",
      });
      cookies.set(
        "rupyzHierarchyEnable",
        response.data.data.enable_hierarchy_management,
        {
          path: "/",
        }
      );
      cookies.set(
        "rupyzAnalyticsEnable",
        response.data.data.enable_analytics_calculation,
        {
          path: "/",
        }
      );
      cookies.set(
        "rupyzGalleryEnable",
        !response.data.data.disable_gallery_photo,
        {
          path: "/",
        }
      );
      cookies.set(
        "rupyzCustomrCategoryMappingEnabled",
        response.data.data.enable_customer_category_mapping,
        {
          path: "/",
        }
      );
      cookies.set(
        "rupyzCustomerLevelOrderEnable",
        response.data.data.enable_customer_level_order,

        {
          path: "/",
        }
      );
      cookies.set(
        "rupyzEnableGeoFencing",
        response.data.data.activity_geo_fencing,

        {
          path: "/",
        }
      );
      cookies.set(
        "rupyzEnableLiveLocationTrace",
        response.data.data.live_location_tracking,

        {
          path: "/",
        }
      );
      dispatch({
        type: preferences.GET_PREFERENCES,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

//post update preferences
export const addPreferencesAction = (details) => (dispatch) => {
  const cookies = new Cookies();
  let data = details;
  const url = `${BASE_URL_V2}/organization/${org_id}/preferences/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .post(url, data, { headers })
    .then((response) => {
      cookies.set(
        "rupyzStaffEnable",
        response.data.data.staff_customer_mapping,
        {
          path: "/",
        }
      );
      cookies.set(
        "rupyzRolePermissionEnable",
        response.data.data.enable_roles_permission,
        { path: "/" }
      );
      cookies.set("rupyzLocationEnable", response.data.data.location_tracking, {
        path: "/",
      });
      if (response.status == 200) {
        notification.success({
          message: `${response.data.message}`,
        });
      }
      dispatch({
        type: preferences.ADD_PREFERENCES,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: preferences.ADD_PREFERENCES,
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

//get staff preferences
export const staffPreferencesAction = () => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/user/preferences/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .get(url, { headers })
    .then((response) => {
      cookies.set(
        "rupyzStaffPushNotification",
        response.data.data.push_notifications,
        { path: "/" }
      );
      cookies.set(
        "rupyzStaffWhatsAppNotification",
        response.data.data.whatsapp_opt_in,
        { path: "/" }
      );
      cookies.set(
        "rupyzStaffWhatsAppEmiNotification",
        response.data.data.whatsapp_emi,
        {
          path: "/",
        }
      );
      dispatch({
        type: preferences.GET_STAFF_PREFERENCES,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: preferences.GET_STAFF_PREFERENCES,
          payload: "",
        });
      }, 100);
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

//post staff update preferences
export const staffAddPreferencesAction = (details) => (dispatch) => {
  const cookies = new Cookies();
  let data = details;
  const url = `${BASE_URL_V2}/organization/${org_id}/user/preferences/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  axios
    .post(url, data, { headers })
    .then((response) => {
      cookies.set(
        "rupyzStaffPushNotification",
        response.data.data.push_notifications,
        { path: "/" }
      );
      cookies.set(
        "rupyzStaffWhatsAppNotification",
        response.data.data.whatsapp_opt_in,
        { path: "/" }
      );
      cookies.set(
        "rupyzStaffWhatsAppEmiNotification",
        response.data.data.whatsapp_emi,
        {
          path: "/",
        }
      );
      if (response.status == 200) {
        notification.success({
          message: `${response.data.message}`,
        });
      }
      dispatch({
        type: preferences.ADD_STAFF_PREFERENCES,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: preferences.ADD_STAFF_PREFERENCES,
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

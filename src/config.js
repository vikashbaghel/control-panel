import { notification } from "antd";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const BASE_URL_V1 = process.env.REACT_APP_BASE_URL_V1;
export const BASE_URL_V2 = process.env.REACT_APP_BASE_URL_V2;
export const BASE_URL_V3 = process.env.REACT_APP_BASE_URL_V3;

export const auth_token = cookies.get("rupyzToken");
export const org_id = cookies.get("rupyzOrgId");
export const customer_id = cookies.get("rupyzDistributorId");
export const userName = cookies.get("rupyzUserName");
export const accessType = cookies.get("rupyzAccessType");
export const profileImage = cookies.get("rupyzProfileImage");

export const GOOGLE_MAPS_KEY = process.env.REACT_APP_GOOGLE_MAPS_KEY;
export const FCM_VAPID_KEY = process.env.REACT_APP_FCM_VAPID;
export const SENTRY_DSN_KEY = process.env.REACT_APP_SENTRY_DSN;

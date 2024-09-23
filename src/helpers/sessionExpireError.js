import { notification } from "antd";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const SessionExpireError = async (response) => {
  // unautherized error handling
  if (response && response.status === 403) {
    notification.warning({
      message: `Session Expired`,
      duration: 1,
    });
    cookies.set("rupyzToken", "", { path: "/" });
    setTimeout(() => window.location.reload(), 1000);
    return;
  }
  // maintenance error handling
  if (response && response.status === 503) {
    cookies.set("error", true, { path: "/" });
    return true;
  }
  return false;
};

export default SessionExpireError;

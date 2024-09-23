import Cookies from "universal-cookie";
import { BASE_URL_V2, org_id } from "../../config";
import SessionExpireError from "../../helpers/sessionExpireError";
import { notification } from "antd";
import axios from "axios";

export const getLiveLocation = async (user_id, create_date) => {
  const cookies = new Cookies();
  if (!user_id) return;
  const url = `${BASE_URL_V2}/organization/${org_id}/live-location/${user_id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const params = { create_date };

  try {
    const response = await axios.get(url, { headers, params });
    return response.data;
  } catch (error) {
    SessionExpireError(error.response);
    notification.warning({
      message: `${error.response.data.message}`,
    });
  }
};

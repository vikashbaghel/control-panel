import Cookies from "universal-cookie";
import { BASE_URL_V2, org_id } from "../../config";
import axios from "axios";
import SessionExpireError from "../../helpers/sessionExpireError";
import { notification } from "antd";

const cookies = new Cookies();

const checkIn = async (formData) => {
  const url = `${BASE_URL_V2}/organization/${org_id}/activity/checkin/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const body = formData;

  return await axios
    .post(url, body, { headers })
    .then((response) => {
      notification.success({ message: response.data.message });
      return response.data;
    })
    .catch((err) => {
      SessionExpireError(err.response);
      notification.warning({
        message: `${err.response.data.message}`,
      });
      return err.response.data;
    });
};

const checkOut = async (formData) => {
  const url = `${BASE_URL_V2}/organization/${org_id}/activity/checkout/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const body = formData;

  return await axios
    .post(url, body, { headers })
    .then((response) => {
      notification.success({ message: response.data.message });
      return response.data;
    })
    .catch((err) => {
      SessionExpireError(err.response);
      notification.warning({
        message: `${err.response.data.message}`,
      });
      return err.response.data;
    });
};

export const customerCheckInCheckOut = { checkIn, checkOut };

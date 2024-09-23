import { notification } from "antd";
import axios from "axios";
import Cookies from "universal-cookie";
import { BASE_URL_V1, BASE_URL_V2, org_id } from "../../config.js";
import SessionExpireError from "../../helpers/sessionExpireError.js";
import { preference } from "../../services/preference-service.js";

const handleError = (error) => {
  //   SessionExpireError(error);
  const { message } = error["data"] || {};
  if (message) {
    notification.error({ message });
  } else
    notification.error({
      message: "Unexpected error",
    });
};

export const fetchWhatsappSettings = async () => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/settings/whatsapp/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  return axios
    .get(url, { headers })
    .then((response) => {
      preference.set({
        whatsapp_white_label: {
          is_account_created: response.data.data.is_account_created,
          is_active: response.data.data.is_active,
          is_campaigns_created: response.data.data.is_campaigns_created,
          is_meta_verified: response.data.data.is_meta_verified,
          is_template_created: response.data.data.is_template_created,
        },
      });
      return response["data"];
    })
    .catch((error) => {
      handleError(error.response);
    });
};

export const updateWhatsappSettings = async (data) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/settings/whatsapp/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  return axios
    .post(url, data, { headers })
    .then((response) => {
      return response["data"];
    })
    .catch((error) => {
      handleError(error.response);
    });
};

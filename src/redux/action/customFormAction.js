import { notification } from "antd";
import axios from "axios";
import Cookies from "universal-cookie";
import { BASE_URL_V1, BASE_URL_V2, org_id } from "../../config.js";
import SessionExpireError from "../../helpers/sessionExpireError.js";

const handleError = (error) => {
  SessionExpireError(error);
  const { message } = (error || {})["data"] || {};
  if (message) {
    notification.error({ message });
  }
};

const createCustomForm = async (identifier, form_name, schema_json) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/custom-forms/${identifier}/${form_name}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  return axios
    .post(url, { schema_json }, { headers })
    .then((response) => {
      return response["data"];
    })
    .catch((error) => {
      handleError(error.response);
    });
};
const fetchCustomForm = async (identifier, form_name) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/custom-forms/${identifier}/${form_name}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  return axios
    .get(url, { headers })
    .then((response) => {
      return response["data"];
    })
    .catch((error) => {
      if ((error.response || {})["status"] === 400) {
        return { data: error.response["data"] || {} };
      } else handleError(error.response);
    });
};

export default {
  fetch: fetchCustomForm,
  create: createCustomForm,
};

export async function postHtmlTemplate(data = {}) {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/analytics/pdftemplate/${data.type}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const postData = {
    html_template: data.html_template,
  };
  return axios
    .post(url, postData, { headers })
    .then((response) => {
      return response["data"];
    })
    .catch((error) => {
      if ((error.response || {})["status"] === 400) {
        return { data: error.response["data"] || {} };
      } else handleError(error.response);
    });
}

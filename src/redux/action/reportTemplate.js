import { BASE_URL_V2, org_id } from "../../config";
import Cookies from "universal-cookie";
import { reportTemplate } from "../constant";
import axios from "axios";
import SessionExpireError from "../../helpers/sessionExpireError";
import { notification } from "antd";

const cookies = new Cookies();
const headers = { Authorization: cookies.get("rupyzToken") };

// //get Report Template list
// export const getReportTemplateList = (page_no, name) => (dispatch) => {
//   const url = `${BASE_URL_V2}/organization/${org_id}/report/template/`;
//   const params = { page_no: page_no, name: name };
//   axios
//     .get(url, { headers })
//     .then((response) => {
//       dispatch({
//         type: reportTemplate.GET_REPORT_TEMPLATE_LIST,
//         payload: response,
//       });
//     })
//     .catch((error) => {
//       SessionExpireError(error.response);
//     });
// };

// get Report Template by id
export const getReportTemplate = (id) => (dispatch) => {
  const url = `${BASE_URL_V2}/organization/${org_id}/report/template/${id}/`;

  axios
    .get(url, { headers })
    .then((response) => {
      dispatch({
        type: reportTemplate.GET_REPORT_TEMPLATE,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: reportTemplate.GET_REPORT_TEMPLATE,
          payload: "",
        });
      }, 100);
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

// create and update a report template
export const createTemplate = (fromData, id) => (dispatch) => {
  let url;
  if (id) {
    url = `${BASE_URL_V2}/organization/${org_id}/report/template/${id}/`;
  } else {
    url = `${BASE_URL_V2}/organization/${org_id}/report/template/`;
  }
  const data = fromData;

  axios
    .post(url, data, { headers })
    .then((response) => {
      if (response.status === 200) {
        notification.success({
          message: `${response.data.message}`,
        });
      }
      dispatch({
        type: reportTemplate.CREATE_TEMPLATE,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: reportTemplate.CREATE_TEMPLATE,
          payload: "",
        });
      }, 100);
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

// delete a report template
export const deleteTemplate = (id) => (dispatch) => {
  let url = `${BASE_URL_V2}/organization/${org_id}/report/template/${id}/delete/`;
  let data = {};
  axios
    .post(url, data, { headers })
    .then((response) => {
      dispatch({
        type: reportTemplate.DELETE_REPORT_TEMPLATE,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

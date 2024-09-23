import axios from "axios";
import { BASE_URL_V2, BASE_URL_V3, org_id } from "../../config.js";
import { ApprovalReimbursement } from "../constant";
import { notification } from "antd";
import SessionExpireError from "../../helpers/sessionExpireError.js";
import Cookies from "universal-cookie";

//get approval reimbursement
export const approvalReimbursementService = (status, id) => (dispatch) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/reimbursement-tracker/status/?status=${
    status ? status : "All"
  }`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const params = { page_no: id };
  axios
    .get(url, { headers, params })
    .then((response) => {
      dispatch({
        type: ApprovalReimbursement.GET_APPROVAL_REIMBURSEMENT_TRACKER,
        payload: response,
      });
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

//Post approval reimbursement
export const ApprovedreimbursementService = (status, id) => (dispatch) => {
  if(status === undefined || id === undefined) return 
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/reimbursement-tracker/${id}/status/`;
  const data = status;
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
        type: ApprovalReimbursement.APPROVED_REIMBURSEMENT_TRACKER,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: ApprovalReimbursement.APPROVED_REIMBURSEMENT_TRACKER,
          payload: "",
        });
      }, 2000);
    })
    .catch((err) => {
      SessionExpireError(err.response);
      notification.warning({
        message: `${err.response.data.message}`,
      });
    });
};

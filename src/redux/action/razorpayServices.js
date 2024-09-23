import axios from "axios";
import { notification } from "antd";
import Cookies from "universal-cookie";
import { BASE_URL_V2, org_id } from "../../config";
import SessionExpireError from "../../helpers/sessionExpireError";

export const getPaymentGatewayList = async () => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/payment-gateway/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  try {
    const response = await axios.get(url, { headers });
    return response;
  } catch (error) {
    SessionExpireError(error.response);
  }
};

export const addPaymentGateway = async (data) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/payment-gateway/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  try {
    const response = await axios.post(url, data, { headers });
    return response;
  } catch (error) {
    notification.warning({ message: error?.response?.data?.message });
    SessionExpireError(error.response);
  }
};

export const editGatewayCharges = async (data) => {
  if (!data?.charges?.id) return;

  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/payment-gateway/${data.charges.id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  try {
    const response = await axios.post(url, data, { headers });
    return response;
  } catch (error) {
    SessionExpireError(error.response);
  }
};

export const getTransactionsList = async (params = {}) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/payment-transaction/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  try {
    const response = await axios.get(url, { headers, params });
    return response;
  } catch (error) {
    SessionExpireError(error.response);
  }
};

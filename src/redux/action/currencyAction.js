import axios from "axios";
import Cookies from "universal-cookie";
import { BASE_URL_V1, BASE_URL_V2, org_id } from "../../config";
import SessionExpireError from "../../helpers/sessionExpireError";

const cookies = new Cookies();

const fetchCountryCurrencyData = async () => {
  const url = `${BASE_URL_V1}/masterapp/currencies/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  return await axios
    .get(url, { headers })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

const fetchList = async (name) => {
  const url = `${BASE_URL_V2}/organization/${org_id}/currency/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const params = { name };

  return await axios
    .get(url, { headers, params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

const fetchCurrencyId = async (currency_id) => {
  const url = `${BASE_URL_V2}/organization/${org_id}/currency/${currency_id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };

  return await axios
    .get(url, { headers })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

const createCurrency = async (form_input) => {
  const url = `${BASE_URL_V2}/organization/${org_id}/currency/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const data = form_input;

  return await axios
    .post(url, data, { headers })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

const updateCurrency = async (currency_id, form_input) => {
  const url = `${BASE_URL_V2}/organization/${org_id}/currency/${currency_id}/update/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const data = form_input;

  return await axios
    .post(url, data, { headers })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

const deleteCurrency = async (currency_id) => {
  const url = `${BASE_URL_V2}/organization/${org_id}/currency/${currency_id}/delete/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  const data = {};

  return await axios
    .post(url, data, { headers })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

export const Currency = {
  fetchCountryCurrencyData,
  fetchList,
  fetchCurrencyId,
  createCurrency,
  updateCurrency,
  deleteCurrency,
};

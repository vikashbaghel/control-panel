import { PINCODE_API } from "../constant";
import SessionExpireError from "../../helpers/sessionExpireError";
import axios from "axios";
import { notification } from "antd";
import { formatState } from "../../helpers/globalFunction";

export const pincodeAutoFill = (pinCode) => (dispatch) => {
  const url = `https://api.postalpincode.in/pincode/${pinCode}`;
  axios
    .get(url)
    .then((response) => {
      if (response.data && response.data[0].Status === "Error") {
        notification.warning({ message: response.data[0].Message });
        return;
      }
      dispatch({
        type: PINCODE_API,
        payload: response,
      });
      setTimeout(() => {
        dispatch({
          type: PINCODE_API,
          payload: "",
        });
      }, 100);
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

export const getDetailsFromPincode = async (pinCode) => {
  const url = `https://api.postalpincode.in/pincode/${pinCode}`;

  try {
    const response = await axios.get(url);

    if (response.data.length > 0 && response.data[0].Status === "Error") {
      notification.warning({ message: response.data[0].Message });
      return;
    }
    if (response.data.length > 0 && response.data[0].Status === "Success") {
      return {
        city: response.data[0].PostOffice[0].District,
        state: formatState(response.data[0].PostOffice[0].State),
      };
    }
  } catch (error) {
    SessionExpireError(error.response);
  }
};

import { BASE_URL_V2, org_id } from "../config";
import axios from "axios";
import Cookies from "universal-cookie";
import SessionExpireError from "../helpers/sessionExpireError";

export const updateCheckInCustomer = async () => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/activity/checkin/status/`;
  const headers = { Authorization: cookies.get("rupyzToken") };

  await axios
    .get(url, { headers })
    .then((response) => {
      const res = response.data.data;

      localStorage.setItem(
        "CheckInCustomer",
        JSON.stringify(
          res.customer_id
            ? {
                id: res.customer_id,
                name: res.customer_name,
                check_in_time: res.is_checked_in,
              }
            : {}
        )
      );
    })
    .catch((error) => {
      SessionExpireError(error.response);
    });
};

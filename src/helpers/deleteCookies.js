import axios from "axios";
import Cookies from "universal-cookie";
import { BASE_URL_V1 } from "../config";

async function logOutFun() {
  const cookies = new Cookies();

  const url = `${BASE_URL_V1}/user/logout/`;
  const headers = { Authorization: cookies.get("rupyzToken") };

  await axios
    .post(url, {}, { headers })
    .then((response) => {
      cookies.set("rupyzToken", "", { path: "/" });
      setTimeout(() => {
        window.location.reload();
      }, 500);
    })
    .catch((error) => {
      cookies.remove("rupyzToken");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    });
}

export default logOutFun;

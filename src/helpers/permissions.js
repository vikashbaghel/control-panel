import Cookies from "universal-cookie";

const cookies = new Cookies();
const Permissions = (permission) => {
  let permissions = cookies.get("rupyzPermissionType");

  let accessType = cookies.get("rupyzAccessType") === "WEB_SARE360";
  if (accessType) {
    return true;
  }
  if (
    permissions &&
    permissions.filter((ele) => ele === permission).length > 0
  ) {
    return true;
  }
  return false;
};

export default Permissions;

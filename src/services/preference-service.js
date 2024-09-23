import Cookies from "universal-cookie";

const constants = {
  key: "preferences-v1",
};

const cookies = new Cookies();

const getPreferences = (key) => {
  const tempList = cookies.get(constants.key) || {};
  return key ? tempList?.[key] : tempList;
};

const setPreferences = (data) => {
  cookies.set(constants.key, { ...getPreferences(), ...data }, { path: "/" });
};

export const preference = {
  get: getPreferences,
  set: setPreferences,
};

import { notification } from "antd";
import axios from "axios";
import Cookies from "universal-cookie";
import { BASE_URL_V1, BASE_URL_V2, org_id } from "../../config.js";
import SessionExpireError from "../../helpers/sessionExpireError.js";

const handleError = (error) => {
  SessionExpireError(error);
  const { message } = error["data"] || {};
  if (message) {
    notification.error({ message });
  } else
    notification.error({
      message: "Unexpected error",
    });
};

//  Testimonials
const createTestimonial = async (data) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/organization/${org_id}/testimonial/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  return axios
    .post(url, data, { headers })
    .then((response) => {
      return response["data"];
    })
    .catch((error) => {
      handleError(error.response);
    });
};
const updateTestimonial = async (data) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/organization/${org_id}/testimonial/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  return axios
    .post(url, data, { headers })
    .then((response) => {
      return response["data"];
    })
    .catch((error) => {
      handleError(error.response);
    });
};
const deleteTestimonial = async (id) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/organization/${org_id}/testimonial/delete/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  return axios
    .post(url, { id }, { headers })
    .then((response) => {
      return response["data"];
    })
    .catch((error) => {
      handleError(error.response);
    });
};
const fetchTestimonials = async (page_no) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/organization/${org_id}/testimonial/?page_no=${page_no}`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  return axios
    .get(url, { headers })
    .then((response) => {
      return response["data"];
    })
    .catch((error) => {
      handleError(error.response);
    });
};
export const testimonialService = {
  list: fetchTestimonials,
  create: createTestimonial,
  update: updateTestimonial,
  delete: deleteTestimonial,
};

//  Sliders
const createSlider = async (data) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/organization/${org_id}/sliders/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  return axios
    .post(url, data, { headers })
    .then((response) => {
      return response["data"];
    })
    .catch((error) => {
      handleError(error.response);
    });
};
const updateSlider = async (id, data) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/organization/${org_id}/sliders/${id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  return axios
    .post(url, data, { headers })
    .then((response) => {
      return response["data"];
    })
    .catch((error) => {
      handleError(error.response);
    });
};
const deleteSlider = async (id) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/organization/${org_id}/sliders/${id}/delete/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  return axios
    .post(url, { id }, { headers })
    .then((response) => {
      return response["data"];
    })
    .catch((error) => {
      handleError(error.response);
    });
};
const fetchSliders = async () => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/organization/${org_id}/sliders/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  return axios
    .get(url, { headers })
    .then((response) => {
      return response["data"];
    })
    .catch((error) => {
      handleError(error.response);
    });
};
export const sliderService = {
  list: fetchSliders,
  create: createSlider,
  update: updateSlider,
  delete: deleteSlider,
};

//  Teams
const createTeam = async (data) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/organization/${org_id}/team/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  return axios
    .post(url, data, { headers })
    .then((response) => {
      return response["data"];
    })
    .catch((error) => {
      handleError(error.response);
    });
};
const updateTeam = async (data) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/organization/${org_id}/team/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  return axios
    .post(url, data, { headers })
    .then((response) => {
      return response["data"];
    })
    .catch((error) => {
      handleError(error.response);
    });
};
const deleteTeam = async (id) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/organization/${org_id}/team/delete/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  return axios
    .post(url, { id }, { headers })
    .then((response) => {
      return response["data"];
    })
    .catch((error) => {
      handleError(error.response);
    });
};
const fetchTeams = async (page_no) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/organization/${org_id}/team/?page_no=${page_no}`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  return axios
    .get(url, { headers })
    .then((response) => {
      return response["data"];
    })
    .catch((error) => {
      handleError(error.response);
    });
};
export const teamService = {
  list: fetchTeams,
  create: createTeam,
  update: updateTeam,
  delete: deleteTeam,
};

//  Achievement
const createAchievement = async (data) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/organization/${org_id}/achievement/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  return axios
    .post(url, data, { headers })
    .then((response) => {
      return response["data"];
    })
    .catch((error) => {
      handleError(error.response);
    });
};
const updateAchievement = async (data) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/organization/${org_id}/achievement/${data["id"]}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  return axios
    .post(url, data, { headers })
    .then((response) => {
      return response["data"];
    })
    .catch((error) => {
      handleError(error.response);
    });
};
const deleteAchievement = async (id) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/organization/${org_id}/achievement/delete/${id}/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  return axios
    .post(url, { id }, { headers })
    .then((response) => {
      return response["data"];
    })
    .catch((error) => {
      handleError(error.response);
    });
};
const fetchAchievements = async (page_no) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/organization/${org_id}/achievement/?page_no=${page_no}`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  return axios
    .get(url, { headers })
    .then((response) => {
      return response["data"];
    })
    .catch((error) => {
      handleError(error.response);
    });
};
export const achievementService = {
  list: fetchAchievements,
  create: createAchievement,
  update: updateAchievement,
  delete: deleteAchievement,
};

//  SEO
const updateSEO = async (data) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/organization/${org_id}/seocontent/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  return axios
    .post(url, data, { headers })
    .then((response) => {
      return response["data"];
    })
    .catch((error) => {
      handleError(error.response);
    });
};
const fetchSEO = async () => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/organization/${org_id}/seocontent/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  return axios
    .get(url, { headers })
    .then((response) => {
      return response["data"];
    })
    .catch((error) => {
      handleError(error.response);
    });
};
export const seocontentService = {
  fetch: fetchSEO,
  update: updateSEO,
};

//  Configuration
const updateConfiguration = async (data) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/organization/${org_id}/configuration/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  return axios
    .post(url, data, { headers })
    .then((response) => {
      return response["data"];
    })
    .catch((error) => {
      handleError(error.response);
    });
};
const fetchConfiguration = async () => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/organization/${org_id}/configuration/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  return axios
    .get(url, { headers })
    .then((response) => {
      return response["data"];
    })
    .catch((error) => {
      handleError(error.response);
    });
};
export const configurationService = {
  fetch: fetchConfiguration,
  update: updateConfiguration,
};

//  Organization Profile
const updateProfile = async (data) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/organization/${org_id}/info/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  return axios
    .post(url, data, { headers })
    .then((response) => {
      return response["data"];
    })
    .catch((error) => {
      handleError(error.response);
    });
};
const fetchProfile = async () => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V1}/organization/${org_id}/info/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  return axios
    .get(url, { headers })
    .then((response) => {
      return response["data"];
    })
    .catch((error) => {
      handleError(error.response);
    });
};
export const orgProfileService = {
  fetch: fetchProfile,
  update: updateProfile,
};

//  Domain
const checkDomain = async (str) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/domain/check/?domain=${str}`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  return axios
    .get(url, { headers })
    .then((response) => {
      return response["data"];
    })
    .catch((error) => {
      handleError(error.response);
    });
};
const updateDomain = async (data) => {
  const cookies = new Cookies();
  const url = `${BASE_URL_V2}/organization/${org_id}/domain/update/`;
  const headers = { Authorization: cookies.get("rupyzToken") };
  return axios
    .post(url, data, { headers })
    .then((response) => {
      return response["data"];
    })
    .catch((error) => {
      handleError(error.response);
    });
};
export const domainService = {
  test: checkDomain,
  update: updateDomain,
};

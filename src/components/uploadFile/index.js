import axios from "axios";
import { auth_token, BASE_URL_V1 } from "../../config";
import Cookies from "universal-cookie";

async function uploadFile(item, params = {}) {
  const cookies = new Cookies();
  const headers = { Authorization: auth_token };

  let type = item.type.split("/")[0];
  let name = item.name;
  let content_type = item.type.split("/")[1];
  let formData = new FormData();
  formData.append("type", type);
  formData.append("file_name", name);
  formData.append("content_type", content_type);

  const response = await axios
    .post(`${BASE_URL_V1}/s3/upload/`, formData, { headers })
    .then((response) => response)
    .catch((error) => console.warn(error));

  cookies.set("rupyzUploadFileUrl", response.headers.upload_url, {
    path: "/",
  });

  let formData1 = new FormData();
  formData1.append("key", response.headers.key);
  formData1.append("x-amz-algorithm", response.headers.x_amz_algorithm);
  formData1.append("x-amz-signature", response.headers.x_amz_signature);
  formData1.append("x-amz-date", response.headers.x_amz_date);
  formData1.append("Policy", response.headers.policy);
  formData1.append(
    "success_action_status",
    response.data.data[0].success_action_status
  );
  formData1.append("x-amz-credential", response.headers.x_amz_credential);
  formData1.append("Content-Type", response.data.data[0].content_type);
  formData1.append(
    "Content-Disposition",
    response.data.data[0].content_disposition
  );
  formData1.append("acl", response.data.data[0].acl);
  formData1.append("file", item.originFileObj, item.name);

  const response1 = await axios
    .post(cookies.get("rupyzUploadFileUrl"), formData1)
    .then((response1) => response1)
    .catch((error1) => console.warn(error1));

  if (response1.data.error === true) {
  }

  const { id, url } = await axios
    .post(
      `${BASE_URL_V1}/s3/confirm/`,
      {
        file_id: response.data.data[0].id,
        ...params,
      },
      { headers }
    )
    .then((response2) => {
      return response2.data.data;
    })
    .catch((error2) => console.warn(error2));

  return {
    fileId: id,
    fileUrl: url,
  };
}

export default uploadFile;

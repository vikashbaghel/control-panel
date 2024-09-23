import axios from "axios";
import { BASE_URL_V1, auth_token } from "../config";
import Resizer from "react-image-file-resizer";

export const singleUploadImage = async (item) => {
  let type;
  if (
    item.type?.split("/")[1] === "jpg" ||
    item.type?.split("/")[1] === "png" ||
    item.type?.split("/")[1] === "jpeg"
  ) {
    type = "image";
  }
  if (
    item.type?.split("/")[1] === "pdf" ||
    item.type?.split("/")[1] === "csv"
  ) {
    type = "document";
  }
  if (item.type?.split("/")[1] === "zip") {
    type = "archive";
  }
  let name = item.name;
  let content_type = item.type?.split("/")[1];
  let formData = new FormData();
  formData.append("type", type);
  formData.append("file_name", name);
  formData.append("content_type", content_type);

  const url = `${BASE_URL_V1}/s3/upload/`;
  const headers = { Authorization: auth_token };
  const data = formData;

  try {
    const res1 = await axios.post(url, data, { headers });
    if (!res1.data.error) {
      try {
        let formData1 = new FormData();
        formData1.append("key", res1.headers.key);
        formData1.append("x-amz-algorithm", res1.headers.x_amz_algorithm);
        formData1.append("x-amz-signature", res1.headers.x_amz_signature);
        formData1.append("x-amz-date", res1.headers.x_amz_date);
        formData1.append("Policy", res1.headers.policy);
        formData1.append(
          "success_action_status",
          res1.data.data[0].success_action_status
        );
        formData1.append("x-amz-credential", res1.headers.x_amz_credential);
        formData1.append("Content-Type", res1.data.data[0].content_type);
        formData1.append(
          "Content-Disposition",
          res1.data.data[0].content_disposition
        );
        formData1.append("acl", res1.data.data[0].acl);
        formData1.append("file", item.originFileObj, item.name);

        const url = res1.headers.upload_url;
        const data = formData1;
        const res2 = await axios.post(url, data);
        if (!res2.data.error) {
          const url = `${BASE_URL_V1}/s3/confirm/`;
          const data = { file_id: res1.data.data[0].id };
          const headers = { Authorization: auth_token };
          try {
            const res3 = await axios.post(url, data, { headers });
            if (res3.status === 200) {
              return res3.data.data.id;
            }
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const resizeImage = (params = {}) =>
  new Promise((resolve) => {
    const {
      file, // Is the file of the image which will resized.
      maxWidth, // Is the maxWidth of the resized new image.
      maxHeight, // Is the maxHeight of the resized new image.
      // not required fields :-
      compressFormat, // Is the compressFormat of the resized new image.
      quality, // Is the quality of the resized new image.
      rotation, // Is the degree of clockwise rotation to apply to uploaded image.
      outputType, // Is the output type of the resized new image.
      minWidth, // Is the minWidth of the resized new image.
      minHeight, // Is the minHeight of the resized new image.
    } = params;
    Resizer.imageFileResizer(
      file,
      maxWidth,
      maxHeight,
      compressFormat || "PNG",
      quality || 100,
      rotation || 0,
      (file) => {
        resolve(file);
      },
      outputType || "file",
      minWidth || maxWidth,
      minHeight || maxHeight
    );
  });

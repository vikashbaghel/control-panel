import axios from "axios";
import { Col, Modal, Space, Spin, Upload } from "antd";
import { useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { BASE_URL_V1, auth_token } from "../../config";
import { ActiveRightIcon, RightIcon, UploadFile } from "../../assets/globle";
import "./styles.css";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import pdfIcon from "../../assets/defaultPdf.svg";
import zipIcon from "../../assets/defaultZIP.png";
import csvIcon from "../../assets/defaultCSV.webp";

const imageTypes = {
  jpg: "image",
  jpeg: "image",
  png: "image",
};
const acceptedTypes = {
  ...imageTypes,
  pdf: "document",
  csv: "document",
  "x-zip-compressed": "archive",
};
const fileSizeLimit = 5; //allowed upto 5mb only

export const UploadPreview = ({ file, onPreview, onRemove, disabledEdit }) => {
  const containerRef = useRef();

  function downloadFileWithCustomName(url, customFileName) {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement("a");
        const objectUrl = URL.createObjectURL(blob);

        link.href = objectUrl;
        link.download = customFileName;
        document.body.appendChild(link);
        link.click();

        // Clean up
        URL.revokeObjectURL(objectUrl);
        document.body.removeChild(link);
      })
      .catch((error) => console.error("Error downloading file:", error));
  }

  const documentPreview = (file, value = "") => {
    if (file.originFileObj) {
      let option = URL.createObjectURL(file.originFileObj);
      value
        ? window.open(option, "_blank")
        : downloadFileWithCustomName(option, file.name);
    } else {
      value
        ? window.open(file.url, "_blank")
        : downloadFileWithCustomName(file.url, file.name);
    }
  };

  let previewImage = { image: "", action: null };

  switch (file?.type?.split("/")[1]) {
    case "pdf":
      previewImage = {
        image: pdfIcon,
        action: () => documentPreview(file, "pdf"),
      };
      break;
    case "x-zip-compressed":
      previewImage = { image: zipIcon, action: () => documentPreview(file) };
      break;
    case "csv":
      previewImage = { image: csvIcon, action: () => documentPreview(file) };
      break;
    default:
      previewImage = {
        image: file.thumbUrl || file.url,
        action: () => onPreview(file),
      };
      break;
  }

  return (
    <div className="upload-preview">
      <Col ref={containerRef} className="ant-upload-list-item">
        <Col flex={1}>
          <img
            src={previewImage?.image}
            alt="thumnail"
            width={80}
            height={80}
          />
        </Col>
      </Col>
      <div className="upload-preview-icons">
        <Space size={"large"}>
          <EyeOutlined
            style={{ fontSize: 16, color: "#322e80", cursor: "pointer" }}
            onClick={() => previewImage.action()}
          />
          {!disabledEdit && (
            <DeleteOutlined
              style={{ fontSize: 16, color: "#e10000", cursor: "pointer" }}
              onClick={() => onRemove(file)}
            />
          )}
        </Space>
      </div>
    </div>
  );
};

export const uploadImage = async (uploadImageList, keys = []) => {
  let array1 = [];
  await Promise.all(
    uploadImageList.map(async (item, index) => {
      try {
        let type = acceptedTypes[item.type?.split("/")[1]];
        let name = item.name;
        let content_type = item.type?.split("/")[1];
        let formData = new FormData();
        formData.append("type", type);
        formData.append("file_name", name);
        formData.append("content_type", content_type);

        const url = `${BASE_URL_V1}/s3/upload/`;
        const headers = { Authorization: auth_token };
        const data = formData;

        await axios
          .post(url, data, { headers })
          .then(async (response) => {
            let formData1 = new FormData();
            formData1.append("key", response.headers.key);
            formData1.append(
              "x-amz-algorithm",
              response.headers.x_amz_algorithm
            );
            formData1.append(
              "x-amz-signature",
              response.headers.x_amz_signature
            );
            formData1.append("x-amz-date", response.headers.x_amz_date);
            formData1.append("Policy", response.headers.policy);
            formData1.append(
              "success_action_status",
              response.data.data[0].success_action_status
            );
            formData1.append(
              "x-amz-credential",
              response.headers.x_amz_credential
            );
            formData1.append(
              "Content-Type",
              response.data.data[0].content_type
            );
            formData1.append(
              "Content-Disposition",
              response.data.data[0].content_disposition
            );
            formData1.append("acl", response.data.data[0].acl);
            formData1.append("file", item?.originFileObj || item, item.name);
            const url = response.headers.upload_url;
            const data = formData1;
            await axios
              .post(url, data)
              .then(async (response1) => {
                if (response1.data.error === true) {
                }
                const url = `${BASE_URL_V1}/s3/confirm/`;
                const data = { file_id: response.data.data[0].id };
                const headers = { Authorization: auth_token };
                await axios
                  .post(url, data, { headers })
                  .then(async (response2) => {
                    if (keys.length) {
                      let obj = {};
                      keys.map((k) => {
                        obj[k] = response2.data.data[k];
                      });
                      array1.push(obj);
                    } else {
                      array1.push(response2.data.data["id"]);
                    }
                  })
                  .catch((error2) => console.warn(error2));
              })
              .catch((error1) => console.warn(error1));
          })
          .catch((error) => console.warn(error));
      } catch (error) {
        console.log(error);
      }
    })
  );

  return array1;
};

const handleImageChange = async (params, accept, setLoading) => {
  if ((params["file"] || {}).status) {
    return params["fileList"];
  } else {
    const fileList = params["fileList"];

    let filteredFileList = [];

    const promise = fileList?.map(async (file) => {
      const isFileSizeValid =
        file?.originFileObj?.size / 1024 / 1024 <= fileSizeLimit;

      accept = accept.replace(".zip", ".x-zip-compressed");

      if (file?.id) {
        filteredFileList.push(file);
      } else if (accept.split(",").includes("." + file?.type?.split("/")[1])) {
        if (
          Object.keys(imageTypes).includes(file?.type?.split("/")[1]) &&
          !isFileSizeValid
        ) {
          setLoading(true);
          try {
            const compressedFile = await imageCompression(file?.originFileObj, {
              maxSizeMB: 5,
            });
            if (compressedFile) {
              const originFileObj = new File([compressedFile], file?.name);
              setLoading(false);
              filteredFileList.push({
                ...file,
                originFileObj,
                thumbUrl: URL.createObjectURL(originFileObj),
              });
            }
          } catch (error) {
            setLoading(false);
            console.log(error);
          }
        } else {
          filteredFileList.push(file);
        }
      }
    });
    await Promise.all(promise);
    return filteredFileList;
  }
};

export default function ImageUploader({
  onChange,
  value = [],
  accept = ".jpeg,.png,.jpg",
  maxCount = 1,
  disabledEdit = false,
  message = "",
  params,
}) {
  const [loading, setLoading] = useState(false);

  const [previewImage, setPreviewImage] = useState({ open: false, url: null });

  const onUploadChange = async (params) => {
    const res = await handleImageChange(params, accept, setLoading);
    if (res) {
      onChange(res);
    }
  };

  const onPreview = (file) => {
    if (!file.type || file.type?.split("/")[0] === "image") {
      if (!file?.id) {
        file = { ...file, url: URL.createObjectURL(file.originFileObj) };
      }
      setPreviewImage({ open: true, url: file?.url });
    }
  };

  const onRemove = (file) => {
    let imageList = value.filter((img) => img.uid !== file.uid);
    onChange(imageList);
  };

  return (
    <div className="upload_wrapper">
      <div style={{ color: "#727176", paddingBlockEnd: ".5em" }}>
        {message ||
          `Images above ${fileSizeLimit}MB will be compressed dynamically`}
      </div>

      <Upload
        className="upload-list-inline"
        listType="picture-card"
        beforeUpload={() => {
          return false;
        }}
        fileList={value}
        maxCount={maxCount}
        onChange={onUploadChange}
        onPreview={onPreview}
        multiple
        accept={accept}
        itemRender={(originNode, file) => {
          return (
            <UploadPreview {...{ file, onPreview, onRemove, disabledEdit }} />
          );
        }}
        {...{ params }}
      >
        {loading ? (
          <Spin />
        ) : (
          value?.length !== maxCount &&
          !disabledEdit && (
            <div className="upload_text_section">
              <img src={UploadFile} alt="img" />
              <div>Upload or Drag</div>
            </div>
          )
        )}
      </Upload>
      <ImageViewer {...{ previewImage, setPreviewImage }} />
    </div>
  );
}

export function ProductImageUploader({
  onChange,
  value = { imgs: [], default_img: {} },
  accept = ".jpeg,.png,.jpg",
  maxCount = 1,
}) {
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState({ open: false, url: null });

  const onUploadChange = async (params) => {
    const res = await handleImageChange(params, accept, setLoading);
    if (res) {
      onChange(res);
    }
  };

  const onPreview = (file) => {
    setPreviewImage({ open: true, url: file?.thumbUrl || file?.url });
  };

  return (
    <div className="upload_wrapper">
      <div
        style={{ color: "#727176", paddingBlockEnd: ".5em" }}
      >{`Images above ${fileSizeLimit}MB will be compressed dynamically`}</div>
      <Upload
        className="upload-list-inline"
        data-testid="image-upload-add-product"
        listType="picture-card"
        beforeUpload={() => {
          return false;
        }}
        fileList={value.imgs}
        maxCount={maxCount}
        onChange={onUploadChange}
        onPreview={onPreview}
        multiple
        accept={accept}
        itemRender={(img, file) => {
          let checked = false;
          if (value?.default_img?.id && value?.default_img?.id === file.id) {
            checked = true;
          } else if (value?.default_img?.uid === file.uid) {
            checked = true;
          }
          return (
            <div
              key={file}
              className={`upload_container ${
                checked ? "active_container" : ""
              }`}
            >
              <img
                src={checked ? ActiveRightIcon : RightIcon}
                alt="icon"
                checked={checked}
                className="default_checkbox"
                onClick={() => onChange(file)}
              />
              {img}
            </div>
          );
        }}
      >
        {loading ? (
          <Spin />
        ) : (
          (value.imgs || [])?.length !== maxCount && (
            <div className="upload_text_section">
              <img src={UploadFile} alt="img" />
              <div>Upload or Drag</div>
            </div>
          )
        )}
      </Upload>
      <div style={{ fontSize: "12px", color: "#727176" }}>
        <span style={{ color: "#000" }}>Select the image</span> that you want to
        be displayed as the featured image
      </div>
      <ImageViewer {...{ previewImage, setPreviewImage }} />
    </div>
  );
}

export function ImageViewer({ previewImage, setPreviewImage }) {
  return (
    <div className="preview-for-image">
      <Modal
        open={previewImage.open}
        onCancel={() => setPreviewImage({ open: false, url: null })}
        footer={<div></div>}
        // closable={false}
        width={600}
        centered
      >
        <div style={{ padding: "6px 6px 0 6px" }}>
          <img
            src={previewImage.url}
            alt="img"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: 5,
            }}
          />
        </div>
      </Modal>
    </div>
  );
}

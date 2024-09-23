import React, { useEffect, useState } from "react";
import { Card, Col, Space, Button, Upload, notification } from "antd";
import { PictureOutlined, UploadOutlined } from "@ant-design/icons";
import uploadFile from "../uploadFile";

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

var uploading = false;

const ImageUpload = (props) => {
  const config = {
    max_size: 5242880,
  };

  const [uploadList, setUploadList] = useState([]);
  const [data, setData] = useState({
    id: null,
    file: null,
    base64: "",
  });

  async function onChange(file) {
    if (!uploading) {
      uploading = true;
      let { fileId, fileUrl } = await uploadFile(
        file,
        props.uploadParams || {}
      );
      setData({
        id: fileId,
        file: file["originFileObj"],
        base64: await toBase64(file["originFileObj"]),
      });
      props.onChange && props.onChange(fileId);
      props.onUpload &&
        props.onUpload({
          fileId,
          fileUrl,
          file: file["originFileObj"],
        });
      uploading = false;
    }
  }

  useEffect(() => {
    if (uploadList.length) {
      onChange(uploadList[0]);
    }
  }, [uploadList]);
  return (
    <>
      <Card
        style={
          props?.rules?.error && !uploadList.length
            ? { border: "2px solid red" }
            : {}
        }
      >
        <Space style={{ color: "#808080" }}>
          <Col>
            {data["base64"] || props.default ? (
              <img
                src={data["base64"] || props.default}
                style={{
                  height: 58,
                  width: 64,
                  objectFit: "contain",
                }}
              />
            ) : (
              <PictureOutlined style={{ fontSize: 64 }} />
            )}
          </Col>
          <Col>
            {data["base64"] || props.default ? "Change" : "Add"}{" "}
            {props.name || "Image"}
            {props?.rules?.required && <span style={{ color: "red" }}> *</span>}
            <div style={{ fontSize: 12 }}>Maximum file size: 5 MB</div>
            <div style={{ fontSize: 12 }}>{props.description}</div>
          </Col>
          <Col>
            <Upload
              maxCount={1}
              accept={"image/jpeg, image/png, image/jpg"}
              beforeUpload={(file) => {
                return false;
              }}
              fileList={uploadList}
              onChange={({ file, fileList }) => {
                if (file.size <= config["max_size"]) {
                  setUploadList(fileList);
                } else
                  notification.error({
                    message: `File size should not exceed ${
                      config["max_size"] / 1024 / 1024
                    } MB`,
                  });
              }}
              /*
                        onRemove={(file) => {
                            const index = fileList.indexOf(file);
                            let arr = [...fileList];
                            arr.splice(index, 1);
                            setFileList(arr);
                        }}                                    
                        //showUploadList={{ showPreviewIcon: false }}                                    
                        */
              itemRender={(element, file) => null}
            >
              <Button disabled={props.loader || false}>
                <UploadOutlined /> Upload
              </Button>
            </Upload>
          </Col>
        </Space>
      </Card>
      {props?.rules?.error && !uploadList.length && (
        <span style={{ color: "#ff4d4f", fontFamily: "poppins" }}>
          {props?.rules?.msg}
        </span>
      )}
    </>
  );
};

export default ImageUpload;

import React, { useState, useEffect } from "react";
import {
  theme,
  Space,
  Card,
  Row,
  Col,
  Button,
  Table,
  Form,
  Modal,
  Input,
  Spin,
  Dropdown,
  notification,
  Checkbox,
  Select,
  Divider,
} from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
//import { appInfoService } from "../../../redux/action/storefrontAction";
import {
  orgProfileService,
  configurationService,
} from "../../../redux/action/storefrontAction";
import ImageUpload from "../../../components/imageUpload/imageUpload";
import { resizeImage } from "../../../helpers/uploadImage";
import uploadFile from "../../../components/uploadFile";

const defaults = {
  manifest: {},
  icons: {
    sizes: [512, 192, 168, 144, 96, 72, 48, 196],
    default_size: 512,
    maskable_size: 196,
  },
  icon_object: {
    file: "",
    fileUrl: "",
  },
};

export default function AppInfo() {
  const [config, setConfig] = useState({ manifest: defaults["manifest"] });
  const [formData, setFormData] = useState();
  const [icon, setIcon] = useState(defaults["icon_object"]);
  const [formRef, setFormRef] = Form.useForm();
  const [loader, setLoader] = useState(false);
  const default_icon_size = defaults.icons["default_size"];

  const updateConfiguration = async (values) => {
    const response = await configurationService.update(values);
    if (response) {
      const { data, message } = response;
      if (data) {
        notification.success({ message });
      } else if (message) {
        notification.error({ message });
      }
    }
    fetchConfiguration();
  };

  const fetchConfiguration = async () => {
    const { data } = await configurationService.fetch();
    if (data) {
      setConfig({
        ...data,
        manifest: data["manifest"] || defaults["manifest"],
      });
    }
  };

  const handleSubmit = async (values) => {
    if (!icon["fileUrl"]) {
      return notification.warning({ message: "Icon is required" });
    }
    setLoader(true);
    if (icon["file"]) {
      let icons = [
        {
          src: icon["fileUrl"],
          sizes: `${default_icon_size}x${default_icon_size}`,
          type: "image/png",
        },
      ];
      for (let i = 0; i < defaults.icons["sizes"].length; i++) {
        let target_size = defaults.icons["sizes"][i];
        if (target_size !== defaults.icons["default_size"]) {
          let originFileObj = await resizeImage({
            file: icon["file"],
            maxHeight: target_size,
            maxWidth: target_size,
            compressFormat: "PNG",
          });
          let fileObj = {
            name: `icon-${target_size}x${target_size}.png`,
            size: originFileObj["size"],
            type: originFileObj["type"],
            originFileObj,
          };
          let { fileId, fileUrl } = await uploadFile(fileObj, {
            is_public: true,
          });
          icons.push({
            src: fileUrl,
            sizes: `${target_size}x${target_size}`,
            type: "image/png",
            ...(target_size === defaults.icons["maskable_size"]
              ? { purpose: "maskable" }
              : {}),
          });
        }
      }
      values.icon = icons;
    }
    await updateConfiguration({
      ...config,
      manifest: {
        ...config["manifest"],
        ...values,
      },
    });
    setLoader(false);
    setFormData(null);
  };

  useEffect(() => {
    fetchConfiguration();
  }, []);

  useEffect(() => {
    if (formData && (formData["icon"] || []).length) {
      setIcon({
        fileUrl: formData["icon"][0]["src"],
        file: "",
      });
    } else setIcon(defaults["icon_object"]);
  }, [formData]);

  return (
    <>
      <Card className="card-layout" style={{ height: "100%" }}>
        <Row justify={"space-between"}>
          <Col>
            <div style={styles.subheading}>App Info.</div>
          </Col>
          <Col>
            <button
              className="button_secondary"
              style={{ float: "right" }}
              onClick={() => setFormData(config["manifest"])}
            >
              Edit
            </button>
          </Col>
        </Row>
        {(config["manifest"] || {})["name"] ? (
          <>
            <Row justify={"space-between"} style={{ marginTop: 24 }}>
              <Col>App Name</Col>
              <Col>{config["manifest"]["name"]}</Col>
            </Row>
            <Divider style={{ borderColor: "#fff", margin: "12px 0px" }} />
            <Row justify={"space-between"}>
              <Col>
                <div>App Icon Image</div>
                <div style={{ fontSize: 12, color: "#727176" }}>
                  ( Resolution should be {default_icon_size} x{" "}
                  {default_icon_size} px )
                </div>
              </Col>
              <Col>
                <img
                  src={
                    ((config["manifest"] || {})["icon"] || [{ src: "" }])[0][
                      "src"
                    ]
                  }
                  style={{
                    height: 120,
                    width: 120,
                    borderRadius: 4,
                    objectFit: "contain",
                    backgroundColor: "#FFFFFF90",
                  }}
                />
              </Col>
            </Row>
            <Divider style={{ borderColor: "#fff", margin: "12px 0px" }} />
          </>
        ) : (
          <Col align="middle">
            <img
              src={require("../../../assets/placeholder-no-data.svg").default}
              style={{ height: 52 }}
            />
            <div style={{ color: "#CBCBCB", fontSize: 16 }}>
              Doesn’t have any App Info.
            </div>
          </Col>
        )}
      </Card>
      {!!formData && (
        <Modal
          className="modal-layout"
          open={true}
          key={`modal-closed-${!formData}`}
          onCancel={() => {
            if (!loader) {
              setFormData(false);
            }
          }}
          title={<div style={{ textAlign: "center" }}>{"Edit App Info."}</div>}
          footer={[
            <Button
              size="middle"
              type="primary"
              onClick={formRef.submit}
              loading={loader}
            >
              Finish
            </Button>,
          ]}
        >
          <br />
          <ImageUpload
            name="Icon"
            default={icon["fileUrl"]}
            onUpload={setIcon}
            uploadParams={{
              is_public: true,
            }}
            description={`Resolution should be ${default_icon_size}x${default_icon_size} px`}
            {...{ loader }}
          />
          <br />
          <Form
            form={formRef}
            size="small"
            layout="vertical"
            initialValues={{ ...formData }}
            onFinish={handleSubmit}
          >
            <Form.Item
              required={true}
              rules={[{ required: true }]}
              name={"name"}
              label={<div style={styles.label}>App Name</div>}
            >
              <Input size="middle" style={styles.input} disabled={loader} />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </>
  );
}

const styles = {
  heading: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 22,
    color: "#000000",
  },
  subheading: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 18,
    color: "#000000",
  },
  label: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 16,
    color: "#808080",
  },
};

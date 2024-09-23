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
  Select,
  notification,
  Layout,
} from "antd";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
  orgProfileService,
  configurationService,
} from "../../../redux/action/storefrontAction";
import { EllipsisOutlined } from "@ant-design/icons";
import ckEditorUploadAdapter from "../../../helpers/ckEditorUploadAdapter";

export const social_media_types = [
  { label: "Twitter", value: "twitter" },
  { label: "Facebook", value: "facebook" },
  { label: "Instagram", value: "instagram" },
  { label: "Linkedin", value: "linkedin" },
];

export default function General() {
  const [socialFormRef] = Form.useForm();
  const [config, setConfig] = useState({});
  const [form, setForm] = useState({});
  const [about, setAbout] = useState("");
  const [socialForm, setSocialForm] = useState(false);

  const updateProfile = async (values) => {
    const response = await orgProfileService.update(values);
    if (response) {
      const { data, message } = response;
      if (data) {
        notification.success({ message });
      } else if (message) {
        notification.error({ message });
      }
    }
    fetchProfile();
  };

  const fetchProfile = async () => {
    const { data } = await orgProfileService.fetch();
    if (data) {
      setForm(data);
      if (data["about_us"]) {
        setAbout(data["about_us"]);
      }
    }
  };

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
  };

  const fetchConfiguration = async () => {
    const { data } = await configurationService.fetch();
    if (data) {
      setConfig(data);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchConfiguration();
  }, []);

  useEffect(() => {
    socialFormRef.resetFields();
    if (!socialFormRef) {
    } else {
      socialFormRef.setFieldsValue(socialForm);
    }
  }, [socialForm]);

  if (!Object.keys(form).length) {
    return (
      <Space align="middle">
        <Spin />
        <div>Fetching Profile</div>
      </Space>
    );
  }

  return (
    <>
      <Space direction="vertical" style={{ flex: 1 }}>
        <Card className="card-layout">
          <Row justify={"space-between"}>
            <Col>
              <div style={styles.subheading}>About Us</div>
            </Col>
            <Col>
              <button
                className="button_secondary"
                style={{ float: "right" }}
                onClick={() => updateProfile({ about_us: about })}
              >
                Update
              </button>
            </Col>
          </Row>
          <br />
          <CKEditor
            config={{
              mediaEmbed: {
                previewsInData: true,
              },
              image: {
                toolbar: ["imageTextAlternative"],
              },
            }}
            onReady={(editor) => {
              //console.log(Array.from( editor.ui.componentFactory.names() ));
              editor.plugins.get("FileRepository").createUploadAdapter = (
                loader
              ) => {
                return new ckEditorUploadAdapter(loader);
              };
            }}
            editor={ClassicEditor}
            data={form["about_us"]}
            onChange={(event, editor) => {
              setAbout(editor.getData());
            }}
          />
          <br />
        </Card>

        <Card className="card-layout">
          <Row justify={"space-between"}>
            <Col>
              <div style={styles.subheading}>Social Media</div>
            </Col>
            <Col>
              <button
                className="button_secondary"
                style={{ float: "right" }}
                onClick={() => setSocialForm({})}
              >
                Add Account
              </button>
            </Col>
          </Row>
          <br />
          <Table
            pagination={false}
            dataSource={[
              ...Object.keys(form["social_media"]).map((social) => ({
                platform: social,
                link: form["social_media"][social],
              })),
            ]}
            columns={[
              {
                title: "Platform",
                dataIndex: "platform",
              },
              {
                title: "Link",
                dataIndex: "link",
              },
              {
                title: "Action",
                render: (a) => {
                  return (
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: "edit",
                            label: (
                              <a
                                target="_blank"
                                onClick={() => setSocialForm(a)}
                              >
                                Edit
                              </a>
                            ),
                          },
                          {
                            key: "delete",
                            label: (
                              <a
                                target="_blank"
                                onClick={() => {
                                  let obj = { ...form["social_media"] };
                                  delete obj[a.platform];
                                  updateProfile({ social_media: obj });
                                }}
                              >
                                Delete
                              </a>
                            ),
                          },
                        ],
                      }}
                    >
                      <EllipsisOutlined
                        style={{
                          fontSize: 22,
                          transform: "rotate(90deg)",
                          cursor: "pointer",
                        }}
                      />
                    </Dropdown>
                  );
                },
                align: "center",
              },
            ]}
          />
          <br />
        </Card>

        <Card className="card-layout">
          <Form
            layout="vertical"
            initialValues={config}
            onFinish={updateConfiguration}
          >
            <Row justify={"space-between"}>
              <Col>
                <div style={styles.subheading}>Contact Info</div>
              </Col>
              <Col>
                <button
                  className="button_secondary"
                  htmltype="submit"
                  style={{ float: "right" }}
                >
                  Update
                </button>
              </Col>
            </Row>
            <br />
            <Form.Item label="Email" name="website_email">
              <Input />
            </Form.Item>
            <Form.Item label="Mobile" name="website_contact_us">
              <Input prefix={"+91"} maxLength={10} />
            </Form.Item>
            <Form.Item label="Full Address" name="address_line_1">
              <Input placeholder="Address Line 1" />
            </Form.Item>
            <Form.Item name="address_line_2" style={{ marginTop: -16 }}>
              <Input placeholder="Address Line 2" />
            </Form.Item>
            <Form.Item label="Pincode" name="pincode">
              <Input />
            </Form.Item>
            <Form.Item label="Whatsapp Number" name="whatsapp_no">
              <Input prefix={"+91"} maxLength={10} />
            </Form.Item>
          </Form>
        </Card>
      </Space>
      {form && (
        <Modal
          key={`modal-closed-${!socialForm}`}
          className="modal-layout"
          open={socialForm}
          onCancel={() => setSocialForm(false)}
          style={{ overflow: "hidden" }}
          title={
            <div style={{ textAlign: "center" }}>
              {socialForm["link"] ? "Edit Account" : "Add Account"}
            </div>
          }
          footer={
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button className="button_primary" onClick={socialFormRef.submit}>
                Finish
              </button>
            </div>
          }
        >
          <br />
          <Form
            form={socialFormRef}
            size="small"
            layout="vertical"
            initialValues={socialForm}
            onFinish={(obj) => {
              let socials = { ...form["social_media"] };
              socials[obj.platform] = obj.link;
              updateProfile({ social_media: socials });
              setSocialForm(false);
            }}
          >
            <Form.Item
              required={true}
              rules={[{ required: true }]}
              name={"platform"}
              label={<div style={styles.label}>Platform</div>}
            >
              <Select
                size="middle"
                style={styles.input}
                options={social_media_types}
              />
            </Form.Item>
            <Form.Item
              required={true}
              rules={[{ required: true }]}
              name={"link"}
              label={<div style={styles.label}>Link</div>}
            >
              <Input size="middle" style={styles.input} />
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
    marginRight: 12,
  },
};

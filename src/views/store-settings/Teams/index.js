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
  Select,
  Dropdown,
  notification,
  Image,
} from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import ImageUpload from "../../../components/imageUpload/imageUpload";
import { teamService } from "../../../redux/action/storefrontAction";

export default function Teams() {
  const [form, setForm] = useState(false);
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [fileId, setFileId] = useState(null);
  const [formRef] = Form.useForm();

  const createTeam = async (values) => {
    if (!fileId) {
      return notification.error({ message: "Image is required" });
    }
    const response = await teamService.create({
      is_published: true,
      profile_pic: fileId,
      ...values,
    });
    if (response) {
      const { data, message } = response;
      if (data && data["id"]) {
        notification.success({ message });
        setForm(false);
        fetchTeams();
      } else if (message) {
        notification.error({ message });
      }
    }
  };

  const updateTeam = async (values) => {
    const response = await teamService.update({
      id: form["id"],
      is_published: true,
      profile_pic: fileId || form["profile_pic"],
      ...values,
    });
    if (response) {
      const { data, message } = response;
      if (data && data["id"]) {
        notification.success({ message });
        setForm(false);
        fetchTeams();
      } else if (message) {
        notification.error({ message });
      }
    }
  };

  const deleteTeam = async (id) => {
    const response = await teamService.delete(id);
    if (response) {
      const { data, message } = response;
      if (data && data["id"]) {
        notification.success({ message });
        fetchTeams();
      } else if (message) {
        notification.error({ message });
      }
    }
  };

  const fetchTeams = async (values) => {
    const { data } = await teamService.list(page);
    if (data) {
      setList(data);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [page]);

  useEffect(() => {
    formRef.resetFields();
    if (!form) {
      setFileId(null);
    } else {
      formRef.setFieldsValue(form);
    }
  }, [form]);

  return (
    <>
      <Space direction="vertical" style={{ flex: 1 }}>
        <Card className="card-layout">
          <Row justify={"space-between"}>
            <Col>
              <div style={styles.subheading}>Teams</div>
            </Col>
            <Col>
              <button
                className="button_secondary"
                style={{ float: "right" }}
                onClick={() => setForm({})}
              >
                Add Member
              </button>
            </Col>
          </Row>
          <br />
          <Table
            pagination={false}
            dataSource={list}
            columns={[
              {
                title: "Image",
                dataIndex: "profile_pic_url",
                render: (value) => {
                  return (
                    <div
                      style={{
                        height: 64,
                        width: 64,
                        borderRadius: "50%",
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={value}
                        style={{
                          height: 64,
                          width: 64,
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  );
                },
              },
              {
                title: "Name",
                dataIndex: "name",
              },
              {
                title: "Designation",
                dataIndex: "position",
              },
              {
                title: "Intro",
                dataIndex: "intro",
              },
              {
                title: "LinkedIn",
                dataIndex: "social_links",
                render: (socials) =>
                  socials.length ? socials[0]["linkedin"] : "",
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
                                onClick={() => {
                                  let obj = { ...a };
                                  if (obj.social_links.length) {
                                    obj["linkedin"] =
                                      obj.social_links[0]["linkedin"];
                                  }
                                  setForm(obj);
                                }}
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
                                onClick={() => deleteTeam(a.id)}
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
        </Card>
      </Space>
      {
        <Modal
          className="modal-layout"
          open={!!form}
          key={`modal-closed-${!form}`}
          onCancel={() => setForm(false)}
          title={
            <div style={{ textAlign: "center" }}>
              {form["id"] ? "Edit Member" : "Add Member"}
            </div>
          }
          footer={[
            <Button size="middle" type="primary" onClick={formRef.submit}>
              Finish
            </Button>,
          ]}
        >
          <br />
          <ImageUpload default={form["profile_pic_url"]} onChange={setFileId} />
          <br />
          <Form
            form={formRef}
            size="small"
            layout="vertical"
            initialValues={form}
            onFinish={(values) => {
              values["social_links"] = [{ linkedin: values["linkedin"] }];
              delete values["linkedin"];
              if (form["id"]) updateTeam(values);
              else createTeam(values);
            }}
          >
            <Form.Item
              required={true}
              rules={[{ required: true }]}
              name={"name"}
              label={<div style={styles.label}>Name</div>}
            >
              <Input size="middle" style={styles.input} />
            </Form.Item>
            <Form.Item
              required={true}
              rules={[{ required: true }]}
              name={"intro"}
              label={<div style={styles.label}>Intro</div>}
            >
              <Input.TextArea rows="2" size="middle" style={styles.input} />
            </Form.Item>
            <Form.Item
              required={true}
              rules={[{ required: true }]}
              name={"position"}
              label={<div style={styles.label}>Designation</div>}
            >
              <Input size="middle" style={styles.input} />
            </Form.Item>
            <Form.Item
              required={true}
              rules={[{ required: true }]}
              name={"linkedin"}
              label={<div style={styles.label}>LinkedIn</div>}
            >
              <Input size="middle" style={styles.input} />
            </Form.Item>
          </Form>
          <br />
        </Modal>
      }
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

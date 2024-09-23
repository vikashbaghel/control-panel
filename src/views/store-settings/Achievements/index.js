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
  Dropdown,
  notification,
  Image,
} from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import ImageUpload from "../../../components/imageUpload/imageUpload";
import { achievementService } from "../../../redux/action/storefrontAction";

export default function Achievements() {
  const [form, setForm] = useState(false);
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [fileId, setFileId] = useState(null);
  const [formRef] = Form.useForm();

  const createAchievement = async (values) => {
    if (!fileId) {
      return notification.error({ message: "Image is required" });
    }
    const response = await achievementService.create({
      is_published: true,
      image: fileId,
      ...values,
    });
    if (response) {
      const { data, message } = response;
      if (data) {
        notification.success({ message });
        setForm(false);
        fetchAchievements();
      } else if (message) {
        notification.error({ message });
      }
    }
  };

  const updateAchievement = async (values) => {
    const response = await achievementService.update({
      id: form["id"],
      is_published: true,
      image: fileId || form["image"],
      ...values,
    });
    if (response) {
      const { data, message } = response;
      if (data) {
        notification.success({ message });
        setForm(false);
        fetchAchievements();
      } else if (message) {
        notification.error({ message });
      }
    }
  };

  const deleteAchievement = async (id) => {
    const response = await achievementService.delete(id);
    if (response) {
      const { data, message } = response;
      if (data) {
        notification.success({ message });
        fetchAchievements();
      } else if (message) {
        notification.error({ message });
      }
    }
  };

  const fetchAchievements = async (values) => {
    const { data } = await achievementService.list(page);
    if (data) {
      setList(data);
    }
  };

  useEffect(() => {
    fetchAchievements();
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
              <div style={styles.subheading}>Achievements</div>
            </Col>
            <Col>
              <button
                className="button_secondary"
                style={{ float: "right" }}
                onClick={() => setForm({})}
              >
                Add Achievement
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
                dataIndex: "image_url",
                render: (value) => {
                  return (
                    <div
                      style={{
                        height: 72,
                        width: 128,
                        borderRadius: 10,
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={value}
                        style={{
                          height: 72,
                          width: 128,
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  );
                },
              },
              {
                title: "Title",
                dataIndex: "title",
              },
              {
                title: "Description",
                dataIndex: "description",
              },
              {
                title: "Client",
                dataIndex: "client",
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
                              <a target="_blank" onClick={() => setForm(a)}>
                                Edit
                              </a>
                            ),
                          },
                          {
                            key: "delete",
                            label: (
                              <a
                                target="_blank"
                                onClick={() => deleteAchievement(a.id)}
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
              {form["id"] ? "Edit Achievement" : "Add Achievement"}
            </div>
          }
          footer={[
            <Button size="middle" type="primary" onClick={formRef.submit}>
              Finish
            </Button>,
          ]}
        >
          <br />
          <ImageUpload
            default={form["image_url"]}
            onChange={setFileId}
            description="Recommended size: 1920x1080"
          />
          <br />
          <Form
            form={formRef}
            size="small"
            layout="vertical"
            initialValues={form}
            onFinish={form["id"] ? updateAchievement : createAchievement}
          >
            <Form.Item
              required={true}
              rules={[{ required: true }]}
              name={"title"}
              label={<div style={styles.label}>Title</div>}
            >
              <Input size="middle" style={styles.input} />
            </Form.Item>
            <Form.Item
              required={true}
              rules={[{ required: true }]}
              name={"description"}
              label={<div style={styles.label}>Description</div>}
            >
              <Input.TextArea rows="6" size="middle" style={styles.input} />
            </Form.Item>
            <Form.Item
              required={true}
              rules={[{ required: true }]}
              name={"client"}
              label={<div style={styles.label}>Client</div>}
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

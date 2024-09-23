import { useState, useEffect } from "react";
import {
  Space,
  Card,
  Row,
  Col,
  Button,
  Table,
  Form,
  Modal,
  Input,
  notification,
  Dropdown,
  Slider,
  Image,
} from "antd";
import {
  EllipsisOutlined,
  FrownOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import ImageUpload from "../../../components/imageUpload/imageUpload";
import { testimonialService } from "../../../redux/action/storefrontAction";

export default function Testimonials() {
  const [form, setForm] = useState(false);
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [fileId, setFileId] = useState(null);
  const [formRef] = Form.useForm();

  const createTestimonial = async (values) => {
    if (!fileId) {
      return notification.error({ message: "Image is required" });
    }
    const response = await testimonialService.create({
      is_published: true,
      user_pic: fileId,
      ...values,
    });
    if (response) {
      const { data, message } = response;
      if (data && data["id"]) {
        notification.success({ message });
        setForm(false);
        fetchTestimonials();
      } else if (message) {
        notification.error({ message });
      }
    }
  };

  const updateTestimonial = async (values) => {
    const response = await testimonialService.update({
      id: form["id"],
      is_published: true,
      user_pic: fileId || form["user_pic"],
      ...values,
    });
    if (response) {
      const { data, message } = response;
      if (data && data["id"]) {
        notification.success({ message });
        setForm(false);
        fetchTestimonials();
      } else if (message) {
        notification.error({ message });
      }
    }
  };

  const deleteTestimonial = async (id) => {
    const response = await testimonialService.delete(id);
    if (response) {
      const { data, message } = response;
      if (data && data["id"]) {
        notification.success({ message });
        fetchTestimonials();
      } else if (message) {
        notification.error({ message });
      }
    }
  };

  const fetchTestimonials = async (values) => {
    const { data } = await testimonialService.list(page);
    if (data) {
      setList(data);
    }
  };

  useEffect(() => {
    fetchTestimonials();
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
              <div style={styles.subheading}>Testimonials</div>
            </Col>
            <Col>
              <button
                className="button_secondary"
                style={{ float: "right" }}
                onClick={() => setForm({})}
              >
                Add Testimonial
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
                dataIndex: "user_pic_url",
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
                dataIndex: "user_name",
              },
              {
                title: "Designation",
                dataIndex: "position",
              },
              {
                title: "Company",
                dataIndex: "company",
              },
              {
                title: "Review",
                dataIndex: "content",
              },
              {
                title: "Rating",
                dataIndex: "rating",
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
                                onClick={() => deleteTestimonial(a.id)}
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
              {form["id"] ? "Edit Testimonial" : "Add Testimonial"}
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
            default={form["user_pic_url"]}
            onChange={setFileId}
            description="Recommended size: 1920x1080"
          />
          <br />
          <Form
            form={formRef}
            size="small"
            layout="vertical"
            initialValues={form}
            onFinish={form["id"] ? updateTestimonial : createTestimonial}
          >
            <Form.Item
              required={true}
              rules={[{ required: true }]}
              name={"user_name"}
              label={<div style={styles.label}>Name</div>}
            >
              <Input size="middle" style={styles.input} />
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
              name={"company"}
              label={<div style={styles.label}>Company</div>}
            >
              <Input size="middle" style={styles.input} />
            </Form.Item>
            <Form.Item
              required={true}
              rules={[{ required: true }]}
              name={"content"}
              label={<div style={styles.label}>Review</div>}
            >
              <Input.TextArea size="middle" style={styles.input} rows="6" />
            </Form.Item>
            <Form.Item
              name={"rating"}
              label={<div style={styles.label}>Rating</div>}
            >
              <Slider
                defaultValue={5.0}
                min={1.0}
                max={5.0}
                marks={{
                  1: <FrownOutlined />,
                  5: <SmileOutlined />,
                }}
              />
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

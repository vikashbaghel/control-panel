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
  Dropdown,
  Select,
  Checkbox,
  notification,
  Input,
  Image,
} from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import ImageUpload from "../../../components/imageUpload/imageUpload";
import { sliderService } from "../../../redux/action/storefrontAction";
import SelectProduct from "./SelectProduct";
import SelectCategory from "./SelectCategory";

export default function Slides() {
  const linkTypes = [
    {
      label: "Product",
      value: "product",
      key: "product_id",
      component: (
        <Form.Item
          required={true}
          rules={[{ required: true, message: "Product is required" }]}
          name="product"
          label={<div style={styles.label}>Select Product</div>}
        >
          <SelectProduct />
        </Form.Item>
      ),
    },
    {
      label: "Category",
      value: "category",
      key: "category_id",
      component: (
        <Form.Item
          required={true}
          rules={[{ required: true, message: "Category is required" }]}
          name="category"
          label={<div style={styles.label}>Select Category</div>}
        >
          <SelectCategory />
        </Form.Item>
      ),
    },
    {
      label: "Other",
      value: "other_link",
      key: "link",
      component: (
        <Form.Item
          required={true}
          rules={[{ required: true, message: "Other Link is required" }]}
          name="other_link_url"
          label={<div style={styles.label}>Other Link</div>}
        >
          <Input size="middle" />
        </Form.Item>
      ),
    },
  ];

  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(false);
  const [fileId, setFileId] = useState(null);
  const [activeLinkType, setActiveLinkType] = useState("");
  const [error, setError] = useState(false);

  const [formRef] = Form.useForm();

  const createSlider = async (values) => {
    values = {
      slider_image: fileId,
      ...values,
      ...(values?.product && { product: values.product.id }),
      ...(values?.category && { category: values.category.id }),
    };
    const response = await sliderService.create(values);
    if (response) {
      const { data, message } = response;
      if (data) {
        notification.success({ message });
        setForm(false);
        fetchSliders();
      } else if (message) {
        notification.error({ message });
      }
    }
  };

  const updateSlider = async (values) => {
    values = {
      id: form["id"],
      slider_image: fileId || form["slider_image"],
      ...values,
      ...(values?.product && { product: values.product.id }),
      ...(values?.category && { category: values.category.id }),
    };
    const response = await sliderService.update(form["id"], values);
    if (response) {
      const { data, message } = response;
      if (data) {
        notification.success({ message });
        setForm(false);
        fetchSliders();
      } else if (message) {
        notification.error({ message });
      }
    }
  };

  const deleteSlider = async (id) => {
    const response = await sliderService.delete(id);
    if (response) {
      const { data, message } = response;
      if (data && data["id"]) {
        notification.success({ message });
        fetchSliders();
      } else if (message) {
        notification.error({ message });
      }
    }
  };

  const fetchSliders = async () => {
    const { data } = await sliderService.list(page);
    if (data) {
      setList(data);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, [page]);

  useEffect(() => {
    formRef.resetFields();
    setError(false);
    if (!form) {
      setFileId(null);
      setActiveLinkType(null);
    } else {
      setActiveLinkType(form["link_type"]);
      formRef.setFieldsValue(form);
    }
  }, [form]);

  return (
    <>
      <Space direction="vertical" style={{ flex: 1 }}>
        <Card className="card-layout">
          <Row justify={"space-between"}>
            <Col>
              <div style={styles.subheading}>Sliders</div>
            </Col>
            <Col>
              <button
                className="button_secondary"
                style={{ float: "right" }}
                onClick={() => setForm({})}
              >
                Add Slider
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
                dataIndex: "slider_image_url",
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
                title: "Link",
                render: (a) => {
                  let matches = linkTypes.filter(
                    (obj) => obj.link_type === a.link_type
                  );
                  if (matches.length === 1) {
                    let [obj] = matches;
                    return <div>{obj["label"]}</div>;
                  }
                  return <div />;
                },
              },
              {
                title: "Status",
                dataIndex: "is_published",
                render: (value) => {
                  return <div>{value ? "Active" : "Disabled"}</div>;
                },
              },
              {
                title: "Position",
                dataIndex: "is_footer",
                render: (value) => {
                  return <div>{value ? "Bottom" : "Top"}</div>;
                },
              },
              {
                title: "Action",
                render: (a, obj, i) => {
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
                                  setForm(list[i]);
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
                                onClick={() => deleteSlider(a.id)}
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
          onCancel={() => {
            setForm(false);
          }}
          title={
            <div style={{ textAlign: "center" }}>
              {form["id"] ? "Edit Slider" : "Add Slider"}
            </div>
          }
          footer={[
            <Button
              size="middle"
              type="primary"
              onClick={() => {
                if (!fileId && !form["id"]) {
                  setError(true);
                }
                formRef.submit();
              }}
            >
              Finish
            </Button>,
          ]}
        >
          <br />

          <ImageUpload
            default={form["slider_image_url"]}
            onChange={setFileId}
            description="Recommended size: 1920x1080"
            rules={{
              required: true,
              error: error,
              msg: "Image is required",
            }}
          />
          <br />
          <Form
            form={formRef}
            size="small"
            layout="vertical"
            initialValues={{ is_published: true, ...form }}
            onFinish={form["id"] ? updateSlider : createSlider}
            requiredMark={(label, info) => (
              <div style={{ display: "flex", gap: "2px" }}>
                {label}{" "}
                {info.required && <span style={{ color: "red" }}>*</span>}
              </div>
            )}
          >
            <Form.Item
              required={true}
              rules={[
                {
                  required: true,
                  message: "Name is required",
                },
              ]}
              name={"name"}
              label={<div style={styles.label}>Name</div>}
            >
              <Input size="middle" style={styles.input} />
            </Form.Item>
            <Form.Item
              required={true}
              rules={[
                {
                  required: true,
                  message: "Type is required",
                },
              ]}
              name={"link_type"}
              label={<div style={styles.label}>Select Type</div>}
            >
              <Select
                size="middle"
                style={styles.input}
                options={linkTypes.map((obj, i) => {
                  let { label, value } = obj;
                  return { label, value };
                })}
                onChange={setActiveLinkType}
              />
            </Form.Item>
            {activeLinkType &&
              linkTypes.find((obj) => obj.value === activeLinkType)[
                "component"
              ]}
            <Form.Item
              name={"is_footer"}
              label={<div style={styles.label}>Position</div>}
              valuePropName="checked"
            >
              <Checkbox>Bottom</Checkbox>
            </Form.Item>
            <Form.Item
              name={"is_published"}
              label={<div style={styles.label}>Status</div>}
              //valuePropName="checked"
            >
              <Select
                size="middle"
                style={styles.input}
                options={[
                  { label: "Active", value: true },
                  { label: "Disable", value: false },
                ]}
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
  },
};

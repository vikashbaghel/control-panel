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
  notification,
  Spin,
} from "antd";
import { PictureOutlined, UploadOutlined } from "@ant-design/icons";
import ImageUpload from "../../../components/imageUpload/imageUpload";
import { seocontentService } from "../../../redux/action/storefrontAction";

export default function SEO() {
  const [form, setForm] = useState();
  const [fileId, setFileId] = useState(null);
  const [faviconId, setFaviconId] = useState(null);

  const updateSEO = async (values) => {
    const response = await seocontentService.update({
      seo_image: fileId || form["seo_image"],
      favicon: faviconId || form["favicon"],
      ...values,
    });
    if (response) {
      const { data, message } = response;
      if (data) {
        notification.success({ message });
      } else if (message) {
        notification.error({ message });
      }
    }
  };

  const fetchSEO = async () => {
    const data = await seocontentService.fetch();
    if (data) {
      setForm(data['data']);
    }
  };

  useEffect(() => {
    fetchSEO();
  }, []);

  return (
    <>
      <Space direction="vertical" style={{ flex: 1 }}>
        <div style={styles.heading}>Search Engine Optimisation</div>
        {form ? (
          <Card className='card-layout'>
            <Form
              size="small"
              layout="vertical"
              initialValues={form}
              onFinish={updateSEO}
            >
              <Row justify={"space-between"}>
                <Col>
                  <div style={styles.subheading}>SEO Content</div>
                </Col>
                <Col>
                  <Form.Item>
                    <button
                      className='button_primary'
                      htmlType="submit"                      
                      style={{ float: "right" }}
                    >
                      Update
                    </button>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name={"title"}
                label={<div style={styles.label}>Title</div>}
              >
                <Input size="middle" style={styles.input} />
              </Form.Item>
              {/*
                <div style={{float: 'right'}}>
                    <Form.Item>
                    <Button
                        size="middle"
                        htmlType="submit"
                        type="primary">
                        Finish
                    </Button>
                    </Form.Item>
                </div>
                */}
              <Space>
                <ImageUpload
                  name="SEO Image"
                  default={form["seo_image_url"]}
                  onChange={setFileId}
                />
                <ImageUpload
                  name="Favicon"
                  default={form["favicon_url"]}
                  onChange={setFaviconId}
                />
              </Space>
              <br />
              <br />
              <Form.Item
                name={"description"}
                label={<div style={styles.label}>Description</div>}
              >
                <Input.TextArea rows="6" size="middle" style={styles.input} />
              </Form.Item>
              <Form.Item
                name={"keyword"}
                label={<div style={styles.label}>Keywords</div>}
              >
                <Select
                  size="middle"
                  style={styles.input}
                  mode="tags"
                  onChange={(e) => {}}
                />
              </Form.Item>
              <Form.Item
                name={"google_analytics"}
                label={
                  <div style={styles.label}>
                    Website Tracking (Google Analytics)
                  </div>
                }
              >
                <Input.TextArea
                  rows="12"
                  size="middle"
                  style={styles.input}
                  placeholder="Global Site Tag (gtag.js)"
                />
              </Form.Item>
            </Form>
          </Card>
        ) : (
          <Space align="middle">
            <Spin />
            <div>Fetching Content</div>
          </Space>
        )}
      </Space>
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

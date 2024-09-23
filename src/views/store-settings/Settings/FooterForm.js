import { useState } from "react";
import { Space, Card, Table, Row, Col } from "antd";
import ColorSelect from "./ColorSelect";
import LogoSelect from "./LogoSelect";

function FooterForm({ config, updateConfiguration }) {
  const constants = {
    id: "footer_config",
  };
  const [form_component, set_form_component] = useState();
  return (
    <>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Row gutter={16}>
          <Col style={{ flex: 1, height: "100%" }}>
            <Card className="card-layout" style={{ flex: 1 }}>
              <Row justify={"space-between"}>
                <Col>
                  <div style={styles.subheading}>Logos</div>
                </Col>
                <Col>
                  <button
                    className="button_secondary"
                    style={{ float: "right" }}
                    onClick={() => {
                      set_form_component(
                        <LogoSelect
                          default={config["footer_logo_url"]}
                          onFinish={(fileId) => {
                            updateConfiguration({
                              // ...config,
                              footer_config: {
                                ...config[constants.id],
                                footer_logo: fileId,
                              },
                            });
                          }}
                          onClose={() => {
                            set_form_component(null);
                          }}
                        />
                      );
                    }}
                  >
                    Edit
                  </button>
                </Col>
              </Row>
              <br />
              <Table
                pagination={false}
                dataSource={[
                  ...((config || {})["footer_logo_url"]
                    ? [
                        {
                          logo_name: "Footer Logo",
                          logo_url: (config || {})["footer_logo_url"],
                        },
                      ]
                    : []),
                ]}
                columns={[
                  {
                    title: "Logo",
                    dataIndex: "logo_url",
                    render: (value) => (
                      <img
                        src={value}
                        style={{ height: 64, width: 64, objectFit: "contain" }}
                      />
                    ),
                  },
                  {
                    title: "Name",
                    dataIndex: "logo_name",
                  },
                ]}
              />
            </Card>
          </Col>
          <Col style={{ flex: 1, height: "100%" }}>
            <Card className="card-layout" style={{ flex: 1 }}>
              <Row justify={"space-between"}>
                <Col>
                  <div style={styles.subheading}>Background Colour</div>
                </Col>
                <Col>
                  <button
                    className="button_secondary"
                    style={{ float: "right" }}
                    onClick={() => {
                      set_form_component(
                        <ColorSelect
                          default={
                            (config[constants.id] || {})["footer_background"]
                          }
                          onFinish={(fileId) => {
                            updateConfiguration({
                              // ...config,
                              footer_config: {
                                ...config[constants.id],
                                footer_background: fileId,
                              },
                            });
                          }}
                          onClose={() => {
                            set_form_component(null);
                          }}
                        />
                      );
                    }}
                  >
                    Edit
                  </button>
                </Col>
              </Row>
              <br />
              <Table
                pagination={false}
                dataSource={[
                  ...((config[constants.id] || {})["footer_background"]
                    ? [
                        {
                          name: "Background Colour",
                          color_code: (config[constants.id] || {})[
                            "footer_background"
                          ],
                        },
                      ]
                    : []),
                ]}
                columns={[
                  {
                    title: "Colour",
                    dataIndex: "color_code",
                    render: (value) => {
                      return (
                        <div
                          style={{
                            height: 48,
                            width: 64,
                            backgroundColor: value,
                            borderRadius: 10,
                            border: "1px solid #E4E4E4",
                          }}
                        />
                      );
                    },
                  },
                  {
                    title: "Name",
                    dataIndex: "name",
                  },
                  {
                    title: "Code",
                    dataIndex: "color_code",
                  },
                ]}
              />
            </Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col style={{ flex: 1, height: "100%" }}>
            <Card className="card-layout" style={{ flex: 1 }}>
              <Row justify={"space-between"}>
                <Col>
                  <div style={styles.subheading}>Heading Colour</div>
                </Col>
                <Col>
                  <button
                    className="button_secondary"
                    style={{ float: "right" }}
                    onClick={() => {
                      set_form_component(
                        <ColorSelect
                          default={
                            (config[constants.id] || {})["footer_heading"]
                          }
                          onFinish={(fileId) => {
                            updateConfiguration({
                              // ...config,
                              footer_config: {
                                ...config[constants.id],
                                footer_heading: fileId,
                              },
                            });
                          }}
                          onClose={() => {
                            set_form_component(null);
                          }}
                        />
                      );
                    }}
                  >
                    Edit
                  </button>
                </Col>
              </Row>
              <br />
              <Table
                pagination={false}
                dataSource={[
                  ...((config[constants.id] || {})["footer_heading"]
                    ? [
                        {
                          name: "Heading Colour",
                          color_code: (config[constants.id] || {})[
                            "footer_heading"
                          ],
                        },
                      ]
                    : []),
                ]}
                columns={[
                  {
                    title: "Colour",
                    dataIndex: "color_code",
                    render: (value) => {
                      return (
                        <div
                          style={{
                            height: 48,
                            width: 64,
                            backgroundColor: value,
                            borderRadius: 10,
                            border: "1px solid #E4E4E4",
                          }}
                        />
                      );
                    },
                  },
                  {
                    title: "Name",
                    dataIndex: "name",
                  },
                  {
                    title: "Code",
                    dataIndex: "color_code",
                  },
                ]}
              />
            </Card>
          </Col>
          <Col style={{ flex: 1, height: "100%" }}>
            <Card className="card-layout" style={{ flex: 1 }}>
              <Row justify={"space-between"}>
                <Col>
                  <div style={styles.subheading}>Text Colour</div>
                </Col>
                <Col>
                  <button
                    className="button_secondary"
                    style={{ float: "right" }}
                    onClick={() => {
                      set_form_component(
                        <ColorSelect
                          default={(config[constants.id] || {})["footer_text"]}
                          onFinish={(fileId) => {
                            updateConfiguration({
                              ...config[constants.id],
                              footer_config: {
                                ...config[constants.id],
                                footer_text: fileId,
                              },
                            });
                          }}
                          onClose={() => {
                            set_form_component(null);
                          }}
                        />
                      );
                    }}
                  >
                    Edit
                  </button>
                </Col>
              </Row>
              <br />
              <Table
                pagination={false}
                dataSource={[
                  ...((config[constants.id] || {})["footer_text"]
                    ? [
                        {
                          name: "Text Colour",
                          color_code: (config[constants.id] || {})[
                            "footer_text"
                          ],
                        },
                      ]
                    : []),
                ]}
                columns={[
                  {
                    title: "Colour",
                    dataIndex: "color_code",
                    render: (value) => {
                      return (
                        <div
                          style={{
                            height: 48,
                            width: 64,
                            backgroundColor: value,
                            borderRadius: 10,
                            border: "1px solid #E4E4E4",
                          }}
                        />
                      );
                    },
                  },
                  {
                    title: "Name",
                    dataIndex: "name",
                  },
                  {
                    title: "Code",
                    dataIndex: "color_code",
                  },
                ]}
              />
            </Card>
          </Col>
        </Row>
      </Space>
      {form_component}
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
};

export default FooterForm;

import React, { useState, useEffect } from "react";
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
  Dropdown,
  notification,
  Checkbox,
  Select,
} from "antd";
import { EditOutlined, EllipsisOutlined } from "@ant-design/icons";
import { domainService } from "../../../redux/action/storefrontAction";
import {
  orgProfileService,
  configurationService,
} from "../../../redux/action/storefrontAction";
import { forms } from "../Settings";
import filterService from "../../../services/filter-service";
import { getPaymentGatewayList } from "../../../redux/action/razorpayServices";

export default function Domain() {
  const domain_config = {
    default_domain: "mystore.digital",
    subdomain_regex: /^[a-zA-Z0-9-]$/,
  };
  const [config, setConfig] = useState({
    product_setting: {},
  });
  const [formData, setFormData] = useState();
  const [formRef, setFormRef] = Form.useForm();
  const [form, setForm] = useState({});
  const [custom, setCustom] = useState(false);
  const [info, setInfo] = useState("");
  const [isRazorpayLinked, setIsRazorpayLinked] = useState(false);

  const paymentOptions = [
    ...(isRazorpayLinked
      ? [
          {
            label: "Payment Mandatory",
            value: "SHOW_AND_MANDATORY",
          },
          { label: "Payment Optional", value: "SHOW" },
        ]
      : []),
    { label: "No Payment", value: "DONT_SHOW" },
  ];

  const paymentOptionsMsg = {
    SHOW_AND_MANDATORY:
      "Payment is Mandatory. Customers have to Pay Online for placing Order.",
    SHOW: "Customer can Pay as per their Payment terms or can Pay Online too.",
    DONT_SHOW:
      "There will be no Option to Pay Online. Customer can place order without Payment",
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
    fetchConfiguration();
  };

  const fetchConfiguration = async () => {
    const { data } = await configurationService.fetch();
    if (data) {
      setConfig({
        ...data,
        product_setting: data["product_setting"] || {},
      });
    }
  };

  const fetchProfile = async () => {
    const { data } = await orgProfileService.fetch();
    if (data) {
      let { domain } = data;
      setForm({ domain });
    }
  };

  const updateDomain = async (obj) => {
    const response = await domainService.update(obj);
    if (response) {
      const { data, message } = response;
      if (data) {
        notification.success({ message });
      } else if (message) {
        notification.error({ message });
      }
      setFormData(false);
    }
    fetchProfile();
  };

  const checkDomain = async (str) => {
    const data = await domainService.test(str);
    if (data["data"] && data["message"]) {
      setInfo(
        <div
          style={{
            fontSize: 12,
            color: data["data"]["is_exists"] ? "#bb2124" : "#22bb33",
          }}
        >
          {data["message"]}
        </div>
      );
    }
  };

  const formatDomain = (obj) => {
    let str = obj["domain"];
    if (!custom) {
      str = [
        obj["name"],
        obj["domain"] || domain_config["default_domain"],
      ].join(".");
    }
    return str;
  };

  const isRazorpayAccountLinked = async () => {
    const res = await getPaymentGatewayList();
    if (res && res.status === 200) {
      const flag = res?.data?.data?.[0]?.is_active ?? false;
      setIsRazorpayLinked(flag);
    }
  };

  useEffect(() => {
    if (formData) {
      if (formData["subdomain"]) {
        setCustom(false);
      }
      // else if (!formData['name']) {
      //   setCustom(true);
      // }
      else setCustom(false);
    }
    setInfo("");
  }, [formData]);

  useEffect(() => {
    fetchProfile();
    fetchConfiguration();
    isRazorpayAccountLinked();
  }, []);

  return (
    <>
      <div style={{ display: "flex", gap: "1.5em" }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "1.5em",
          }}
        >
          {!!Object.keys(config["product_setting"]).length && (
            <Card className="card-layout" style={{ width: "100%" }}>
              <Col>
                <div
                  style={{
                    ...styles.subheading,
                    marginLeft: -12,
                  }}
                >
                  General
                </div>
              </Col>
              <br />
              <Space
                direction="vertical"
                size={"middle"}
                style={{ width: "100%" }}
              >
                <div style={styles.flex_col}>
                  Website Access
                  <Select
                    style={{ width: "100%" }}
                    defaultValue={config["product_setting"]["website_access"]}
                    options={[
                      { label: "Everyone", value: "PUBLIC" },
                      {
                        label: "Only My customers",
                        value: "ONLY_MY_CUSTOMERS",
                      },
                    ]}
                    onChange={async (accessType) => {
                      const obj = { ...config };
                      obj["product_setting"]["website_access"] = accessType;
                      // updateConfiguration(obj["product_setting"]);
                      updateConfiguration({
                        product_setting: {
                          website_access:
                            obj["product_setting"]["website_access"],
                        },
                      });
                    }}
                  />
                </div>

                <div style={styles.flex_col}>
                  Lead Form
                  <Select
                    style={{ width: "100%" }}
                    defaultValue={config["lead_settings"]}
                    options={[
                      { label: "Show", value: "SHOW" },
                      { label: "Don't Show", value: "DONT_SHOW" },
                      {
                        label: "Show and Mandatory",
                        value: "SHOW_AND_MANDATORY",
                      },
                    ]}
                    onChange={async (accessType) => {
                      const obj = { ...config };
                      obj["lead_settings"] = accessType;
                      updateConfiguration({
                        lead_settings: obj["lead_settings"],
                      });
                    }}
                  />
                </div>

                <div style={styles.flex_col}>
                  Sign up Form
                  <Select
                    style={{ width: "100%" }}
                    defaultValue={config["enable_customers_signup"]}
                    options={[
                      { label: "Show", value: true },
                      { label: "Don't Show", value: false },
                    ]}
                    onChange={async (accessType) => {
                      const obj = { ...config };
                      obj["enable_customers_signup"] = accessType;
                      updateConfiguration({
                        enable_customers_signup: obj["enable_customers_signup"],
                      });
                    }}
                  />
                </div>

                <div style={styles.flex_col}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>Payment Options</span>
                    <span
                      style={{
                        color: "#322E80",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        filterService.setFilters({
                          tab: "payment-gateway",
                          page: "",
                        })
                      }
                    >
                      {!isRazorpayLinked && "Link"} Payment Gateway
                    </span>
                  </div>
                  <Select
                    style={{ width: "100%" }}
                    options={paymentOptions}
                    value={
                      paymentOptions?.length > 1
                        ? config["payment_settings"]
                        : "DONT_SHOW"
                    }
                    onChange={async (accessType) => {
                      const obj = { ...config };
                      obj["payment_settings"] = accessType;
                      updateConfiguration({
                        payment_settings: obj["payment_settings"],
                      });
                    }}
                    disabled={paymentOptions.length === 1}
                  />
                  <span style={{ color: "#727176", fontWeight: 500 }}>
                    {paymentOptions?.length > 1
                      ? paymentOptionsMsg[config?.payment_settings]
                      : paymentOptionsMsg["DONT_SHOW"]}
                  </span>
                </div>
              </Space>
            </Card>
          )}

          <Card className="card-layout">
            <Row justify={"space-between"}>
              <Col>
                <div style={styles.subheading}>Domain</div>
              </Col>
              {!form["domain"] && (
                <Col>
                  <Button
                    type="primary"
                    style={{ float: "right" }}
                    onClick={() => {
                      setFormData({
                        name: "",
                        domain: domain_config["default_domain"],
                        subdomain: true,
                      });
                    }}
                  >
                    Add Domain
                  </Button>
                </Col>
              )}
            </Row>
            <br />
            <Table
              pagination={false}
              dataSource={form["domain"] ? [{ domain: form["domain"] }] : []}
              columns={[
                {
                  title: "Domain",
                  dataIndex: "domain",
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
                                    let obj = a["domain"].split(".");
                                    if (obj.length === 3) {
                                      setFormData({
                                        name: obj[0],
                                        domain: `${obj[1]}.${obj[2]}`,
                                      });
                                    } else setFormData(a);
                                  }}
                                >
                                  Edit
                                </a>
                              ),
                            },
                            /*
                                                  {
                                                      key: 'delete',
                                                      label: (
                                                        <a target="_blank"
                                                          onClick={()=>{
                                                          }}>
                                                          Delete
                                                        </a>
                                                      ),
                                                  },
                                                  */
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
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "1.5em",
            justifyContent: "space-between",
          }}
        >
          {!!Object.keys(config["product_setting"]).length && (
            <Card className="card-layout">
              <Row>
                <Col flex={1}>
                  <div style={{ ...styles.subheading }}>Product Setting</div>
                </Col>
              </Row>
              <br />
              <Space direction="vertical" style={{ width: "100%" }}>
                {[
                  { label: "Buyer Price", name: "buyers_price" },
                  { label: "MRP", name: "mrp" },
                ].map((obj, i) => (
                  <Row gutter={16}>
                    <Col>
                      <Checkbox
                        defaultChecked={config["product_setting"][obj["name"]]}
                        onChange={async (e) => {
                          const conf = { ...config };
                          conf["product_setting"][obj["name"]] =
                            e.target.checked;
                          updateConfiguration({
                            product_setting: {
                              [obj["name"]]:
                                conf["product_setting"][obj["name"]],
                            },
                          });
                        }}
                      />
                    </Col>
                    <Col flex={1} style={{ paddingTop: 4 }}>
                      {obj["label"]}
                    </Col>
                  </Row>
                ))}
              </Space>
            </Card>
          )}

          <Card className="card-layout">
            <Row justify={"space-between"}>
              <Col>
                <div style={styles.subheading}>Font Type</div>
              </Col>
            </Row>
            <br />
            <Table
              pagination={false}
              dataSource={[{ font: config["font"] || "Poppins" }]}
              columns={[
                {
                  title: "Name",
                  dataIndex: "font",
                },
                {
                  title: "Action",
                  render: (a) => (
                    <EditOutlined
                      onClick={() => {
                        setForm(forms[1]);
                      }}
                    />
                  ),
                },
              ]}
            />
          </Card>

          <Card className="card-layout">
            <Row justify={"space-between"}>
              <Col>
                <div style={styles.subheading}>Colours</div>
              </Col>
              <Col>
                <button
                  className="button_secondary"
                  style={{ float: "right" }}
                  onClick={() => setForm(forms[0])}
                >
                  Edit
                </button>
              </Col>
            </Row>
            <br />
            <Table
              pagination={false}
              dataSource={[
                ...(config["secondary_color"]
                  ? [
                      {
                        name: "Primary",
                        color_code: config["primary_color"],
                      },
                    ]
                  : []),
                ...(config["secondary_color"]
                  ? [
                      {
                        name: "Secondary",
                        color_code: config["secondary_color"],
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
        </div>
      </div>

      {formData && (
        <Modal
          className="modal-layout"
          open={form}
          onCancel={() => setFormData(false)}
          onOk={formRef.submit}
          title={<div style={{ textAlign: "center" }}>{"Update Domain"}</div>}
          //footer={null}
          okText="Save"
        >
          <br />
          <p
            style={{
              fontSize: 11,
              fontWeight: "600",
              color: "#bb2124",
            }}
          >
            Domain/Sub-Domain Configuration Will Take Upto 1 Hour to Get
            Reflected.
          </p>
          <Form
            form={formRef}
            size="small"
            layout="vertical"
            initialValues={formData}
            onFinish={(obj) => {
              let str = formatDomain(obj);
              updateDomain({ domain: str });
            }}
            onValuesChange={(x, i) => {
              setTimeout(() => {
                let str = formatDomain(i);
                if (i["domain"]) {
                  if (custom) checkDomain(str);
                  else if (i["name"]) checkDomain(str);
                  else if (info) setInfo("");
                } else if (info) setInfo("");
              }, 500);
            }}
          >
            <Row>
              {custom ? (
                <Form.Item
                  //label="Domain"
                  name={"domain"}
                >
                  <Input
                    size="middle"
                    placeholder={domain_config["default_domain"]}
                    defaultValue={domain_config["default_domain"]}
                  />
                </Form.Item>
              ) : (
                <>
                  <Form.Item
                    //label="Name"
                    name={"name"}
                    defaultValue=""
                  >
                    <Input
                      size="middle"
                      placeholder="subdomain"
                      style={{
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                      }}
                      onKeyDownCapture={(e) => {
                        if (domain_config["subdomain_regex"].test(e.key)) {
                        } else if (e.key === "Backspace") {
                        } else e.preventDefault();
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    //label="Domain"
                    name={"domain"}
                  >
                    <Input
                      size="middle"
                      style={{
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                      }}
                      placeholder={domain_config["default_domain"]}
                      defaultValue={domain_config["default_domain"]}
                      disabled={true}
                    />
                  </Form.Item>
                </>
              )}
            </Row>
            <div
              style={{
                height: 18,
                position: "relative",
                top: -18,
                marginBottom: -10,
              }}
            >
              {info}
            </div>
            {/*
                <Checkbox 
                  checked={custom}
                  onChange={(e)=>{
                    setCustom(e.target.checked);
                  }}>
                  Add Custom Domain
                </Checkbox>
                */}
          </Form>
          <br />
        </Modal>
      )}

      {(form?.name === "color" || form?.name === "font") && (
        <form.component
          values={config}
          onFinish={updateConfiguration}
          onClose={() => setForm({})}
        />
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
  flex_col: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5em",
  },
};

import React, { useEffect, useState } from "react";
import { ArrowLeft } from "../../assets/globle";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox, Col, Form, Input, Row } from "antd";
import FormInput from "../../components/form-elements/formInput";
import StateSelectSearch from "../../components/selectSearch/stateSelectSearch";
import { getDetailsFromPincode } from "../../redux/action/pincodeAutoFill";
import styles from "./address.module.css";
import {
  addressDetail as addressDetailAPI,
  updateAddress,
} from "../../redux/action/checkoutAction";
import { useDispatch, useSelector } from "react-redux";

const AddAddress = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { addressDetail } = useSelector((state) => state);

  const queryParameters = new URLSearchParams(window.location.search);
  const id = queryParameters.get("id");
  const customer = queryParameters.get("customer");

  const [addressType, setAddressType] = useState("Warehouse");
  const [isLoading, setIsLoading] = useState(false);

  const fetchDetailsFromPincode = async (pincode) => {
    const res = await getDetailsFromPincode(pincode);
    if (res) {
      form.setFieldsValue(res);
    }
  };

  const handleSubmit = async (value) => {
    Object.assign(value, {
      name: addressType !== "Other" ? addressType : value.name,
    });
    value = id ? { ...value, id } : value;

    const response = await updateAddress(customer, value);
    if (response && response.status === 200) {
      setIsLoading(false);
      form.resetFields();
      navigate(-1);
    } else setIsLoading(false);
    return;
  };

  useEffect(() => {
    id && dispatch(addressDetailAPI(customer, id));
  }, []);

  useEffect(() => {
    if (addressDetail.data && !addressDetail.data.data.error) {
      form.setFieldsValue(addressDetail.data.data.data);
      setAddressType(getTheAddressType(addressDetail.data.data.data.name));
    }
  }, [addressDetail]);

  return (
    <div style={{ fontFamily: "Poppins" }}>
      <h4
        className="page_title"
        style={{
          display: "flex",
          alignContent: "center",
          fontSize: 20,
          gap: 10,
        }}
      >
        <img
          src={ArrowLeft}
          alt="arrow"
          onClick={() => navigate(-1)}
          style={{ cursor: "pointer" }}
        />
        {id ? "Update" : "Add"} Address
      </h4>
      <div className={styles.form_container}>
        <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 10 }}>
          Business Details
        </div>
        <Form
          form={form}
          colon={false}
          layout="vertical"
          onFinish={handleSubmit}
          scrollToFirstError={true}
          initialValues={{ address_line_2: "" }}
          requiredMark={(label, info) => (
            <div>
              {label} {info.required && <span style={{ color: "red" }}>*</span>}
            </div>
          )}
          validateMessages={{
            required: "${label} is required.",
          }}
        >
          <div>
            <label>
              Address Type <span style={{ color: "red" }}>*</span>
            </label>
            <div className={styles.button_group}>
              {["Warehouse", "Godown", "Other"].map((data, index) => (
                <span
                  key={index}
                  className={data === addressType ? styles.active : ""}
                  onClick={() => setAddressType(data)}
                >
                  {data}
                </span>
              ))}
              {addressType === "Other" && (
                <Form.Item label="" name="name">
                  <Input
                    placeholder="Enter Address Type"
                    style={{ width: "200px" }}
                  />
                </Form.Item>
              )}
            </div>
            <Form.Item
              label="Enter Name, Number, Area, Landmark"
              name="address_line_1"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter the Address" />
            </Form.Item>
            <Form.Item
              label="Pincode"
              name="pincode"
              rules={[
                { required: true },
                {
                  validator: (_, v) => {
                    if (v?.length === 6) return Promise.resolve();
                    return Promise.reject();
                  },
                },
              ]}
            >
              <FormInput
                type="num"
                params={{
                  placeholder: "Enter the Pincode",
                  maxLength: 6,
                }}
                formatter={(v) => {
                  if (v.length === 6) {
                    fetchDetailsFromPincode(v);
                  }
                  return v;
                }}
              />
            </Form.Item>
            <div className={styles.pincode_subline}>
              (Enter Pincode to auto fill city & state)
            </div>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="City"
                  name="city"
                  rules={[{ required: true }]}
                >
                  <FormInput
                    type="city"
                    params={{
                      placeholder: "Enter City",
                      maxLength: 30,
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="State"
                  name="state"
                  rules={[{ required: true }]}
                >
                  <StateSelectSearch />
                </Form.Item>
              </Col>
            </Row>
            <div style={{ display: "flex", gap: "1em", height: 30 }}>
              <Form.Item name="is_default" valuePropName="checked">
                <Checkbox name="is_default" />
              </Form.Item>
              <p style={{ margin: 0, paddingTop: 4 }}>
                Make this Primary Address
              </p>
            </div>
          </div>
        </Form>
      </div>
      <div className={styles.footer_container}>
        <Button className="button_secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
        <Button
          className="button_primary"
          onClick={() => form.submit()}
          loading={isLoading}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default AddAddress;

const getTheAddressType = (addressType) => {
  return ["Warehouse", "Godown"].includes(addressType) ? addressType : "Other";
};

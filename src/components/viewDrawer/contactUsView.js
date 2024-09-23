import React, { useContext, useEffect } from "react";
import { Button, Drawer, Form, Input } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import Context from "../../context/Context";
import { contactUs } from "../../redux/action/authAction";

const { TextArea } = Input;

const ContactUsView = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const context = useContext(Context);
  const { contactUsViewOpen, setContactUsViewOpen } = context;

  const onClose = () => {
    setContactUsViewOpen(false);
  };

  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };

  const onFinish = (values) => {
    if (values.name !== "") {
      const apiData = {
        name: values.name,
        email: values.email,
        mobile: values.mobile,
        message: values.message,
      };
      dispatch(contactUs(apiData));
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    if (state.contactUs.data !== "") {
      if (state.contactUs.data.data.error === false) {
        onClose();
      }
    }
  }, [state]);

  return (
    <div>
      <>
        <Drawer
          title={
            <div style={{ display: "flex", alignItems: "center" }}>
              <CloseOutlined onClick={onClose} />
              &nbsp;&nbsp;&nbsp; <div style={style.heading}>Contact Us</div>
            </div>
          }
          width={520}
          closable={false}
          onClose={onClose}
          open={contactUsViewOpen}
          style={{ overflowY: "auto" }}
        >
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            validateMessages={validateMessages}
          >
            <Form.Item
              style={{ fontWeight: "600" }}
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              style={{ fontWeight: "600" }}
              label="E-Mail"
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please input your email!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              style={{ fontWeight: "600" }}
              label="Mobile"
              name="mobile"
              rules={[
                {
                  required: true,
                  message: "Please input your mobile!",
                  min: 10,
                  max: 10,
                },
              ]}
            >
              <Input type="mobile" />
            </Form.Item>
            <Form.Item
              label="Message"
              style={{ fontWeight: "600" }}
              name="message"
              rules={[
                { required: true, message: "Please input your message!" },
              ]}
            >
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Drawer>
      </>
    </div>
  );
};

export default ContactUsView;

const style = {
  heading: { fontSize: "25px", fontWeight: "600" },
  lable: { lineHeight: "40px", fontSize: 15, fontWeight: "600" },
  button: { width: "100%", marginTop: 30 },
};

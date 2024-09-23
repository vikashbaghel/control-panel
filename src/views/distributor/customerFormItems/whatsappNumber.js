import { Form, Input, message, notification } from "antd";
import React, { useEffect, useState } from "react";
import FormInput from "../../../components/form-elements/formInput";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { customerNumberValidator } from "../../../redux/action/customerAction";

const states = {
  currentValue: "",
  errorMessage: "",
};

const WhatsappNumber = ({ form, formInput }) => {
  let { prev_mobile } = formInput;
  const [status, setStatus] = useState("");

  const icons = {
    success: <CheckCircleOutlined style={{ color: "green" }} />,
    error: <CloseCircleOutlined style={{ color: "red" }} />,
    loader: <LoadingOutlined />,
  };

  const validateWhatsappNumber = (_, value) => {
    if (!value) {
      return Promise.reject({
        message: "Whatsapp Number is required",
      });
    } else if (value.length < 10) {
      return Promise.reject({
        message: "Whatsapp Number is Invalid",
      });
    } else if (status === "error") {
      return Promise.reject({
        message: states.errorMessage,
      });
    } else if (
      status === "success" ||
      [prev_mobile, states.currentValue].includes(value)
    ) {
      return Promise.resolve();
    }
  };

  const validateNumber = (num) => {
    states.errorMessage = "";
    setStatus("");
    if (num.length === 10) {
      if (prev_mobile && prev_mobile === num) return setStatus("");
      setStatus("loader");
      customerNumberValidator(num).then((res) => {
        if (res.error || res.data.is_used) {
          states.errorMessage = res.message || "";
          setStatus("error");
          notification.error({ message: res.message || "" });
        } else {
          setStatus("success");
        }
      });
    }
  };

  useEffect(() => {
    if (status) {
      form.validateFields(["mobile"]);
      if (status === "success") {
        states.currentValue = `${form.getFieldValue("mobile") || ""}`;
      }
    }
  }, [status]);

  return (
    <div
      key={`update-${form.getFieldValue("whatsapp_mobile")}`}
      className="customer_whatsapp_number"
    >
      <Form.Item
        label="Whatsapp Number"
        name={"mobile"}
        required
        rules={[
          {
            validator: validateWhatsappNumber,
          },
        ]}
      >
        <FormInput
          type="num"
          params={{
            maxLength: 10,
            placeholder: "Whatsapp Number",
            status: status,
            suffix: icons[status] || <></>,
            style: { height: 45, padding: "5px !important", borderWidth: 2 },
          }}
          onChange={(e) => validateNumber(e)}
        />
      </Form.Item>
    </div>
  );
};

export default WhatsappNumber;

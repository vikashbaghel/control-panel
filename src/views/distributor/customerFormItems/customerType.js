import { Form } from "antd";
import React from "react";
import SelectCustomerType from "../form/selectCustomerType";

const CustomerType = ({ field_props }) => {
  return (
    <Form.Item
      {...field_props}
      {...(field_props.required && {
        rules: [
          {
            validator: (_, v) => {
              if (!v) return Promise.reject(new Error("${label} is required"));
              return Promise.resolve();
            },
          },
        ],
      })}
    >
      <SelectCustomerType />
    </Form.Item>
  );
};

export default CustomerType;

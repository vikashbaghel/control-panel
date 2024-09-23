import { Form, Select } from "antd";
import { Option } from "antd/es/mentions";
import { paymentOptionList } from "../../../generic/list/paymentOptionList";

const PaymentTerm = ({ field_props }) => {
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
      <Select placeholder="Select Payment Terms">
        {paymentOptionList?.map((ele) => (
          <Option key={ele.value} value={ele.value}>
            {ele.label}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export default PaymentTerm;

import { Form } from "antd";
import { SelectPricingGroup } from "../form/selectCustomerType";

const PricingGroup = ({ field_props }) => {
  return (
    <Form.Item
      {...field_props}
      {...(field_props.required && {
        rules: [
          {
            validator: (_, v) => {
              if (v?.id) return Promise.resolve();
              return Promise.reject(new Error("${label} is required"));
            },
          },
        ],
      })}
    >
      <SelectPricingGroup />
    </Form.Item>
  );
};

export default PricingGroup;

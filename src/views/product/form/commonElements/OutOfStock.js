import { Checkbox, Form } from "antd";

export default function OutOfStock() {
  return (
    <Form.Item label="" name="is_out_of_stock" valuePropName="checked">
      <Checkbox>
        <span style={{ color: "#000", fontFamily: "Poppins" }}>
          Mark Out of Stock
        </span>
      </Checkbox>
    </Form.Item>
  );
}

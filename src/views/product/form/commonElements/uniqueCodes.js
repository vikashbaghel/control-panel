import { Form, Input } from "antd";

export function HsnCode() {
  return (
    <Form.Item label="HSN Code" name="hsn_code" rules={[{ required: true }]}>
      <Input placeholder="Enter HSN Code" data-testid="HSN-Code" />
    </Form.Item>
  );
}

export function ProductCode({ label }) {
  return (
    <Form.Item
      label={label || "Product Code"}
      name="code"
      rules={[{ required: true }]}
    >
      <Input placeholder="Enter Product Code" data-testid="Product-Code" />
    </Form.Item>
  );
}

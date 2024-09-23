import { Form } from "antd";
import FormInput from "../../../components/form-elements/formInput";

const BusinessName = () => {
  return (
    <Form.Item label="Business Name" name="name" rules={[{ required: true }]}>
      <FormInput
        type="businessName"
        params={{
          maxLength: 150,
          placeholder: "Enter Business Name",
          id: "name",
        }}
      />
    </Form.Item>
  );
};

export default BusinessName;

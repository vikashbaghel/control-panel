import { Form } from "antd";
import FormInput from "../../../components/form-elements/formInput";

const ContactPerson = () => {
  return (
    <Form.Item
      label="Name"
      name="contact_person_name"
      required
      rules={[
        { required: true },
        {
          validator: (_, v) => {
            if (v?.length > 0 && v[0] === " ")
              return Promise.reject(new Error("Contact Person is required."));
            return Promise.resolve();
          },
        },
      ]}
    >
      <FormInput
        type="alpha"
        params={{ placeholder: "Enter Name", id: "contact_person_name" }}
      />
    </Form.Item>
  );
};

export default ContactPerson;

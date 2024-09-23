import { Form } from "antd";
import FormInput from "../../../components/form-elements/formInput";
import { getDetailsFromPincode } from "../../../redux/action/pincodeAutoFill";

const Pincode = ({ form, field_props }) => {
  const fetchDetailsFromPincode = async (pincode) => {
    const res = await getDetailsFromPincode(pincode);
    if (res) {
      form.setFieldsValue(res);
    }
  };

  return (
    <Form.Item
      {...field_props}
      {...(field_props.required && {
        rules: [
          {
            validator: (_, v) => {
              if (!v || v?.length !== 6)
                return Promise.reject(new Error("${label} is required"));
              return Promise.resolve();
            },
          },
        ],
      })}
    >
      <FormInput
        type="num"
        params={{
          id: field_props.name,
          placeholder: "Enter Pincode",
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
  );
};

export default Pincode;

import { Form } from "antd";
import React from "react";
import FormInput from "../../../components/form-elements/formInput";
import { gstAction } from "../../../redux/action/gstAction";
import { useDispatch } from "react-redux";

const GSTField = ({ field_props }) => {
  const dispatch = useDispatch();

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
      <FormInput
        params={{
          id: field_props.name,
          maxLength: 15,
          placeholder: "Enter GST No",
        }}
        formatter={(v) => {
          if (v.length === 15) {
            dispatch(gstAction(v));
          }
          return v.toUpperCase();
        }}
      />
    </Form.Item>
  );
};

export default GSTField;

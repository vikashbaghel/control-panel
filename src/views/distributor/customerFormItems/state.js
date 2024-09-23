import { Form } from "antd";
import React from "react";
import StateSelectSearch from "../../../components/selectSearch/stateSelectSearch";

const State = () => {
  return (
    <Form.Item
      label="State"
      name="state"
      required
      rules={[
        {
          validator: (_, value) => {
            if (value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error("State is required"));
          },
        },
      ]}
    >
      <StateSelectSearch />
    </Form.Item>
  );
};

export default State;

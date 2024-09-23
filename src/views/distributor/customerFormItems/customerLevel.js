import React, { useEffect, useState } from "react";
import { Form, Select } from "antd";
import Cookies from "universal-cookie";
import { getParentLevel } from "../../../components/viewDrawer/distributor-details/customerDetailCard";
import AssignModule from "../../../components/assignModule";

const CustomerLevelFormItems = ({ form, setFormInput, formInput }) => {
  const cookies = new Cookies();
  const customerLevelList = cookies.get("rupyzCustomerLevelConfig");

  const queryParameters = new URLSearchParams(window.location.search);
  const customerId = queryParameters.get("id") || 0;

  const [customerLevel, setCustomerLevel] = useState("LEVEL-1");
  const customerParentAPI = `/customer/${customerId}/mapping/parents/?customer_level=${customerLevel}`;

  useEffect(() => {
    setCustomerLevel(form.getFieldValue("customer_level"));
  }, [form.getFieldValue("customer_level")]);

  return (
    <>
      <Form.Item
        label="Customer Level"
        name="customer_level"
        rules={[{ required: true }]}
      >
        <Select onChange={(v) => setCustomerLevel(v)}>
          {Object.keys(customerLevelList || {}).map((ele) => (
            <Select.Option value={ele} key={ele}>
              {customerLevelList[ele]}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      {customerLevel !== "LEVEL-1" && (
        <Form.Item
          label={`Map ${
            customerLevelList[getParentLevel({ customer_level: customerLevel })]
          }`}
          name="select_parents"
          rules={[
            { required: true, message: "" },
            {
              validator: (_, v) => {
                if (
                  v &&
                  (v?.add_set?.length ||
                    (customerId &&
                      ((formInput?.parents_count && !v?.remove_set?.length) ||
                        formInput?.parents_count - v?.remove_set?.length > 0)))
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("${label} is required"));
              },
            },
          ]}
        >
          <AssignModule
            key={`select--${customerLevel}`}
            title={
              customerLevelList[
                getParentLevel({ customer_level: customerLevel })
              ]
            }
            api={customerParentAPI}
            assignAllOption={false}
            sortBy="selection"
            {...(!customerId && {
              returnItemDetails: (v) => {
                setFormInput({ ...formInput, selected_parents_preview: v });
              },
            })}
            returnItemDetails={(list) =>
              setFormInput((prev) => ({ ...prev, "Parent Name": list }))
            }
          />
        </Form.Item>
      )}
    </>
  );
};

export default CustomerLevelFormItems;

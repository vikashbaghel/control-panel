import { Select } from "antd";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function SelectUnit({ onChange, value, params = {} }) {
  const { Option } = Select;
  const state = useSelector((state) => state);
  const { productUnit } = state;

  const [unitsList, setUnitsList] = useState([]);

  useEffect(() => {
    if (productUnit.data !== "" && !productUnit.data.data.error) {
      setUnitsList(productUnit.data.data.data);
    }
  }, [state]);

  return (
    <Select
      onChange={(v) => {
        onChange(v);
      }}
      value={value || undefined}
      style={{ width: "100%" }}
      placeholder="Select a unit"
      variant="borderless"
      // showSearch={true}
      {...(params || {})}
    >
      {unitsList?.map((ele) => (
        <Option key={ele.id} value={ele.name}>
          {ele.name}
        </Option>
      ))}
    </Select>
  );
}

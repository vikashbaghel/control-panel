import React, { useState } from "react";
import { Button, Form, Input, Select } from "antd";
const { Option } = Select;

function ShowHideSelect() {
  const [visible, setVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [baseAmountValue, setBaseAmountValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [targetAmountValue, setTargetAmountValue] = useState("");

  const handleButtonClick = () => {
    setVisible(!visible);
  };

  const handleSelectChange = (value) => {
    setSearchValue([...searchValue, value]);
  };

  return (
    <>
      <div>
        <Button onClick={handleButtonClick}> + Add Product Pricing</Button>
        {visible && (
          <div style={{ marginTop: "30px" }}>
            <Select
              showSearch
              style={{ width: 440 }}
              placeholder="Select product"
              optionFilterProp="children"
              onChange={handleSelectChange}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {product.map((option) => (
                <Option
                  key={option.value}
                  onClick={(e) => {
                    setBaseAmountValue(option.amount);
                    setNameValue(option.name);
                  }}
                  value={option.name}
                >
                  {option.name}
                </Option>
              ))}
            </Select>
          </div>
        )}
      </div>

      {searchValue && (
        <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
          <div style={style.list_item}>
            <Input
              style={{ margin: 5 }}
              name="name"
              defaultValue={searchValue}
              //   onChange={handleChange}
            />
          </div>
          <div style={style.list_item}>
            <Input
              style={style.input}
              placeholder="Enter discount value"
              name="amount"
              value={searchValue.amount}
              //   onChange={handleChange}
              type="number"
            />
          </div>
          <Button
            type="primary"
            style={{ float: "right", margin: 5 }}
            // onClick={handleSubmit}
          >
            Add
          </Button>
        </div>
      )}
    </>
  );
}

export default ShowHideSelect;

const product = [
  {
    id: 12,
    name: "Mobile",
    amount: "300",
  },
  {
    id: 13,
    name: "Bike",
    amount: "300",
  },
  {
    id: 14,
    name: "Car",
    amount: "300",
  },
  {
    iid: 15,
    name: "Mouse",
    amount: "300",
  },
  {
    id: 16,
    name: "Keyboard",
    amount: "300",
  },
  {
    id: 17,
    name: "Laptop",
    amount: "300",
  },
];

const style = {
  list_item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    margin: 5,
    width: "50%",
  },
  list_item_total: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 17,
    fontWeight: 600,
  },
};

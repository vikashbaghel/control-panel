import React, { useState, useContext } from "react";
import { Checkbox, Divider, Tooltip } from "antd";
import Context from "../../context/Context";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const CheckboxList = ({ checkboxValues }) => {
  const context = useContext(Context);
  const { selectAllColumn, setSelectAllColumn } = context;
  const [checkAll, setCheckAll] = useState(false);

  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      setSelectAllColumn((prev) => [...prev, event.target.value]);
      return;
    }
    let tempSelectedList = selectAllColumn.filter(
      (item) => item !== event.target.value
    );
    setSelectAllColumn(tempSelectedList);
  };

  const handleSelectAllChange = (event) => {
    const checked = event.target.checked;
    setSelectAllColumn(checked ? checkboxValues.map((data) => data.name) : []);
    setCheckAll(checked);
  };

  return (
    <div>
      <div
        style={{
          fontWeight: "600",
          marginBottom: "10px",
          marginTop: "25px",
        }}
      >
        <label>Select Columns(Specific Columns in Report)</label>
        <div style={{ color: "rgb(187 187 187)", fontSize: 12 }}>
          Please Select Upto 15 Columns for better PDF report.
        </div>
      </div>
      <div style={style.category}>
        <div
          style={{
            padding: "10px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Checkbox
            checked={checkAll}
            onChange={handleSelectAllChange}
            style={{ fontWeight: "500", color: "#1677ff" }}
          >
            Select All
          </Checkbox>
          <label
            style={{
              color: "red",
              fontSize: "12px",
              marginTop: "10px",
              fontWeight: "600",
            }}
          >
            Do not Select Anything, if you want all fields in the Report
          </label>
          <Divider />
        </div>
        <div style={{ height: 300, overflow: "auto" }}>
          {checkboxValues.map((data, index) => {
            return (
              <Checkbox
                key={index}
                value={data.name}
                style={{ width: "250px", marginLeft: "8px", marginBottom: 10 }}
                checked={selectAllColumn.includes(data.name)}
                onChange={handleCheckboxChange}
              >
                <span>{data.name} </span>
                <Tooltip placement="topLeft" title={data.description}>
                  <ExclamationCircleOutlined style={{ color: "#878787" }} />
                </Tooltip>
              </Checkbox>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CheckboxList;

const style = {
  date: {
    display: "flex",
    gap: "40px",
  },
  dateInput: {
    height: "40px",
  },
  category: {
    border: "1px solid #D9D9D9",
    borderRadius: "8px",
  },
};

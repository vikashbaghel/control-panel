import React from "react";
import { stateList } from "../../generic/list/stateList";
import { Select } from "antd";

const StateSelectSearch = ({ onChange, value, params }) => {
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <>
      <Select
        showSearch
        value={value || null}
        placeholder={"Search State"}
        style={{ width: "100%" }}
        allowClear={true}
        defaultActiveFirstOption={false}
        filterOption={filterOption}
        onChange={(data) => {
          onChange && onChange(data);
          document.activeElement.blur();
        }}
        options={stateList.map((d) => ({
          value: d.value,
          label: d.label,
        }))}
        {...params}
      />
      <br />
    </>
  );
};

export default StateSelectSearch;

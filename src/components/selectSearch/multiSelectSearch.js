// https://team-1624359381274.atlassian.net/wiki/x/DAAkCg

import React, { useEffect, useState } from "react";
import { Select } from "antd";
import axios from "axios";
import Cookies from "universal-cookie";
import "./multiSelect.css";
import { ListItemTag } from "../listItemDesign";

const cookies = new Cookies();
const Option = Select;

const MultiSelectSearch = ({
  optionList,
  apiUrl,
  value,
  onChange,
  onUpdate,
  params,
  optionParams = {
    value: "id",
    label: "name",
  },
  defaultOption,
  listItem,
  images = false,
  setInterface,
}) => {
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [data, setData] = useState(optionList || []);
  const [hasMore, setHasMore] = useState(true);

  const [loader, setLoader] = useState();
  const [timer, setTimer] = useState(null);
  const [dataSet, setDataSet] = useState({ add_set: [], remove_set: [] });

  const [listner, setListner] = useState({});

  const handleSearch = (v) => {
    if (optionList) return;
    if (timer) {
      clearTimeout(timer);
    }
    setTimer(
      setTimeout(() => {
        reset();
        setSearch(v);
      }, 600)
    );
  };


  const handleChange = (id, type) => {
    setSearch("");
    let initialSelection = data.filter((ele) => ele.is_selected).map((item) => item.id);
    //handle add_set, remove_set
    if (onUpdate) {
      if (type === "ADD") {
        // on select
        let add_set = dataSet.add_set;
        let remove_set = [];
        let isRemoveSetChange = false;

        if (!initialSelection.includes(id)) {
          add_set = [...new Set([...add_set, id])];
        } else if (dataSet.remove_set.includes(id)) {
          remove_set = dataSet.remove_set.filter((ele) => ele !== id);
          isRemoveSetChange = true;
        }
        setDataSet({
          ...dataSet,
          ...(isRemoveSetChange && { remove_set }),
          add_set,
        });
      } else {
        // on deselect
        let add_set = [];
        let remove_set = dataSet.remove_set;
        let isAddSetChange = false;

        if (initialSelection.includes(id)) {
          remove_set = [...new Set([...remove_set, id])];
        } else if (dataSet.add_set.includes(id)) {
          add_set = dataSet.add_set.filter((ele) => ele !== id);
          isAddSetChange = true;
        }

        setDataSet({
          ...dataSet,
          ...(isAddSetChange && { add_set }),
          remove_set,
        });
      }
      return;
    }
    else {
        //handle select/deselect without add_set, remove_set
        let result = [];
        if (type === "ADD") {
          result = [...value, id];
        } else {
          result = value.filter((opt) => opt !== id);
        }
        if (!defaultOption) return onChange(result);
        if (id === defaultOption.value) {
          onChange([]);
        } else if (
          optionList?.length > 0 &&
          result.length === optionList.length
        ) {
          onChange([]);
        } else onChange(result);
    }

  };

  const fetchData = async (page, search) => {
    setLoader(true);
    const url = apiUrl;
    const headers = { Authorization: cookies.get("rupyzToken") };
    const params = { page_no: page, name: search };
    const newDataTemp = await axios.get(url, { headers, params });
    if (newDataTemp.data.data.length < 30) {
      setHasMore(false);
    } else setHasMore(true);
    setLoader(false);
    return newDataTemp.data.data;
  };

  const handleScrollToBottom = (event) => {
    const target = event.target;
    const isBottom =
      target.scrollHeight < target.scrollTop + target.clientHeight + 50;
    if (isBottom) {
      setPage(page + 1);
    }
  };

  const reset = () => {
    setPage(-1);
    setData([]);
  };

  useEffect(() => {
    if (onUpdate) {
      let tempList = [
        ...dataSet.add_set,
        ...data
          .filter(
            (ele) => ele.is_selected && !dataSet.remove_set.includes(ele.id)
          )
          .map((item) => item.id),
      ];
      onChange([...new Set(tempList.flat())]);
      onUpdate(dataSet);
    }
  }, [data, dataSet]);

  useEffect(() => {
    if (optionList) return;
    if (page === -1) {
      setPage(1);
      setHasMore(true);
    } else {
      fetchData(page, search || "").then((newData) => {
        if (page === 1) {
          setData(newData);
        } else {
          setData(data.concat(newData));
        }
      });
    }
  }, [page, search]);

  useEffect(() => {
    if (listner.callback) {
      listner.callback({ 
        data, 
        page, 
        hasMore, 
        search 
      });
    }
  }, [
      listner,
      data, 
      page, 
      hasMore, 
      search 
    ]);

  useEffect(() => {
    setInterface && setInterface({ reset, setListner });
  }, []);

  return (
    <Select
      showSearch
      mode="multiple"
      maxTagCount="responsive"
      value={value?.length > 0 ? value : defaultOption?.value}
      style={{ width: "100%" }}
      filterOption={false}
      onSearch={handleSearch}
      onSelect={(v) => handleChange(v, "ADD")}
      onDeselect={(v) => handleChange(v, "REMOVE")}
      allowClear={true}
      onClear={() => {
        onChange([]);
        handleSearch("");
      }}
      onPopupScroll={(e) => {
        if (hasMore && !loader) handleScrollToBottom(e);
      }}
      tagRender={images && ((item) => <ListItemTag item={item} />)}
      loading={loader}
      {...params}
      className="multi_select"
    >
      {defaultOption && (
        <Option value={defaultOption.value}>{defaultOption.label}</Option>
      )}
      {(data || []).map((ele, index) => (
        <Option
          key={index}
          value={ele[optionParams.value]}
          style={{ borderBottom: "1px solid #eee" }}
        >
          {listItem ? listItem(ele) : ele[optionParams.label]}
        </Option>
      ))}
    </Select>
  );
};

export default MultiSelectSearch;

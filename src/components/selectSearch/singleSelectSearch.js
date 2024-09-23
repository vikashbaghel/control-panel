// https://team-1624359381274.atlassian.net/wiki/x/DAAkCg

import React, { useEffect, useState } from "react";
import { Select } from "antd";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const SingleSelectSearch = ({
  apiUrl,
  value,
  onChange,
  setInterface,
  params,
  optionFilter = (arr) => arr,
}) => {
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const [loader, setLoader] = useState();
  const [timer, setTimer] = useState(null);
  // Debounces the search input to delay API calls until the user 
  // stops typing for 600ms, reducing the number of API requests.
  const handleSearch = (v) => {
    if (timer) {
      clearTimeout(timer);
    }
    setTimer(
      setTimeout(() => {
        setSearch(v);
        reset();
      }, 600)
    );
  };
  // Updates the selected value and calls the onChange callback with the selected item. Clears the search input and blurs the input field.
  const handleChange = (newValue) => {
    let tempList = data.filter((data) => data.id === newValue);
    onChange(tempList[0]);
    setSearch("");
    document.activeElement.blur();
  };

  const fetchData = async (page, search) => {
    setLoader(true);
    const url = apiUrl;
    const headers = { Authorization: cookies.get("rupyzToken") };
    const params = { page_no: page, name: search };
    const newDataTemp = await axios.get(url, { headers, params });
    if (newDataTemp.data.data.length < 30) {
      setHasMore(false);
    }
    setLoader(false);
    return newDataTemp.data.data;
  };

  const handleScrollToBottom = (event) => {
    const target = event.target;
    const isBottom =
      parseInt(target.scrollHeight - target.scrollTop) === target.clientHeight;
    if (isBottom) {
      hasMore && setPage(page + 1);
    }
  };

  const reset = () => {
    setPage(-1);
    setData([]);
    setHasMore(true);
  };

  useEffect(() => {
    if (page === -1) {
      setPage(1);
    } else {
      fetchData(page, search || "").then((newData) => {
        if (page === 1) {
          setData(newData);
        } else setData(data.concat(newData));
      });
    }
  }, [page, search]);

  useEffect(() => {
    setInterface && setInterface({ reset, data });
  }, [setInterface, data]);

  return (
    <Select
      showSearch
      value={value}
      style={{ width: "100%" }}
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      notFoundContent={null}
      allowClear={true}
      onClear={() => {
        onChange({ name: null, id: "" });
        handleSearch("");
      }}
      options={optionFilter(data || []).map((ele) => ({
        value: ele.id,
        label: ele.name,
      }))}
      onPopupScroll={handleScrollToBottom}
      loading={loader}
      {...params}
    />
  );
};

export default SingleSelectSearch;

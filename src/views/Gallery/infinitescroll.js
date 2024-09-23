import { useEffect, useState } from "react";
import { Checkbox, Col, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { auth_token } from "../../config";
import { Staff } from "../../assets/navbarImages";
import { staticActivityTypes } from "./GalleryFilter";

export default function FilterScroll({
  apiUrl,
  dataList,
  allowSearch = true,
  dataFilter = (arr) => arr,
  selectBy = "id",
  onSelect,
  value = [],
  img = false,
  maxLabelLength = 15,
}) {
  const [data, setData] = useState(dataList || []);
  const [hasMore, setHasMore] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    page: 1,
  });

  const [timer, setTimer] = useState(null);
  const [selections, setSelections] = useState(value || []);

  const fetchData = async (activeFilters) => {
    const { page, name } = activeFilters;

    if (dataList) {
      const filteredData = dataList.filter((item) =>
        item.label.toLowerCase().includes((name || "").toLowerCase())
      );
      return filteredData;
    } else if (apiUrl) {
      const headers = { Authorization: auth_token };
      const params = { page_no: page, name };

      const newDataTemp = await axios.get(apiUrl, { headers, params });
      if (newDataTemp.data.data.length < 30) {
        setHasMore(false);
      }
      return newDataTemp.data.data;
    }
  };

  const handleFilterChange = (e, item) => {
    const isChecked = e.target.checked;
    const v = item[selectBy]?.toString();

    let arr = [...selections];

    if (isChecked) {
      arr = [...arr, v];
    } else {
      arr = arr.filter((id) => id !== v);
    }
    setSelections(arr);
    let dataLength = data.length + staticActivityTypes.length;
    onSelect(arr, !hasMore && arr.length === dataLength);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    if (timer) {
      clearTimeout(timer);
    }
    const handler = () => {
      setHasMore(true);
      setActiveFilters((prev) => {
        return {
          ...prev,
          name: value,
          page: 1,
        };
      });
    };
    if (dataList) {
      handler();
    } else {
      const delayDebounceFn = setTimeout(handler, 700);
      setTimer(delayDebounceFn);
    }
  };

  useEffect(() => {
    fetchData(activeFilters).then((newData) => {
      if (newData) {
        if (activeFilters.page === 1) {
          setData(newData);
        } else setData((prevData) => prevData.concat(newData));
      }
    });
  }, [activeFilters]);

  const trimLabel = (label) => {
    if (label.length > maxLabelLength) {
      return label.substring(0, maxLabelLength) + "...";
    }
    return label;
  };

  return (
    <>
      {allowSearch && (
        <Col>
          <Input
            className="search"
            placeholder="Search"
            onChange={handleSearch}
            suffix={<SearchOutlined />}
          />
        </Col>
      )}
      <InfiniteScroll
        dataLength={data.length}
        next={() => {
          if (apiUrl) {
            setActiveFilters((prev) => {
              return {
                ...prev,
                page: prev.page + 1,
              };
            });
          }
        }}
        hasMore={hasMore}
        height={250}
        loader={
          !dataList?.length && (
            <h4 style={{ textAlign: "center" }}>Loading...</h4>
          )
        }
        scrollableTarget="scrollableDiv"
      >
        <div id="scrollableDiv">
          {dataFilter(data).map((item, index) => (
            <div key={index}>
              <Checkbox
                className="picture-sorting"
                checked={selections.includes(item[selectBy]?.toString())}
                onChange={(e) => handleFilterChange(e, item)}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 15,
                    textOverflow: "ellipsis",
                    overflowWrap: "anywhere",
                  }}
                >
                  {img && (
                    <img
                      src={item.pic_url || Staff}
                      alt="icon"
                      width={25}
                      height={25}
                      style={{ borderRadius: "50%" }}
                    />
                  )}
                  {trimLabel(item.name || item.label)}
                </div>
              </Checkbox>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </>
  );
}

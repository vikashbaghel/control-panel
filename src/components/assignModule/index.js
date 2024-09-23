import axios from "axios";
import WrapText from "../wrapText";
import Cookies from "universal-cookie";
import { Button, Col, Row } from "antd";
import styles from "./assignModule.module.css";
import { BASE_URL_V2, org_id } from "../../config";
import { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { DownOutlined, SearchOutlined } from "@ant-design/icons";

const constants = {
  initialNextParams: { page_no: 1, selected: true },
};

const AssignModule = ({
  api,
  title,
  onChange,
  value,
  sortBy,
  assignAllOption = true,
  returnItemDetails,
}) => {
  const cookies = new Cookies();
  const node = useRef();

  const [searchValue, setSearchValue] = useState("");
  const [openModal, setOpenModal] = useState(false);

  //   state to manage inifnity loop
  const [data, setData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [timer, setTimer] = useState(null);
  const [nextParams, setNextParams] = useState({
    ...constants.initialNextParams,
  });

  //   for infinite loop API calling
  const fetchData = async (page, search) => {
    const url = `${BASE_URL_V2}/organization/${org_id}${api}`;
    const headers = { Authorization: cookies.get("rupyzToken") };

    let params = {};
    if (search) {
      params = { page_no: page, name: search };
    } else if (sortBy === "selection") {
      params = nextParams;
    } else {
      params = { page_no: page };
    }

    const newDataTemp = await axios.get(url, { headers, params });

    const updateParams = nextParams;
    newDataTemp?.data?.headers?.next_params?.split("&")?.forEach((pair) => {
      const [key, value] = pair.split("=");
      if (key) updateParams[key] = value;
    });
    setNextParams(updateParams);

    const data = newDataTemp.data.data;
    if (data.length < 30) {
      if (sortBy === "selection" && newDataTemp.data.headers?.next_params) {
        setPageNo((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
    }
    return data;
  };

  // to add or remove from the list
  const handleCheckedList = (id, index) => {
    const checked = !isChecked(data[index]);

    let arr = [...data];
    arr[index]["is_selected"] = checked;
    setData(arr);

    let valueSet = value;

    if (checked) {
      if (value.remove_set.includes(id)) {
        const filteredList = value.remove_set.filter((ele) => ele !== id);
        valueSet.remove_set = filteredList;
      } else valueSet.add_set = [...valueSet.add_set, id];
    } else {
      if (value.add_set.includes(id)) {
        const filteredList = value.add_set.filter((ele) => ele !== id);
        valueSet.add_set = filteredList;
      } else valueSet.remove_set = [...valueSet.remove_set, id];
    }

    onChange(valueSet);

    if (returnItemDetails) {
      const updatedItems = arr.filter((ele) => ele.is_selected);
      returnItemDetails(updatedItems);
    }
  };

  const isChecked = (item) => {
    let isChecked = value.disallow_all
      ? value.add_set?.includes(item.id)
      : value.allow_all
      ? !value.remove_set?.includes(item.id)
      : (item.is_selected && !value.remove_set.includes(item.id)) ||
        value.add_set.includes(item.id);

    return isChecked;
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    if (timer) {
      clearTimeout(timer);
    }
    const delayDebounceFn = setTimeout(() => {
      setData([]);
      setHasMore(true);
      setPageNo(-1);
      setSearchValue(value);
    }, 700);
    setTimer(delayDebounceFn);
  };

  const handleDomClick = (e) => {
    if (!node.current?.contains(e.target)) {
      setOpenModal(false);
    }
  };

  useEffect(() => {
    if (pageNo === -1) {
      setPageNo(1);
      setNextParams({ ...constants.initialNextParams });
    } else {
      fetchData(pageNo, searchValue).then((newData) => {
        if (pageNo === 1) {
          setData(newData);
        } else {
          setData(data.concat(newData));
        }
      });
    }
  }, [pageNo]);

  useEffect(() => {
    if (openModal) document.addEventListener("click", handleDomClick);
    return () => {
      document.removeEventListener("click", handleDomClick);
    };
  }, [openModal]);

  return (
    <div
      className={`${styles.module_container} assign_module_conatiner`}
      ref={node}
    >
      <div
        className={styles.module_head}
        onClick={() => setOpenModal(!openModal)}
        style={{ color: "#7C7C7C" }}
      >
        {title} <DownOutlined style={{ opacity: 0.3, fontSize: 12 }} />
      </div>
      <div
        className={`${styles.form} assign_form ${
          openModal ? styles.open_module : ""
        }`}
      >
        <Row gutter={10} align={"middle"}>
          <Col flex={1}>
            <div className="search_input_assign">
              <input
                style={{ width: "100%" }}
                placeholder="Search "
                onChange={handleSearch}
              />
              <SearchOutlined />
            </div>
          </Col>
          {assignAllOption && (
            <Col>
              <Button
                style={{ width: 100, borderRadius: 4 }}
                size="large"
                onClick={() => {
                  const isChecked = !(
                    value.allow_all && !value.remove_set.length
                  );
                  onChange({
                    add_set: [],
                    remove_set: [],
                    allow_all: isChecked,
                    disallow_all: !isChecked,
                  });
                }}
              >
                <span style={{ fontSize: 12 }}>
                  {value.allow_all && !value.remove_set.length
                    ? "Remove All"
                    : "Assign All"}
                </span>
              </Button>
            </Col>
          )}
        </Row>
        <InfiniteScroll
          dataLength={data.length}
          next={() => {
            const page = pageNo + 1 || 1;
            setPageNo(page);
          }}
          hasMore={hasMore}
          height={299.8}
          loader={
            hasMore === true ? (
              <h4 style={{ textAlign: "center" }}>Loading...</h4>
            ) : (
              <></>
            )
          }
          scrollableTarget="scrollableDiv"
        >
          <div className={styles.assign_list_main}>
            {data?.map((item, index) => {
              const isSelected = isChecked(item);
              return (
                <div
                  className={styles.assign_list_box}
                  id="scrollableDiv"
                  key={index}
                >
                  <div>
                    <WrapText len={30}>{item.name}</WrapText>
                  </div>
                  <div>
                    <div
                      className={
                        isSelected ? styles.remove_button : styles.assign_button
                      }
                      onClick={() => {
                        handleCheckedList(item.id, index);
                      }}
                    >
                      {isSelected ? "Remove" : "Assign"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default AssignModule;

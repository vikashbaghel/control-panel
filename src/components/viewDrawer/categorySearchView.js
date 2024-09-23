import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useContext } from "react";
import { CloseOutlined, CloseCircleTwoTone } from "@ant-design/icons";
import Context from "../../context/Context";
import { useEffect } from "react";
import { useState } from "react";
import {
  searchLeadAction,
  searchLeadCategoryAction,
} from "../../redux/action/leadManagementAction";
import { Drawer, Input } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import Cookies from "universal-cookie";
import { BASE_URL_V2, org_id } from "../../config";
import styles from "./order.module.css";

const { Search } = Input;

const CategorySearchView = ({ pageCount }) => {
  const context = useContext(Context);
  const {
    categorySearchViewOpen,
    setCategorySearchViewOpen,
    setSearchLeadCategory,
  } = context;
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const cookies = new Cookies();

  const [leadCategoryList, setLeadCategoryList] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [searchLeadCategoryList, setSearchLeadCategoryList] = useState([]);

  const fetchMoreData = () => {
    const url = `${BASE_URL_V2}/organization/${org_id}/leadcategory/?page_no=${pageNo}`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    axios.get(url, { headers }).then((response) => {
      setLeadCategoryList(leadCategoryList.concat(response.data.data));
      setPageNo(pageNo + 1);
      if (response.data.data.length !== 30) {
        setHasMore(false);
      }
    });
  };

  useEffect(() => {
    fetchMoreData();
  }, []);

  const onClose = () => {
    setCategorySearchViewOpen(false);
  };

  const handleClick = (name) => {
    setSearchLeadCategory(name);
    dispatch(searchLeadAction(pageCount, name));
    onClose();
  };
  const onSearch = (e) => {
    if (e.target.value.length < 1) {
      setSearch("");
    }
    if (e.target.value.length > 1) {
      setSearch(e.target.value);
      dispatch(searchLeadCategoryAction(1, e.target.value));
    }
  };

  useEffect(() => {
    if (state.searchLeadCategoryList.data !== "") {
      if (state.searchLeadCategoryList.data.data.error === false) {
        setSearchLeadCategoryList(state.searchLeadCategoryList.data.data.data);
      }
    }
  }, [state]);

  return (
    <Drawer
      className="container"
      title={
        <>
          <CloseOutlined onClick={onClose} /> &nbsp;&nbsp;&nbsp;
          <span>Lead Categories</span>{" "}
        </>
      }
      width={400}
      closable={false}
      onClose={onClose}
      open={categorySearchViewOpen}
      style={{ overflowY: "auto" }}
    >
      {/* <List
        size="large"
        //   header={<div>Header</div>}
        //   footer={<div>Footer</div>}
        bordered
        dataSource={leadCategoryList}
        renderItem={(item) => (
          <List.Item
            className="clickable"
            onClick={() => handleClick(item.name)}
            style={{ fontWeight: 600 }}
          >
            {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
          </List.Item>
        )}
      /> */}
      <h3 style={{ marginTop: 0 }}>Lead Category List</h3>
      <div>
        <Search
          placeholder="Search for lead"
          size="large"
          onChange={onSearch}
          allowclear={{
            clearIcon: <CloseCircleTwoTone twoToneColor="red" />,
          }}
        />
      </div>
      <br />
      <div id="scrollableDiv" className={styles.category_container}>
        {search === "" ? (
          <InfiniteScroll
            dataLength={leadCategoryList.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={
              <h4 style={{ textAlign: "center", color: "blue" }}>Loading...</h4>
            }
            scrollableTarget="scrollableDiv"
          >
            {leadCategoryList &&
              leadCategoryList.map((data, index) => (
                <div
                  key={index}
                  className={styles.category_list}
                  onClick={() => handleClick(data.name)}
                >
                  {data.name.charAt(0).toUpperCase() + data.name.slice(1)}
                </div>
              ))}
          </InfiniteScroll>
        ) : (
          <>
            {searchLeadCategoryList &&
              searchLeadCategoryList.map((data, index) => (
                <div
                  key={index}
                  className={styles.category_list}
                  onClick={() => handleClick(data.name)}
                >
                  {data.name.charAt(0).toUpperCase() + data.name.slice(1)}
                </div>
              ))}
          </>
        )}
      </div>
    </Drawer>
  );
};

export default CategorySearchView;

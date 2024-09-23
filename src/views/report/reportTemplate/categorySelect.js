import React, { useEffect, useState } from "react";
import styles from "../report.module.css";
import Cookies from "universal-cookie";
import { BASE_URL_V1, org_id } from "../../../config";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

const CategorySelect = ({
  value = [],
  onChange,
  result = (arr) => {
    onChange && onChange(arr);
  },
}) => {
  const cookies = new Cookies();

  const [data, setData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");

  const handleRemoveSelectList = (name) => {
    let tempList = value.filter((ele) => ele !== name);
    result(tempList);
  };

  //   const handleSelectAll = (selectAll) => {
  //     if (selectAll) {
  //       setSelectedList(data.map((ele) => ele.name));
  //       return;
  //     }
  //     setSelectedList([]);
  //   };

  const handleSelectList = (name) => {
    // Check if the name is already in the selectedNames array
    if (!value.includes(name)) {
      // Add the name to the selectedNames array
      result([...value, name]);
      return;
    }
  };

  const fetchData = async (page, search) => {
    const url = `${BASE_URL_V1}/organization/${org_id}/category/?is_with_id=true`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    const params = {
      page_no: page,
      name: search,
    };
    const newDataTemp = await axios.get(url, { headers, params });
    if (newDataTemp.data.data.length < 30) {
      setHasMore(false);
    }
    return newDataTemp.data.data;
  };

  //   initial call for API and whenever page count changes
  useEffect(() => {
    fetchData(pageNo, search).then((newData) => setData(data.concat(newData)));
  }, [pageNo, search]);

  //   usefor calling more data when the page is scrolled down
  const handleLoadMore = () => {
    setPageNo((prevPage) => prevPage + 1);
  };

  // useEffect(() => {
  //   result(selectedList);
  // }, [selectedList]);

  return (
    <div className={styles.select_option_container}>
      <div className={styles.option_header}>Select Category</div>
      <div className={styles.search_group}>
        <input
          placeholder={`Search Category`}
          onChange={(event) => {
            setData([]);
            setHasMore(true);
            setPageNo(1);
            setSearch(event.target.value);
          }}
        />
      </div>
      {/* <div className={styles.select_all}>
        <span>If You Want to Select All Don't Select Any Category</span>
        {selectedList.length === data.length ? (
          <span onClick={() => handleSelectAll(false)}>Remove All</span>
        ) : (
          <span onClick={() => handleSelectAll(true)}>Select All</span>
        )}
      </div> */}
      <br />
      <div className={styles.category_option_list}>
        <InfiniteScroll
          dataLength={data.length}
          next={handleLoadMore}
          hasMore={hasMore}
          height={380}
          loader={
            hasMore === true ? (
              <h4 style={{ textAlign: "center" }}>Loading...</h4>
            ) : (
              <></>
            )
          }
          scrollableTarget="scrollableDiv"
        >
          {data?.map((item, index) => {
            let checked = value?.filter((ele) => ele === item.name);
            return (
              <div key={index} id="scrollableDiv" className={styles.list_item}>
                <span className={styles.field_name} title={item.description}>
                  {item.name}
                </span>
                {checked.length > 0 ? (
                  <span
                    style={{
                      cursor: "pointer",
                      marginRight: 14,
                      color: "red",
                      fontSize: 12,
                    }}
                    onClick={() => handleRemoveSelectList(item.name)}
                  >
                    Remove
                  </span>
                ) : (
                  <button onClick={() => handleSelectList(item.name)}>
                    Select
                  </button>
                )}
              </div>
            );
          })}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default CategorySelect;

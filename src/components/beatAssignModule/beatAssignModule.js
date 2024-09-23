import React, { useState, useEffect, useContext } from "react";
import styles from "../assignModule/assignModule.module.css";
import Cookies from "universal-cookie";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { SearchOutlined } from "@ant-design/icons";
import { BASE_URL_V2, org_id } from "../../config";
import Context from "../../context/Context";

const BeatAssignModule = ({
  title,
  searchLabel,
  incoiming,
  selectedOptionsList,
  allow_all,
  formCount,
}) => {
  const queryParameters = new URLSearchParams(window.location.search);
  const userId = queryParameters.get("id");

  const context = useContext(Context);
  const { addBeatOpen } = context;

  const cookies = new Cookies();
  const [searchValue, setSearchValue] = useState("");

  //   state to manage inifnity loop
  const [data, setData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  //   state for checkList
  const [add, setAdd] = useState([]);
  const [remove, setRemove] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [disAllowAll, setDisAllowAll] = useState(false);

  // State for add listcomming from the api
  const [tempAddSet, setTempAddSet] = useState([]);

  useEffect(() => {
    setSelectAll(allow_all);
  }, [allow_all]);

  useEffect(() => {
    if (selectedOptionsList?.add_set) {
      setAdd(selectedOptionsList.add_set);
      setRemove(selectedOptionsList.remove_set);
      setSelectAll(selectedOptionsList.select_all);
      setDisAllowAll(selectedOptionsList.disallow_all);
    }
  }, [formCount]);

  //   for infinite loop API calling
  const fetchData = async (id, page, search) => {
    const url = `${BASE_URL_V2}/organization/${org_id}/beat/${id}/mapping/`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    const params = { page_no: page, name: search };
    const newDataTemp = await axios.get(url, { headers, params });
    if (newDataTemp.data.data.length < 30) {
      setHasMore(false);
    }
    return newDataTemp.data.data;
  };

  //   initial call for API and whenever page count changes
  useEffect(() => {
    fetchData(userId, pageNo, searchValue).then((newData) =>
      setData(data.concat(newData))
    );
  }, [pageNo, searchValue]);

  useEffect(() => {
    fetchData(userId, pageNo, "").then((newData) => setData(newData));
  }, [userId, addBeatOpen]);

  useEffect(() => {
    setAdd([]);
    setRemove([]);
    setPageNo(1);
  }, [addBeatOpen]);

  //   usefor calling more data when the page is scrolled down
  const handleLoadMore = () => {
    setPageNo((prevPage) => prevPage + 1);
  };

  //   adding items in add list and also removing items from remove list
  const handleAddList = (e, id) => {
    e.preventDefault();
    // adding in add set
    setAdd((prevadd) => prevadd.concat(id));
    // removing from remove set
    let removedAddedList = remove.filter((item) => item !== id);
    setRemove(removedAddedList);
  };

  //   removing the items from added list but also maintaining the excude list
  const handleRemoveList = (e, id) => {
    e.preventDefault();
    // adding in remove set
    setRemove((prevadd) => prevadd.concat(id));
    // removing from add set
    let removedAddedList = add.filter((item) => item !== id);
    setAdd(removedAddedList);
  };

  //   to handle select all
  const handleSelectAllList = (e, value) => {
    e.preventDefault();
    setSelectAll(!selectAll);
    setDisAllowAll(selectAll);
    if (!value) {
      setAdd(data.map((item) => item.id));
      setRemove([]);
    } else {
      setAdd([]);
    }
  };

  //   adding the incoming data to the add list if new data has been added
  useEffect(() => {
    if (selectAll) {
      setAdd(data.map((item) => item.id));
      setRemove([]);
    } else {
      let arrayOfSelectedItems = data
        .filter((item) => item.is_selected === true)
        .map((item) => item.id);
      setAdd((prevadd) => prevadd.concat(arrayOfSelectedItems));
      setTempAddSet((prevadd) => prevadd.concat(arrayOfSelectedItems));
    }
  }, [data]);

  useEffect(() => {
    if (disAllowAll) {
      let selectedListTempData = {
        add_set:
          add.length === 0 ? add : removeElementsFromAddSet(add, tempAddSet),
        remove_set: [],
        allow_all: selectAll,
        disallow_all: disAllowAll,
      };
      incoiming(selectedListTempData);
      return;
    }
    if (selectAll) {
      let selectedListTempData = {
        add_set: [],
        remove_set: [...new Set(remove)],
        allow_all: selectAll,
        disallow_all: disAllowAll,
      };
      incoiming(selectedListTempData);
      return;
    }
    let selectedListTempData = {
      add_set:
        add.length === 0 ? add : removeElementsFromAddSet(add, tempAddSet),
      remove_set: [...new Set(remove)],
      allow_all: selectAll,
      disallow_all: disAllowAll,
    };
    incoiming(selectedListTempData);
  }, [add, remove, selectAll]);

  return (
    <div className={styles.form}>
      <div className={styles.form_header}>{title}</div>
      <div className={styles.search_head}>
        <label>{searchLabel}</label>
        <b onClick={(e) => handleSelectAllList(e, selectAll)}>
          {selectAll ? "Remove All" : "Assign All"}
        </b>
      </div>
      <div className="search_input_assign">
        <input
          placeholder="Search "
          onChange={(event) => {
            setData([]);
            setHasMore(true);
            setTimeout(() => {
              setSearchValue(event.target.value);
              setPageNo(1);
            }, 500);
          }}
        />
        <SearchOutlined />
      </div>
      <br />
      <InfiniteScroll
        dataLength={data.length}
        next={handleLoadMore}
        hasMore={hasMore}
        height={350}
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
            return (
              <div
                className={styles.assign_list_box}
                id="scrollableDiv"
                key={index}
              >
                <div>
                  <div>{item.name}</div>
                </div>
                <div>
                  {!add.includes(item.id) ? (
                    <button
                      className="button_secondary"
                      onClick={(e) => handleAddList(e, item.id)}
                    >
                      Assign
                    </button>
                  ) : (
                    <p
                      className={styles.remove_button}
                      onClick={(e) => handleRemoveList(e, item.id)}
                    >
                      Remove
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default BeatAssignModule;

const removeElementsFromAddSet = (array1, array2) => {
  let array1List = [...new Set(array2)];
  if (array2.length === 0) return array1;
  return array1.filter((item) => !array1List.includes(item));
};

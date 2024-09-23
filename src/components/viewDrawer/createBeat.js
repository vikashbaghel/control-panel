import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Context from "../../context/Context";
import { CloseOutlined, CloseCircleTwoTone } from "@ant-design/icons";
import { Drawer, Button, Select, Form, Input, List, Checkbox } from "antd";
//api called
import { BASE_URL_V2, org_id } from "../../config";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import Cookies from "universal-cookie";
import { beatAddService } from "../../redux/action/beatAction";

const { Search } = Input;

const CreateBeat = () => {
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const context = useContext(Context);
  const { addBeatOpen, setAddBeatOpen } = context;
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [add_set, setAddSet] = useState([]);
  const [newData, setNewData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [remove_set, setRemoveSet] = useState([]);
  const [exclude_set, setExcludeSet] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [isDisallowAll, setIsDisallowAll] = useState(false);

  const fetchMoreData = () => {
    const url = `${BASE_URL_V2}/organization/${org_id}/beat/0/mapping/`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    const params = { page_no: pageNo, name: search };
    axios.get(url, { headers, params }).then((response) => {
      setNewData(newData.concat(response.data.data));
      setPageNo(pageNo + 1);
      if (response.data.data.length !== 30) {
        setHasMore(false);
      }
    });
  };

  useEffect(() => {
    fetchMoreData();
  }, [search]);

  useEffect(() => {
    if (isAllSelected) return setAddSet(newData.map((item) => item.id));
    let newSelectedArrayTemp = add_set.concat(
      newData.filter((item) => item.is_selected).map((item) => item.id)
    );
    newSelectedArrayTemp = newSelectedArrayTemp.filter(
      (item) => !remove_set.includes(item)
    );
    newSelectedArrayTemp = [...new Set(newSelectedArrayTemp)];
    setAddSet(newSelectedArrayTemp);
  }, [newData]);

  const onClose = () => {
    setAddBeatOpen(false);
    setName("");
    setIsAllSelected(false);
    setExcludeSet([]);
    setAddSet([]);
    setRemoveSet([]);
    setSearch("");
    setPageNo(1);
    setIsAllSelected(false);
    setIsDisallowAll(false);
    setHasMore(true);
    setSearchInput("");
  };

  //Function To Send Request to Post API
  const onFinish = (values) => {
    const apiData1 = {
      name: name,
      add_set: add_set,
      disallow_all: !isAllSelected,
    };
    const apiData2 = {
      name: name,
      allow_all: isAllSelected,
      disallow_all: isDisallowAll,
      exclude_set: exclude_set,
      add_set: add_set,
      remove_set: remove_set,
    };
    let apiData =
      !isAllSelected &&
      exclude_set.length === 0 &&
      add_set.length === 0 &&
      remove_set.length === 0
        ? apiData1
        : apiData2;
    dispatch(beatAddService(apiData));
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  //checkbox handle get customer Id
  function checkBoxHandle(e, idx) {
    if (e.target.checked) {
      const index = exclude_set.indexOf(idx);
      if (index >= 0) {
        exclude_set.splice(index, idx);
      }
      setAddSet([...add_set, idx]);
      return;
    }
    let newCustomerAssignAfterUnChecked = add_set.filter((ele) => ele !== idx);
    setAddSet(newCustomerAssignAfterUnChecked);

    if (isAllSelected) {
      setExcludeSet([...exclude_set, idx]);
    }

    setRemoveSet([...remove_set, idx]);
  }

  const onChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setIsAllSelected(true);
      setIsDisallowAll(false);
      setAddSet(newData.map((item) => item.id));
    } else {
      setIsDisallowAll(true);
      setIsAllSelected(false);
      setAddSet([]);
    }
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    setNewData([]);
    setTimeout(() => {
      setSearch(e.target.value);
      setPageNo(1);
      setHasMore(true);
    }, 500);
  };

  return (
    <>
      <Drawer
        className="container"
        title={
          <>
            <CloseOutlined onClick={onClose} /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span>Create Beat</span>{" "}
          </>
        }
        width={520}
        closable={false}
        onClose={onClose}
        open={addBeatOpen}
        style={{ overflowY: "auto" }}
      >
        <Form {...layout} onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <Form.Item style={{ fontWeight: "600" }} name="name">
            <label>Name :</label>
            <Input
              style={{ fontWeight: "600", width: "470px", height: "40px" }}
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Enter Name"
            />
          </Form.Item>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
            }}
          >
            <label style={{ fontWeight: "600" }}>Select Customer :</label>
            <div>
              <div>
                <Search
                  placeholder="Search Customer with name"
                  size="large"
                  value={searchInput}
                  style={{ marginBottom: 5 }}
                  onChange={handleSearchChange}
                  allowclear={{
                    clearIcon: (
                      <CloseCircleTwoTone
                        twoToneColor="red"
                        onClick={() => setNewData([])}
                      />
                    ),
                  }}
                />
              </div>
              <InfiniteScroll
                dataLength={newData.length}
                next={fetchMoreData}
                style={{
                  alignItems: "right",
                  width: 460,
                  marginBottom: "10px",
                  marginTop: "10px",
                  fontSize: 12,
                  border: "1px solid rgba(140, 140, 140, 0.35)",
                  borderRadius: 5,
                  paddingLeft: "15px",
                }}
                hasMore={hasMore}
                height={350}
                loader={
                  <h4 style={{ textAlign: "center", color: "blue" }}>
                    Loading...
                  </h4>
                }
                scrollableTarget="scrollableDiv"
              >
                {searchInput ? (
                  <></>
                ) : (
                  <Checkbox
                    onClick={onChange}
                    style={{ fontWeight: "500", color: "#1677ff" }}
                    checked={isAllSelected}
                  >
                    Select All
                  </Checkbox>
                )}
                {newData &&
                  newData.map((data, index) => {
                    return (
                      <List.Item key={index} style={{ padding: "0" }}>
                        <div id="scrollableDiv">
                          <List.Item.Meta
                            avatar={<></>}
                            title={
                              <>
                                <Checkbox
                                  onChange={(e) => {
                                    checkBoxHandle(e, data.id);
                                  }}
                                  style={{ marginRight: "10px" }}
                                  value={data.name}
                                  checked={add_set.includes(data.id)}
                                />
                                <>{data.name}</>
                              </>
                            }
                          />
                        </div>
                      </List.Item>
                    );
                  })}
              </InfiniteScroll>
            </div>
          </div>

          <div
            style={{
              position: "fixed",
              display: "flex",
              width: "478px",
              gap: "20px",
              justifyContent: "center",
              bottom: 1,
              padding: 20,
              backgroundColor: "white",
              border: "1px solid #D9D9D9",
              marginLeft: "-24px",
            }}
          >
            <Button onClick={onClose} style={{ width: 200, height: "40px" }}>
              Cancel
            </Button>
            <Button
              style={{ width: 200, height: "40px" }}
              type="primary"
              onClick={onFinish}
            >
              Submit
            </Button>
          </div>
        </Form>
      </Drawer>
    </>
  );
};
export default CreateBeat;

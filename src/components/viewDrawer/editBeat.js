import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Context from "../../context/Context";
import { CloseOutlined, CloseCircleTwoTone } from "@ant-design/icons";
import { Drawer, Button, Form, Input, List, Checkbox } from "antd";
import { BASE_URL_V2, org_id } from "../../config";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import Cookies from "universal-cookie";
import { beatEditService } from "../../redux/action/beatAction";
import PropTypes from "prop-types";

const EditBeat = ({ id }) => {
  const { Search } = Input;
  const cookies = new Cookies();

  const [pageNo, setPageNo] = useState(1);
  const [newData, setNewData] = useState([]);
  const [search, setSearch] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const context = useContext(Context);
  const dispatch = useDispatch();
  const { editBeatOpen, setEditBeatOpen, editBeatData, setEditBeatData } =
    context;
  const [name, setName] = useState("");
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [exclude_set, setExcludeSet] = useState([]);
  const [add_set, setAddSet] = useState([]);
  const [remove_set, setRemoveSet] = useState([]);
  const [isDisallowAll, setIsDisallowAll] = useState(false);

  const fetchMoreData = async (id) => {
    let beatId = id ? id : editBeatData.id;
    if (beatId === undefined) return;
    const url = `${BASE_URL_V2}/organization/${org_id}/beat/${beatId}/mapping/`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    const params = { page_no: search === "" ? pageNo : 0, name: search };

    await axios.get(url, { headers, params }).then((response) => {
      setNewData(
        search === "" ? newData.concat(response.data.data) : response.data.data
      );
      setPageNo(pageNo + 1);
      if (response.data.data.length !== 30) {
        setHasMore(false);
      }
    });
  };

  useEffect(() => {
    if (editBeatData) {
      setIsAllSelected(editBeatData.allow_all);
    }
  }, [editBeatOpen]);

  useEffect(() => {
    fetchMoreData(id);
  }, [editBeatOpen, search]);

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
    setEditBeatOpen(false);
    setEditBeatData("");
    setNewData([]);
    setAddSet([]);
    setRemoveSet([]);
    setSearch("");
    setPageNo(1);
    setIsAllSelected(false);
    setIsDisallowAll(false);
    setHasMore(true);
  };

  //Sumit updated beat request.
  const onFinish = (values) => {
    const apiData1 = {
      id: editBeatData.id,
      name: name ? name : editBeatData.name,
      add_set: add_set,
      disallow_all: !isAllSelected,
    };
    const apiData2 = {
      id: editBeatData.id,
      name: name ? name : editBeatData.name,
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
    dispatch(beatEditService(apiData));
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
    let newCustomerAssign = add_set.filter((ele) => ele !== idx);
    setAddSet(newCustomerAssign);

    if (isAllSelected) {
      setExcludeSet([...exclude_set, idx]);
    }
    setRemoveSet([...remove_set, idx]);
  }

  const onSelectAllChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setIsAllSelected(true);
      setIsDisallowAll(false);
      setAddSet(newData.map((item) => item.id));
    } else {
      setIsAllSelected(false);
      setIsDisallowAll(true);
      setAddSet([]);
    }
  };

  const handleSearchChange = (e) => {
    setNewData([]);
    setHasMore(true);
    setTimeout(() => {
      setSearch(e.target.value);
      setPageNo(1);
    }, 500);
  };

  return (
    <>
      {editBeatData && (
        <Drawer
          className="container"
          title={
            <>
              <CloseOutlined onClick={onClose} /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span>Edit Beat</span>{" "}
            </>
          }
          width={520}
          closable={false}
          onClose={onClose}
          open={editBeatOpen}
          style={{ overflowY: "auto" }}
        >
          <Form {...layout} onFinish={onFinish} onFinishFailed={onFinishFailed}>
            <Form.Item style={{ fontWeight: "600" }} name="name">
              <label>Name :</label>
              <input
                style={{
                  fontWeight: "600",
                  width: "470px",
                  height: "40px",
                  border: "1px solid #d9d9d9",
                  borderRadius: "6px",
                  paddingLeft: "10px",
                }}
                onChange={(e) => setName(e.target.value)}
                defaultValue={editBeatData.name}
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
                  next={() => fetchMoreData(editBeatData.id)}
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
                  <Checkbox
                    onClick={onSelectAllChange}
                    style={{ fontWeight: "500", color: "#1677ff" }}
                    defaultChecked={editBeatData.allow_all === true}
                  >
                    Select All
                  </Checkbox>
                  {newData?.map((data, index) => {
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
      )}
    </>
  );
};

EditBeat.propTypes = {
  id: PropTypes.any,
};

export default EditBeat;

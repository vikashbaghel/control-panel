import { Button, Dropdown, Input, Popconfirm, Space, Table, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EditOutlined, CloseCircleTwoTone } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux/es/exports";
import {
  deleteLeadCategory,
  leadCategoryAction,
  searchLeadCategoryAction,
} from "../../redux/action/leadManagementAction";
import { useState } from "react";
import { useContext } from "react";
import Context from "../../context/Context";
import AddLeadCategoryView from "../../components/viewDrawer/addLeadCategoryView";
import EditLeadCategoryView from "../../components/viewDrawer/editLeadcategoryView";
import Permissions from "../../helpers/permissions";

const { Search } = Input;

const LeadCategory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const context = useContext(Context);
  const {
    setLeadCategoryVieOpen,
    setEditLeadCategoryViewOpen,
    setLeadCategoryData,
  } = context;
  const [leadCategoryList, setLeadCategoryList] = useState("");
  const [deleteLeadCategoryId, setDeleteLeadCategoryId] = useState("");
  const [pageCount, setPageCount] = useState(1);
  const [search, setSearch] = useState("");
  const [searchLeadCategoryList, setSearchLeadCategoryList] = useState([]);

  let viewLeadCategoryPermission = Permissions("VIEW_LEAD_CATEGORY");
  let createLeadCategoryPermission = Permissions("CREATE_LEAD_CATEGORY");
  let editLeadCategoryPermission = Permissions("EDIT_LEAD_CATEGORY");
  let deleteLeadCategoryPermission = Permissions("DELETE_LEAD_CATEGORY");

  const columns = [
    {
      title: "Category Name",
      dataIndex: "name",
      render: (text) => <div style={{ color: "blue" }}>{text}</div>,
    },
    {
      title: "Action",
      dataIndex: "operation",
      key: "operation",
      align: "center",
      render: (text, record) => (
        <Space
          size="middle"
          direction="horizontal"
          style={{ width: "100%", justifyContent: "center" }}
          onClick={() => {
            setLeadCategoryData({ name: record.name, id: record.id });
            setDeleteLeadCategoryId(record.id);
          }}
        >
          <Dropdown
            menu={{
              items,
            }}
          >
            <a style={{ color: "black" }}>...</a>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const items = [
    editLeadCategoryPermission
      ? {
          key: "1",
          label: (
            <div onClick={() => setEditLeadCategoryViewOpen(true)}>
              <EditOutlined style={style.icon_edit} /> Edit
            </div>
          ),
        }
      : {},
    deleteLeadCategoryPermission
      ? {
          key: "2",
          label: (
            <div>
              <Popconfirm
                title="Are You Sure, You want to Delete ?"
                onConfirm={() => handleDeleteProduct()}
              >
                <CloseCircleTwoTone twoToneColor="red" /> Delete
              </Popconfirm>
            </div>
          ),
        }
      : {},
  ];

  useEffect(() => {
    dispatch(leadCategoryAction(pageCount));
  }, [pageCount]);

  useEffect(() => {
    if (state.leadCategoryList.data !== "") {
      if (state.leadCategoryList.data.data.error === false) {
        setLeadCategoryList(state.leadCategoryList.data.data.data);
      }
    }
    if (state.searchLeadCategoryList.data !== "") {
      if (state.searchLeadCategoryList.data.data.error === false) {
        setSearchLeadCategoryList(state.searchLeadCategoryList.data.data.data);
      }
    }
  }, [state]);

  const handleDeleteProduct = () => {
    dispatch(deleteLeadCategory(deleteLeadCategoryId));
    setTimeout(() => {
      dispatch(leadCategoryAction());
    }, 200);
  };

  const onSearch = (e) => {
    setTimeout(() => {
      setSearch(e.target.value);
    }, 500);
  };

  useEffect(() => {
    dispatch(searchLeadCategoryAction("", search));
  }, [search]);

  return (
    <div>
      <h2 className="page_title">
        Lead Category List
        <div className="breadcrumb">
          <span onClick={() => navigate("/web")}>Home </span>
          <span onClick={() => navigate("/web/lead-category")}>
            {" "}
            / Lead-category
          </span>
        </div>
      </h2>
      <Content
        style={{
          padding: 24,
          margin: 0,
          minHeight: "82vh",
          background: colorBgContainer,
          position: "relative",
        }}
      >
        {/* <h2 style={{ contain: "", marginBottom: 40 }}></h2> */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ width: "30%" }}>
            <Search
              placeholder="Search for lead"
              size="large"
              onChange={onSearch}
              allowclear={{
                clearIcon: <CloseCircleTwoTone twoToneColor="red" />,
              }}
            />
          </div>
          {createLeadCategoryPermission ? (
            <Button
              // style={{ position: "absolute", top: 15, right: 24 }}
              type="primary"
              className="btn-rounded mb-2 me-2 btn btn-success"
              onClick={() => {
                setLeadCategoryVieOpen(true);
              }}
            >
              Add New Category
            </Button>
          ) : (
            <></>
          )}
        </div>
        <br />
        {viewLeadCategoryPermission ||
        createLeadCategoryPermission ||
        editLeadCategoryPermission ||
        deleteLeadCategoryPermission ? (
          <Table
            pagination={false}
            columns={columns}
            dataSource={
              search !== "" ? searchLeadCategoryList : leadCategoryList
            }
          />
        ) : (
          <Table pagination={false} columns={columns} dataSource={""} />
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "row-reverse",
            paddingTop: 24,
          }}
        >
          <Button
            type="primary"
            onClick={() => setPageCount(pageCount + 1)}
            disabled={leadCategoryList.length < 30 ? true : false}
          >
            {">"}
          </Button>
          <Button style={{ margin: "0 5px" }}>{pageCount}</Button>
          <Button
            type="primary"
            onClick={() => setPageCount(pageCount - 1)}
            disabled={pageCount === 1 ? true : false}
          >
            {"<"}
          </Button>
        </div>
        <AddLeadCategoryView />
        <EditLeadCategoryView />
      </Content>
    </div>
  );
};

export default LeadCategory;

const style = {
  icon_edit: {
    color: "#34c38f",
    cursor: "pointer",
    fontSize: 15,
  },
};

import React, { useEffect, useState, useContext } from "react";
import {
  CaretLeftOutlined,
  CaretRightOutlined,
  MoreOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import Styles from "./settings.module.css";
import { Button, Dropdown, Spin, Table, theme } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Context from "../../context/Context";
import { useNavigate } from "react-router";
import Permissions from "../../helpers/permissions";
import {
  deleteLeadCategory,
  leadCategoryAction,
} from "../../redux/action/leadManagementAction";
import { DeleteIcon, EditIcon } from "../../assets/globle";
import ConfirmDelete from "../../components/confirmModals/confirmDelete";
import AddLeadCategoryComponent from "./addLeadCategory";
import SearchInput from "../../components/search-bar/searchInput";
import Pagination from "../../components/pagination/pagination";
import { useSearchParams } from "react-router-dom";

const LeadCategoryComponent = () => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const pageCount = Number(searchParams.get("page")) || 1;
  const searchPageCount = Number(searchParams.get("search_page")) || 1;

  const [leadCategoryList, setLeadCategoryList] = useState([]);
  const [rowData, setRowdata] = useState("");

  const [search, setSearch] = useState("");

  const context = useContext(Context);
  const {
    setEditLeadCategoryViewOpen,
    deleteModalOpen,
    setDeleteModalOpen,
    setLoading,
  } = context;

  let viewLeadCategoryPermission = Permissions("VIEW_LEAD_CATEGORY");
  let createLeadCategoryPermission = Permissions("CREATE_LEAD_CATEGORY");
  let editLeadCategoryPermission = Permissions("EDIT_LEAD_CATEGORY");
  let deleteLeadCategoryPermission = Permissions("DELETE_LEAD_CATEGORY");

  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  useEffect(() => {
    search
      ? dispatch(leadCategoryAction(search, searchPageCount))
      : dispatch(leadCategoryAction("", pageCount));
  }, [search, pageCount, searchPageCount]);

  useEffect(() => {
    if (state.leadCategoryList.data !== "") {
      if (state.leadCategoryList.data.data.error === false) {
        setLeadCategoryList(state.leadCategoryList.data.data.data);
        setLoading(false);
      }
    }
  }, [state]);

  const items = [
    editLeadCategoryPermission && {
      key: "1",
      label: (
        <div
          onClick={() => {
            setEditLeadCategoryViewOpen(true);
          }}
          className="action-dropdown-list"
        >
          <img src={EditIcon} alt="edit" /> Edit
        </div>
      ),
    },
    deleteLeadCategoryPermission && {
      key: "2",
      label: (
        <div>
          <div
            onClick={() => setDeleteModalOpen(true)}
            className="action-dropdown-list"
          >
            <img src={DeleteIcon} alt="delete" /> <span>Delete</span>
          </div>
        </div>
      ),
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => <div>{text}</div>,
    },
    editLeadCategoryPermission || deleteLeadCategoryPermission
      ? {
          title: " ",
          dataIndex: "operation",
          key: "operation",
          width: 50,
          render: (text, record) => (
            <div
              onMouseOver={() => {
                setRowdata(record);
              }}
            >
              <Dropdown
                menu={{
                  items,
                }}
                className="action-dropdown"
              >
                <div className="clickable">
                  <MoreOutlined className="action-icon" />
                </div>
              </Dropdown>
            </div>
          ),
        }
      : {},
  ];

  const styleHeader = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    width: "1050px",
  };

  // delete function
  const handleDeleteCustomer = (data) => {
    if (data === true) {
      dispatch(deleteLeadCategory(rowData.id, false));
      setTimeout(() => {
        dispatch(leadCategoryAction("", pageCount));
      }, 400);
    }
  };
  return (
    <>
      <div className="table_list position-rel">
        <Content
          style={{
            padding: "0px 24px",
            margin: 0,
            height: "82vh",
            background: "transparent",
          }}
        >
          <div style={styleHeader}>
            <SearchInput
              placeholder="Search Lead Category"
              searchValue={(data) =>
                setTimeout(() => {
                  setSearch(data);
                }, 500)
              }
            />

            {/* <div> */}
            {createLeadCategoryPermission && (
              <button
                className="button_primary"
                onClick={() => {
                  setEditLeadCategoryViewOpen(true);
                  setRowdata("");
                }}
              >
                Add Lead Category
              </button>
            )}
            {/* </div> */}
          </div>

          <div
            style={{
              width: "1050px",
              display: "flex",
              flexDirection: "column",
              minHeight: "70vh",
            }}
          >
            {(viewLeadCategoryPermission ||
              createLeadCategoryPermission ||
              editLeadCategoryPermission ||
              deleteLeadCategoryPermission) && (
              <>
                <Table
                  pagination={false}
                  columns={columns}
                  dataSource={leadCategoryList}
                  scroll={{ y: 500 }}
                />
                <Pagination list={leadCategoryList} search={search} />
              </>
            )}
          </div>
          <ConfirmDelete
            title={"Lead Category"}
            open={deleteModalOpen}
            confirmValue={(data) => {
              handleDeleteCustomer(data);
              setDeleteModalOpen(data);
            }}
          />
          <AddLeadCategoryComponent data={rowData} pageCount={pageCount} />
        </Content>
      </div>
    </>
  );
};

export default LeadCategoryComponent;

import { Button, Dropdown, Table } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { ArrowLeft, DeleteIcon, EditIcon } from "../../assets/globle";
import Context from "../../context/Context";
import ConfirmDelete from "../../components/confirmModals/confirmDelete";
import { useDispatch, useSelector } from "react-redux";
import {
  CaretLeftOutlined,
  CaretRightOutlined,
  MoreOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Content } from "antd/es/layout/layout";
import {
  staffBeatsAssigned,
  staffDetailsById,
} from "../../redux/action/staffAction";
import moment from "moment";
import { Staff as staffIcon } from "../../assets/navbarImages";

const IndividualSelectedList = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const context = useContext(Context);
  const { setDeleteModalOpen, deleteModalOpen } = context;
  const queryParameters = new URLSearchParams(window.location.search);
  const id = queryParameters.get("id");
  const [staffDetails, setStaffDetails] = useState("");

  const tableName = queryParameters.get("type");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [dataList, setdataList] = useState([]);
  const [selectedData, setSelectedData] = useState([]);

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(staffDetailsById(id));
    dispatch(staffBeatsAssigned(id, pageCount));
  }, [pageCount, search]);

  useEffect(() => {
    if (
      state.staffBeatsAssigned.data !== "" &&
      state.staffBeatsAssigned.data.data.error === false
    ) {
      setdataList(state.staffBeatsAssigned.data.data.data);
      setLoading(false);
    }
    if (state.staff.data !== "" && state.staff.data.data.error === false)
      setStaffDetails(state.staff.data.data.data);
  }, [state]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "300px",
      render: (text, record) => (
        <div
          style={{ cursor: "pointer" }}
          // onClick={() => {
          //   navigate(
          //     `/web/staff/view-details/?id=${record.id}&userid=${record.user}`
          //   );
          // }}
        >
          <div>{record?.name}</div>
        </div>
      ),
    },
    {
      title: "No. of customer ",
      dataIndex: "customer_count",
      width: "150px",
    },
    {
      title: "Created By",
      dataIndex: "created_by_name",
      width: "300px",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      width: "150px",
      render: (text, record) => moment(record.created_at).format("DD MMM Y"),
    },
    {
      title: " ",
      dataIndex: " ",
      key: "operation",
      width: "50px",
      render: (text, record) => (
        <div
          onMouseOver={() => {
            setSelectedData(record);
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
    },
  ];

  const items = [
    {
      key: "2",
      label: (
        <div
          onClick={() => {
            navigate(`/web/setting?tab=Beat&id=${selectedData.id}`);
          }}
          className="action-dropdown-list"
        >
          <img src={EditIcon} alt="edit" /> Edit
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <>
          <div
            className="action-dropdown-list"
            onClick={() => {
              setDeleteModalOpen(true);
            }}
          >
            <img src={DeleteIcon} alt="delete" /> <span>Delete</span>
          </div>
        </>
      ),
    },
  ];

  //pagination handle page count plus
  const handleAdd = () => {
    setPageCount(pageCount + 1);
  };

  //pagination handle page count plus
  const handleRemove = () => {
    if (pageCount === 1) {
      return;
    }
    setPageCount(pageCount - 1);
  };

  // delete function
  const handleDeleteCustomer = (data) => {
    if (data === true) {
    }
  };

  return (
    <div>
      <h2
        className="page_title"
        style={{ display: "flex", alignItems: "center" }}
      >
        {" "}
        <img
          src={ArrowLeft}
          alt="arrow"
          onClick={() => navigate(-1)}
          className="clickable"
        />
        &nbsp;
        {tableName === "beat" && `Assigned Beat (${staffDetails?.beat_count})`}
      </h2>

      <Content
        style={{
          padding: 24,
          paddingTop: 1,
          margin: 0,
          height: "82vh",
          background: "transparent",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 15,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: ".5em",
              paddingInline: "0.7em",
            }}
          >
            <img
              src={staffDetails?.profile_pic_url || staffIcon}
              alt="profile"
              className="clickable"
              width="30px"
              height="30px"
              style={{ borderRadius: "50%" }}
            />
            {staffDetails?.name}
          </div>
          <div className="search_input">
            <input
              placeholder="Search for Customer"
              onChange={(e) =>
                setTimeout(() => {
                  setSearch(e.target.value);
                }, 500)
              }
            />
            <SearchOutlined />
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={dataList}
          pagination={false}
          scroll={{ y: 500 }}
          loading={loading}
        />
        <ConfirmDelete
          title={"Beat"}
          open={deleteModalOpen}
          confirmValue={(rowData) => {
            handleDeleteCustomer(rowData);
          }}
        />
        <br />
        <div className="pagination-container">
          <div>
            <Button
              disabled={pageCount === 1 && true}
              onClick={() => {
                handleRemove();
                setLoading(true);
              }}
              className="pagenation-icon"
            >
              <CaretLeftOutlined />
            </Button>
            <div className="Pagination-count">Page {pageCount}</div>
            <Button
              disabled={dataList?.length < 30 ? true : false}
              onClick={() => {
                handleAdd();
                setLoading(true);
              }}
              className="pagenation-icon"
            >
              <CaretRightOutlined />
            </Button>
          </div>
        </div>
      </Content>
    </div>
  );
};

export default IndividualSelectedList;

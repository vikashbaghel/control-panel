import React, { useState } from "react";
import { MoreOutlined, SearchOutlined } from "@ant-design/icons";
import { Dropdown, Table } from "antd";
import { Content } from "antd/es/layout/layout";
import styles from "./approvalBeatPlan.module.css";
import handleParams from "../../helpers/handleParams";
import { useNavigate, useSearchParams } from "react-router-dom";
import ConfirmDelete from "../../components/confirmModals/confirmDelete";
import Pagination from "../../components/pagination/pagination";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { NoPhoto, ViewDetails } from "../../assets";
import UpdateBeatStatus from "./updateBeatStatus";
import { useContext } from "react";
import Context from "../../context/Context";
import { DeleteIcon, EditIcon } from "../../assets/globle";
import { useEffect } from "react";
import {
  approvalBeatPlanListAction,
  beatPlanDeleteService,
} from "../../redux/action/beatPlanAction";
import Cookies from "universal-cookie";

const BeatPlanList = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const cookies = new Cookies();
  const navigate = useNavigate();
  const context = useContext(Context);
  const { setDateOfRow, setSelectedStaffId, setDeleteModalOpen, setLoading } =
    context;
  const queryParameters = new URLSearchParams(window.location.search);
  const search = queryParameters.get("query") || "";
  const pageCount = search
    ? queryParameters.get("search_page")
    : queryParameters.get("page");

  const [searchParams, setSearchParams] = useSearchParams();
  const { getApprovalBeatPlanList, approvalBeatPlanDetails } = state;

  const [id, setId] = useState("");
  const [allBeatList, setAllBeatList] = useState([]);
  const [filter_status, setFilterStatus] = useState("All");

  useEffect(() => {
    detailAPICalling(filter_status, pageCount, search);
  }, [filter_status, pageCount, search]);

  const detailAPICalling = (filter, page, search) => {
    dispatch(
      approvalBeatPlanListAction(
        page,
        search,
        filter,
        cookies.get("rupyzLoginData").user_id
      )
    );
  };

  useEffect(() => {
    if (getApprovalBeatPlanList.data !== "") {
      if (getApprovalBeatPlanList.data.data.error === false)
        setAllBeatList(getApprovalBeatPlanList.data.data.data);
    }
    if (
      approvalBeatPlanDetails.data &&
      !approvalBeatPlanDetails.data.data.error
    ) {
      detailAPICalling(filter_status, pageCount, search);
    }
    setLoading(false);
  }, [state]);

  const columns = [
    {
      title: "Beat Plan Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => {
        return (
          <div
            style={{
              width: "200px",
              cursor: "pointer",
              position: "relative",
              height: 40,
              display: "flex",
              alignItems: "center",
              paddingLeft: 10,
            }}
            onMouseOver={() => setId(record.id)}
            onClick={() => handleOnClick()}
          >
            {record.is_active ? (
              <div className="active_tag">Active</div>
            ) : (
              <></>
            )}
            {text}
          </div>
        );
      },
    },
    {
      title: "Duration Date",
      dataIndex: "start_date",
      render: (text, record) => {
        return (
          <span style={{ width: "200px" }}>
            {moment(text).format("DD MMM YYYY")}-{" "}
            {moment(record.end_date).format("DD MMM YYYY")}
          </span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "name",
      render: (text, record) => (
        <UpdateBeatStatus status={text} beatId={record.id} />
      ),
    },
    {
      title: " ",
      dataIndex: "operation",
      key: "operation",
      width: 50,
      render: (text, record) => (
        <div
          onMouseOver={() => {
            setId(record.id);
            setDateOfRow(record.start_date);
            setSelectedStaffId(record);
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

  const handleOnClick = () => {
    id && navigate(`/web/beat-plan-details/${id}?myPlan=true`);
  };

  const items = [
    {
      key: "1",
      label: (
        <div onClick={handleOnClick} className="action-dropdown-list">
          <img src={ViewDetails} alt="view" />
          View Details
        </div>
      ),
    },
    // {
    //   key: "2",
    //   label: (
    //     <div onClick={handleOnClickEdit} className="action-dropdown-list">
    //       <img src={EditIcon} alt="edit" /> Edit
    //     </div>
    //   ),
    // },
    {
      key: "3",
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

  const handleDeleteCustomer = (data) => {
    if (data) {
      const deleteRequest = {
        id: id,
      };
      dispatch(beatPlanDeleteService(deleteRequest));
      setTimeout(() => {
        detailAPICalling(filter_status, pageCount, search);
      }, 400);
    }
  };

  return (
    <div>
      <div className={styles.beat_plan_heading}>
        <h2 className="page_title">My Beat Plan</h2>
        <div className="search_input">
          <input
            placeholder="Search for Customer"
            onChange={(e) => {
              setTimeout(() => {
                handleParams(searchParams, setSearchParams, {
                  query: e.target.value,
                });
              }, 500);
            }}
          />
          <SearchOutlined />
        </div>
      </div>
      <Content
        style={{
          padding: 24,
          margin: 0,
          minHeight: "82vh",
          display: "flex",
          flexDirection: "column",
          gap: "2em",
        }}
      >
        <div className={styles.filter_options}>
          {filterOptions.map((ele) => (
            <p
              className={`${styles.filter_name} ${
                filter_status === ele && styles.active_filter
              }`}
              onClick={() => setFilterStatus(ele)}
            >
              {ele}
            </p>
          ))}
        </div>
        <Table
          dataSource={allBeatList || ""}
          columns={columns}
          pagination={false}
          scroll={{ y: 500 }}
        />
        <Pagination list={allBeatList || ""} search={search} />
      </Content>
      <ConfirmDelete
        title={"Beat Plan"}
        confirmValue={(data) => {
          handleDeleteCustomer(data);
        }}
        search={search}
      />
    </div>
  );
};

export default BeatPlanList;

const filterOptions = ["All", "Active", "Upcoming", "Closed"];

import { useContext, useEffect, useState } from "react";
import { Content } from "antd/es/layout/layout";
import { Table, Dropdown } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Context from "../../context/Context";
import { MoreOutlined } from "@ant-design/icons";
import moment from "moment";
import {
  approvalBeatPlanListAction,
  beatPlanDeleteService,
} from "../../redux/action/beatPlanAction";
import { DeleteIcon } from "../../assets/globle";
import { ViewDetails } from "../../assets";
import { Staff } from "../../assets/dashboardIcon";
import ConfirmDelete from "../../components/confirmModals/confirmDelete";
import styles from "./approvalBeatPlan.module.css";
import UpdateBeatStatus from "./updateBeatStatus";
import Pagination from "../../components/pagination/pagination";
import handleParams from "../../helpers/handleParams";
import { useSearchParams } from "react-router-dom";
import Cookies from "universal-cookie";
import SearchInput from "../../components/search-bar/searchInput";

const ApprovalBeatPlanList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cookies = new Cookies();
  const context = useContext(Context);
  const { setDateOfRow, setSelectedStaffId, setDeleteModalOpen, setLoading } =
    context;
  const state = useSelector((state) => state);
  const { approvalBeatPlanDetails } = state;
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParameters = new URLSearchParams(window.location.search);
  const search = queryParameters.get("query") || "";
  const pageCount = queryParameters.get("page");
  const searchPage = queryParameters.get("search_page");

  const [id, setId] = useState("");
  // const [pageCount, setPageCount] = useState(1);
  const [filter_status, setFilterStatus] = useState("All");

  const [allBeatList, setAllBeatList] = useState([]);
  // const [search, setSearch] = useState("");

  const admin = cookies.get("rupyzAccessType") === "WEB_SARE360" ? true : false;

  useEffect(() => {
    if (state.getApprovalBeatPlanList.data !== "") {
      if (state.getApprovalBeatPlanList.data.data.error === false)
        setAllBeatList(state.getApprovalBeatPlanList.data.data.data);
    }
    if (
      approvalBeatPlanDetails.data &&
      !approvalBeatPlanDetails.data.data.error
    ) {
      detailAPICalling(filter_status, search ? searchPage : pageCount, search);
    }
    setLoading(false);
  }, [state]);

  useEffect(() => {
    if (search || searchPage) {
      if (search && searchPage)
        detailAPICalling(filter_status, searchPage, search);
    } else detailAPICalling(filter_status, pageCount, search);
  }, [filter_status, pageCount, search, searchPage]);

  const detailAPICalling = (filter, page, search) => {
    dispatch(approvalBeatPlanListAction(page, search, filter));
  };

  const handleOnClick = () => {
    id && navigate(`/web/beat-plan-details/${id}`);
  };

  const filterOptions = [
    "All",
    "Approval Pending",
    "Active",
    "Upcoming",
    "Closed",
  ];

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

  const columns = [
    {
      title: "Staff Name",
      dataIndex: "user_name",
      key: "name",
      render: (text, record) => {
        return (
          <div
            style={{
              width: "200px",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              position: "relative",
            }}
            onMouseOver={() => setId(record.id)}
            onClick={() => handleOnClick()}
          >
            {record.is_active ? (
              <div className="active_tag">Active</div>
            ) : (
              <></>
            )}
            <img
              src={record.profile_pic_url ? record.profile_pic_url : Staff}
              width={35}
              height={35}
              style={{ borderRadius: "50%" }}
            />
            &nbsp;&nbsp;&nbsp;
            <span>{text}</span>
          </div>
        );
      },
    },
    {
      title: "Beat Plan Name",
      dataIndex: "name",
      key: "name",
      render: (text) => {
        return <div style={{ width: "200px" }}>{text}</div>;
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

  const handleDeleteCustomer = (data) => {
    if (data) {
      const deleteRequest = {
        id: id,
      };
      dispatch(beatPlanDeleteService(deleteRequest));
      setTimeout(() => {
        detailAPICalling(
          filter_status,
          search ? searchPage : pageCount,
          search
        );
      }, 400);
    }
  };

  return (
    <div>
      <div className={styles.beat_plan_heading}>
        <h2 className="page_title">{!admin && "Team "}Beat Plan</h2>

        <SearchInput
          placeholder="Search for Beat Plan"
          searchValue={(data) => {
            handleParams(searchParams, setSearchParams, {
              query: data,
            });
          }}
        />
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
              onClick={() => {
                setFilterStatus(ele);
                if (!search)
                  handleParams(searchParams, setSearchParams, "", ["page"]);
              }}
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

export default ApprovalBeatPlanList;

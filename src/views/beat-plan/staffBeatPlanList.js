import React, { useContext, useEffect, useState } from "react";
import { Content } from "antd/es/layout/layout";
import {
  theme,
  Button,
  Table,
  Input,
  Popconfirm,
  Space,
  Dropdown,
  Card,
  Select,
  Radio,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import Context from "../../context/Context";
import {
  DeleteOutlined,
  CloseCircleTwoTone,
  EditOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { Link } from "react-router-dom";
import {
  approvalBeatPlanListAction,
  beatPlanDeleteService,
  fetchBeatPlan,
} from "../../redux/action/beatPlanAction";
import { Option } from "antd/es/mentions";
import { DeleteIcon } from "../../assets/globle";

const { Search } = Input;

const StaffAllBeatPlanList = () => {
  const dispatch = useDispatch();
  const { staff_id, name } = useParams();
  const navigate = useNavigate();
  const context = useContext(Context);
  const { listType, setDateOfRow, selectedStaffId, setSelectedStaffId } =
    context;
  const state = useSelector((state) => state);
  const [id, setId] = useState("");
  const [pageCount, setPageCount] = useState(1);
  const [filter_status, setFilterStatus] = useState("");

  const [allBeatList, setAllBeatList] = useState([]);
  const [search, setSearch] = useState("");

  setSelectedStaffId(staff_id);

  useEffect(() => {
    if (state.getBeatPlanRoot.data !== "") {
      if (state.getBeatPlanRoot.data.data.error === false)
        setAllBeatList(state.getBeatPlanRoot.data.data.data);
    }
  }, [state]);

  useEffect(() => {
    dispatch(
      fetchBeatPlan(pageCount, "", filter_status && filter_status, staff_id)
    );
  }, [filter_status, pageCount, staff_id]);

  useEffect(() => {
    const searchTerm = search;
    if (searchTerm.length > 0) {
      dispatch(fetchBeatPlan("", searchTerm, "", staff_id));
    }
    return;
  }, [search]);

  const handleOnClick = () => {
    id && navigate(`/web/beat-plan-details/${id}`);
  };

  const handleOnClickEdit = () => {
    id && navigate(`/web/edit-beat-plan-details/${id}/`);
    setSelectedStaffId(staff_id);
  };

  const items = [
    {
      key: "1",
      label: (
        <div onClick={handleOnClick}>
          <EditOutlined style={style.icon_edit} /> View Details
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div onClick={handleOnClickEdit}>
          <EditOutlined style={style.icon_edit} /> Edit
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <Popconfirm
          title="Are You Sure, You want to Delete Beat Plan ?"
          okText="Yes"
          placement="leftTop"
          style={{ width: "80px" }}
          onConfirm={() => {
            const deleteRequest = {
              id: id,
            };
            dispatch(beatPlanDeleteService(deleteRequest));
            dispatch(approvalBeatPlanListAction());
          }}
        >
          <img src={DeleteIcon} alt={"delete"} style={style.icon_delete} />{" "}
          Delete
        </Popconfirm>
      ),
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => {
        return <div style={{ width: "200px" }}>{text}</div>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => {
        return (
          <div>
            <span
              style={{
                color:
                  record.status === "PENDING"
                    ? "#F09F41"
                    : record.status === "ACTIVE"
                    ? "#228542"
                    : record.status === "APPROVED"
                    ? "#1593F4"
                    : record.status === "REJECTED"
                    ? "#F43D44"
                    : "#6C6C6C",
                background:
                  record.status === "PENDING"
                    ? "#FEF8F1"
                    : record.status === "ACTIVE"
                    ? "#EEFDF3"
                    : record.status === "APPROVED"
                    ? "#F0F8FE"
                    : record.status === "REJECTED"
                    ? "#FEF0F1"
                    : "#F5F5F5",
                padding: "4px 15px 4px 15px",
                borderRadius: "1pc",
              }}
            >
              {record.status}
            </span>
          </div>
        );
      },
    },
    {
      title: "Created By",
      dataIndex: "created_by_name",
      key: "name",
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      render: (text) => {
        return (
          <span style={{ width: "200px" }}>
            {moment(text).format("DD-MMM-YYYY")}
          </span>
        );
      },
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      render: (text) => {
        return (
          <span style={{ width: "200px" }}>
            {moment(text).format("DD-MMM-YYYY")}
          </span>
        );
      },
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
            setId(record.id);
          }}
        >
          <Dropdown
            menu={{
              items,
            }}
            onClick={() => {
              setId(record.id);
              setDateOfRow(record.start_date);
            }}
          >
            <a style={{ color: "black" }}>...</a>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <>
      <div>
        <h2 className="page_title">
          Beat Plan - {name}
          <div className="breadcrumb">
            <span onClick={() => navigator("/web")}>Home </span>
            <span onClick={() => navigate("/web/beat-plan")}> / beat-plan</span>
          </div>
        </h2>

        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: "82vh",
            background: colorBgContainer,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                height: "50px",
                display: "flex",
                flexDirection: "row",
                gap: "20px",
              }}
            >
              <Search
                placeholder="Search Beat Plan"
                size="large"
                onChange={(e) =>
                  setTimeout(() => {
                    setSearch(e.target.value);
                  }, 500)
                }
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
              }}
            >
              {/* filter by status */}
              <Select
                style={{
                  width: "200px",
                }}
                onChange={(e) => setFilterStatus(e)}
                value={filter_status}
              >
                <Option value="">All</Option>
                <Option value="APPROVED">Approved</Option>
                <Option value="PENDING">Pending</Option>
                <Option value="COMPLETED">Completed</Option>
                <Option value="REJECTED">Rejected</Option>
              </Select>
            </div>
          </div>

          <Table
            dataSource={allBeatList !== "" ? allBeatList : ""}
            columns={columns}
            pagination={false}
          />
        </Content>
      </div>
    </>
  );
};

export default StaffAllBeatPlanList;

const style = {
  icon_edit: {
    color: "green",
    cursor: "pointer",
    fontSize: 15,
  },
  icon_delete: {
    color: "red",
    cursor: "pointer",
    fontSize: 15,
  },
  active_plan: {
    width: "100%",
  },
  pending_plan: {
    width: "400px",
  },
  is_selected: {
    padding: "10px",
    borderTopLeftRadius: "5px",
    borderTopRightRadius: "5px",
    color: "black",
    background: "white",
  },
  is_not_selected: {
    padding: "10px",
    color: "black",
  },
};

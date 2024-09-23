import { Button, Dropdown, Space, Table } from "antd";
import { Content } from "antd/es/layout/layout";
import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CaretLeftOutlined,
  CaretRightOutlined,
  SearchOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import Context from "../../context/Context";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteGoals,
  getGoalById,
  getGoalTemplate,
} from "../../redux/action/goals";
import { toIndianCurrency } from "../../helpers/convertCurrency";
import Permissions from "../../helpers/permissions";
import { DeleteIcon, EditIcon } from "../../assets/globle";
import ConfirmDelete from "../../components/confirmModals/confirmDelete";
import SearchInput from "../../components/search-bar/searchInput";
import handleParams from "../../helpers/handleParams";
import Pagination from "../../components/pagination/pagination";

const Goal = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const navigate = useNavigate();
  const context = useContext(Context);
  const { setDeleteModalOpen } = context;

  const [searchParams, setSearchParams] = useSearchParams();
  const goalSearchInput = searchParams.get("query");

  const [pageCount, setPageCount] = useState(1);
  const [goalTemplateList, setGoalTemplateList] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState("");

  let viewTargetTemplate = Permissions("VIEW_TARGET_TEMPLATE");
  let setTargetTemplate = Permissions("SET_TARGET_TEMPLATE");
  let assignTarget = Permissions("ASSIGN_TARGET");

  const columns = [
    {
      title: "Target Name",
      dataIndex: "name",
      render: (text) => (
        <div>{text ? text.charAt(0).toUpperCase() + text.slice(1) : ""}</div>
      ),
      key: "goal_name",
    },
    {
      title: "Duration",
      dataIndex: "duration_string",
      key: "duration",
      align: "center",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Sales Amount",
      dataIndex: "target_sales_amount",
      render: (text) => (
        <div style={text > 0 ? {} : { color: "#ddd" }}>
          {toIndianCurrency(text)}
        </div>
      ),
      key: "duration",
      align: "center",
    },
    {
      title: "Payment Collection ",
      dataIndex: "target_payment_collection",
      render: (text) => (
        <div style={text > 0 ? {} : { color: "#ddd" }}>
          {toIndianCurrency(text)}
        </div>
      ),
      key: "duration",
      align: "center",
    },
    {
      title: "Leads",
      dataIndex: "target_new_leads",
      render: (text) => (
        <div style={text > 0 ? {} : { color: "#ddd" }}>{text}</div>
      ),
      key: "duration",
      align: "center",
    },
    {
      title: "New Customer ",
      dataIndex: "target_new_customers",
      render: (text) => (
        <div style={text > 0 ? {} : { color: "#ddd" }}>{text}</div>
      ),
      key: "duration",
      align: "center",
    },
    {
      title: "Customer Visit",
      dataIndex: "target_customer_visits",
      render: (text) => (
        <div style={text > 0 ? {} : { color: "#ddd" }}>{text}</div>
      ),
      key: "duration",
      align: "center",
    },
    setTargetTemplate
      ? {
          title: " ",
          dataIndex: "action",
          key: "action",
          width: 50,
          align: "end",
          render: (text, record) => (
            <div onMouseOver={() => setSelectedGoal(record)}>
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
      : { title: " " },
  ];

  const items = [
    {
      key: "1",
      label: (
        <div
          onClick={() => {
            dispatch(getGoalById(selectedGoal.id));
            setTimeout(() => {
              navigate(`/web/create-target?id=${selectedGoal.id}`);
            }, 200);
          }}
          className="action-dropdown-list"
        >
          <img src={EditIcon} alt="edit" /> Edit
        </div>
      ),
    },
    {
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

  const handleDeleteOrder = (data) => {
    if (data) {
      dispatch(deleteGoals(selectedGoal.id));
      setTimeout(() => {
        dispatch(getGoalTemplate(pageCount));
      }, 400);
    }
  };

  useEffect(() => {
    dispatch(getGoalTemplate(pageCount, goalSearchInput));
  }, [pageCount, goalSearchInput]);

  useEffect(() => {
    if (state.getGoalTemplate.data !== "") {
      if (state.getGoalTemplate.data.data.error === false)
        setGoalTemplateList(state.getGoalTemplate.data.data.data);
    }
  }, [state]);

  return (
    <div className="table_list position-rel">
      <h2 className="page_title">Target Template Setting</h2>
      <Content
        style={{
          padding: 24,
          margin: 0,
          minHeight: "82vh",
          position: "relative",
        }}
      >
        {" "}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <SearchInput
            placeholder="Search for target"
            searchValue={(data) =>
              handleParams(searchParams, setSearchParams, { query: data })
            }
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1em",
            }}
          >
            {setTargetTemplate && (
              <button
                onClick={() => navigate("/web/create-target")}
                className="button_secondary"
              >
                Create New Template
              </button>
            )}
            {assignTarget && (
              <button
                className="button_primary"
                onClick={() => navigate("/web/assign-target")}
                style={{ borderRadius: "5px" }}
              >
                Assign Target
              </button>
            )}
          </div>
        </div>
        <br />
        {viewTargetTemplate || setTargetTemplate || assignTarget ? (
          <>
            <Table
              pagination={false}
              columns={columns}
              dataSource={goalTemplateList}
            />
            <br />
            <br />
            <Pagination list={goalTemplateList} search={goalSearchInput} />
          </>
        ) : (
          <></>
        )}
        <ConfirmDelete
          title={"Target"}
          confirmValue={(data) => {
            handleDeleteOrder(data);
          }}
        />
      </Content>
    </div>
  );
};

export default Goal;

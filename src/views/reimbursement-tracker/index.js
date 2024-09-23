import { useEffect, useState, useContext } from "react";
import { Table, Spin, Select, Dropdown } from "antd";
import { Content } from "antd/es/layout/layout";
import moment from "moment";
import Context from "../../context/Context";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import styles from "./expenses.module.css";
import {
  reibursementService,
  reimbursementDeleteService,
} from "../../redux/action/reimbursementAction";
import { toIndianCurrency } from "../../helpers/convertCurrency";
import { Option } from "antd/es/mentions";
import ViewExpensesDetailComponent from "./viewExpensesDetail";
import ConfirmDelete from "../../components/confirmModals/confirmDelete";
import { ArrowLeft } from "../../assets/globle";
import { staffDetailsById } from "../../redux/action/staffAction";
import { Staff } from "../../assets/navbarImages";
import Pagination from "../../components/pagination/pagination";

const ReimbursementTracker = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const context = useContext(Context);
  const state = useSelector((state) => state);
  const { editReibursement, staff } = state;
  const { deleteModalOpen, setDeleteModalOpen, setLoading } = context;

  // get query params
  const queryParameters = new URLSearchParams(window.location.search);
  const staffId = queryParameters.get("staff_id");
  const userid = queryParameters.get("userid");
  const pageNumber = Number(queryParameters.get("page")) || 1;

  const [getId, setGetId] = useState("");
  const [rowData, setRowData] = useState("");
  const [filter_status, setFilterStatus] = useState("");
  const [reibursementTrackerList, setReibursementTrackerList] = useState("");

  useEffect(() => {
    if (staffId) {
      dispatch(staffDetailsById(staffId));
      dispatch(reibursementService("", pageNumber, userid, ""));
    }
  }, [staffId]);

  useEffect(() => {
    if (state.reibursementTracker.data !== "") {
      if (state.reibursementTracker.data.data.error === false)
        state.reibursementTracker.data.data.data.map((ele) => {
          ele.start_date_time = moment(ele.start_date_time).format(
            "DD-MMM-YYYY"
          );
        });
      {
        setReibursementTrackerList(state.reibursementTracker.data.data.data);
        setLoading(false);
      }
    }
    if (editReibursement.data && !editReibursement.data.data.error) {
      setRowData("");
    }
  }, [state]);

  // delete function
  const handleDeleteCustomer = (data) => {
    if (data === true) {
      rowData !== "" &&
        dispatch(reimbursementDeleteService(rowData?.id, false));
      setTimeout(() => {
        dispatch(reibursementService("", pageNumber));
        setRowData("");
      }, 400);
    }
  };

  const columns = [
    {
      title: "Expense Head",
      dataIndex: "name",
      width: "150px",
      render: (text) => {
        return <div style={{ fontWeight: "600", color: "#000" }}>{text}</div>;
      },
    },
    {
      title: " Duration",
      dataIndex: "start_date_time",
      width: "200px",
      render: (text, record) => {
        return (
          <div>
            {moment(record.start_date_time).format("DD MMM YY")} -{" "}
            {record.end_date_time !== null
              ? moment(record.end_date_time).format("DD MMM YY")
              : ""}
          </div>
        );
      },
    },
    {
      title: "Items Added",
      dataIndex: "total_items",
      render: (text) => {
        return <div style={{ fontWeight: "600" }}>{text}</div>;
      },
    },
    {
      title: "Expense",
      dataIndex: "total_amount",
      render: (text) => {
        return (
          <div style={{ fontWeight: "600", color: "#000" }}>
            {toIndianCurrency(text)}
          </div>
        );
      },
    },
    {
      title: "Status",
      key: "tags",
      dataIndex: "status",
      render: (_, { status }) => {
        let color =
          status === "Approved"
            ? "#288948"
            : status === "Active"
            ? "blue"
            : status === "Submitted"
            ? "orange"
            : status === "Paid"
            ? "#727176"
            : status === "Rejected"
            ? "red"
            : "gray";
        let background =
          status === "Approved"
            ? "#EEFDF3"
            : status === "Active"
            ? "#F0F8FE"
            : status === "Submitted"
            ? "#FEF8F1"
            : status === "Paid"
            ? "#F4F4F4"
            : status === "Rejected"
            ? "#FEF0F1"
            : "gray";
        return (
          <div key={status}>
            <span
              style={{
                color: color,
                background: background,
                padding: "3px 14px",
                borderRadius: "8px",
                border: "1px solid #FFF",
                fontSize: "13px",
              }}
            >
              {status}
            </span>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (staffId) {
      dispatch(reibursementService(filter_status, pageNumber, userid));
      return;
    }
    dispatch(reibursementService(filter_status, pageNumber));
  }, [filter_status, pageNumber]);

  const getRowClassName = (record) => {
    if (record.id === rowData?.id) {
      return "custom-row-class";
    }
    return "";
  };

  return (
    <>
      <div className="table_list">
        <h2 className={`${styles.page_header} page_title`}>
          {staffId && (
            <img src={ArrowLeft} alt="back" onClick={() => navigate(-1)} />
          )}
          Expense Tracker List
        </h2>

        <div className={styles.product_table_container}>
          <Content
            style={{
              padding: 24,
              paddingTop: 0,
              margin: 0,
              minHeight: "82vh",
              background: "transparent",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className={styles.filter_section}>
              {staffId && (
                <div className={styles.staff_img}>
                  <img
                    src={staff?.data?.data?.data?.profile_pic_url || Staff}
                    alt={staff?.data?.data?.data?.name}
                  />
                  <p>{staff?.data?.data?.data?.name}</p>
                </div>
              )}
              <div
                className={`${styles.filter_btns} ${
                  !staffId && styles.filter_section_space
                }`}
              >
                <Select
                  style={{
                    margin: "5",
                    height: "40px",

                    width: "175px",
                  }}
                  onChange={(e) => setFilterStatus(e)}
                  value={filter_status}
                  defaultValue="All"
                >
                  <Option value="">All</Option>
                  <Option value="Active">Active</Option>
                  <Option value="Approved">Approved</Option>
                  <Option value="Rejected">Rejected</Option>
                  <Option value="Submitted">Submitted</Option>
                </Select>

                <button
                  className="button_primary"
                  onClick={() => {
                    navigate("/web/expense-tracker/add-expense-head");
                  }}
                >
                  Add Expense Head
                </button>
              </div>
            </div>

            <Table
              columns={columns}
              dataSource={reibursementTrackerList}
              pagination={false}
              scroll={{ y: 500 }}
              onRow={(record, rowIndex) => ({
                onClick: () => {
                  // dispatch(productView(record.id));
                  setRowData(record);
                },
              })}
              style={{ cursor: "pointer" }}
              rowClassName={getRowClassName}
            />
            <br />
            <br />
            <Pagination list={reibursementTrackerList} />
          </Content>
          {rowData && rowData.id ? (
            <ViewExpensesDetailComponent
              data={rowData}
              pageNumber={pageNumber}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
      <ConfirmDelete
        title={"Expense Head"}
        open={deleteModalOpen}
        confirmValue={(rowData) => {
          handleDeleteCustomer(rowData);
          setDeleteModalOpen(rowData);
        }}
      />
    </>
  );
};

export default ReimbursementTracker;

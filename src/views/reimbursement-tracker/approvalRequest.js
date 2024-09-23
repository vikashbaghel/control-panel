import React, { useEffect, useState, useContext } from "react";
import { Table, Select } from "antd";
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
import { DeleteIcon, EditIcon } from "../../assets/globle";
import ConfirmDelete from "../../components/confirmModals/confirmDelete";
import { approvalReimbursementService } from "../../redux/action/approvalReimbursementAction";
import { Staff as staffIcon } from "../../assets/dashboardIcon";
import Pagination from "../../components/pagination/pagination";
import { useSearchParams } from "react-router-dom";

const ApprovalReimbursementTracker = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = Number(searchParams.get("page")) || 1;

  const context = useContext(Context);
  const state = useSelector((state) => state);
  const { deleteModalOpen, setDeleteModalOpen, setLoading } = context;
  const [rowData, setRowData] = useState("");
  const [filter_status, setFilterStatus] = useState("");
  const [reibursementTrackerList, setReibursementTrackerList] = useState("");
  const [
    approvalReimbursementTrackerList,
    setApprovalReimbursementTrackerList,
  ] = useState("");
  useEffect(() => {
    if (state.approvalReibursementTracker.data !== "") {
      if (state.approvalReibursementTracker.data.data.error === false)
        state.approvalReibursementTracker.data.data.data.map((ele) => {
          ele.start_date_time = moment(ele.start_date_time).format(
            "DD-MMM-YYYY"
          );
        });

      {
        setApprovalReimbursementTrackerList(
          state.approvalReibursementTracker.data.data.data
        );
        setLoading(false);
      }
      if (
        state.approvalReimbursementStatus.data !== "" &&
        !state.approvalReimbursementStatus.data.data.error
      )
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
      title: "Name",
      dataIndex: "created_by_name",
      width: "220px",
      render: (text, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1em",
            fontWeight: "600",
            color: "#000",
          }}
        >
          <img
            src={record.profile_pic_url || staffIcon}
            alt={text}
            style={{ width: "35px", height: "35px", borderRadius: "50%" }}
          />
          {text}
        </div>
      ),
    },
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
      width: "100px",
      render: (text) => {
        return <div style={{ fontWeight: "600" }}>{text}</div>;
      },
    },
    {
      title: "Expense",
      width: "130px",
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
      width: "130px",
      render: (_, { status }) => {
        let color =
          status === "Approved"
            ? "#288948"
            : status === "Active"
            ? "blue"
            : status === "Pending"
            ? "orange"
            : status === "Paid"
            ? "#727176"
            : status === "Rejected"
            ? "red"
            : "white";
        let background =
          status === "Approved"
            ? "#EEFDF3"
            : status === "Active"
            ? "#F0F8FE"
            : status === "Pending"
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
    dispatch(approvalReimbursementService(filter_status, pageNumber));
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
        <h2 className="page_title">Approval Request Tracker List </h2>
        <div className={styles.product_table_container}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: "82vh",
              background: "transparent",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={styleHeader}>
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
                <Option value="Approved">Approved</Option>
                <Option value="Rejected">Rejected</Option>
                <Option value="Submitted">Pending</Option>
                <Option value="Paid">Paid</Option>
              </Select>
            </div>

            <Table
              columns={columns}
              dataSource={approvalReimbursementTrackerList}
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
            <Pagination list={approvalReimbursementTrackerList} />
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

export default ApprovalReimbursementTracker;

const styleHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

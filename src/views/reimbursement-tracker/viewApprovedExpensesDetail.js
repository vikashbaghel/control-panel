import React from "react";
import { useEffect, useContext } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Context from "../../context/Context";
import styles from "./expenses.module.css";
import { feedbackActivityById } from "../../redux/action/recordFollowUpAction";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { orderViewAction } from "../../redux/action/orderViewAction";
import { ExpenseIcon } from "../../assets/globle";
import {
  reibursementListService,
  reibursementService,
  reimbursementDeleteService,
} from "../../redux/action/reimbursementAction";
import ViewExpenseItemComponent from "./viewExpenseModal";
import ConfirmDelete from "../../helpers/confirmDelete";
import { DeleteIcon, EditIcon } from "../../assets/globle";
import { NOExpenseIcon } from "../../assets/expense/index";
import { toIndianCurrency } from "../../helpers/convertCurrency";

const ViewExpensesDetailComponent = ({ data, date, pageNumber }) => {
  const queryParameters = new URLSearchParams(window.location.search);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state);
  const [expenseInfo, setExpenseInfo] = useState();
  const context = useContext(Context);
  const {
    setOrderViewOpen,
    setRecordActivityViewOpen,
    setViewReimbursementItemOpen,
    deleteModalOpen,
    setDeleteModalOpen,
  } = context;
  const [expenseItemDetails, setExpenseItemDetails] = useState([]);

  const { head_id } = data;

  useEffect(() => {
    dispatch(reibursementListService(data?.id));
  }, [data]);

  useEffect(() => {
    if (state.getReibursmentList.data !== "") {
      if (state.getReibursmentList.data.data.error === false) {
        setExpenseItemDetails(state.getReibursmentList.data.data.data);
      }
    }
  }, [state]);

  const handleViewModal = (item) => {
    if (item.module_type === "Order") {
      dispatch(orderViewAction(item.module_id));
      setOrderViewOpen(true);
    }
    if (item.module_type === "Order Dispatch") {
      dispatch(orderViewAction(item.sub_module_id));
      setOrderViewOpen(true);
    }
    if (
      item.module_type === "Lead Feedback" ||
      item.module_type === "Customer Feedback"
    ) {
      dispatch(feedbackActivityById(item.id));
      setRecordActivityViewOpen(true);
    }

    if (item.module_type === "Lead") {
      navigate(`/web/view-lead/?id=${item.module_id}`);
    }
    if (item.module_type === "Customer") {
      navigate(`/web/view-lead/?id=${item.module_id}`);
    }
    if (item.module_type === "Payment") {
      navigate(`/web/payment/?id=${item.module_id}`);
    }
  };

  const onHandleExpense = () => {
    navigate(
      `/web/expense-tracker/add-expense/?expense_head_id=${data.id}&expense_head_name=${data.name}`
    );
  };

  // delete function
  const handleDeleteHead = (data) => {
    if (data === true) {
      head_id !== undefined &&
        dispatch(reimbursementDeleteService(head_id, false));
      setTimeout(() => {
        dispatch(reibursementService("", pageNumber));
      }, 400);
    }
  };

  return (
    <>
      <div>
        {(data.status === "Active" || data.status === "Rejected") && (
          <div className={styles.form_button_submitted}>
            <button className="button_primary">Submitted</button>
            <img
              onClick={() => {
                setDeleteModalOpen(true);
              }}
              src={DeleteIcon}
              alt="delete"
            />
            <button
              className="button_secondary"
              onClick={() => {
                navigate(
                  `/web/expense-tracker/add-expense-head/?id=${data?.id}`
                );
              }}
            >
              <img width={"13px"} src={EditIcon} alt="edit" /> Edit
            </button>
          </div>
        )}
        <div className={styles.expense_details_main}>
          <div className={styles.activity_details_header}>
            <div style={{ display: "flex", gap: "5px" }}>
              <img style={{ width: "25px" }} src={ExpenseIcon} alt="" />
              <p style={{ color: "#000", margin: "0px" }}>{data.name}</p>
            </div>
            <div>
              <p style={{ fontSize: "10px", margin: "0px", color: "#727176" }}>
                {moment(data.start_date_time).format("DD MMM YY")} -{" "}
                {data.end_date_time !== null
                  ? moment(data.end_date_time).format("DD MMM YY")
                  : ""}
              </p>
            </div>
          </div>

          <div className={styles.activity_details_header}>
            <div>
              <p style={{ color: "#000", fontWeight: "600" }}>
                {" "}
                {toIndianCurrency(data?.total_amount)}
              </p>
            </div>
            <div
              className={styles.expense_details_status}
              style={{
                color:
                  data.status === "Approved"
                    ? "#288948"
                    : data.status === "Active"
                    ? "blue"
                    : data.status === "Submitted"
                    ? "orange"
                    : data.status === "Paid"
                    ? "#727176"
                    : data.status === "Rejected"
                    ? "red"
                    : "gray",
                background:
                  data.status === "Approved"
                    ? "#EEFDF3"
                    : data.status === "Active"
                    ? "#F0F8FE"
                    : data.status === "Submitted"
                    ? "#FEF8F1"
                    : data.status === "Paid"
                    ? "#F4F4F4"
                    : data.status === "Rejected"
                    ? "#FEF0F1"
                    : "gray",
              }}
            >
              {data.status}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div>
              <p style={{ color: "#727176", fontWeight: "600" }}>Description</p>
            </div>
            <div>{data.description}</div>
          </div>

          {data.status === "Rejected" && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div>
                <p style={{ color: "red", fontWeight: "600" }}>Reject Reason</p>
              </div>
              <div>{data.comments}</div>
            </div>
          )}
        </div>
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "20px 0px",
            }}
          >
            <p style={{ margin: "0px" }}>List of Expense</p>
            <button
              className="button_secondary"
              onClick={onHandleExpense}
              style={{ padding: "7px 20px 7px 10px", fontSize: "14px" }}
            >
              <span style={{ margin: "0px 5px", fontSize: "14px" }}>+</span> Add
              Expense
            </button>
          </div>
          {expenseItemDetails.length > 0 ? (
            <div>
              {expenseItemDetails.map((expenseItemDetails) => (
                <div
                  key={expenseItemDetails.id}
                  className={styles.expense_item}
                  onClick={() => {
                    setViewReimbursementItemOpen(true);
                    setExpenseInfo(expenseItemDetails);
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div style={{ color: "#727176", fontWeight: "600" }}>
                      {expenseItemDetails?.name}
                    </div>
                    <div style={{ color: "#727176", fontWeight: "600" }}>
                      {moment(expenseItemDetails?.expense_date_time).format(
                        "DD MMM"
                      )}
                    </div>
                  </div>
                  <div>
                    <p
                      style={{
                        color: "#000",
                        fontWeight: "600",
                        marginBottom: "0px",
                        fontSize: "16px",
                      }}
                    >
                      {" "}
                      {toIndianCurrency(expenseItemDetails?.amount)}
                    </p>
                    {/* <div>{moment(expenseItemDetails.expense_date_time).format("DD MMM")}</div> */}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "grid", placeItems: "center" }}>
              <img src={NOExpenseIcon} alt="" />
              <p>No Expenses recorded</p>
            </div>
          )}
          <ViewExpenseItemComponent data={expenseInfo} />
          <ConfirmDelete
            title={"Lead Category"}
            open={deleteModalOpen}
            confirmValue={(data) => {
              handleDeleteHead(data);
              setDeleteModalOpen(data);
            }}
          />
        </>
      </div>
    </>
  );
};

export default ViewExpensesDetailComponent;

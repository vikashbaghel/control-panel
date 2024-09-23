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
import { DeleteOutlineIcon, ExpenseIcon } from "../../assets/globle";
import {
  reibursementListService,
  reibursementService,
  reimbursementDeleteService,
  reimbursementEditService,
} from "../../redux/action/reimbursementAction";
import ViewExpenseItemComponent from "./viewExpenseModal";
import ConfirmDelete from "../../components/confirmModals/confirmDelete";
import { EditIcon } from "../../assets/globle";
import { NOExpenseIcon } from "../../assets/expense/index";
import {
  ApprovedreimbursementService,
  approvalReimbursementService,
} from "../../redux/action/approvalReimbursementAction";
import { DatePicker, Modal, Tooltip } from "antd";
import dayjs from "dayjs";
import { toIndianCurrency } from "../../helpers/convertCurrency";
import { Staff as staffIcon } from "../../assets/dashboardIcon";

const ViewExpensesDetailComponent = ({ data, date, pageNumber }) => {
  const dateFormat = "YYYY-MM-DD";
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
    isSubmittedOpen,
    setIsSubmittedlOpen,
  } = context;
  const [expenseItemDetails, setExpenseItemDetails] = useState([]);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const initialInput = {
    end_date_time: data.end_date_time,
  };
  const [formInput, setFormInput] = useState(initialInput);
  // state to manage the form error state
  const [error, setError] = useState(initialError);

  const [formInputReject, setFormInputReject] = useState(initialInputReject);
  // state to manage the form error state
  const [errorReject, setErrorReject] = useState(initialErrorReject);

  const { id } = data;

  // get path from url
  const path = window.location.pathname;
  const approvedPath = path === "/web/approval-request-tracker";
  const myExpensePath = path === "/web/expense-tracker";

  const resetDatePickerValues = () => {
    setFormInput((prevState) => ({
      ...prevState,
      end_date_time: undefined,
    }));
  };

  useEffect(() => {
    dispatch(reibursementListService(data?.id));
  }, [data]);

  useEffect(() => {
    if (state.getReibursmentList.data !== "") {
      if (state.getReibursmentList.data.data.error === false) {
        setExpenseItemDetails(state.getReibursmentList.data.data.data);
      }
    }
    if (state.editReibursement.data !== "") {
      if (state.editReibursement.data.data.error === false) {
        if (state.editReibursement.data.status === 200) {
          navigate("/web/expense-tracker");
          dispatch(reibursementService("", pageNumber));
          resetDatePickerValues();
        }
      }
    }
    if (state.approvalReimbursementStatus.data !== "") {
      if (state.approvalReimbursementStatus.data.data.error === false) {
        if (state.approvalReimbursementStatus.data.status === 200) {
          navigate("/web/approval-request-tracker");
          dispatch(approvalReimbursementService("", pageNumber));
          resetDatePickerValues();
        }
      }
    }
  }, [state]);

  const handleFormInputChange = (e) => {
    setFormInputReject((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

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
      // `/web/expense-tracker/add-expense/?expense_head_id=${data.id}&expense_head_name=${data.name}`
      `/web/expense-tracker/add-expense?expense_head_id=${
        data.id
      }&start_date=${moment(data.start_date_time).format(
        dateFormat
      )}&end_date=${moment(data.end_date_time).format(dateFormat)}`
    );
  };

  // delete function
  const handleDeleteHead = (data) => {
    if (data === true) {
      id !== undefined && dispatch(reimbursementDeleteService(id));
      setTimeout(() => {
        dispatch(reibursementService("", pageNumber));
      }, 400);
    }
  };

  const handleStartDateChange = (date, dateString) => {
    setFormInput((prevState) => {
      return { ...prevState, end_date_time: dateString };
    });
  };

  // handle submitted expense
  const onHandleSubmitted = () => {
    if (!formInput.end_date_time) {
      setError((prevState) => ({
        ...prevState,
        end_date_time: true,
      }));
    }
    const apiData = {
      status: "Submitted",
      id: data.id,
      end_date_time: moment(formInput.end_date_time).format(
        "YYYY-MM-DDTh:mm:ss"
      ),
    };
    dispatch(reimbursementEditService(apiData));
    setIsSubmittedlOpen(false);
  };

  useEffect(() => {
    setTimeout(() => {
      setError(initialError);
    }, 5000);
  }, [error]);

  // handle Approve
  const onHandleApprove = () => {
    const apiData = {
      status: "Approved",
    };
    dispatch(ApprovedreimbursementService(apiData, data.id));
  };

  // handle Reject
  const onHandleRejected = () => {
    if (!formInput.comments) {
      setError((prevState) => ({
        ...prevState,
        comments: true,
      }));
    }
    let values = formInputReject;
    const apiData = {
      status: "Rejected",
      comments: values.comments,
    };
    dispatch(ApprovedreimbursementService(apiData, data.id));
  };

  const disabledDates = (current) => {
    return (
      current < moment(data.start_date_time) || current > moment().endOf("day")
    );
  };

  useEffect(() => {
    setTimeout(() => {
      setErrorReject(initialErrorReject);
    }, 5000);
  }, [error]);

  const closeExpenseModal = () => {
    setIsSubmittedlOpen(false);
    setFormInput(initialInput);
  };

  return (
    <>
      <div>
        {myExpensePath && (
          <div>
            {(data.status === "Active" || data.status === "Rejected") && (
              <div className={styles.form_button_submitted}>
                <button
                  className="button_primary"
                  onClick={() => setIsSubmittedlOpen(true)}
                >
                  Submit
                </button>
                <img
                  onClick={() => {
                    setDeleteModalOpen(true);
                  }}
                  src={DeleteOutlineIcon}
                  alt="delete"
                  className="clickable"
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
          </div>
        )}
        {approvedPath && (
          <div>
            {data.status === "Pending" && (
              <div className={styles.form_button_submitted}>
                <button className="button_primary" onClick={onHandleApprove}>
                  Approve
                </button>
                <button
                  className="button_secondary"
                  onClick={() => {
                    setIsRejectModalOpen(true);
                  }}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        )}
        <div
          className={`${styles.expense_details_main} ${
            data.status !== "Pending" && styles.expense_details_main_topmargin
          }`}
        >
          <div className={styles.activity_details_header}>
            <div style={{ display: "flex", gap: "5px" }}>
              <img style={{ width: "25px" }} src={ExpenseIcon} alt="" />
              <Tooltip title={data.name}>
                <p
                  style={{
                    color: "#000",
                    margin: "0px",
                    maxWidth: "150px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {data.name}
                </p>
              </Tooltip>
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
            <p className={styles.activity_created_by_name}>
              <img src={data?.profile_pic_url || staffIcon} alt="" />{" "}
              <Tooltip title={data.created_by_name}>
                <span
                  style={{
                    maxWidth: "150px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {data.created_by_name}
                </span>
              </Tooltip>
            </p>

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
                    : data.status === "Pending"
                    ? "orange"
                    : data.status === "Paid"
                    ? "#727176"
                    : data.status === "Rejected"
                    ? "red"
                    : "white",
                background:
                  data.status === "Approved"
                    ? "#EEFDF3"
                    : data.status === "Active"
                    ? "#F0F8FE"
                    : data.status === "Submitted"
                    ? "#FEF8F1"
                    : data.status === "Pending"
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
          <p
            style={{
              color: "#000",
              fontWeight: "600",
              paddingLeft: ".5em",
              margin: 0,
            }}
          >
            {toIndianCurrency(data?.total_amount)}
          </p>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div>
              <p style={{ color: "#727176", fontWeight: "600" }}>Description</p>
            </div>
            <div style={{ wordBreak: "break-word" }}>{data.description}</div>
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
          {myExpensePath && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "20px 0px",
              }}
            >
              <p style={{ margin: "0px" }}>List of Expense</p>
              {data.status === "Active" && (
                <button
                  className="button_secondary"
                  onClick={onHandleExpense}
                  style={{ padding: "7px 20px 7px 10px", fontSize: "14px" }}
                >
                  <span style={{ margin: "0px 5px", fontSize: "14px" }}>+</span>{" "}
                  Add Expense
                </button>
              )}
            </div>
          )}
          {approvedPath && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "20px 0px",
              }}
            >
              <p style={{ margin: "0px" }}>List of Expense</p>
            </div>
          )}
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
                    <Tooltip title={expenseItemDetails?.name}>
                      <div
                        style={{
                          color: "#727176",
                          fontWeight: "600",
                          maxWidth: "150px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {expenseItemDetails?.name}
                      </div>
                    </Tooltip>
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
          <ViewExpenseItemComponent
            data={expenseInfo}
            pageNumber={pageNumber}
          />
          <ConfirmDelete
            title={"Expense"}
            open={deleteModalOpen}
            confirmValue={(data) => {
              handleDeleteHead(data);
              setDeleteModalOpen(data);
            }}
          />

          <Modal
            centered
            title={
              <div
                style={{
                  padding: 15,
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: 600,
                  height: 25,
                }}
              >
                {" "}
              </div>
            }
            open={isSubmittedOpen}
            footer={[
              <div
                style={{
                  marginTop: 20,
                  display: "flex",
                  background: "#fff",
                  padding: 15,
                  flexDirection: "row-reverse",
                  borderRadius: "0 0 10px 10px",
                }}
                className={styles.edit_header}
              >
                <button className="button_primary" onClick={onHandleSubmitted}>
                  Submit
                </button>
                <button
                  className="button_secondary"
                  style={{ marginRight: 20 }}
                  onClick={closeExpenseModal}
                >
                  Cancel
                </button>
              </div>,
            ]}
            onCancel={closeExpenseModal}
            className={styles.product_category_main}
            style={{ padding: "0px !important" }}
            width={600}
          >
            <form>
              <div
                className={styles.product_category_body_name}
                style={{ margin: "10px 20px" }}
              >
                <label>
                  End Date <span style={{ color: "red" }}>*</span>
                </label>
                <DatePicker
                  format={dateFormat}
                  name="expense_date_time"
                  disabledDate={disabledDates}
                  onChange={handleStartDateChange}
                  style={{ width: "100%", height: "40px" }}
                  className={error.end_date_time ? styles.input_error : ""}
                  value={
                    formInput.end_date_time
                      ? dayjs(formInput.end_date_time, "YYYY-MM-DD")
                      : ""
                  }
                />
                {error.end_date_time ? (
                  <div className={styles.error}>Select End Date</div>
                ) : (
                  <></>
                )}
              </div>
            </form>
          </Modal>
          {/* Reject MOdal */}
          <Modal
            centered
            open={isRejectModalOpen}
            footer={null}
            closable={false}
            className={styles.product_category_main}
            style={{ padding: "0px !important" }}
            width={600}
          >
            <div className={styles.product_category_main_header}>
              <div className={styles.product_category_main_header_title}>
                {/* {data === "" ? "Create New Lead Category" : "Update Lead Category"} */}
              </div>
              <div
                onClick={() => {
                  setIsRejectModalOpen(false);
                  setFormInputReject(initialErrorReject);
                }}
                className={styles.product_category_main_header_cross}
              >
                X
              </div>
            </div>
            <form>
              <div className={styles.product_category_body_main}>
                <div className={styles.product_category_body_name}>
                  <label>
                    Reject Reason <span style={{ color: "red" }}>*</span>
                  </label>
                  <textarea
                    name="comments"
                    onChange={handleFormInputChange}
                    style={{ width: "95%", height: "40px" }}
                    className={errorReject.comments ? styles.input_error : ""}
                    value={formInputReject.comments}
                  />
                  {errorReject.comments ? (
                    <div className={styles.error}>Enter Reject Reason</div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </form>
            <div className={styles.product_category_footer}>
              <button
                className="button_secondary"
                onClick={() => {
                  setIsRejectModalOpen(false);
                  setFormInputReject(initialErrorReject);
                }}
              >
                Cancel
              </button>
              <button className="button_primary" onClick={onHandleRejected}>
                Submit
              </button>
            </div>
          </Modal>
        </>
      </div>
    </>
  );
};

export default ViewExpensesDetailComponent;

const initialError = {
  end_date_time: false,
};

const initialInputReject = {
  comments: "",
};

const initialErrorReject = {
  comments: false,
};

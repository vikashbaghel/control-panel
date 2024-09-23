import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Context from "../../context/Context";
import { Modal, Tooltip } from "antd";
//api called
import Styles from "./expenses.module.css";
import moment from "moment";
import styles from "../../components/viewDrawer/order.module.css";
import {
  EditIcon,
  DeleteIcon,
  DeleteOutlineIcon,
} from "../../assets/globle/index.js";
import {
  reibursementItemDetailsService,
  reibursementListService,
  reibursementService,
  reimbursementItemDeleteService,
} from "../../redux/action/reimbursementAction";
import { useState } from "react";
import { roundToDecimalPlaces } from "../../helpers/roundToDecimal";
import { NoDataIcon } from "../../assets/expense/index";
import { useNavigate } from "react-router-dom";
import { toIndianCurrency } from "../../helpers/convertCurrency";

const ViewExpenseItemComponent = ({ data, pageNumber }) => {
  const context = useContext(Context);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state);
  const [reibursementItemDetails, setReibursementItemDetails] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const {
    viewReimbursementItemOpen,
    setViewReimbursementItemOpen,
    // setDeleteModalOpen,
    // deleteModalOpen,
  } = context;

  // get path from url
  const path = window.location.pathname;
  const approvedPath = path === "/web/approval-request-tracker";
  const myExpensePath = path === "/web/expense-tracker";

  useEffect(() => {
    dispatch(reibursementItemDetailsService(data?.id));
  }, [data]);

  useEffect(() => {
    if (state.getReimbursementItemDetails.data !== "") {
      if (state.getReimbursementItemDetails.data.data.error === false) {
        setReibursementItemDetails(
          state.getReimbursementItemDetails.data.data.data
        );
      }
    }
  }, [state]);

  const onHandleExpense = () => {
    navigate(
      `/web/expense-tracker/add-expense/?expense_head_id=${reibursementItemDetails?.reimbursementtracker}&expense_head_name=${reibursementItemDetails.expense_head_name}&expense_id=${reibursementItemDetails?.id}`
    );
    setViewReimbursementItemOpen(false);
  };

  const onCancel = () => {
    setViewReimbursementItemOpen(false);
  };

  const handleDeleteHead = (data) => {
    if (data === true) {
      dispatch(reimbursementItemDeleteService(data.id));
      setTimeout(() => {
        onCancel();
        dispatch(reibursementListService(data.reimbursementtracker));
      }, 400);
    }
  };

  return (
    <>
      <Modal
        centered
        open={viewReimbursementItemOpen}
        footer={null}
        style={{ padding: "0px !important" }}
        className={Styles.record_activity_main}
        onCancel={onCancel}
        width={600}
        title={
          <div
            style={{
              padding: 15,
              textAlign: "center",
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            Expense Details
          </div>
        }
      >
        <div className={Styles.record_activity_body_main_view}>
          <div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Tooltip title={reibursementItemDetails?.name}>
                  <div
                    style={{
                      color: "#000",
                      fontWeight: "600",
                      maxWidth: "250px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {reibursementItemDetails?.name}
                  </div>
                </Tooltip>
                <div style={{ color: "#727176" }}>
                  {moment(reibursementItemDetails?.expense_date_time).format(
                    "DD MMM"
                  )}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div
                  style={{ color: "#000", fontWeight: "600", fontSize: "18px" }}
                >
                  {toIndianCurrency(reibursementItemDetails?.amount)}
                </div>
                {myExpensePath && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    <button
                      onClick={onHandleExpense}
                      className="button_secondary"
                    >
                      <img width={"13px"} src={EditIcon} alt="" /> Edit
                    </button>
                    <img
                      src={DeleteOutlineIcon}
                      style={{ cursor: "pointer" }}
                      alt=""
                      onClick={() => {
                        setDeleteModalOpen(true);
                      }}
                    />
                  </div>
                )}
              </div>

              {reibursementItemDetails.description && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ color: "#727176" }}>Description</div>
                  <div>
                    <p style={{ fontSize: "15px", margin: "0px" }}>
                      {reibursementItemDetails.description
                        ? reibursementItemDetails.description
                        : ""}
                    </p>
                  </div>
                </div>
              )}

              {reibursementItemDetails?.bill_proof_urls?.length > 0 ? (
                <div>
                  <div style={{ color: "#727176" }}>Photo / Docs</div>
                  <div className={styles.img_view}>
                    {reibursementItemDetails &&
                      reibursementItemDetails.bill_proof_urls &&
                      reibursementItemDetails.bill_proof_urls.map(
                        (data, index) => {
                          return (
                            <div
                              style={{ position: "relative" }}
                              className={styles.view_img_preview_container}
                            >
                              <div>
                                <img
                                  width="88px"
                                  height="88px"
                                  style={{ margin: "6px 6px 2px 6px" }}
                                  src={data.url}
                                  alt=""
                                />
                              </div>
                            </div>
                          );
                        }
                      )}
                  </div>
                </div>
              ) : (
                <></>
              )}
              {reibursementItemDetails.description === "" &&
              reibursementItemDetails.bill_proof_urls.length === 0 ? (
                <div style={{ display: "grid", placeItems: "center" }}>
                  <img src={NoDataIcon} alt="" />
                  <p>No other details</p>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        <ConfirmDelete
          title={"Expense Details"}
          open={deleteModalOpen}
          closeModal={(data) => {
            setDeleteModalOpen(data);
          }}
          data={data}
          pageNumber={pageNumber}
        />
      </Modal>
    </>
  );
};

export default ViewExpenseItemComponent;

const ConfirmDelete = ({ title, open, closeModal, data, pageNumber }) => {
  const dispatch = useDispatch();
  const context = useContext(Context);
  const { setViewReimbursementItemOpen } = context;

  const onCancel = () => {
    closeModal(false);
  };

  const onSubmit = () => {
    dispatch(reimbursementItemDeleteService(data.id));
    onCancel();
    setTimeout(() => {
      setViewReimbursementItemOpen(false);
      dispatch(reibursementListService(data.reimbursementtracker));
      dispatch(reibursementService("", pageNumber));
    }, 1000);
  };

  return (
    title && (
      <div>
        <Modal
          centered
          open={open}
          className={styles.delet_main}
          onCancel={onCancel}
          title={
            <div
              style={{
                padding: 15,
                textAlign: "center",
                fontSize: 18,
                fontWeight: 650,
              }}
            >
              Delete {title} ?
            </div>
          }
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
              <button className="button_primary" onClick={onSubmit}>
                Delete
              </button>
              <button
                className="button_secondary"
                style={{ marginRight: 20 }}
                onClick={onCancel}
              >
                Cancel
              </button>
            </div>,
          ]}
        >
          <div className={styles.delet_p} style={{ padding: "20px" }}>
            Are You Sure, You want to Delete Your {title} ?
          </div>
        </Modal>
      </div>
    )
  );
};

import React, { useContext, useState } from "react";
import Context from "../../context/Context";
import { useDispatch } from "react-redux";
import { orderAction, updateStatus } from "../../redux/action/orderAction";
import styles from "../../helpers/helper.module.css";
import TextArea from "antd/es/input/TextArea";
import { Modal, Select } from "antd";
import { orderActionDetailsBYId } from "../../redux/action/getOrderDetalsByIdAction";
import { useNavigate } from "react-router-dom";
import Permissions from "../../helpers/permissions";
import { orderViewAction } from "../../redux/action/orderViewAction";
import { OrderStatusView } from "../statusView";
import "./updateStatus.css";

const UpdateStatus = ({
  record,
  filters = {},
  orderId,
  block = false,
  refreshOrderList = true,
  color = "",
}) => {
  const navigate = useNavigate();
  const context = useContext(Context);
  const dispatch = useDispatch();
  const { editDistributorData, setShippedOrderData, setAttendanceModalAction } =
    context;
  const [status, setStatus] = useState("");
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [error, setError] = useState(false);

  // Permissions List
  let approveOrderPermission = Permissions("APPROVE_ORDER");
  let processOrderPermission = Permissions("PROCESS_ORDER");
  let readyToDispatchOrderPermission = Permissions("READY_TO_DISPATCH_ORDER");
  let dispatchOrderPermission = Permissions("DISPATCH_ORDER");
  let deliverOrderPermission = Permissions("DELIVER_ORDER");
  let rejectOrderPermission = Permissions("REJECT_ORDER");
  let closeOrderPermission = Permissions("CLOSE_ORDER");

  const fetchOrderList = () => {
    dispatch(orderAction(filters));
  };

  const handleStatusChange = (v) => {
    if (v === "Rejected") {
      setShowRejectReason(true);
      return;
    }
    if (v === "Shipped") {
      setShippedOrderData(record);
      localStorage.setItem("rupyzDispatchItems", JSON.stringify(record.items));
      navigate("/web/order/shipped-order");
      return;
    }
    if (v === "close") {
      dispatch(updateStatus(record.id, { delivery_status: "Closed" }));
      handleUpdateStatus();
      setShowRejectReason(false);
      return;
    }
    dispatch(updateStatus(record.id, { delivery_status: v }));
    setStatus(v);
    handleUpdateStatus();
    setShowRejectReason(false);
  };

  const handleUpdateStatus = () => {
    if (orderId) {
      setTimeout(() => {
        dispatch(orderViewAction(orderId));
      }, 500);
      return;
    }
    setTimeout(() => {
      fetchOrderList();
      if (refreshOrderList) {
        dispatch(orderActionDetailsBYId(editDistributorData.id));
      }
    }, 500);
  };

  const optionList = {
    Received: [
      { label: "Received", value: "Received" },
      ...(approveOrderPermission
        ? [{ label: "Approve", value: "Approved" }]
        : []),
      ...(rejectOrderPermission
        ? [{ label: "Reject", value: "Rejected" }]
        : []),
    ],
    Approved: [
      { label: "Approve", value: "Approved" },
      ...(processOrderPermission
        ? [{ label: "Processing", value: "Processing" }]
        : []),
      ...(readyToDispatchOrderPermission
        ? [{ label: "Ready to dispatch", value: "Ready To Dispatch" }]
        : []),
      ...(dispatchOrderPermission
        ? [{ label: "Dispatch", value: "Shipped" }]
        : []),
      ...(rejectOrderPermission
        ? [{ label: "Reject", value: "Rejected" }]
        : []),
    ],
    Processing: [
      { label: "Processing", value: "Processing" },
      ...(readyToDispatchOrderPermission
        ? [{ label: "Ready to dispatch", value: "Ready To Dispatch" }]
        : []),
      ...(dispatchOrderPermission
        ? [{ label: "Dispatch", value: "Shipped" }]
        : []),
      ...(rejectOrderPermission
        ? [{ label: "Reject", value: "Rejected" }]
        : []),
    ],
    "Ready To Dispatch": [
      { label: "Ready to dispatch", value: "Ready To Dispatch" },
      ...(dispatchOrderPermission
        ? [{ label: "Dispatch", value: "Shipped" }]
        : []),
    ],
    "Partial Shipped": [
      { label: "Partial Dispatch", value: "Partial Shipped" },
      ...(!record.is_closed && dispatchOrderPermission
        ? [{ label: "Dispatch", value: "Shipped" }]
        : []),
      ...(deliverOrderPermission
        ? [{ label: "Delivered", value: "Delivered" }]
        : []),
      ...(!record.is_closed && closeOrderPermission
        ? [{ label: "Close", value: "close" }]
        : []),
    ],
    Shipped: [
      { label: "Dispatch", value: "Shipped" },
      ...(deliverOrderPermission
        ? [{ label: "Delivered", value: "Delivered" }]
        : []),
    ],
  };

  const statusClassName = {
    Received: "custom-select_received",
    Approved: "custom-select_approved",
    Processing: "custom-select_approved",
    "Ready To Dispatch": "custom-select_approved",
    Shipped: "custom-select_shipped",
    "Partial Shipped": "custom-select_shipped",
    Delivered: "custom-select_shipped",
    Rejected: "custom-select_rejected",
  };

  return (
    <div>
      {record.delivery_status !== "Rejected" &&
      record.delivery_status !== "Delivered" ? (
        <div
          className={
            color ? "custom-select" : statusClassName[record.delivery_status]
          }
        >
          <Select
            options={optionList[record.delivery_status]}
            style={{ width: block ? "100%" : 140, textAlign: "center" }}
            value={status || record.delivery_status}
            onChange={(e) =>
              setAttendanceModalAction({
                open: true,
                handleAction: () => handleStatusChange(e),
              })
            }
          />
        </div>
      ) : (
        <OrderStatusView status={record.delivery_status} {...{ block }} />
      )}
      <Modal
        open={showRejectReason}
        style={{ position: "relative" }}
        centered
        closable={false}
        title={
          <div
            style={{
              padding: 15,
              textAlign: "center",
              fontSize: 18,
              fontWeight: 600,
              fontFamily: "Poppins",
            }}
          >
            Reject Reason
          </div>
        }
        footer={[
          <div
            style={{
              marginTop: 20,
              display: "flex",
              background: "#fff",
              padding: " 15px 0px",
              flexDirection: "row-reverse",
              borderRadius: "0 0 10px 10px",
            }}
            className={styles.edit_header}
          >
            <button
              className="button_primary"
              style={{ marginRight: 20, fontFamily: "Poppins" }}
              onClick={() => {
                if (rejectReason) {
                  dispatch(
                    updateStatus(record.id, {
                      delivery_status: "Rejected",
                      reject_reason: rejectReason,
                    })
                  );
                  setShowRejectReason(false);
                  handleUpdateStatus();
                  setStatus("Rejected");
                } else {
                  setError(true);
                  setTimeout(() => {
                    setError(false);
                  }, 3000);
                }
              }}
            >
              Submit
            </button>
            <button
              className="button_secondary"
              style={{ marginRight: 20, fontFamily: "Poppins" }}
              onClick={() => setShowRejectReason(false)}
            >
              Cancel
            </button>
          </div>,
        ]}
      >
        <div style={{ margin: "20px 25px 5px 25px" }}>
          <label
            style={{ fontFamily: "Poppins", fontSize: 15, fontWeight: 500 }}
          >
            Reason <span style={{ color: "red" }}>*</span>
          </label>
          <TextArea
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            style={{ resize: "none", border: error ? "1px solid red" : "" }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default UpdateStatus;

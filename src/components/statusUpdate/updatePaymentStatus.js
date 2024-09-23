import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../helpers/helper.module.css";
import { Select, notification } from "antd";
import {
  paymentAction,
  paymentActionById,
  paymentActionUpdateStatus as paymentActionUpdateStatusAPI,
} from "../../redux/action/paymentAction";
import Permissions from "../../helpers/permissions";
import RejectReasonModal from "../../helpers/rejectReason";
import Context from "../../context/Context";
import ConfirmApprove from "../confirmModals/confirmApprove";
import { useSearchParams } from "react-router-dom";
import { PaymentStatusView } from "../statusView";

const { Option } = Select;

const UpdatePaymentStatus = ({ record, filters }) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const [status, setStatus] = useState("");
  const context = useContext(Context);
  const {
    setShowRejectReason,
    setIsConfirmApproveOpen,
    setAttendanceModalAction,
  } = context;

  let paymentStatusUpdatePermission = Permissions("PAYMENT_STATUS_UPDATE");

  useEffect(() => {
    setStatus(record.status);
  }, [record]);

  const handleStatusChange = (e) => {
    if (e === "Dishonour") {
      setShowRejectReason(true);
      return;
    }
    setIsConfirmApproveOpen(true);
  };

  useEffect(() => {
    if (
      state.paymentActionUpdateStatus?.data &&
      state.paymentActionUpdateStatus.data.data.error === false
    ) {
      setIsConfirmApproveOpen(false);
      handleReloadData();
    }
  }, [state]);

  const handleReloadData = () => {
    dispatch(paymentActionById(record.id));
    dispatch(paymentAction(filters));
  };

  return (
    <div>
      {record.status &&
      record.status === "Pending" &&
      paymentStatusUpdatePermission ? (
        <Select
          // className={styles.select_field}
          onChange={(e) =>
            setAttendanceModalAction({
              open: true,
              handleAction: () => handleStatusChange(e),
            })
          }
          value={status}
        >
          <>
            <Option className={styles.option} value="Pending" disabled>
              Pending
            </Option>
            <Option className={styles.option} value="Approved">
              Approve
            </Option>
            <Option className={styles.option} value="Dishonour">
              Reject
            </Option>
          </>
        </Select>
      ) : (
        <PaymentStatusView status={record.status} />
      )}
      <div style={{ position: "relative" }}>
        <RejectReasonModal
          submitReason={(reason) =>
            reason
              ? (dispatch(
                  paymentActionUpdateStatusAPI(record.id, "Dishonour", reason)
                ),
                setShowRejectReason(false))
              : notification.warning({
                  message: "Please Give the Reason for Reject",
                })
          }
        />
        <ConfirmApprove
          submitReason={() => {
            dispatch(paymentActionUpdateStatusAPI(record.id, "Approved"));
          }}
          title={"Payment"}
        />
      </div>
    </div>
  );
};

export default UpdatePaymentStatus;

import React, { useEffect, useState } from "react";
import { approvalBeatPlanDetailsAction } from "../../redux/action/beatPlanAction";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "antd";
import styles from "./beatPlanDetails.module.css";
import Cookies from "universal-cookie";
import Permissions from "../../helpers/permissions";

const UpdateBeatStatus = ({ status, beatId, isActive }) => {
  const dispatch = useDispatch();
  const cookies = new Cookies();

  const [updateStatus, setUpdateStatus] = useState("");

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const admin = cookies.get("rupyzAccessType") === "WEB_SARE360" ? true : false;

  const isDropDownOn = Permissions("BEAT_PLAN_APPROVAL") || admin;

  const handleStatusUpdate = (status, reason) => {
    let apiData = { status: status, id: beatId };
    Object.assign(
      apiData,
      updateStatus === "APPROVE"
        ? { comments: reason }
        : { reject_reason: reason }
    );
    dispatch(approvalBeatPlanDetailsAction(apiData));
  };

  useEffect(() => {
    if (updateStatus === "APPROVE") {
      setIsApproveModalOpen(true);
    }
    if (updateStatus === "REJECT") {
      setIsRejectModalOpen(true);
    }
  }, [updateStatus]);

  let color;
  let background;
  let border;
  switch (status) {
    case "PENDING":
      color = "#EF9834";
      background = "#FEF8F1";
      border = "1px solid #EF9834";
      break;
    case "ACTIVE":
      color = "#297B00";
      background = "#EEFDF3";
      border = "1px solid #297B00";
      break;
    case "APPROVED":
      color = "#297B00";
      background = "#EEFDF3";
      border = "1px solid #297B00";
      break;
    case "REJECTED":
      color = "#F3252C";
      background = "#FEF0F1";
      border = "1px solid #F3252C";
      break;
    default:
      color = "#6A6A6A";
      background = "#EEEEEE";
      border = "1px solid #6A6A6A";
      break;
  }

  return (
    <div>
      {status === "PENDING" && isDropDownOn ? (
        <select
          style={{
            color: color,
            background: background,
            border: border,
            padding: "6px 25px",
            borderRadius: "5px",
            width: 130,
          }}
          onChange={(event) => setUpdateStatus(event.target.value)}
          value={updateStatus}
        >
          {["PENDING", "APPROVE", "REJECT"].map((value, index) => (
            <option value={value} key={index}>
              {value}
            </option>
          ))}
        </select>
      ) : (
        <div
          style={{
            color: color,
            background: background,
            border: border,
            padding: "6px 20px",
            borderRadius: "5px",
            width: 130,
            textAlign: "center",
            fontSize: 13,
          }}
        >
          {status}
        </div>
      )}
      {isActive && (
        <div
          style={{
            fontSize: 13,
            marginTop: 5,
            textAlign: "center",
            color: "#727176",
          }}
        >
          Active Beat Plan
        </div>
      )}
      <ApproveModal
        isOpen={isApproveModalOpen}
        close={(data) => {
          setIsApproveModalOpen(data);
          setUpdateStatus("PENDING");
        }}
        submit={(data) => handleStatusUpdate("APPROVED", data)}
      />
      <RejectModal
        isOpen={isRejectModalOpen}
        close={(data) => {
          setIsRejectModalOpen(data);
          setUpdateStatus("PENDING");
        }}
        submit={(data) => handleStatusUpdate("REJECTED", data)}
      />
    </div>
  );
};

export default UpdateBeatStatus;

const ApproveModal = ({ isOpen, close, submit }) => {
  const [approveNote, setApproveNote] = useState("");

  const handleSubmit = () => {
    submit(approveNote);
    onCancel();
  };

  const onCancel = () => {
    close(false);
    setApproveNote("");
  };
  return (
    <Modal
      open={isOpen}
      onCancel={onCancel}
      centered
      width={500}
      title={
        <div
          style={{
            padding: 15,
            textAlign: "center",
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          Approve Reason
        </div>
      }
      footer={[
        <div
          style={{
            marginTop: 20,
            display: "flex",
            background: "#fff",
            padding: 15,
            borderRadius: "0 0 10px 10px",
            justifyContent: "end",
          }}
        >
          <button
            className="button_secondary"
            onClick={onCancel}
            style={{ marginRight: 20 }}
          >
            Cancel
          </button>
          <button className="button_primary" onClick={handleSubmit}>
            Save
          </button>
        </div>,
      ]}
    >
      <div className={styles.approve_container}>
        <label>
          Reason <span>(Optional)</span>
        </label>
        <textarea
          onChange={(event) => setApproveNote(event.target.value)}
          value={approveNote}
        />
      </div>
    </Modal>
  );
};
const RejectModal = ({ isOpen, close, submit }) => {
  const [rejectNote, setRejectNote] = useState("");

  const handleSubmit = () => {
    submit(rejectNote);
    onCancel();
  };
  const onCancel = () => {
    close(false);
    setRejectNote("");
  };
  return (
    <Modal
      open={isOpen}
      onCancel={onCancel}
      centered
      width={500}
      title={
        <div
          style={{
            padding: 15,
            textAlign: "center",
            fontSize: 18,
            fontWeight: 600,
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
            padding: 15,
            borderRadius: "0 0 10px 10px",
            justifyContent: "end",
          }}
        >
          <button
            className="button_secondary"
            onClick={onCancel}
            style={{ marginRight: 20 }}
          >
            Cancel
          </button>
          <button className="button_primary" onClick={handleSubmit}>
            Save
          </button>
        </div>,
      ]}
    >
      <div className={styles.approve_container}>
        <label>
          Reason <span style={{ color: "red" }}>*</span>
        </label>
        <textarea
          onChange={(event) => setRejectNote(event.target.value)}
          value={rejectNote}
        />
      </div>
    </Modal>
  );
};

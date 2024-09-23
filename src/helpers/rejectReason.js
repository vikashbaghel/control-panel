import { Modal } from "antd";
import React, { useContext, useState } from "react";
import Context from "../context/Context";

const RejectReasonModal = ({ submitReason }) => {
  const context = useContext(Context);
  const { showRejectReason, setShowRejectReason } = context;
  const [rejectReason, setRejectReason] = useState("");

  const onCancel = () => {
    setShowRejectReason(false);
    setRejectReason("");
  };

  const handleSubmit = () => {
    submitReason(rejectReason);
    setRejectReason("");
  };

  return (
    <div>
      <Modal
        open={showRejectReason}
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
        onCancel={onCancel}
        centered
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
          >
            <button className="button_primary" onClick={handleSubmit}>
              Reject
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
        <textarea
          rows={4}
          placeholder="Please Enter the Reason for this Rejection"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          style={{
            width: "86%",
            margin: "20px ",
            marginBottom: 0,
          }}
        />
      </Modal>
    </div>
  );
};

export default RejectReasonModal;

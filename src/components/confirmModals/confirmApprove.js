import { Modal } from "antd";
import React, { useContext, useState } from "react";
import Context from "../../context/Context";

const ConfirmApprove = ({ submitReason, title }) => {
  const context = useContext(Context);
  const { isConfirmApproveOpen, setIsConfirmApproveOpen } = context;

  const onCancel = () => {
    setIsConfirmApproveOpen(false);
  };

  const handleSubmit = () => {
    submitReason(true);
  };

  return (
    <div>
      <Modal
        open={isConfirmApproveOpen}
        title={
          <div
            style={{
              padding: 15,
              textAlign: "center",
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            Approve {title}
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
              Approve
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
        <div style={{ margin: "20px ", fontFamily: "Poppins" }}>
          Are You Sure, You want to Approve Your {title} ?
        </div>
      </Modal>
    </div>
  );
};

export default ConfirmApprove;

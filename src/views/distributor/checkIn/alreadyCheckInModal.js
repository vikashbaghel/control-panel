import { Modal } from "antd";
import React, { useContext } from "react";
import styles from "./alreadyCheckInModale.module.css";
import Context from "../../../context/Context";

const AlreadyCheckInModal = ({
  alreadCheckedModal,
  setAlreadCheckedModal,
  onCheckOut,
}) => {
  const { setCheckOutModal } = useContext(Context);
  const { open, detail } = alreadCheckedModal;

  const customerDetail = JSON.parse(
    localStorage.getItem("CheckInCustomer") || "{}"
  );

  const onClose = () => {
    setAlreadCheckedModal({ open: false, detail: {} });
  };

  const handleCheckout = () => {
    setCheckOutModal({
      open: true,
      handleAction: onClose,
      openConfirm: false,
      handleCheckOut: () => {
        onClose();
        onCheckOut();
      },
    });
  };

  return (
    <Modal
      width={520}
      onCancel={onClose}
      open={open}
      centered
      zIndex={9999}
      title={
        <div>
          <div className={styles.modal_header}>Already Checked In</div>
          <div style={{ padding: 20, paddingTop: 0 }}>
            <div className={styles.modal_para}>
              You are already checked in to{" "}
              <span style={{ color: "#000", fontWeight: 600 }}>
                {customerDetail?.name}
              </span>
              . Do you want to check out from there?
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              padding: 20,
              gap: 20,
              alignItems: "center",
            }}
          >
            <button
              className={"button_secondary"}
              onClick={onClose}
              style={{ height: 38, width: 70 }}
            >
              No
            </button>
            <button
              className={"button_primary"}
              onClick={handleCheckout}
              style={{ height: 40, width: 70 }}
            >
              Yes
            </button>
          </div>
        </div>
      }
      footer={[]}
      style={{ fontFamily: "Poppins" }}
    ></Modal>
  );
};

export default AlreadyCheckInModal;

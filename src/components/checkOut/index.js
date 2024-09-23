import React, { useContext, useEffect, useState } from "react";
import { Modal } from "antd";
import { MapPin, OrderSuccessImage } from "../../assets";
import Context from "../../context/Context";
import { INITIAL_CHECKOUT_MODAL } from "../../generic/contextConstant";
import { customerCheckInCheckOut } from "../../redux/action/customerCheckInCheckOut";
import { preference } from "../../services/preference-service";
import styles from "./checkout.module.css";

const CheckOut = () => {
  const { checkOutModal, setCheckOutModal } = useContext(Context);
  const { handleAction, handleCheckOut } = checkOutModal;
  const customerDetail = JSON.parse(
    localStorage.getItem("CheckInCustomer") || "{}"
  );

  const [openModal, setOpenModal] = useState(false);
  const [openCheckoutModal, setOpenCheckoutModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const onClose = () => {
    setCheckOutModal(INITIAL_CHECKOUT_MODAL);
    setOpenCheckoutModal(false);
    handleAction && handleAction();
  };

  const callingCheckOut = () => {
    setLoading(true);
    const apiData = { customer_id: customerDetail.id };
    customerCheckInCheckOut
      .checkOut(apiData)
      .then((response) => {
        if (!response.error) {
          localStorage.setItem("CheckInCustomer", JSON.stringify({}));
          handleCheckOut && handleCheckOut();
          onClose();
          setOpenModal(false);
          setLoading(false);
          return;
        }
        onClose();
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  return (
    <div>
      <ActivitySuccessModal
        {...{
          openModal,
          setOpenModal,
          checkOutModal,
          setCheckOutModal,
          setOpenCheckoutModal,
        }}
      />
      <Modal
        open={openCheckoutModal}
        onCancel={onClose}
        centered
        width={700}
        zIndex={10000}
        title={
          <div
            style={{
              padding: 10,
              textAlign: "center",
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            Check Out
          </div>
        }
        footer={
          <div
            style={{
              display: "flex",
              background: "#fff",
              padding: 15,
              justifyContent: "flex-end",
              borderRadius: "0 0 10px 10px",
              gap: 20,
            }}
          >
            <button
              loading={loading}
              className="button_secondary"
              onClick={onClose}
            >
              No
            </button>
            <button
              loading={loading}
              className="button_primary"
              onClick={() => callingCheckOut()}
            >
              Check Out
            </button>
          </div>
        }
        style={{ fontFamily: "Poppins" }}
      >
        <div
          style={{
            margin: 20,
            borderRadius: "10px",
            border: "2px solid #FFF",
            background: "#F4F4F4",
            padding: " 20px",
          }}
        >
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontWeight: 600,
              margin: 0,
              fontSize: 18,
              marginBottom: 5,
            }}
          >
            <img src={MapPin} alt="map" />
            {customerDetail?.name}
          </h2>
          <div style={{ marginLeft: 30, color: "#727176" }}>
            You are being logged out from {customerDetail?.name}.
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CheckOut;

const ActivitySuccessModal = ({
  openModal,
  setOpenModal,
  checkOutModal,
  setCheckOutModal,
  setOpenCheckoutModal,
}) => {
  const { open, handleAction, openConfirm = true } = checkOutModal;

  const onClose = () => {
    setCheckOutModal(INITIAL_CHECKOUT_MODAL);
    handleAction && handleAction();
    setOpenModal(false);
  };

  const handleCheckModal = () => {
    setOpenCheckoutModal(true);
  };

  useEffect(() => {
    if (!preference.get("activity_check_in_required")) {
      onClose();
    } else if (openConfirm) return setOpenModal(open);
    else {
      handleCheckModal();
      setOpenModal(false);
      return;
    }
  }, [open]);

  return (
    <Modal
      open={openModal}
      centered
      onCancel={onClose}
      zIndex={9999}
      title={
        <div>
          <div className={styles.modal_header}>Confirmed</div>
          <div className={styles.modal_body}>
            <div>Your Activity has been successfully created !!</div>
            <img src={OrderSuccessImage} alt="img" width={200} />
          </div>

          <div className={styles.modal_button_group}>
            <button className="button_secondary" onClick={onClose}>
              Start New Activity
            </button>
            <button className="button_primary" onClick={handleCheckModal}>
              Check Out
            </button>
          </div>
        </div>
      }
      width={650}
      footer={[]}
      style={{ fontFamily: "Poppins" }}
    ></Modal>
  );
};

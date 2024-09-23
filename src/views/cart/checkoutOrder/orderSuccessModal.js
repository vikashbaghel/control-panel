import React, { useContext } from "react";
import { Modal } from "antd";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { OrderSuccessImage } from "../../../assets";
import styles from "./checkout.module.css";
import Context from "../../../context/Context";
import cartService from "../../../services/cart-service";
import { preference } from "../../../services/preference-service";

const cookies = new Cookies();

const OrderSuccessModal = ({
  openSuccessWindow,
  setOpenSuccessWindow,
  orderId,
  customer_id,
}) => {
  const { setCheckOutModal, setCartNumber, setOpenDistributorDrawer } =
    useContext(Context);
  const navigate = useNavigate();
  const { open, handleAction } = openSuccessWindow;

  const onClose = (event) => {
    handleAction() && handleAction();
    setOpenSuccessWindow({
      open: false,
      handleAction: null,
    });
    cartService.clearCart();
    setCartNumber(0);
    if (event === "activity") {
      setOpenDistributorDrawer(true);
      navigate(`/web/customer?id=${customer_id}`);
      return;
    }
    if (orderId) {
      return navigate(`/web/order/order-details?id=${orderId}`);
    }
    navigate("/web/customer");
  };

  const handleNewActivity = () => {
    cookies.set("rupOrderId", "", { path: "/" });
    onClose("activity");
  };
  const handleViewOrder = () => {
    if (cookies.get("telephonic_order") === "true") {
      return onClose("activity");
    }
    setCheckOutModal({
      open: true,
      openConfirm: false,
      handleAction: null,
      handleCheckOut: () => onClose("activity"),
    });
  };

  return (
    <Modal
      open={open}
      centered
      onCancel={onClose}
      title={
        <div>
          <div className={styles.modal_header}>Confirmed</div>
          <div className={styles.modal_body}>
            <div>
              Your Order has been {orderId ? "updated" : "placed"} successfully
              !!
            </div>
            <img src={OrderSuccessImage} alt="img" width={200} />
          </div>
          {orderId ? (
            <div className={styles.modal_button_group}>
              <button
                className="button_primary"
                style={{ width: "100%", borderRadius: 5 }}
                onClick={onClose}
              >
                View Order Detail
              </button>
            </div>
          ) : cookies.get("telephonic_order") === "true" ? (
            <div className={styles.modal_button_group}>
              <button
                className="button_primary"
                style={{ width: "100%", borderRadius: 5 }}
                onClick={onClose}
              >
                Customer List
              </button>
            </div>
          ) : (
            <div className={styles.modal_button_group}>
              <button className="button_secondary" onClick={handleNewActivity}>
                Start New Activity
              </button>
              {preference.get("activity_check_in_required") && (
                <button className="button_primary" onClick={handleViewOrder}>
                  Check Out
                </button>
              )}
            </div>
          )}
        </div>
      }
      width={650}
      footer={[]}
      style={{ fontFamily: "Poppins" }}
    ></Modal>
  );
};

export default OrderSuccessModal;

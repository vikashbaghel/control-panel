import moment from "moment";
import { Drawer } from "antd";
import { useContext } from "react";
import styles from "./styles.module.css";
import { useNavigate } from "react-router";
import Context from "../../context/Context";
import { toIndianCurrency } from "../../helpers/convertCurrency";
import PaymentStatus from "../store-settings/Payment-gateway/paymentStatus";

export default function PaymentDetails({
  transactionDetails,
  setTransactionDetails,
}) {
  const navigate = useNavigate("");

  const context = useContext(Context);
  const { setOpenDistributorDrawer } = context;

  const handleClose = () => {
    setTransactionDetails({});
  };

  return (
    <Drawer
      open={Object.keys(transactionDetails).length}
      onClose={handleClose}
      title={<div className={styles.drawer_title}>Transaction Details</div>}
      headerStyle={{ borderBottom: "none", paddingBlockStart: "2em" }}
      width={550}
    >
      <div className={styles.drawer_body}>
        <p>Payment ID</p>
        <p
          className={transactionDetails?.payment?.id && styles.link}
          onClick={() =>
            transactionDetails?.payment?.id &&
            navigate(`/web/payment?id=${transactionDetails?.payment?.id}`)
          }
        >
          {transactionDetails?.payment?.payment_number || "-"}
        </p>
        <p>Transaction ID</p>
        <p>{transactionDetails?.transaction_id}</p>
        <p>Customer name</p>
        <p
          className={styles.link}
          onClick={() => {
            setOpenDistributorDrawer(true);
            navigate(`/web/customer?id=${transactionDetails?.customer?.id}`);
          }}
        >
          {transactionDetails?.customer?.name}
        </p>
        <p>Date and time</p>
        <p>
          {moment(transactionDetails?.created_at).format(
            "DD MMM YYYY - hh:mm a"
          )}
        </p>
        <p>Amount</p>
        <p>{toIndianCurrency(transactionDetails?.amount)}</p>
        <p>Order id</p>
        <p
          className={transactionDetails?.order?.id && styles.link}
          onClick={() =>
            transactionDetails?.order?.id &&
            navigate(
              `/web/order/order-details?id=${transactionDetails?.order?.id}`
            )
          }
        >
          {transactionDetails?.order?.order_id || "-"}
        </p>
        <p>Payment status</p>
        <div>
          <PaymentStatus>{transactionDetails?.status}</PaymentStatus>
          <p style={{ paddingTop: "8px" }}>{transactionDetails?.error_msg}</p>
        </div>
        <p>Payment method</p>
        <p>{transactionDetails?.method || "-"}</p>
        <p className={styles.divider}></p>
        <p className={styles.divider}></p>
        <p>Payment gateway </p>
        <p style={{ color: "#000000", fontWeight: 500 }}>
          {transactionDetails?.payment_gateway?.pg_name}
        </p>
        <p>Razorpay order ID</p>
        <p>{transactionDetails?.merchant_order_id}</p>
        <p>Razorpay payment ID</p>
        <p>{transactionDetails?.merchant_payment_id || "-"}</p>
      </div>
    </Drawer>
  );
}

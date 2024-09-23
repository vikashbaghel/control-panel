import data from "../generic/statusConstant.json";
import WrapText from "./wrapText";

export const PaymentStatusView = ({ status }) => {
  return (
    <div
      style={{
        textAlign: "center",
        background: data.payment.background[status],
        color: data.payment.color[status],
        padding: "5px",
        borderRadius: "5px",
        border: "1px solid #FFF",
        width: 120,
      }}
    >
      {status === "Dishonour" ? "Rejected" : status}
    </div>
  );
};

export const OrderStatusView = ({ status, block = false }) => {
  const statusDisplay = (status) => {
    switch (status) {
      case "Shipped":
        return "Dispatch";
      case "Partial Shipped":
        return "Partial Dispatch";
      default:
        return status;
    }
  };

  return (
    <div
      style={{
        background: data.order.background[status],
        color: data.order.color[status],
        padding: "10px",
        display: "block",
        border: `1px solid white`,
        borderRadius: "5px",
        width: block ? "100%" : 140,
        textAlign: "center",
      }}
    >
      <WrapText width={200}>{statusDisplay(status)}</WrapText>
    </div>
  );
};

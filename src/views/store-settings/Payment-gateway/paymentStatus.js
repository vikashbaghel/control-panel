export default function PaymentStatus({ children }) {
  const payment_status = {
    failed: { background: "#ffecec", color: "#e10000" },
    inactive: { background: "#ffecec", color: "#e10000" },
    received: { background: "#eefdf3", color: "#288948" },
    active: { background: "#eefdf3", color: "#288948" },
    paid: { background: "#eefdf3", color: "#288948" },
    refund: { title: "Refunded", background: "#FEF8F1", color: "#F1A248" },
    initiated: { background: "#F0F8FE", color: "#1D97F5" },
  };

  return (
    <div style={styles.status_container}>
      <div
        style={{ ...styles.status, ...payment_status[children?.toLowerCase()] }}
      >
        {payment_status[children?.toLowerCase()]?.["title"] || children}
      </div>
    </div>
  );
}

const styles = {
  status_container: {
    display: "flex",
  },
  status: {
    border: "1px solid #ffffff",
    padding: "5px 15px",
    borderRadius: 8,
    textTransform: "capitalize",
  },
};

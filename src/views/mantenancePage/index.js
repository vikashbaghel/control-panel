import MaintenanceImg from "../../assets/maintenance-img.svg";

const MaintenancePage = () => {
  return (
    <div
      style={{
        height: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <img src={MaintenanceImg} alt="maintenance" />

      <h2 style={{ color: "#0A0015", margin: 0 }}>Site is Under Maintenance</h2>
      <p style={{ color: "#727176" }}>Please try again after sometime</p>
    </div>
  );
};

export default MaintenancePage;

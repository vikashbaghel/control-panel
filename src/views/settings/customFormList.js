import { Table } from "antd";
import { useNavigate } from "react-router";
import { CustomFormIcon } from "../../assets/settings";

export default function CustomFormList() {
  const navigate = useNavigate();

  const columns = [
    {
      title: "List",
      dataIndex: "title",
      width: "600px",
      render: (v) => {
        return <div style={{ fontWeight: 600, color: "#000" }}>{v}</div>;
      },
    },
    {
      title: "Action",
      dataIndex: "link",
      align: "center",
      render: (text, record) => (
        <div
          style={{
            borderRadius: 4,
            border: "2px solid #FFF",
            background: "#F4F4F4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: ".5em",
            padding: 8,
            cursor: "pointer",
          }}
          onClick={() => navigate(`${record.route}`)}
        >
          <img src={CustomFormIcon} alt="edit" /> Customize
        </div>
      ),
    },
  ];

  const formsList = [
    {
      title: "Customer",
      route: "/web/custom-form/customer",
    },
    {
      title: "Activity",
      route: "/web/custom-form/activity",
    },
    {
      title: "Order PDF",
      route: "/web/custom-report/order-pdf",
    },
    {
      title: "Dispatch PDF",
      route: "/web/custom-report/dispatch-pdf",
    },
  ];

  return (
    <div style={{ paddingLeft: 24 }}>
      <Table columns={columns} dataSource={formsList} pagination={false} />
    </div>
  );
}

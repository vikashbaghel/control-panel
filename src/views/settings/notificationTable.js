import { Checkbox, Table } from "antd";
import Cookies from "universal-cookie";

export default function NotificationTable({ title, statusList, updateList }) {
  const cookies = new Cookies();

  const customerLevelList = cookies.get("rupyzCustomerLevelConfig");

  const tableKeys = {
    "Order Status": [
      "Received",
      "Approved",
      "Processing",
      "Ready To Dispatch",
      "Partial Shipped",
      "Shipped",
      "Delivered",
      "Rejected",
      "Closed",
    ],
    "Payment Status":
      Object.keys(statusList).length > 0
        ? Object?.keys(statusList["LEVEL-1"])
        : [],
  };

  const orderColumns = [
    {
      title: title,
      width: 250,
      render: (text) => (
        <div style={{ fontWeight: 500, color: "#000000" }}>
          {text === "Shipped"
            ? "Dispatch"
            : text === "Dishonour"
            ? "Rejected"
            : text}
        </div>
      ),
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          {customerLevelList["LEVEL-1"]}
        </div>
      ),

      render: (text) => (
        <div style={{ textAlign: "center" }}>
          <Checkbox
            checked={statusList["LEVEL-1"][text]}
            onChange={(e) => {
              updateList((prevForm) => ({
                ...prevForm,
                "LEVEL-1": {
                  ...prevForm["LEVEL-1"],
                  [text]: e.target.checked,
                },
              }));
            }}
          />
        </div>
      ),
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          {customerLevelList["LEVEL-2"]}
        </div>
      ),

      render: (text) => (
        <div style={{ textAlign: "center" }}>
          <Checkbox
            checked={statusList["LEVEL-2"][text]}
            onChange={(e) => {
              updateList((prevForm) => ({
                ...prevForm,
                "LEVEL-2": {
                  ...prevForm["LEVEL-2"],
                  [text]: e.target.checked,
                },
              }));
            }}
          />
        </div>
      ),
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          {customerLevelList["LEVEL-3"]}
        </div>
      ),

      render: (text) => (
        <div style={{ textAlign: "center" }}>
          <Checkbox
            checked={statusList["LEVEL-3"][text]}
            onChange={(e) => {
              updateList((prevForm) => ({
                ...prevForm,
                "LEVEL-3": {
                  ...prevForm["LEVEL-3"],
                  [text]: e.target.checked,
                },
              }));
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <Table
      pagination={false}
      columns={orderColumns}
      dataSource={Object.keys(statusList).length > 0 ? tableKeys[title] : []}
    />
  );
}

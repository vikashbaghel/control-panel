import moment from "moment";
import { linkAccount } from ".";
import EditCharges from "./editCharges";
import styles from "./styles.module.css";
import { useNavigate } from "react-router";
import PaymentStatus from "./paymentStatus";
import Context from "../../../context/Context";
import WrapText from "../../../components/wrapText";
import { Dropdown, Table, notification } from "antd";
import { useContext, useEffect, useState } from "react";
import { MoreOutlined, SyncOutlined } from "@ant-design/icons";
import { toIndianCurrency } from "../../../helpers/convertCurrency";
import { addPaymentGateway } from "../../../redux/action/razorpayServices";
import ConfirmDelete from "../../../components/confirmModals/confirmDelete";

export default function LinkedAccountDetails({ accountsList, refetchList }) {
  const navigate = useNavigate();
  const [chargesTitle, setChargesTitle] = useState("");
  const [isRefresh, setIsRefresh] = useState(false);
  const [editChargesData, setEditChargesData] = useState({});

  const context = useContext(Context);
  const { setDeleteModalOpen, deleteModalOpen } = context;

  const refetchStatus = async () => {
    setIsRefresh(true);
    const res = await addPaymentGateway({
      pg_name: "Razorpay",
      status: "Refresh",
    });
    if (res && res.status === 200) {
      notification.success({ message: res.data.message });
      refetchList();
    }
    setIsRefresh(false);
  };

  const handleDeactivate = async () => {
    const res = await addPaymentGateway({
      pg_name: "Razorpay",
      status: "Deactivate",
    });
    if (res && res.status === 200) {
      refetchList();
    }
  };

  const items = [
    {
      key: "1",
      label: (record) => (
        <div onClick={() => setEditChargesData(record)}>Edit Charges</div>
      ),
    },
    {
      key: "2",
      label: (record) =>
        record?.is_active ? (
          <div onClick={() => setDeleteModalOpen(true)}>Deactivate</div>
        ) : (
          ""
        ),
    },
  ];

  const column = [
    {
      title: "Gateway name",
      dataIndex: "pg_name",
    },
    {
      title: "Status",
      dataIndex: "is_active",
      render: (text) => (
        <PaymentStatus>{text ? "active" : "inactive"}</PaymentStatus>
      ),
    },
    {
      title: <WrapText len={25}>{chargesTitle || "Charges"}</WrapText>,
      dataIndex: "charges",
      render: (text, record) => (
        <div>
          {record?.charges?.type === "Percentage"
            ? record?.charges?.value + " %"
            : toIndianCurrency(record?.charges?.value)}
        </div>
      ),
    },
    {
      title: "Expiry Date",
      dataIndex: "expiry_date",
      render: (text) => {
        const current_date = moment().format("DD MMM YY");
        const exp_date = text ? moment(text).format("DD MMM YY") : "";

        if (exp_date) {
          if (moment(text).diff(current_date, "days") <= 3) {
            return <div style={{ color: "red" }}>{exp_date}</div>;
          } else return <div>{exp_date}</div>;
        }
      },
    },
    {
      title: "Refresh Activation",
      render: (_, record) =>
        record.is_active ? (
          <button
            className="button_primary"
            onClick={refetchStatus}
            disabled={isRefresh}
          >
            <SyncOutlined className={isRefresh && styles.spin} />
          </button>
        ) : (
          <button className="button_secondary" onClick={linkAccount}>
            Activate
          </button>
        ),
    },
    {
      title: " ",
      key: "operation",
      render: (text, record) => (
        <Dropdown
          menu={{
            items: items.map((item) => ({
              ...item,
              label: item.label(record),
            })),
          }}
          placement="bottomRight"
          className="action-dropdown"
        >
          <div className="clickable">
            <MoreOutlined className="action-icon" />
          </div>
        </Dropdown>
      ),
    },
  ];

  useEffect(() => {
    setChargesTitle(accountsList?.[0]?.charges?.name);
  }, [accountsList]);

  return (
    <div>
      <Table columns={column} dataSource={accountsList} pagination={false} />
      <p className={`${styles.text} ${styles.link}`}>
        Click to see all{" "}
        <span onClick={() => navigate("/web/payment-received")}>
          Payment Received
        </span>
      </p>
      <ConfirmDelete
        title={"Payment Gateway"}
        open={deleteModalOpen}
        confirmValue={(v) => {
          if (v) handleDeactivate();
        }}
      />
      <EditCharges {...{ editChargesData, setEditChargesData, refetchList }} />
    </div>
  );
}

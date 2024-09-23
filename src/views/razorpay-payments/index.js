import moment from "moment";
import { Select, Table } from "antd";
import styles from "./styles.module.css";
import PaymentDetails from "./paymentDetails";
import { useNavigate } from "react-router-dom";
import Context from "../../context/Context.js";
import WrapText from "../../components/wrapText";
import { ArrowLeft } from "../../assets/globle";
import Paginator from "../../components/pagination";
import { BASE_URL_V2, org_id } from "../../config.js";
import { useContext, useEffect, useState } from "react";
import filterService from "../../services/filter-service";
import { toIndianCurrency } from "../../helpers/convertCurrency.js";
import PaymentStatus from "../store-settings/Payment-gateway/paymentStatus";
import { getTransactionsList } from "../../redux/action/razorpayServices.js";
import defaultCustomerIcon from "../../assets/distributor/customer-img.svg";
import { DatePickerInput } from "../../components/form-elements/datePickerInput.js";
import SingleSelectSearch from "../../components/selectSearch/singleSelectSearch.js";

export default function PaymentsReceived() {
  const navigate = useNavigate();
  const context = useContext(Context);
  const { setLoading } = context;

  const [transactionsList, setTransactionsList] = useState([]);
  const [transactionDetails, setTransactionDetails] = useState({});
  const [activeFilters, setActiveFilters] = useState({
    page: 1,
    ...filterService.getFilters(),
  });

  const columns = [
    {
      title: "Customer name",
      width: 250,
      render: (text, record) => (
        <div className={styles.flex_5}>
          <img
            src={record?.customer?.logo_image_url || defaultCustomerIcon}
            alt={record.customer.name}
            width={50}
            height={50}
            style={{ borderRadius: 5 }}
          />
          <WrapText len={30}>{record.customer.name}</WrapText>
        </div>
      ),
    },
    {
      title: "Date and time",
      dataIndex: "created_at",
      render: (text, record) => (
        <div>{moment(text).format("DD MMM YYYY - hh:mm a")}</div>
      ),
    },
    {
      title: "Order Id",
      dataIndex: "order",
      render: (text) => {
        if (text?.id)
          return (
            <div
              className={styles.link}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/web/order/order-details?id=${text.id}`);
              }}
            >
              {text?.order_id}
            </div>
          );
      },
    },
    {
      title: "Payment Id",
      dataIndex: "payment",
      render: (text) => {
        if (text?.id) {
          return (
            <div
              className={styles.link}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/web/payment?id=${text.id}`);
              }}
            >
              {text?.payment_number}
            </div>
          );
        }
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (text, record) => <div>{toIndianCurrency(text)}</div>,
    },
    {
      title: "Payment status",
      dataIndex: "status",
      render: (text) => <PaymentStatus>{text}</PaymentStatus>,
    },
  ];

  const statusFilterOptions = [
    {
      value: "",
      label: "All",
    },
    {
      value: "Initiated",
      label: "Initiated",
    },
    {
      value: "Paid",
      label: "Paid",
    },
    {
      value: "Failed",
      label: "Failed",
    },
    {
      value: "Refund",
      label: "Refund",
    },
  ];

  const fetchTransactionsList = async () => {
    const { page, date, customer_id, status } = activeFilters;
    const params = {
      page_no: page,
      customer: customer_id,
      status,
      date,
    };
    const res = await getTransactionsList(params);
    if (res && res.status === 200) {
      setTransactionsList(res.data.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactionsList();
  }, [activeFilters]);

  useEffect(() => {
    filterService.setEventListener(setActiveFilters);
  }, []);

  return (
    <div className={styles.payments_page}>
      <h2 className={styles.flex_5}>
        <img
          src={ArrowLeft}
          alt="back"
          className="clickable"
          onClick={() => navigate(-1)}
        />{" "}
        Payment Received
      </h2>
      <div className={styles.filters}>
        <div style={{ width: "25%" }}>
          <SingleSelectSearch
            apiUrl={`${BASE_URL_V2}/organization/${org_id}/customer/?dd=true`}
            onChange={(data) => {
              filterService.setFilters({
                customer_id: data?.id,
                customer_name: data?.name,
              });
            }}
            value={activeFilters?.customer_name}
            params={{
              placeholder: "Select Customer",
            }}
          />
        </div>
        <div className={styles.flex_5}>
          <div>
            <DatePickerInput
              format="YYYY-MM-DD"
              onChange={(v) => filterService.setFilters({ date: v })}
              value={activeFilters?.date}
            />
          </div>
          <Select
            options={statusFilterOptions}
            onChange={(v) => filterService.setFilters({ status: v })}
            value={activeFilters["status"] || ""}
            style={{ width: 120 }}
          />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={transactionsList}
        pagination={false}
        onRow={(record) => ({
          onClick: () => {
            setTransactionDetails(record);
          },
        })}
        style={{ cursor: "pointer" }}
      />
      <Paginator
        limiter={transactionsList.length < 30}
        value={activeFilters["page"]}
        onChange={(i) => {
          filterService.setFilters({ page: i });
        }}
      />
      <PaymentDetails {...{ transactionDetails, setTransactionDetails }} />
    </div>
  );
}

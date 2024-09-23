import moment from "moment";
import { Table, Tooltip } from "antd";
import styles from "./styles.module.css";
import Context from "../../../context/Context";
import WrapText from "../../../components/wrapText";
import { InfoCircleOutlined } from "@ant-design/icons";
import Paginator from "../../../components/pagination";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../../components/AdminLayout";
import filterService from "../../../services/filter-service";
import { ArrowLeft, Download } from "../../../assets/globle";
import { Staff as staffIcon } from "../../../assets/dashboardIcon";
import { DateFilterWithButtons, TableSortFilter } from "./Filters";
import { toIndianCurrency } from "../../../helpers/convertCurrency";
import customerIcon from "../../../assets/distributor/customer-img.svg";
import { TimeInHrsAndMinsFormat } from "../../../helpers/globalFunction";
import { getTCPCLogsList } from "../../../redux/action/recordFollowUpAction";
import noActivityIcon from "../../../assets/activities/teamActivity/no-map-activity.svg";
import ViewRecordActivityComponent from "../../../components/activityModal/viewRecordActivityModal";
import { CustomerLevelSideTag } from "../../../components/viewDrawer/distributor-details/customerDetailCard";

export default function TCPCDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const context = useContext(Context);
  const { setOpenDistributorDrawer, setLoading } = context;

  const [activityId, setActivityId] = useState();
  const [logsList, setLogsList] = useState({ records: [] });
  const [searchParams, setSearchParams] = useState({
    ...filterService.getFilters(),
  });

  const tableColumns = [
    {
      title: () => (
        <div className={styles.space_between}>
          Customer Name
          <TableSortFilter
            value={
              searchParams?.sort_by === "customer__name"
                ? searchParams?.sort_order
                : ""
            }
            onChange={(v) => {
              filterService.setFilters({
                sort_by: "customer__name",
                sort_order: v,
              });
            }}
          />
        </div>
      ),
      dataIndex: "customer_name",
      width: 250,
      fixed: true,
      render: (text, record) => {
        return {
          props: {
            className: styles.no_padding,
            style: {
              backgroundColor: "#FFFFFF",
            },
          },
          children: (
            <div
              className={styles.flex}
              style={{ position: "relative", cursor: "pointer" }}
              onClick={() => actionOnCustomerName(record)}
            >
              {record.module_type?.toLowerCase()?.includes("lead") ? (
                <div style={{ width: 22 }}></div>
              ) : (
                <CustomerLevelSideTag
                  data={record}
                  wordCount={5}
                  tagStyles={{ borderRadius: "10px 0 0 10px", height: 75 }}
                />
              )}
              <div
                className={styles.flex}
                style={{
                  padding: 14,
                }}
              >
                <img
                  src={record.customer_logo_url || customerIcon}
                  alt="profile"
                  style={{ width: 50, height: 50, borderRadius: 4 }}
                />
                <WrapText width={130}>{text}</WrapText>
              </div>
            </div>
          ),
        };
      },
    },
    {
      title: () => (
        <div className={styles.space_between}>
          <div>
            Check In
            <Tooltip title="Check-in time is the recorded moment when a team member logs their arrival at a customer's location, not necessarily when the activity begins.">
              <InfoCircleOutlined />
            </Tooltip>
          </div>
          <TableSortFilter
            value={
              searchParams?.sort_by === "check_in"
                ? searchParams?.sort_order
                : ""
            }
            onChange={(v) => {
              filterService.setFilters({
                sort_by: "check_in",
                sort_order: v,
              });
            }}
          />
        </div>
      ),
      dataIndex: "check_in",
      render: (text) => <div>{text ? moment(text).format("hh:mm A") : ""}</div>,
    },
    {
      title: () => (
        <div className={styles.space_between}>
          <div>
            Check Out
            <Tooltip title="Check-out time is the recorded moment when a team member logs their departure at a customer's location, not necessarily when the activity ends.">
              <InfoCircleOutlined />
            </Tooltip>
          </div>
          <TableSortFilter
            value={
              searchParams?.sort_by === "check_out"
                ? searchParams?.sort_order
                : ""
            }
            onChange={(v) => {
              filterService.setFilters({
                sort_by: "check_out",
                sort_order: v,
              });
            }}
          />
        </div>
      ),
      dataIndex: "check_out",
      render: (text) => <div>{text ? moment(text).format("hh:mm A") : ""}</div>,
    },
    {
      title: () => (
        <div className={styles.space_between}>
          <div>
            Duration
            <Tooltip title="Duration is the total time spent at the customer's location, from check-in to check-out, encompassing all activities performed.">
              <InfoCircleOutlined />
            </Tooltip>
          </div>
          <TableSortFilter
            value={
              searchParams?.sort_by === "duration"
                ? searchParams?.sort_order
                : ""
            }
            onChange={(v) => {
              filterService.setFilters({
                sort_by: "duration",
                sort_order: v,
              });
            }}
          />
        </div>
      ),
      dataIndex: "duration",
      render: (text) => <div>{TimeInHrsAndMinsFormat(text)}</div>,
    },
    {
      title: id === "tc" ? "Activity" : "Order Type",
      dataIndex: "activity_type",
      render: (text) => (
        <div
          style={{
            textTransform: "capitalize",
            fontWeight: 600,
            color: "#000000",
          }}
        >
          {text?.toLowerCase()?.replace("_", " ")}
        </div>
      ),
    },
    ...(id === "pc"
      ? [
          {
            title: "Order Value",
            dataIndex: "order_value",
            render: (text) => <div>{toIndianCurrency(text)}</div>,
          },
        ]
      : []),
    {
      title: "Location",
      dataIndex: "geo_address",
      width: 250,
      render: (text, record) => (
        <a
          href={`https://maps.google.com/?q=${record?.geo_location_lat},${record?.geo_location_long}`}
          target="_blank"
          rel="noreferrer"
          className={
            record.geo_location_lat &&
            record.geo_location_long &&
            styles.link_tag
          }
          style={{ textDecoration: "underline" }}
          onClick={(e) => {
            if (!record.geo_location_lat && !record.geo_location_long) {
              e.preventDefault();
            }
          }}
        >
          <WrapText len={50}>{text}</WrapText>
        </a>
      ),
    },
    {
      title: "Comments",
      dataIndex: "comments",
      width: 400,
    },
  ];

  const actionOnCustomerName = (data) => {
    switch (data.module_type) {
      case "ORDER":
        navigate(`/web/order/order-details?id=${data.module_id}`);
        break;
      case "PAYMENT":
        navigate(`/web/payment/?id=${data.module_id}`);
        break;
      case "LEAD":
        navigate(`/web/view-lead/?id=${data.module_id}`);
        break;
      case "CUSTOMER":
        setOpenDistributorDrawer(true);
        navigate(`/web/customer?id=${data.module_id}`);
        break;
      default:
        setActivityId(data.module_id);
        break;
    }
  };

  const fetchLogsList = async () => {
    const params = {
      is_pc: id === "pc" ? true : false,
      page_no: searchParams?.page,
      name: searchParams?.query,
      user_id: searchParams?.user_id,
      sort_by: searchParams?.sort_by,
      sort_order: searchParams?.sort_order,
      date: searchParams?.date
        ? moment(searchParams?.date, "DD-MM-YYYY").format("YYYY-MM-DD")
        : null,
    };
    setLogsList((await getTCPCLogsList(params)) || { records: [] });
    setLoading(false);
  };
  const renderTableFooter = () => {
    return (
      <Table.Summary fixed>
        <Table.Summary.Row
          style={{
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          <Table.Summary.Cell className="table-summary-row-sticky">
            &nbsp;&nbsp;&nbsp;&nbsp;Total
          </Table.Summary.Cell>
          <Table.Summary.Cell />
          <Table.Summary.Cell />
          <Table.Summary.Cell />
          <Table.Summary.Cell />
          <Table.Summary.Cell index={3}>
            {toIndianCurrency(logsList?.total)}
          </Table.Summary.Cell>
        </Table.Summary.Row>
      </Table.Summary>
    );
  };

  useEffect(() => {
    fetchLogsList();
  }, [searchParams]);

  useEffect(() => {
    filterService.setEventListener(setSearchParams);
  }, []);

  return (
    <AdminLayout
      leftPanel={
        <div className={styles.flex} style={{ gap: "1em", flex: 1 }}>
          <img
            src={ArrowLeft}
            alt="back"
            onClick={() => navigate(-1)}
            className="clickable"
          />
          <div className={styles.flex}>
            <img
              src={searchParams?.pic_url || staffIcon}
              alt="profile"
              style={{ width: 40, height: 40, borderRadius: "100%" }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 5,
                fontWeight: 600,
              }}
            >
              <p style={{ margin: 0, fontSize: 22 }}>
                {searchParams?.user_name}
              </p>
              <p style={{ margin: 0, fontSize: 14, color: "#000000" }}>
                {id.toUpperCase()} -{" "}
                <span style={{ color: "#727176" }}>
                  {moment(
                    searchParams?.date || moment().format("DD-MM-YYYY"),
                    "DD-MM-YYYY"
                  ).format("DD MMM YYYY")}
                </span>
              </p>
            </div>
          </div>
        </div>
      }
      search={{
        placeholder: "Search for customer",
        searchValue: (query) => filterService.setFilters({ query }),
      }}
      panel={[
        // <div className={`${styles.filter_button} ${styles.flex}`}>
        //   Download in CSV
        //   <img
        //     src={Download}
        //     alt="download"
        //     style={{
        //       filter:
        //         "invert(46%) sepia(4%) saturate(334%) hue-rotate(211deg) brightness(96%) contrast(94%)",
        //     }}
        //   />
        // </div>,
        <DateFilterWithButtons
          value={searchParams?.date}
          onChange={(v) => filterService.setFilters(v)}
        />,
      ]}
    >
      <Table
        columns={tableColumns}
        dataSource={logsList.records}
        pagination={false}
        {...(id === "pc" &&
          logsList.records.length && {
            summary: renderTableFooter,
          })}
        scroll={{
          x: 1800,
          y: "100%",
        }}
        locale={{
          emptyText: (
            <div>
              <img src={noActivityIcon} alt="no-activity" />
              <div style={{ fontWeight: 600, color: "#727176" }}>
                No Data found
              </div>
            </div>
          ),
        }}
        className={
          id === "pc" && logsList?.records?.length
            ? "table-with-footer"
            : "table-height-fixed"
        }
      />
      <br />
      <Paginator
        limiter={(logsList.records || []).length < 30}
        value={searchParams?.page}
        onChange={(i) => {
          filterService.setFilters({ page: i });
        }}
      />
      <ViewRecordActivityComponent
        {...{ activityId }}
        onClose={() => {
          setActivityId();
        }}
        type="drawer"
      />
    </AdminLayout>
  );
}

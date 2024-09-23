import { Dropdown, Tooltip } from "antd";
import { Table } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteOrder, orderAction } from "../../redux/action/orderAction";
import moment from "moment";
import Context from "../../context/Context";
import { MoreOutlined } from "@ant-design/icons";
import { toIndianCurrency } from "../../helpers/convertCurrency";
import UpdateStatus from "../../components/statusUpdate/updateStatus";
import Permissions from "../../helpers/permissions";
import { preferencesAction } from "../../redux/action/preferencesAction";
import { ViewDetails } from "../../assets";
import {
  ArrowLeft,
  DeleteIcon,
  EditIcon,
  StoreFrontIcon,
} from "../../assets/globle";
import ConfirmDelete from "../../components/confirmModals/confirmDelete";
import styles from "./order.module.css";
import { useNavigate } from "react-router-dom";
import { BASE_URL_V1, BASE_URL_V2, org_id } from "../../config";
import { handleEditOder } from "../../helpers/globalFunction";
import Paginator from "../../components/pagination";
import filterService from "../../services/filter-service";
import AdminLayout from "../../components/AdminLayout";
import { Staff as staffIcon } from "../../assets/navbarImages";
import { TableSortFilter } from "../activities/teamActivity/Filters";
import { preference } from "../../services/preference-service";
import ListFilters, { filterListConstants } from "../../components/filter";
import DateFilter from "../../components/filter/dateFilter";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const admin = cookies.get("rupyzAccessType") === "WEB_SARE360" ? true : false;
const filterOptions = [
  {
    label: "Order Received on",
    key: "platform",
    search: false,
    source: "",
    data: [
      { name: "All", id: filterListConstants.selectAllKey },
      { name: "Sales App", id: "SALES_APP" },
      { name: "Storefront", id: "STOREFRONT" },
    ],
    sourceExcludePics: true,
  },
  {
    label: "Customer",
    key: "customer_ids",
    search: true,
    source: `${BASE_URL_V2}/organization/${org_id}/customer/?dd=true`,
  },
  {
    label: "Order Taken By (Staff)",
    key: "user_ids",
    search: true,
    source: `${BASE_URL_V2}/organization/${org_id}/staff/?dd=true`,
    sourceItemKey: "user_id",
  },
  ...(admin
    ? [
        {
          label: "Order Taken By (Admin)",
          key: "admin_user_ids",
          search: true,
          source: `${BASE_URL_V1}/organization/profiles-with-org/${org_id}/?dd=true`,
          sourceItemKey: "user_id",
        },
      ]
    : []),
  {
    label: "Fullfilled By",
    key: "search_term_id",
    search: true,
    source: `${BASE_URL_V2}/organization/${org_id}/customer/?dd=true`,
  },
  {
    label: "Payment Terms",
    key: "payment_options",
    search: false,
    source: "",
    data: [
      { name: "Payment on Delivery", id: "PAY_ON_DELIVERY" },
      { name: "Payment on Next Order", id: "PAYMENT_ON_NEXT_ORDER" },
      { name: "Full Payment in Advance", id: "FULL_ADVANCE" },
      { name: "Partial Payment", id: "PARTIAL_ADVANCE" },
      { name: "Credit Days", id: "CREDIT_DAYS" },
    ],
    sourceExcludePics: true,
  },
];

const filterAction = (allFilterStates = {}) => {
  filterService.setFilters(
    filterOptions.reduce((acc, item) => {
      acc[item.key] = (allFilterStates[item.key]?.selection || []).join(",");
      return acc;
    }, {})
  );
};

const Order = () => {
  const navigate = useNavigate();

  const [perPageData, setPerPageData] = useState([]);
  const context = useContext(Context);
  const { setDeleteModalOpen, setLoading, setAttendanceModalAction } = context;
  const [orderDetails, setOrderDetails] = useState("");
  const [order_status, setOrder_status] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    ...filterService.getFilters(),
  });
  const [subTitle, setSubTitle] = useState({});
  const [loader, setloader] = useState(false);

  let viewOrderPermission = Permissions("VIEW_ORDER");
  let createOrderPermission = Permissions("CREATE_ORDER");
  let orderStatusUpdatePermission = Permissions("ORDER_STATUS_UPDATE");
  let editOrderPermission = Permissions("EDIT_ORDER");
  let dispatchOrderPermission = Permissions("DISPATCH_ORDER");
  let deleteOrderPermission = Permissions("DELETE_ORDER");

  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  useEffect(() => {
    dispatch(preferencesAction());
    filterService.setEventListener(setActiveFilters);
  }, []);

  useEffect(() => {
    setloader(true);
    dispatch(orderAction(activeFilters));
  }, [activeFilters]);

  useEffect(() => {
    if (!window.location.search) {
      filterService.setFilters({ page: 1 });
    }
  }, [window.location.search]);

  //fetch get api control infilnite loop
  useEffect(() => {
    if (state.order.data !== "") {
      if (state.order.data.data.error === false)
        state.order.data.data.data.map((ele) => {
          ele.orderBy = ele.created_by.first_name;
          ele.fullName = ele.customer.name;
          ele.created_at = moment(ele.created_at).format("DD-MMM-YYYY");
          // ele.total_amount = '₹ ' + ele.total_amount
        });
      {
        setPerPageData(state.order.data.data.data);
        setloader(false);
      }
    }
    if (activeFilters?.customer_id) {
      if (
        state.order_detail_byid.data !== "" &&
        state.order_detail_byid.data.data.error === false
      ) {
        setPerPageData(state.order_detail_byid.data.data.data);
      }
      if (
        state.disributor_details.data !== "" &&
        state.disributor_details.data.data.error === false
      ) {
        setSubTitle({
          name: state.disributor_details.data.data.data.name,
          imgUrl: state.disributor_details.data.data.data.logo_image_url,
        });
      }
    }
    if (
      activeFilters?.staff_id &&
      state.staff.data !== "" &&
      state.staff.data.data.error === false
    ) {
      setSubTitle({
        name: state.staff.data.data.data.name,
        imgUrl: state.staff.data.data.data.profile_pic_url,
      });
    }
    setLoading(false);
  }, [state]);

  //capitalizeFirst character
  const capitalizeFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // table column
  const columnsAdmin = [
    {
      title: "Order ID",
      dataIndex: "order_id",
      width: "200px",
      fixed: "left",
      className: styles.table_column_white,
      render: (text, record) => (
        <div>
          {record.is_closed && <div className={styles.close_tag}>Closed</div>}
          <div
            className="clickable"
            onClick={() => navigate(`/web/order/order-details?id=${record.id}`)}
            style={{ marginLeft: 10, color: "#000", fontWeight: 500 }}
          >
            {text}
          </div>
          {record.source === "STOREFRONT" && (
            <Tooltip
              placement="top"
              title={"This Order is placed on Storefront"}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: 12,
                  marginLeft: 8,
                  fontWeight: 500,
                }}
              >
                <img src={StoreFrontIcon} alt="img" width={17} />
                <div>Storefront</div>
              </div>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: "Customer",
      dataIndex: "fullName",
      width: "200px",
      render: (text, record) => (
        <div
          style={{ color: "#000", fontWeight: "600" }}
          className="clickable"
          onClick={() => navigate(`/web/order/order-details?id=${record.id}`)}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "delivery_status",
      key: "key",
      align: "center",
      width: "160px",
      render: (text, record) => (
        <div>
          <UpdateStatus record={record} filters={activeFilters} />
        </div>
      ),
    },
    {
      title: "Ordered Taken By",
      dataIndex: "orderBy",
      width: "160px",
      render: (text, record) =>
        record.source === "STOREFRONT" ? (
          <div></div>
        ) : (
          <div style={{ color: "black" }}>
            {" "}
            {capitalizeFirst(record.created_by.first_name)}{" "}
            {capitalizeFirst(record.created_by.last_name)}
          </div>
        ),
    },
    {
      title: "Fulfilled By",
      dataIndex: "fullfilled_by",
      width: "150px",
      render: (text, record) => (
        <div
          style={{
            color: "black",
            width: "100px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {record.fullfilled_by ? record.fullfilled_by.name : "N/A"}
          <br />
          <span
            style={{
              fontSize: "12px",
              width: "100px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {record.customer_level_name
              ? `(${record.customer_level_name})`
              : ""}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
          Total Amount
          <TableSortFilter
            value={
              activeFilters?.sort_by === "total_amount"
                ? activeFilters?.sort_order
                : ""
            }
            onChange={(v) => {
              filterService.setFilters({
                sort_by: "total_amount",
                sort_order: v,
              });
            }}
          />
        </div>
      ),
      dataIndex: "total_amount",
      width: "180px",
      render: (text) => (
        <div style={{ color: "#000", fontWeight: "600" }}>
          {toIndianCurrency(text)}
        </div>
      ),
    },
    {
      title: (
        <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
          Created On
          <TableSortFilter
            value={
              activeFilters?.sort_by === "created_at"
                ? activeFilters?.sort_order
                : ""
            }
            onChange={(v) => {
              filterService.setFilters({
                sort_by: "created_at",
                sort_order: v,
              });
            }}
          />
        </div>
      ),
      dataIndex: "created_at",
      width: "140px",
      render: (text) => moment(text).format("DD-MMM-YYYY"),
    },
    {
      title: (
        <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
          Updated At
          <TableSortFilter
            value={
              activeFilters?.sort_by === "updated_at"
                ? activeFilters?.sort_order
                : ""
            }
            onChange={(v) => {
              filterService.setFilters({
                sort_by: "updated_at",
                sort_order: v,
              });
            }}
          />
        </div>
      ),
      dataIndex: "updated_at",
      width: "140px",
      render: (text) => moment(text).format("DD-MMM-YYYY"),
    },
    {
      title: (
        <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
          Expected Delivery Date
          <TableSortFilter
            value={
              activeFilters?.sort_by === "expected_delivery_date"
                ? activeFilters?.sort_order
                : ""
            }
            onChange={(v) => {
              filterService.setFilters({
                sort_by: "expected_delivery_date",
                sort_order: v,
              });
            }}
          />
        </div>
      ),
      dataIndex: "expected_delivery_date",
      width: "210px",
      render: (text) => (text ? moment(text).format("DD-MMM-YYYY") : "N/A"),
    },
    {
      title: "Payment Status",
      dataIndex: "payment_option_check",
      width: "170px",
      render: (text) => (
        <div>
          {text === "PAY_ON_DELIVERY"
            ? "Pay On Delivery"
            : text === "FULL_ADVANCE"
            ? "Full Advance"
            : text === "PARTIAL_ADVANCE"
            ? "Partial Advance"
            : text === "CREDIT_DAYS"
            ? " Credit Days"
            : "N/A"}
        </div>
      ),
    },
    {
      title: " ",
      dataIndex: "operation",
      key: "operation",
      width: 50,
      fixed: "right",
      className: styles.table_column_white,
      render: (text, record) => (
        <div
          onMouseOver={() => {
            setOrderDetails(record);
            setOrder_status(record.delivery_status);
          }}
        >
          <Dropdown
            menu={{
              items,
            }}
            className="action-dropdown"
          >
            <div className="clickable">
              <MoreOutlined className="action-icon" />
            </div>
          </Dropdown>
        </div>
      ),
    },
  ];

  const items = [
    {
      key: "1",
      label: (
        <div
          onClick={() =>
            navigate(`/web/order/order-details?id=${orderDetails.id}`)
          }
          className="action-dropdown-list"
        >
          <img src={ViewDetails} alt="view" />
          View Details
        </div>
      ),
    },
    order_status === "Approved" ||
    order_status === "Received" ||
    order_status === "Processing"
      ? editOrderPermission && {
          key: "3",
          label: (
            <div
              onClick={() => {
                setAttendanceModalAction({
                  open: true,
                  handleAction: () => {
                    // dispatch(orderViewAction(orderDetails.id));
                    handleEditOder(orderDetails, () =>
                      navigate(
                        `/web/order/update-order/?getOrder=${orderDetails.id}&name=${orderDetails.fullName}&id=${orderDetails.customer.id}`
                      )
                    );
                  },
                });
              }}
              className="action-dropdown-list"
            >
              <img src={EditIcon} alt="edit" /> Edit
            </div>
          ),
        }
      : null,
    deleteOrderPermission && {
      key: "4",
      label: (
        <div>
          <div
            onClick={() => setDeleteModalOpen(true)}
            className="action-dropdown-list"
          >
            <img src={DeleteIcon} alt="delete" /> <span>Delete</span>
          </div>
        </div>
      ),
    },
  ];

  const handleDeleteOrder = (data) => {
    if (data) {
      let apiData = { is_archived: true };
      dispatch(deleteOrder(apiData, orderDetails.id));

      setTimeout(() => {
        dispatch(orderAction(activeFilters));
      }, 400);
    }
  };

  const customerLevel = preference.get("customer_level_config");

  return (
    <AdminLayout
      title={
        <>
          {(activeFilters?.staff_id || activeFilters?.customer_id) && (
            <img src={ArrowLeft} alt="back" onClick={() => navigate(-1)} />
          )}
          List of Orders
        </>
      }
      subTitle={
        <>
          {(activeFilters?.staff_id || activeFilters?.customer_id) && (
            <p className={styles.staff_img}>
              <img src={subTitle?.imgUrl || staffIcon} alt={subTitle?.name} />
              {subTitle?.name}
            </p>
          )}
        </>
      }
      tableFilter={
        <div className={styles.customer_level_filter}>
          {customerLevel &&
            [
              "All",
              customerLevel["LEVEL-1"],
              customerLevel["LEVEL-2"],
              customerLevel["LEVEL-3"],
            ].map((data, index) => {
              let isActive =
                activeFilters.customer_level === `LEVEL-${index}` ||
                (!activeFilters.customer_level && index === 0);

              return (
                <div
                  key={index}
                  onClick={() => {
                    let obj = filterOptions.reduce((acc, item) => {
                      acc[item.key] = "";
                      return acc;
                    }, {});
                    filterService.setFilters({
                      ...obj,
                      customer_level: data === "All" ? "" : `LEVEL-${index}`,
                    });
                  }}
                  className={isActive ? styles.active : ""}
                >
                  {data}
                </div>
              );
            })}
        </div>
      }
      search={{
        placeholder: "Search by Customer",
        searchValue: (data) => {
          filterService.setFilters({ query: data });
        },
      }}
      panel={[
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <DateFilter {...{ activeFilters }} />
          <ListFilters
            key={`ListFilters-${activeFilters.customer_level || "ALL"}`}
            {...{ filterOptions, activeFilters, filterAction }}
          />
        </div>,
        <div className={styles.search_right_group}>
          <label>Status</label>
          <select
            onChange={(e) => {
              filterService.setFilters({
                status: e.target.value,
              });
            }}
            value={activeFilters["status"] || ""}
          >
            <option value="">All</option>
            <option value="Received">Received</option>
            <option value="Approved">Approved</option>
            <option value="Processing">Processing</option>
            <option value="Ready to Dispatch">Ready to Dispatch</option>
            <option value="Shipped">Dispatch</option>
            <option value="Partial Shipped">Partial Dispatched</option>
            <option value="Delivered">Delivered</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>,
      ]}
    >
      {(viewOrderPermission ||
        createOrderPermission ||
        orderStatusUpdatePermission ||
        editOrderPermission ||
        dispatchOrderPermission ||
        deleteOrderPermission) && (
        <Table
          pagination={false}
          columns={columnsAdmin}
          dataSource={perPageData}
          scroll={{ y: 500 }}
          loading={loader}
        />
      )}
      <br />
      <br />
      <Paginator
        limiter={(perPageData || []).length < 30}
        value={activeFilters["page"]}
        onChange={(i) => {
          filterService.setFilters({ page: i });
        }}
      />
      <ConfirmDelete
        title={"Order"}
        confirmValue={(data) => {
          handleDeleteOrder(data);
        }}
      />
    </AdminLayout>
  );
};

export default Order;

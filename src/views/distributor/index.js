import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  customerDetails,
  customerDistributorPagination,
  deleteCustomer,
} from "../../redux/action/customerAction";
import { Col, Dropdown, Table, Row } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import Context from "../../context/Context";
import Permissions from "../../helpers/permissions";
import Cookies from "universal-cookie";
import { preferencesAction } from "../../redux/action/preferencesAction";
import styles from "./customer.module.css";
import Add from "../../assets/add-icon.svg";
import { Staff } from "../../assets/navbarImages";
import { ViewDetails } from "../../assets";
import { ArrowLeft, DeleteIcon, EditIcon } from "../../assets/globle";
import ConfirmDelete from "../../components/confirmModals/confirmDelete";
import { staffDetailsById } from "../../redux/action/staffAction";
import ViewCustomerDetails from "../../components/viewDrawer/distributor-details/viewCustomerDetails";
import customerIcon from "../../assets/distributor/customer-img.svg";
import TranferPopupConfirmation from "./tranferPopup";
import WrapText from "../../components/wrapText";
import filterService from "../../services/filter-service";
import Paginator from "../../components/pagination";
import AdminLayout from "../../components/AdminLayout";
import RecordActivityComponent from "../../components/activityModal/recordActivity";
import CheckIn from "./checkIn/checkIn";
import ChooseActivity from "./checkIn/chooseActivity";
import { preference } from "../../services/preference-service";
import moment from "moment";
import cartService from "../../services/cart-service";
import AlreadyCheckInModal from "./checkIn/alreadyCheckInModal";
import { updateCheckInCustomer } from "../../services/checkIn-service";
import { getChildLevelName } from "../../components/viewDrawer/distributor-details/customerDetailCard";
import SelectParentCustomerForOrder from "./checkIn/SelectParentCustomerForOrder";
import Address from "../../components/viewDrawer/distributor-details/address";
import { TableSortFilter } from "../activities/teamActivity/Filters";
import CustomerParentList from "./listsModal/CustomerParentList";
import ListViewModal from "./listsModal/StaffList";
import { BASE_URL_V2, org_id } from "../../config";
import ListFilters from "../../components/filter";

const states = {
  init: false,
};

const Distributor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const customerLevelDetails = preference.get("customer_level_config");
  const filterOptions = [
    {
      label: "Beat",
      key: "beat_ids",
      search: true,
      source: `${BASE_URL_V2}/organization/${org_id}/beat/?dd=true`,
      sourceExcludePics: true,
    },
    {
      label: "Customer Level",
      key: "customer_levels",
      search: false,
      source: ``,
      data: [
        { name: customerLevelDetails["LEVEL-1"], id: "LEVEL-1" },
        { name: customerLevelDetails["LEVEL-2"], id: "LEVEL-2" },
        { name: customerLevelDetails["LEVEL-3"], id: "LEVEL-3" },
      ],
    },
    {
      label: "Customer Type",
      key: "customer_type",
      search: true,
      source: `${BASE_URL_V2}/organization/${org_id}/customer/type/`,
      sourceExcludePics: true,
      sourceItemKey: "name",
    },
    {
      label: "Staff Assigned",
      key: "staff_ids",
      search: true,
      source: `${BASE_URL_V2}/organization/${org_id}/staff/?dd=true`,
    },
  ];

  const filterAction = (allFilterStates = {}) => {
    filterService.setFilters(
      filterOptions.reduce((acc, item) => {
        acc[item.key] = allFilterStates[item.key]?.selection || "";
        return acc;
      }, {})
    );
  };

  const context = useContext(Context);
  const {
    setCartNumber,
    openDistributorDrawer,
    setEditDistributorData,
    setDistributorDetails,
    distributorDetails,
    setDeleteModalOpen,
    setLoading,
    setOpenDistributorDrawer,
    setCustomerDrawerFilters,
    setAttendanceModalAction,
  } = context;
  const state = useSelector((state) => state);
  const [distributorList, setdistributorList] = useState("");
  const [id, setId] = useState("");
  const [customername, setCustomerName] = useState("");
  const [editActivityData, setEditActivityData] = useState({});

  const cookies = new Cookies();
  const [performanceData, setPerformanceData] = useState("");

  const [staffDetails, setStaffDetails] = useState("");

  const [selectParentModal, setSelectParentModal] = useState({});

  // for tranfer popup
  const [showTranferPopup, setShowTranferPopup] = useState(false);
  const [childCount, setChildCount] = useState(0);

  const [activeParams, setActiveParams] = useState({
    page: 1,
    ...filterService.getFilters(),
  });
  const initialValue = { open: false, detail: {} };
  const [checkInModal, setCheckInModal] = useState(initialValue);
  const [chooseActivityModal, setChooseActivityModal] = useState(initialValue);
  const [alreadCheckedModal, setAlreadCheckedModal] = useState(initialValue);

  const [openParentDetailList, setOpenParentDetailList] = useState({});
  const [listModal, setListModal] = useState({
    open: false,
    detail: {},
    type: "",
    api: "",
  });

  const queryParameters = new URLSearchParams(window.location.search);
  const staff_id = queryParameters.get("staff_id");
  const staff_name = queryParameters.get("name");
  const customer_parent_id = queryParameters.get("customer_parent_id");
  const customerLevel = queryParameters.get("customer_level") || "";
  const customer_type = queryParameters.get("customer_type") || "";
  let parent_customer_level = queryParameters.get("parent_customer_level");
  if (!parent_customer_level) parent_customer_level = "LEVEL-0";
  const nav = JSON.parse(queryParameters.get("nav"));
  const type = queryParameters.get("type");

  let viewCustomerPermission = Permissions("VIEW_CUSTOMER");
  let createCustomerPermission = Permissions("CREATE_CUSTOMER");
  let editCustomerPermission = Permissions("EDIT_CUSTOMER");
  let deleteCustomerPermission = Permissions("DELETE_CUSTOMER");

  const openCustomerDetailModal = (record) => {
    filterService.setFilters({ id: record.id });
    setCustomerDrawerFilters({
      activeTab: "insights",
    });
    setOpenDistributorDrawer(true);
  };

  const placeOrderWithNewCustomer = async (record) => {
    setAttendanceModalAction({
      open: true,
      handleAction: () => {
        setCartNumber(0);
        cartService.initCart(record);
        navigate(
          `/web/distributor/product-list?id=${record.id}&name=${record.name}`
        );
      },
    });
  };

  const onCreateNewActivity = (record, value = {}) => {
    setAttendanceModalAction({
      open: true,
      handleAction: () => {
        setEditActivityData({
          module_id: record?.id,
          module_type: "Customer Feedback",
          sub_module_type: value.name,
          sub_module_id: value.id,
        });
      },
    });
  };

  useEffect(() => {
    if (state.customerDistributor.data !== "") {
      if (state.customerDistributor.data.data.error === false)
        setdistributorList(state.customerDistributor.data.data.data);
      setLoading(false);
    }
    if (state.performance.data !== "") {
      if (state.performance.data.data.error === false) {
        setPerformanceData(state.performance.data.data.data);
      }
    }
    if (
      staff_id &&
      state.staffCustomerAssigned.data !== "" &&
      state.staffCustomerAssigned.data.data.error === false
    ) {
      setStaffDetails(state.staff.data.data.data);
    }
    if (
      customer_parent_id &&
      state.disributor_details.data !== "" &&
      state.disributor_details.data.data.error === false
    )
      setStaffDetails(state.disributor_details.data.data.data);
    if (state.deleteCustomer.data && !state.deleteCustomer.data.data.error) {
      if (!state?.deleteCustomer?.data?.params?.check_children) {
        callingCustomerAPI();
      } else if (
        !openDistributorDrawer &&
        state.deleteCustomer?.data?.data?.data?.is_used
      ) {
        setChildCount(state.deleteCustomer?.data?.data?.data?.child_count);
        setShowTranferPopup(true);
      } else if (
        !openDistributorDrawer &&
        !state.deleteCustomer?.data?.data?.data?.is_used
      ) {
        setDeleteModalOpen(true);
      }
    }
  }, [state]);

  useEffect(() => {
    if (customer_parent_id)
      return dispatch(customerDetails(customer_parent_id));
    if (staff_id) {
      dispatch(staffDetailsById(staff_id));
    }
  }, [staff_id, customer_parent_id]);

  const items = [
    {
      key: "1",
      label: (
        <div
          onClick={() => {
            filterService.setFilters({
              id: distributorDetails?.id,
            });
            setCustomerDrawerFilters({
              activeTab: "insights",
            });

            setOpenDistributorDrawer(true);
          }}
          className="action-dropdown-list"
        >
          <img src={ViewDetails} alt="view" />
          View Details
        </div>
      ),
    },
    editCustomerPermission
      ? {
          key: "2",
          label: (
            <div
              onClick={() => {
                navigate(`/web/customer/add-customer?id=${id}`);
              }}
              className="action-dropdown-list"
            >
              <img src={EditIcon} alt="edit" /> Edit
            </div>
          ),
        }
      : {},
    deleteCustomerPermission && {
      key: "3",
      label: (
        <div>
          <div
            onClick={() => {
              dispatch(deleteCustomer(id, false, { check_children: true }));
            }}
            className="action-dropdown-list"
          >
            <img src={DeleteIcon} alt="delete" /> <span>Delete</span>
          </div>
        </div>
      ),
    },
  ];

  const isCheckInRequired = preference.get("activity_check_in_required");
  const columnsAdmin = [
    {
      title: "Name",
      dataIndex: "name",
      width: 250,
      fixed: "left",
      className: styles.customer_name,
      render: (text, record) => (
        <div
          className={styles.table_header_name_list}
          style={{
            position: "relative",
            cursor: "pointer",
            overflowWrap: "break-word",
            display: "flex",
            alignItems: "center",
            gap: "0.5em",
          }}
          onClick={() => openCustomerDetailModal(record)}
        >
          <img
            src={record.logo_image_url || customerIcon}
            alt={record.name}
            width={50}
            height={50}
            style={{
              objectFit: "contain",
              borderRadius: "5px",
              minWidth: 50,
              maxWidth: 50,
            }}
          />
          <WrapText len={38}>{text}</WrapText>
          <p
            className={styles.customer_level_label}
            style={{
              backgroundColor:
                record?.customer_level === "LEVEL-1"
                  ? "#FDE3C9"
                  : record?.customer_level === "LEVEL-2"
                  ? "#DFF3CE"
                  : "#D1F2FB",
            }}
          >
            <WrapText len={8}>
              {cookies.get("rupyzCustomerLevelConfig")[record.customer_level]}
            </WrapText>
          </p>
        </div>
      ),
    },
    {
      title: "Check In",
      key: "check_in",
      dataIndex: "",
      align: "center",
      width: preference.get("activity_check_in_required") ? "150px" : "180px",
      render: (text, record) => {
        let isCheckedIn = record?.check_in_time ? true : false;
        const checkedCustomer = JSON.parse(
          localStorage.getItem("CheckInCustomer") || "{}"
        );
        const isDisable =
          checkedCustomer.id && checkedCustomer.id !== record.id;
        return (
          <button
            className={"button_primary"}
            onClick={() => {
              !isCheckInRequired
                ? setChooseActivityModal({
                    open: true,
                    detail: distributorDetails,
                  })
                : isDisable
                ? setAlreadCheckedModal({ open: true, detail: record })
                : isCheckedIn
                ? openCustomerDetailModal(record)
                : setCheckInModal({ open: "true", detail: record });
            }}
            style={{
              width: isCheckInRequired ? 120 : "",
            }}
          >
            {!isCheckInRequired
              ? "Choose Activity"
              : isCheckedIn
              ? "Checked In"
              : "Check In"}
          </button>
        );
      },
    },
    ...(preference.get("activity_allow_telephonic_order")
      ? [
          {
            title: "Telephonic Order",
            key: "telephonic_order",
            dataIndex: "",
            align: "center",
            width: "195px",
            render: (text, record) => {
              const checkedCustomer = JSON.parse(
                localStorage.getItem("CheckInCustomer") || "{}"
              );
              const isDisable =
                checkedCustomer.id && checkedCustomer.id !== record.id;
              return (
                <button
                  className="button_secondary"
                  onClick={() => {
                    isDisable
                      ? setAlreadCheckedModal({ open: true, detail: record })
                      : setSelectParentModal({
                          handleAction: (data) => {
                            placeOrderWithNewCustomer(data);
                            cookies.set("telephonic_order", true, {
                              path: "/",
                            });
                          },
                          detail: record,
                        });
                  }}
                  style={{
                    opacity:
                      checkedCustomer.id && checkedCustomer.id === record.id
                        ? 0.5
                        : 1,
                  }}
                  disabled={
                    checkedCustomer.id && checkedCustomer.id === record.id
                  }
                >
                  Telephonic Order
                </button>
              );
            },
          },
        ]
      : []),
    {
      title: "Contact Person",
      dataIndex: "contact_person_name",
      width: "140px",
      render: (text) => (
        <div className={styles.contact_person_name}>
          <WrapText len={15}>{text}</WrapText>
        </div>
      ),
    },
    {
      title: "Whatsapp Number",
      dataIndex: "mobile",
      width: "170px",
      render: (text) => <WrapText len={10}>{text || "N/A"}</WrapText>,
    },
    {
      title: "Territory",
      dataIndex: "territory",
      width: "140px",
      render: (text) => <WrapText len={10}>{text || "N/A"}</WrapText>,
    },
    {
      title: "City",
      dataIndex: "city",
      width: "140px",
      render: (text, record) => (
        <div>
          <Address
            data={{
              city: record.city,
              map_location_lat: record.map_location_lat,
              map_location_long: record.map_location_long,
            }}
          />
        </div>
      ),
    },
    {
      title: "State",
      dataIndex: "state",
      width: 140,
      key: "state",
      render: (text) => <WrapText len={12}>{text || "N/A"}</WrapText>,
    },
    {
      title: "Parent",
      dataIndex: "parents_count",
      width: 170,
      render: (text, record) => {
        const parent = getChildLevelName(record, "parent");
        return text ? (
          <div
            className={styles.link_tag}
            onClick={() =>
              setOpenParentDetailList({
                id: record.id,
                title: parent,
                level: record.customer_level,
              })
            }
          >
            {text} {parent}
          </div>
        ) : (
          0
        );
      },
    },
    {
      title: "Beat",
      dataIndex: "beat_count",
      width: 130,
      key: "beat_count",
      render: (text, record) =>
        text ? (
          <div
            className={styles.link_tag}
            onClick={() =>
              setListModal({
                open: true,
                title: "Beats",
                api: `${BASE_URL_V2}/organization/${org_id}/customer/${record.id}/mapping/beats/?selected=true`,
                handleAction: null,
              })
            }
          >
            {text}
          </div>
        ) : (
          0
        ),
    },
    {
      title: "Staffs",
      dataIndex: "staff_count",
      width: 130,
      key: "staff_count",
      render: (text, record) =>
        text ? (
          <div
            className={styles.link_tag}
            onClick={() =>
              setListModal({
                open: true,
                title: "Staffs",
                api: `${BASE_URL_V2}/organization/${org_id}/customer/${record.id}/mapping/?selected=true`,
                handleAction: null,
              })
            }
          >
            {text}
          </div>
        ) : (
          0
        ),
    },
    {
      title: (
        <div
          style={{
            display: "flex",
            gap: 7,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Last Visited date
          <TableSortFilter
            value={
              activeParams?.sort_by === "last_visit_date"
                ? activeParams?.sort_order
                : ""
            }
            onChange={(v) => {
              filterService.setFilters({
                sort_by: "last_visit_date",
                sort_order: v,
              });
            }}
          />
        </div>
      ),
      dataIndex: "last_visit_date",
      width: 170,
      key: "last_visit_date",
      render: (text) => (text ? moment(text).format("DD-MMM-YYYY") : "N/A"),
    },
    {
      title: (
        <div
          style={{
            display: "flex",
            gap: 7,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Last Order date
          <TableSortFilter
            value={
              activeParams?.sort_by === "last_order_date"
                ? activeParams?.sort_order
                : ""
            }
            onChange={(v) => {
              filterService.setFilters({
                sort_by: "last_order_date",
                sort_order: v,
              });
            }}
          />
        </div>
      ),
      dataIndex: "last_order_date",
      width: 170,
      key: "last_order_date",
      render: (text) => (text ? moment(text).format("DD-MMM-YYYY") : "N/A"),
    },
    {
      title: (
        <div
          style={{
            display: "flex",
            gap: 7,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          TC
          <TableSortFilter
            value={
              activeParams?.sort_by === "lifetime_tc_count"
                ? activeParams?.sort_order
                : ""
            }
            onChange={(v) => {
              filterService.setFilters({
                sort_by: "lifetime_tc_count",
                sort_order: v,
              });
            }}
          />
        </div>
      ),
      dataIndex: "lifetime_tc_count",
      width: 100,
      align: "center",
      key: "lifetime_tc_count",
    },
    {
      title: (
        <div
          style={{
            display: "flex",
            gap: 7,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          PC
          <TableSortFilter
            value={
              activeParams?.sort_by === "lifetime_pc_count"
                ? activeParams?.sort_order
                : ""
            }
            onChange={(v) => {
              filterService.setFilters({
                sort_by: "lifetime_pc_count",
                sort_order: v,
              });
            }}
          />
        </div>
      ),
      dataIndex: "lifetime_pc_count",
      width: 100,
      align: "center",
      key: "lifetime_pc_count",
    },
    {
      title: "Pricing group",
      dataIndex: "pricing_group_name",
      width: 130,
      key: "pricing_group_name",
      render: (text) => <WrapText len={10}>{text || "N/A"}</WrapText>,
    },
    {
      title: " ",
      dataIndex: "operation",
      key: "operation",
      fixed: "right",
      className: styles.customer_name,
      width: 50,
      render: (text, record) => (
        <div
          onMouseOver={() => {
            setCustomerName(record.name);
            setId(record.id);
            cookies.set("distributorDetails", record, { path: "/" });
            setEditDistributorData(record);
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
  ].filter(Boolean);

  const handleDeleteCustomer = (data) => {
    if (data) {
      dispatch(
        deleteCustomer(id, false, {
          check_children: false,
          is_customer_delete: true,
        })
      );
    }
  };

  const callingCustomerAPI = async () => {
    if (!states.init) {
      states.init = true;
      await updateCheckInCustomer();
    }
    dispatch(customerDistributorPagination(activeParams));
  };

  const onCheckOut = () => {
    filterService.setFilters({ page: "" });
    setOpenDistributorDrawer(false);
    setChooseActivityModal(initialValue);
  };

  useEffect(() => {
    if (performanceData === "") {
      dispatch(preferencesAction());
    }
    filterService.setEventListener(setActiveParams);
  }, []);

  useEffect(() => {
    callingCustomerAPI();
  }, [activeParams]);

  useEffect(() => {
    if (!window.location.search) {
      filterService.setFilters({ page: 1 });
    }
  }, [window.location.search]);

  let obj_item = performanceData && performanceData.customer_level_config;

  const optionItems = Object.keys(removeEmptyValues(obj_item)).map((key) => {
    if (
      key[key?.length - 1] >
      parent_customer_level[parent_customer_level?.length - 1]
    )
      return (
        <option key={key} value={key}>
          {obj_item[key]}
        </option>
      );
  });

  return (
    <>
      <AdminLayout
        title={
          <>
            {staff_name || nav ? (
              <div
                style={{ display: "flex", alignItems: "center", gap: ".5em" }}
              >
                <img
                  src={ArrowLeft}
                  alt="arrow"
                  onClick={() => {
                    navigate(-1);
                  }}
                  className="clickable"
                />
                <p
                  style={{
                    margin: 0,
                    textTransform: "capitalize",
                    fontWeight: "500",
                  }}
                >
                  {!!(nav && customer_type)
                    ? `List of ${customer_type}`
                    : type
                    ? type + " (" + staffDetails?.customer_count + ")"
                    : "List of " + obj_item[customerLevel] + "s"}
                </p>
              </div>
            ) : (
              "Customer List"
            )}
          </>
        }
        subTitle={
          <Col flex={1}>
            <Row justify="space-between">
              {!!(nav && customer_type) && (
                <div style={{ color: "#727176", marginLeft: 65 }}>
                  Customer Type
                </div>
              )}

              {staff_name && (
                <Col
                  style={{
                    display: "flex",
                    alignItems: "center",
                    paddingBlock: ".5em",
                  }}
                >
                  <img
                    src={
                      staffDetails?.logo_image_url ||
                      staffDetails?.profile_pic_url ||
                      Staff
                    }
                    alt="profile"
                    className="clickable"
                    width="30px"
                    height="30px"
                    style={{
                      marginLeft: 35,
                      marginRight: 7,
                      borderRadius: "50%",
                    }}
                  />
                  {staff_name}
                  {customer_parent_id && (
                    <span style={{ color: "#727176" }}>
                      &nbsp;({staffDetails?.customer_level_name})
                    </span>
                  )}
                </Col>
              )}
            </Row>
          </Col>
        }
        search={{
          placeholder: "Search for Customer",
          searchValue: (data) => filterService.setFilters({ query: data }),
        }}
        panel={[
          <ListFilters
            activeFilters={activeParams}
            {...{ filterOptions, filterAction }}
          />,
          // <select
          //   onChange={(e) =>
          //     filterService.setFilters({
          //       customer_level: e.target.value,
          //     })
          //   }
          //   value={customerLevel}
          //   style={{ width: 200 }}
          // >
          //   <option value="">All</option>

          //   {optionItems}
          // </select>,
          ...(createCustomerPermission && !staff_id && !(nav && customer_type)
            ? [
                <button
                  className="button_primary"
                  onClick={() => {
                    cookies.set("leadData", [], { path: "/" });
                    navigate("/web/customer/add-customer");
                  }}
                >
                  <img src={Add} alt="img" className={styles.add_icon} /> Add
                  Customer
                </button>,
              ]
            : []),
        ]}
      >
        <Table
          columns={columnsAdmin}
          {...(viewCustomerPermission && {
            dataSource: distributorList,
            pagination: false,
            scroll: { y: 500 },
          })}
          onRow={(record, rowIndex) => {
            return {
              onMouseOver: () => {
                setDistributorDetails(record);
              },
            };
          }}
        />
        <ViewCustomerDetails />
        {!openDistributorDrawer && (
          <>
            <ConfirmDelete
              title={"Customer"}
              confirmValue={(data) => {
                handleDeleteCustomer(data);
              }}
            />

            <TranferPopupConfirmation
              isOpen={showTranferPopup}
              onChange={(e) => {
                setShowTranferPopup(e?.toggle);
              }}
              details={{ ...distributorDetails, childCount }}
            />
          </>
        )}
        <br />
        <br />
        <Paginator
          limiter={(distributorList || []).length < 30}
          value={activeParams["page"]}
          onChange={(i) => {
            filterService.setFilters({ page: i });
          }}
        />
      </AdminLayout>
      <RecordActivityComponent
        {...{ editActivityData }}
        onClose={() => {
          setEditActivityData({});
          setChooseActivityModal({ open: false, detail: {} });
        }}
        {...{ onCheckOut }}
      />
      <CheckIn
        {...{ checkInModal, setCheckInModal }}
        onchange={() => {
          filterService.setFilters({ page: "" });
          openCustomerDetailModal(distributorDetails);
        }}
      />
      <ChooseActivity
        {...{ chooseActivityModal, setChooseActivityModal }}
        onSelectActivityType={(value) =>
          onCreateNewActivity(distributorDetails, value)
        }
        {...{ onCheckOut }}
      />
      <AlreadyCheckInModal
        {...{ alreadCheckedModal, setAlreadCheckedModal }}
        {...{ onCheckOut }}
      />
      <CustomerParentList
        data={openParentDetailList}
        {...{ setOpenParentDetailList }}
      />
      <ListViewModal {...{ listModal, setListModal }} />
      <SelectParentCustomerForOrder
        {...{ selectParentModal, setSelectParentModal }}
      />
    </>
  );
};

export default Distributor;

export function removeEmptyValues(obj) {
  const filteredObj = {};
  for (let key in obj) {
    if (obj[key] !== "") {
      filteredObj[key] = obj[key];
    }
  }
  return filteredObj;
}

export const capitalizeFirst = (firstCharCapital) => {
  return firstCharCapital
    ? firstCharCapital.charAt(0).toUpperCase() +
        firstCharCapital.slice(1).toLowerCase()
    : "";
};

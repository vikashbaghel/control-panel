import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BeatPlanCustomer,
  beatPlanDetailById,
} from "../../redux/action/beatPlanAction";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, DeleteIcon, StoreFrontIcon } from "../../assets/globle";
import moment from "moment";
import styles from "./beatPlanDetails.module.css";
import { Dropdown, Select, Table, Tooltip } from "antd";
import {
  BeatIcon,
  Calendar,
  Customer,
  Holiday,
  Lead,
  NightStay,
  Purpose,
} from "../../assets/beat";
import { MoreOutlined } from "@ant-design/icons";
import { ViewDetails } from "../../assets";
import { Staff as staffIcon } from "../../assets/navbarImages";
import { toIndianCurrency } from "../../helpers/convertCurrency";
import { useContext } from "react";
import Context from "../../context/Context";
import RecordPayment from "../../components/viewDrawer/recordPayment";
import { Option } from "antd/es/mentions";
import UpdateBeatStatus from "./updateBeatStatus";
import Pagination from "../../components/pagination/pagination";
import handleParams from "../../helpers/handleParams";
import SearchInput from "../../components/search-bar/searchInput";

const BeatPlanDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const context = useContext(Context);
  const { distributorDetails, setLoading } = context;
  const queryParameters = new URLSearchParams(window.location.search);

  const [searchParams, setSearchParams] = useSearchParams();

  const state = useSelector((state) => state);
  const {
    getBeatPlanDetailById,
    getBeatPlanCustomer,
    approvalBeatPlanDetails,
  } = state;
  const { beatPlan_id } = useParams();
  const searchCustomerList = queryParameters.get("query") || "";

  const [beatPlanList, setBeatPlanList] = useState([]);
  // const [searchBeatPlan, setSearchBeatPlan] = useState("");

  const [beatPlanCustomerLeadData, setBeatPlanCustomerLeadData] = useState([]);
  const [selectedOption, setSelectedOption] = useState({});
  const [isCustomerTableOpen, setIsCustomerTableOpen] = useState(false);
  const [listType, setListType] = useState("TARGET_CUSTOMERS");
  const [selectedTable, setSelectedTable] = useState("Customer");
  const [beatDate, setBeatDate] = useState("");

  const page =
    searchCustomerList ||
    // listType === "TARGET_CUSTOMERS" ||
    listType === "VISITED_CUSTOMERS" ||
    listType === "UNEXPECTED_CUSTOMERS"
      ? queryParameters.get("search_page")
      : queryParameters.get("page");

  const searchBeatPlan = searchParams.get("query") || "";

  const columns = [
    {
      title: "Name",
      dataIndex: "beat_name",
      render: (text, record) => (
        <div
          onMouseOver={() => setSelectedOption(record)}
          onClick={() => {
            setIsCustomerTableOpen(true);
            setBeatDate(selectedOption.date);
          }}
          style={{ cursor: "pointer" }}
        >
          {record.is_cancelled ? (
            <div className={styles.beat_cancel_tag}>Canceled</div>
          ) : (
            <></>
          )}
          <div
            style={{
              color: "#000",
              fontWeight: "600",
              textDecoration: record.is_cancelled ? "line-through" : "",
            }}
          >
            {text}
          </div>
          <div style={{ fontSize: 11 }}>
            {moment(record.date).format("DD MMM YY")}
          </div>
        </div>
      ),
    },
    {
      title: "Pipeline",
      dataIndex: "",
      render: (text, record) => (
        <div>
          {record.target_customers_count > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
              <img src={Customer} alt="customer" width={15} />
              &nbsp;&nbsp;<span>Customer</span>
            </div>
          )}
          {record.target_leads_count > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: 10,
                gap: 2,
              }}
            >
              <img src={Lead} alt="lead" width={15} />
              &nbsp;&nbsp;<span>New Lead</span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: <div style={{ color: "#312B81" }}>Planned</div>,
      dataIndex: "",
      render: (text, record) => (
        <div>
          {record.target_customers_count > 0 && (
            <div style={{ display: "flex", alignItems: "center" }}>
              {record.target_customers_count}
            </div>
          )}
          {record.target_leads_count > 0 && (
            <div
              style={{ display: "flex", alignItems: "center", marginTop: 10 }}
            >
              {record.target_leads_count}
            </div>
          )}
        </div>
      ),
    },
    {
      title: <div style={{ color: "#309F35" }}>Visited</div>,
      dataIndex: "",
      render: (text, record) => (
        <div>
          {record.target_customers_count > 0 && (
            <div style={{ display: "flex", alignItems: "center" }}>
              {record.achieved_customers_count}
            </div>
          )}
          {record.target_leads_count > 0 && (
            <div
              style={{ display: "flex", alignItems: "center", marginTop: 10 }}
            >
              {record.achieved_leads_count}
            </div>
          )}
        </div>
      ),
    },
    {
      title: " ",
      dataIndex: "operation",
      key: "operation",
      width: 50,
      render: (text, record) => (
        <div onMouseOver={() => setSelectedOption(record)}>
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

  const columnsCustomer = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <div style={{ color: "#000", fontWeight: 600 }}>{text}</div>
      ),
    },
    {
      title: "Address",
      dataIndex: "address_line_1",
    },
    {
      title: "Credit Limit",
      dataIndex: "credit_limit",
      render: (text, record) => <div>{toIndianCurrency(text)}</div>,
    },
    {
      title: "Due",
      dataIndex: "outstanding_amount",
      render: (text, record) => <div>{toIndianCurrency(text)}</div>,
    },
    {
      title: "Contact Person",
      dataIndex: "contact_person_name",
      render: (text) => (
        <div style={{ textTransform: "uppercase" }}>{text}</div>
      ),
    },
    {
      title: "Number",
      dataIndex: "mobile",
    },
  ];

  const columnsLead = [
    {
      title: "Contact Person",
      dataIndex: "contact_person_name",
      render: (text, record) => (
        <>
          <div
            style={{ color: "black", fontWeight: "600", cursor: "pointer" }}
            onClick={() => {
              navigate(`/web/view-lead/?id=${record.id}`);
            }}
          >
            {text ? text.charAt(0).toUpperCase() + text.slice(1) : ""}
          </div>
          {record.source === "STOREFRONT" && (
            <Tooltip
              placement="top"
              title={"This Lead was generated in Storefront"}
            >
              <div
                style={{ display: "flex", alignItems: "center", fontSize: 12 }}
              >
                <img src={StoreFrontIcon} alt="img" width={17} />
                <div>Storefront</div>
              </div>
            </Tooltip>
          )}
        </>
      ),
      key: "business_name",
    },
    {
      title: "Lead Category",
      dataIndex: "lead_category_name",
      key: "lead_category",
      with: "250px",
    },
    {
      title: "Location",
      dataIndex: "",
      key: "location",
      render: (record, text) => (
        <div>
          {record.city && record.city + ","} {record.state}
        </div>
      ),
    },
    {
      title: "Created by",
      dataIndex: "created_by_name",
      key: "created_by_name",
      align: "center",
    },
    {
      title: "Created at",
      dataIndex: "",
      key: "created_at",
      render: (record, text) => (
        <div>{moment(record.created_at).format("DD-MMM-YYYY")}</div>
      ),
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
    },
  ];

  const items = [
    {
      key: "1",
      label: (
        <div
          onClick={() => {
            setIsCustomerTableOpen(true);
            setBeatDate(selectedOption.date);
            // handleSelectedBeatDate();
          }}
          className="action-dropdown-list"
        >
          <img src={ViewDetails} alt="view" />
          View Details
        </div>
      ),
    },
    {
      key: "4",
      label: (
        <div>
          <div onClick={() => {}} className="action-dropdown-list">
            <img src={DeleteIcon} alt="delete" /> <span>Delete</span>
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch(
      BeatPlanCustomer(
        beatPlan_id,
        page,
        beatDate,
        listType,
        searchCustomerList
      )
    );
  }, [listType, beatDate, searchCustomerList, page]);

  useEffect(() => {
    dispatch(beatPlanDetailById(beatPlan_id, searchBeatPlan));
  }, [searchBeatPlan]);

  useEffect(() => {
    if (getBeatPlanDetailById.data && !getBeatPlanDetailById.data.data.error) {
      setBeatPlanList(getBeatPlanDetailById.data.data.data);
    }
    if (getBeatPlanCustomer.data && !getBeatPlanCustomer.data.data.error) {
      setBeatPlanCustomerLeadData(getBeatPlanCustomer.data.data.data);
    }
    if (
      approvalBeatPlanDetails.data &&
      !approvalBeatPlanDetails.data.data.error
    ) {
      dispatch(beatPlanDetailById(beatPlan_id, searchBeatPlan));
    }
    setLoading(false);
  }, [state]);

  const isMyPlan = queryParameters.get("myPlan");

  return (
    <div className={`table_list position-rel ${styles.beat_detail_container}`}>
      <h2 className={`page_title ${styles.header_container}`}>
        {!isMyPlan ? (
          <div style={{ display: "flex", gap: 30 }}>
            <div>
              <div
                style={{ display: "flex", alignItems: "center", gap: ".5em" }}
              >
                <img
                  src={ArrowLeft}
                  alt="arrow"
                  onClick={() =>
                    isCustomerTableOpen ? (
                      <>
                        {setSelectedTable("Customer")}
                        {setListType("TARGET_CUSTOMERS")}
                        {setIsCustomerTableOpen(false)}
                      </>
                    ) : (
                      navigate("/web/beat-plan")
                    )
                  }
                  className="clickable"
                />
                <img
                  src={
                    beatPlanList?.beat_route_info?.profile_pic_url || staffIcon
                  }
                  alt="staff"
                  width={30}
                  height={30}
                  style={{ borderRadius: "50%" }}
                />

                {beatPlanList.beat_route_info?.created_by_name}
              </div>
              {!isCustomerTableOpen ? (
                <div className={styles.beat_date}>
                  {beatPlanList.beat_route_info?.name}
                  <span style={{ fontSize: 12, fontWeight: 500 }}>
                    {moment(beatPlanList.beat_route_info?.start_date).format(
                      "DD MMM YYYY"
                    )}
                    -
                    {moment(beatPlanList.beat_route_info?.end_date).format(
                      "DD MMM YYYY"
                    )}
                  </span>
                </div>
              ) : (
                <></>
              )}
            </div>

            <UpdateBeatStatus
              status={beatPlanList.beat_route_info?.status}
              beatId={beatPlan_id}
              isActive={beatPlanList.beat_route_info?.is_active}
            />
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <img
                src={ArrowLeft}
                alt="arrow"
                onClick={() =>
                  isCustomerTableOpen ? (
                    <>
                      {setIsCustomerTableOpen(false)}
                      {setSelectedTable("Customer")}
                      {setListType("TARGET_CUSTOMERS")}
                    </>
                  ) : (
                    navigate(-1)
                  )
                }
                className="clickable"
              />
              <div style={{ paddingBlockStart: ".5em" }}>
                <div>
                  {isCustomerTableOpen
                    ? "Beat Details"
                    : beatPlanList.beat_route_info?.name}
                </div>
                <div className={styles.beat_date} style={{ marginLeft: 0 }}>
                  <span
                    style={{ fontSize: 12, fontWeight: 500, marginLeft: 0 }}
                  >
                    {moment(beatPlanList.beat_route_info?.start_date).format(
                      "DD MMM YYYY"
                    )}
                    -
                    {moment(beatPlanList.beat_route_info?.end_date).format(
                      "DD MMM YYYY"
                    )}
                  </span>
                </div>
              </div>
              <div style={{ paddingBlockStart: "0.5em" }}>
                <UpdateBeatStatus
                  status={beatPlanList.beat_route_info?.status}
                  beatId={beatPlanList.beat_route_info?.is_active}
                  isActive={beatPlanList.beat_route_info?.is_active}
                />
              </div>
            </div>
          </>
        )}
      </h2>
      {!isCustomerTableOpen && (
        <div className={styles.search_bar}>
          <SearchInput
            placeholder="Search for Beat Name . . ."
            searchValue={(data) =>
              handleParams(searchParams, setSearchParams, { query: data })
            }
          />
        </div>
      )}
      {!isCustomerTableOpen ? (
        <div style={{ margin: "20px 24px" }}>
          <Table
            columns={columns}
            dataSource={beatPlanList.days_list}
            pagination={false}
            scroll={{ y: 500 }}
          />
        </div>
      ) : (
        <div
          style={{
            margin: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "2em",
          }}
        >
          <CustomerLeadHeader
            beatPlanList={beatPlanList.beat_route_info}
            selectedOption={selectedOption}
            onBack={(data) => {
              setIsCustomerTableOpen(data);
            }}
          />
          {selectedOption.beat_name === "Holiday" ? (
            <div style={{ textAlign: "center" }}>
              <img src={Holiday} alt="holiday" width={300} />
            </div>
          ) : (
            <>
              <div className={styles.table_filters_header}>
                <div className={styles.table_filters}>
                  {["Customer", "Lead"].map((ele) => (
                    <p
                      className={`${styles.filter_name} ${
                        selectedTable === ele && styles.active_filter_name
                      }`}
                      onClick={() => {
                        setListType(
                          ele === "Lead" ? "VISITED_LEADS" : "TARGET_CUSTOMERS"
                        );
                        setSelectedTable(ele);
                        if (searchCustomerList)
                          handleParams(searchParams, setSearchParams, {}, [
                            "query",
                          ]);
                      }}
                    >
                      {ele}
                    </p>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "2em" }}>
                  <SearchInput
                    value={searchCustomerList}
                    placeholder={`Search for ${selectedTable} . . .`}
                    searchValue={(data) => {
                      handleParams(searchParams, setSearchParams, {
                        query: data,
                      });
                    }}
                  />

                  {selectedTable === "Customer" && (
                    <select
                      style={{ width: "200px", padding: "5px 20px" }}
                      onChange={(e) => setListType(e.target.value)}
                      value={listType}
                    >
                      <option value="TARGET_CUSTOMERS">Pending</option>
                      <option value="VISITED_CUSTOMERS">Visited</option>
                      <option value="UNEXPECTED_CUSTOMERS">Not Planned</option>
                    </select>
                  )}
                </div>
              </div>
              <Table
                columns={
                  selectedTable === "Customer" ? columnsCustomer : columnsLead
                }
                dataSource={
                  selectedTable === "Customer"
                    ? beatPlanCustomerLeadData.customers_list
                    : beatPlanCustomerLeadData.leads_list
                }
                pagination={false}
                scroll={{ y: 500 }}
              />
              <Pagination
                list={
                  selectedTable === "Customer"
                    ? beatPlanCustomerLeadData.customers_list
                    : beatPlanCustomerLeadData.leads_list
                }
                search={
                  searchCustomerList ||
                  // listType === "TARGET_CUSTOMERS" ||
                  listType === "VISITED_CUSTOMERS" ||
                  listType === "UNEXPECTED_CUSTOMERS"
                }
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BeatPlanDetails;

const CustomerLeadHeader = ({ beatPlanList, selectedOption, onBack }) => {
  return selectedOption.beat_name === "Holiday" ? (
    <div
      className={styles.customer_lead_container}
      style={{ position: "relative" }}
    >
      {selectedOption.is_cancelled ? (
        <div className={styles.beat_cancel_tag_detail}>Cancelled</div>
      ) : (
        <></>
      )}
      <img src={BeatIcon} alt="beat" style={{ margin: "20px 5px 15px 20px" }} />
      <div className={styles.beat_details}>
        <div
          className={styles.detail_head}
          style={
            selectedOption.is_cancelled
              ? { textDecoration: "line-through" }
              : {}
          }
        >
          {selectedOption.beat_name}
        </div>
        <div className={styles.detail_date}>
          {moment(selectedOption.date).format("DD MMM YY")}
          <img src={Calendar} alt="calendar" width={18} />
        </div>
        <div className={styles.detail_name} onClick={() => onBack(false)}>
          {beatPlanList.name}
        </div>
        <div className={styles.detail_date}>
          {moment(beatPlanList.start_date).format("DD MMM YY")} -
          {moment(beatPlanList.end_date).format("DD MMM YY")}
        </div>
      </div>
    </div>
  ) : (
    <div
      className={styles.customer_lead_container}
      style={{ position: "relative" }}
    >
      {selectedOption.is_cancelled ? (
        <div className={styles.beat_cancel_tag_detail}>Cancelled</div>
      ) : (
        <></>
      )}
      <img src={BeatIcon} alt="beat" style={{ margin: "20px 5px 15px 20px" }} />
      <div className={styles.beat_details}>
        <div
          className={styles.detail_head}
          style={
            selectedOption.is_cancelled
              ? { textDecoration: "line-through" }
              : {}
          }
        >
          {selectedOption.beat_name}
        </div>
        <div className={styles.detail_date}>
          {moment(selectedOption.date).format("DD MMM YY")}
          <img src={Calendar} alt="calendar" width={18} />
        </div>
        <div className={styles.detail_name} onClick={() => onBack(false)}>
          {beatPlanList.name}
        </div>
        <div className={styles.detail_date}>
          {moment(beatPlanList.start_date).format("DD MMM YY")} -
          {moment(beatPlanList.end_date).format("DD MMM YY")}
        </div>
      </div>

      <div className={styles.beat_count}>
        <div>
          <span className={styles.row_first_head}>Pipeline</span>
          <span className={styles.row_second_head}>Planned</span>
          <span className={styles.row_third_head}>Visited</span>
        </div>
        <div>
          <span className={styles.row_first}>
            <img
              src={Customer}
              alt="customer"
              width={15}
              style={{ marginRight: 10 }}
            />
            <span>Customer</span>
          </span>
          <span className={styles.row_second}>
            {selectedOption.target_customers_count}
          </span>
          <span className={styles.row_third}>
            {selectedOption.achieved_customers_count}
          </span>
        </div>
        <div>
          <span className={styles.row_first}>
            <img
              src={Lead}
              alt="customer"
              width={17}
              style={{ marginRight: 8 }}
            />
            <span>New Lead</span>
          </span>
          <span className={styles.row_second}>
            {selectedOption.target_leads_count}
          </span>
          <span className={styles.row_third}>
            {selectedOption.achieved_leads_count}
          </span>
        </div>
      </div>
      {selectedOption.is_cancelled && (
        <div
          style={{
            borderLeft: "1px solid #dedede",
            padding: "20px",
            margin: "20px 0",
          }}
        >
          <div className={styles.cancelled_reason}>
            {selectedOption.cancel_reason}
          </div>
        </div>
      )}
      {selectedOption.night_stay && (
        <div className={styles.beat_night_stay}>
          <div className={styles.night_head}>
            <img src={NightStay} alt="night" /> <span>Night Stay</span>
          </div>
          <div className={styles.night_body}>{selectedOption.night_stay}</div>
        </div>
      )}
      {selectedOption.purpose && (
        <div className={styles.beat_night_stay}>
          <div className={styles.night_head}>
            <img src={Purpose} alt="night" /> <span>Purpose</span>
          </div>
          <div className={styles.night_body}>{selectedOption.purpose}</div>
        </div>
      )}
      {beatPlanList.comments && (
        <div className={styles.beat_admin}>
          <div className={styles.admin_head}>
            <span>Admin</span>
          </div>
          <div className={styles.admin_body}>{beatPlanList.comments}</div>
        </div>
      )}
    </div>
  );
};

import React, { useContext, useEffect, useState } from "react";
import Context from "../../context/Context";
import {
  CloseOutlined,
  CloseCircleTwoTone,
  EditOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Card, Drawer, Dropdown, List, Popconfirm, Radio, Space } from "antd";
import VirtualList from "rc-virtual-list";
import { BASE_URL_V2, org_id } from "../../config";
import axios from "axios";
import Cookies from "universal-cookie";
import { useDispatch } from "react-redux/es/exports";
import moment from "moment";
import styles from "./styles/goal.module.css";
import { deleteUserTarget } from "../../redux/action/goals";
import EditStaffGoalAssign from "./editStaffgoalAssign";
import InfiniteScroll from "react-infinite-scroll-component";
import Permissions from "../../helpers/permissions";
import { roundToDecimalPlaces } from "../../helpers/roundToDecimal";
import { toIndianCurrency } from "../../helpers/convertCurrency";

const TargetDetails = ({ id }) => {
  const dispatch = useDispatch();
  const context = useContext(Context);
  const {
    targetDetailViewOpen,
    setTargetDetailViewOpen,
    setEditStaffTargetAssign,
  } = context;
  const cookies = new Cookies();

  const [activeData, setActiveData] = useState({});
  const [activeProductIsOpen, setActiveProductIsOpen] = useState(false);

  const [upcomingProductIsOpen, setUpcomingProductIsOpen] = useState(false);
  const [upcomingPageNo, setUpcomingPageNo] = useState(1);
  const [upcomingHasMore, setUpcomingHasMore] = useState(true);
  const [upcomingData, setUpcomingData] = useState([]);

  const [closedProductIsOpen, setClosedProductIsOpen] = useState(false);
  const [closedPageNo, setClosedPageNo] = useState(1);
  const [closedHasMore, setClosedHasMore] = useState(true);
  const [closedData, setClosedData] = useState([]);

  const [dropdownTable, setDropdownTable] = useState(false);
  const [indexMatch, setIndexMatch] = useState(0);
  const [user, setUser] = useState("");

  const [targetType, setTargetType] = useState("active");

  let setTargetTemplate = Permissions("SET_TARGET_TEMPLATE");

  const appendActiveData = () => {
    let url;
    if (id === 0) {
      url = `${BASE_URL_V2}/organization/${org_id}/target/?get_currently_active=true`;
    } else {
      url = `${BASE_URL_V2}/organization/${org_id}/target/set/?user_id=${id}&get_currently_active=true`;
    }
    const headers = { Authorization: cookies.get("rupyzToken") };
    axios.get(url, { headers }).then((response) => {
      setActiveData(response.data.data);
    });
  };

  const appendUpcomingData = () => {
    let url;
    if (id === 0) {
      url = `${BASE_URL_V2}/organization/${org_id}/target/?page_no=${upcomingPageNo}&upcoming=true`;
    } else {
      url = `${BASE_URL_V2}/organization/${org_id}/target/set/?user_id=${id}&page_no=${upcomingPageNo}&upcoming=true`;
    }
    const headers = { Authorization: cookies.get("rupyzToken") };
    axios.get(url, { headers }).then((response) => {
      setUpcomingData(upcomingData.concat(response.data.data));
      setUpcomingPageNo(upcomingPageNo + 1);
      if (response.data.data.length !== 30) {
        setUpcomingHasMore(false);
      }
    });
  };

  const appendClosedData = () => {
    let url;
    if (id === 0) {
      url = `${BASE_URL_V2}/organization/${org_id}/target/?page_no=${upcomingPageNo}&closed=true`;
    } else {
      url = `${BASE_URL_V2}/organization/${org_id}/target/set/?user_id=${id}&page_no=${upcomingPageNo}&closed=true`;
    }
    const headers = { Authorization: cookies.get("rupyzToken") };
    axios.get(url, { headers }).then((response) => {
      setClosedData(closedData.concat(response.data.data));
      setClosedPageNo(closedPageNo + 1);
      if (response.data.data.length !== 30) {
        setClosedHasMore(false);
      }
    });
  };

  useEffect(() => {
    if (targetDetailViewOpen) {
      appendActiveData();
      appendUpcomingData();
      appendClosedData();
    }
  }, [targetDetailViewOpen]);

  const onClose = () => {
    setTargetDetailViewOpen(false);
    setActiveData({});
    setUpcomingData([]);
    setClosedData([]);
    setUpcomingPageNo(1);
    setClosedPageNo(1);
  };

  const items = [
    {
      key: "1",
      label: (
        <div onClick={() => setEditStaffTargetAssign(true)}>
          <EditOutlined style={style.icon_edit} /> Edit
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div>
          <Popconfirm
            title="Are You Sure, You want to Delete this Lead ?"
            onConfirm={() => {
              let activeDataforApi = {
                name: user.name,
                duration_string: user.duration_string,
                sales_amount: user.target_sales_amount,
                payment_collection: user.target_payment_collection,
                new_leads: user.target_new_leads,
                new_customers: user.target_new_customers,
                customer_visits: user.target_customer_visits,
              };
              dispatch(deleteUserTarget(parseInt(user.id), activeDataforApi));
            }}
          >
            <CloseCircleTwoTone twoToneColor="red" /> Delete
          </Popconfirm>
        </div>
      ),
    },
  ];

  function calculateAggregatePercentage(data) {
    if (data.length <= 0) return 0;
    const totalCurrent =
      data && data.reduce((acc, item) => acc + item.current_value, 0);
    const totalTarget =
      data && data.reduce((acc, item) => acc + item.target_value, 0);
    const aggregatePercentage = (totalCurrent / totalTarget) * 100;

    if (aggregatePercentage > 0) {
      return roundToDecimalPlaces(aggregatePercentage);
    }
    return aggregatePercentage;
  }

  return (
    <Drawer
      title={
        <>
          <CloseOutlined onClick={onClose} />
          &nbsp;&nbsp;&nbsp; Target Details
        </>
      }
      width={500}
      closable={false}
      onClose={onClose}
      open={targetDetailViewOpen}
      style={{ overflowY: "auto" }}
    >
      <Radio.Group
        name="radiogroup"
        defaultValue="active"
        onChange={(e) => {
          setTargetType(e.target.value);
          setDropdownTable(false);
        }}
        buttonStyle="solid"
      >
        <Radio.Button
          value="active"
          style={{ width: 120, textAlign: "center" }}
        >
          Active
        </Radio.Button>
        <Radio.Button
          value="upcoming"
          style={{ width: 120, textAlign: "center" }}
        >
          Upcoming
        </Radio.Button>
        <Radio.Button
          value="closed"
          style={{ width: 120, textAlign: "center" }}
        >
          Closed
        </Radio.Button>
      </Radio.Group>
      <br />
      <br />
      {(targetType === "active" && !activeData.start_date) ||
      (targetType === "upcoming" && upcomingData.length === 0) ||
      (targetType === "closed" && closedData.length === 0) ? (
        <Card>No Data Available</Card>
      ) : (
        <></>
      )}
      {targetType === "active" ? (
        activeData.start_date ? (
          <div key={activeData.id} style={{ alignItems: "center !important" }}>
            <Card>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    color: "#312B81",
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  {activeData.name
                    ? activeData.name.charAt(0).toUpperCase() +
                      activeData.name.slice(1)
                    : "Custom Target"}
                </div>
                {window.location.pathname === "/web/target" ? (
                  <></>
                ) : setTargetTemplate ? (
                  <Space
                    size="middle"
                    direction="horizontal"
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      position: "relative",
                    }}
                  >
                    <Dropdown
                      menu={{
                        items,
                      }}
                    >
                      <a
                        style={{
                          color: "black",
                          position: "absolute",
                          top: -30,
                          right: 0,
                        }}
                        onMouseEnter={() => {
                          setUser(activeData);
                        }}
                      >
                        ...
                      </a>
                    </Dropdown>
                  </Space>
                ) : (
                  <></>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#464646",
                }}
              >
                <div style={{ fontSize: 12 }}>
                  Assigned by - {activeData.created_by_name}
                </div>
                <div>
                  {moment(activeData.start_date).format("DD MMMM YY")} -{" "}
                  {moment(activeData.end_date).format("DD MMMM YY")}{" "}
                </div>
              </div>
              <div className={`${styles.target_table} ${styles.active_table}`}>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Target</th>
                      <th>Achieved</th>
                      <th>Percent</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Sales</td>
                      <td>
                        {toIndianCurrency(activeData.target_sales_amount)}
                      </td>
                      <td>
                        {toIndianCurrency(activeData.current_sales_amount)}
                      </td>
                      <td>
                        {activeData.target_sales_amount === 0
                          ? 0
                          : roundToDecimalPlaces(
                              (activeData.current_sales_amount /
                                activeData.target_sales_amount) *
                                100
                            )}
                        %
                      </td>
                    </tr>
                    <tr>
                      <td>Collection</td>
                      <td>
                        {toIndianCurrency(activeData.target_payment_collection)}
                      </td>
                      <td>
                        {toIndianCurrency(
                          activeData.current_payment_collection
                        )}
                      </td>
                      <td>
                        {activeData.target_payment_collection === 0
                          ? 0
                          : roundToDecimalPlaces(
                              (activeData.current_payment_collection /
                                activeData.target_payment_collection) *
                                100
                            )}
                        %
                      </td>
                    </tr>
                    <tr>
                      <td>Leads</td>
                      <td>{activeData.target_new_leads}</td>
                      <td>{activeData.current_new_leads}</td>
                      <td>
                        {activeData.target_new_leads === 0
                          ? 0
                          : (activeData.current_new_leads /
                              activeData.target_new_leads) *
                            100}
                        %
                      </td>
                    </tr>
                    <tr>
                      <td>Customers</td>
                      <td>{activeData.target_new_customers}</td>
                      <td>{activeData.current_new_customers}</td>
                      <td>
                        {activeData.target_new_customers === 0
                          ? 0
                          : roundToDecimalPlaces(
                              (activeData.current_new_customers /
                                activeData.target_new_customers) *
                                100
                            )}
                        %
                      </td>
                    </tr>
                    <tr>
                      <td>Visits</td>
                      <td>{activeData.target_customer_visits}</td>
                      <td>{activeData.current_customer_visits}</td>
                      <td>
                        {activeData.target_customer_visits === 0
                          ? 0
                          : roundToDecimalPlaces(
                              (activeData.current_customer_visits /
                                activeData.target_customer_visits) *
                                100
                            )}
                        %
                      </td>
                    </tr>
                    <tr
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setActiveProductIsOpen(!activeProductIsOpen)
                      }
                    >
                      <td
                        style={{
                          textDecoration: "underline",
                          color: "#1677FF",
                        }}
                      >
                        Product
                      </td>
                      <td>{activeData.product_metrics.length}</td>
                      <td>-</td>
                      <td>
                        {calculateAggregatePercentage(
                          activeData.product_metrics
                        )}
                        %{" "}
                        <span style={{ color: "#1677FF" }}>
                          &nbsp;&nbsp;{">>"}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div
                  className={`${styles.product_target_list} ${
                    activeProductIsOpen ? styles.active_product_list : ""
                  }`}
                >
                  {activeData.product_metrics.map((data, index) => {
                    return activeData.product_metrics.length > 0 ? (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                        }}
                      >
                        <div
                          style={{
                            width: "50%",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {data.name}
                        </div>
                        <div style={{ width: "20%" }}>{data.target_value}</div>
                        <div style={{ width: "20%" }}>{data.current_value}</div>
                        <div style={{ width: "10%" }}>
                          {roundToDecimalPlaces(
                            (data.current_value / data.target_value) * 100
                          )}
                          %
                        </div>
                      </div>
                    ) : (
                      <div>No Data Available</div>
                    );
                  })}
                </div>
              </div>
            </Card>
            <br />
          </div>
        ) : (
          <></>
        )
      ) : targetType === "upcoming" ? (
        <InfiniteScroll
          dataLength={upcomingData.length}
          next={appendUpcomingData}
          hasMore={upcomingHasMore}
          height={550}
          loader={
            <h4 style={{ textAlign: "center", color: "blue" }}>Loading...</h4>
          }
          scrollableTarget="scrollableDiv"
        >
          {upcomingData.map((data) => (
            <div
              key={data.id}
              style={{ alignItems: "center !important" }}
              id="scrollableDiv"
            >
              <Card>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      color: "#312B81",
                      fontSize: 16,
                      fontWeight: 600,
                    }}
                  >
                    {data.name
                      ? data.name.charAt(0).toUpperCase() + data.name.slice(1)
                      : "Custom Target"}
                  </div>
                  {window.location.pathname === "/web/target" ? (
                    <></>
                  ) : (
                    <Space
                      size="middle"
                      direction="horizontal"
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        position: "relative",
                      }}
                    >
                      <Dropdown
                        menu={{
                          items,
                        }}
                      >
                        <a
                          style={{
                            color: "black",
                            position: "absolute",
                            top: -30,
                            right: 0,
                          }}
                          onMouseEnter={() => {
                            setUser(data);
                          }}
                        >
                          ...
                        </a>
                      </Dropdown>
                    </Space>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#464646",
                  }}
                >
                  <div style={{ fontSize: 12 }}>
                    Assigned by - {data.created_by_name}
                  </div>
                  <div>
                    {moment(data.start_date).format("DD MMMM YY")} -{" "}
                    {moment(data.end_date).format("DD MMMM YY")}{" "}
                    <span className={styles.dropdown_icon}>
                      <DownOutlined
                        onClick={() => {
                          setDropdownTable(!dropdownTable);
                          setIndexMatch(data.id);
                        }}
                      />
                    </span>
                  </div>
                </div>
                <div
                  className={`${styles.target_table} ${
                    dropdownTable && indexMatch === data.id
                      ? styles.active_table
                      : ""
                  }`}
                >
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Target</th>
                        <th>Achieved</th>
                        <th>Percent</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Sales</td>
                        <td>{toIndianCurrency(data.target_sales_amount)}</td>
                        <td>{toIndianCurrency(data.current_sales_amount)}</td>
                        <td>
                          {data.target_sales_amount === 0
                            ? 0
                            : roundToDecimalPlaces(
                                (data.current_sales_amount /
                                  data.target_sales_amount) *
                                  100
                              )}
                          %
                        </td>
                      </tr>
                      <tr>
                        <td>Collection</td>
                        <td>
                          {toIndianCurrency(data.target_payment_collection)}
                        </td>
                        <td>
                          {toIndianCurrency(data.current_payment_collection)}
                        </td>
                        <td>
                          {data.target_payment_collection === 0
                            ? 0
                            : roundToDecimalPlaces(
                                (data.current_payment_collection /
                                  data.target_payment_collection) *
                                  100
                              )}
                          %
                        </td>
                      </tr>
                      <tr>
                        <td>Leads</td>
                        <td>{data.target_new_leads}</td>
                        <td>{data.current_new_leads}</td>
                        <td>
                          {data.target_new_leads === 0
                            ? 0
                            : roundToDecimalPlaces(
                                (data.current_new_leads /
                                  data.target_new_leads) *
                                  100
                              )}
                          %
                        </td>
                      </tr>
                      <tr>
                        <td>Customers</td>
                        <td>{data.target_new_customers}</td>
                        <td>{data.current_new_customers}</td>
                        <td>
                          {data.target_new_customers === 0
                            ? 0
                            : roundToDecimalPlaces(
                                (data.current_new_customers /
                                  data.target_new_customers) *
                                  100
                              )}
                          %
                        </td>
                      </tr>
                      <tr>
                        <td>Visits</td>
                        <td>{data.target_customer_visits}</td>
                        <td>{data.current_customer_visits}</td>
                        <td>
                          {data.target_customer_visits === 0
                            ? 0
                            : roundToDecimalPlaces(
                                (data.current_customer_visits /
                                  data.target_customer_visits) *
                                  100
                              )}
                          %
                        </td>
                      </tr>
                      <tr
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setUpcomingProductIsOpen(!upcomingProductIsOpen)
                        }
                      >
                        <td
                          style={{
                            textDecoration: "underline",
                            color: "#1677FF",
                          }}
                        >
                          Product
                        </td>
                        <td>{data.product_metrics.length}</td>
                        <td>-</td>
                        <td>
                          {calculateAggregatePercentage(data.product_metrics)}%{" "}
                          <span style={{ color: "#1677FF" }}>
                            &nbsp;&nbsp;{">>"}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div
                    className={styles.product_metrics_list}
                    onClick={() =>
                      setUpcomingProductIsOpen(!upcomingProductIsOpen)
                    }
                  >
                    <div
                      style={{
                        textDecoration: "underline",
                        color: "#1677FF",
                      }}
                    >
                      Product
                    </div>
                    <div>{data.product_metrics.length}</div>
                    <div></div>
                    <div
                      style={{
                        textAlign: "start",
                      }}
                    >
                      {calculateAggregatePercentage(data.product_metrics)}%{" "}
                      <span style={{ color: "#1677FF" }}>{">>"}</span>
                    </div>
                  </div>
                  <div
                    className={`${styles.product_target_list} ${
                      upcomingProductIsOpen ? styles.active_product_list : ""
                    }`}
                  >
                    {data.product_metrics.map((data, index) => {
                      return (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                          }}
                        >
                          <div
                            style={{
                              width: "50%",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {data.name}
                          </div>
                          <div style={{ width: "20%" }}>
                            {data.target_value}
                          </div>
                          <div style={{ width: "20%" }}>
                            {data.current_value}
                          </div>
                          <div style={{ width: "10%" }}>
                            {roundToDecimalPlaces(
                              (data.current_value / data.target_value) * 100
                            )}{" "}
                            %
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
              <br />
            </div>
          ))}
        </InfiniteScroll>
      ) : (
        <InfiniteScroll
          dataLength={closedData.length}
          next={appendClosedData}
          hasMore={closedHasMore}
          height={550}
          loader={
            <h4 style={{ textAlign: "center", color: "blue" }}>Loading...</h4>
          }
          scrollableTarget="scrollableDiv"
        >
          {closedData.map((data) => (
            <div
              key={data.id}
              style={{ alignItems: "center !important" }}
              id="scrollableDiv"
            >
              <Card>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      color: "#312B81",
                      fontSize: 16,
                      fontWeight: 600,
                    }}
                  >
                    {data.name
                      ? data.name.charAt(0).toUpperCase() + data.name.slice(1)
                      : "Custom Target"}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#464646",
                  }}
                >
                  <div style={{ fontSize: 12 }}>
                    Assigned by - {data.created_by_name}
                  </div>
                  <div>
                    {moment(data.start_date).format("DD MMMM YY")} -{" "}
                    {moment(data.end_date).format("DD MMMM YY")}{" "}
                    <span className={styles.dropdown_icon}>
                      <DownOutlined
                        onClick={() => {
                          setDropdownTable(!dropdownTable);
                          setIndexMatch(data.id);
                        }}
                      />
                    </span>
                  </div>
                </div>
                <div
                  className={`${styles.target_table} ${
                    dropdownTable && indexMatch === data.id
                      ? styles.active_table
                      : ""
                  }`}
                >
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Target</th>
                        <th>Achieved</th>
                        <th>Percent</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Sales</td>
                        <td>{toIndianCurrency(data.target_sales_amount)}</td>
                        <td>{toIndianCurrency(data.current_sales_amount)}</td>
                        <td>
                          {data.target_sales_amount === 0
                            ? 0
                            : roundToDecimalPlaces(
                                (data.current_sales_amount /
                                  data.target_sales_amount) *
                                  100
                              )}
                          %
                        </td>
                      </tr>
                      <tr>
                        <td>Collection</td>
                        <td>
                          {toIndianCurrency(data.target_payment_collection)}
                        </td>
                        <td>
                          {toIndianCurrency(data.current_payment_collection)}
                        </td>
                        <td>
                          {data.target_payment_collection === 0
                            ? 0
                            : roundToDecimalPlaces(
                                (data.current_payment_collection /
                                  data.target_payment_collection) *
                                  100
                              )}
                          %
                        </td>
                      </tr>
                      <tr>
                        <td>Leads</td>
                        <td>{data.target_new_leads}</td>
                        <td>{data.current_new_leads}</td>
                        <td>
                          {data.target_new_leads === 0
                            ? 0
                            : roundToDecimalPlaces(
                                (data.current_new_leads /
                                  data.target_new_leads) *
                                  100
                              )}
                          %
                        </td>
                      </tr>
                      <tr>
                        <td>Customers</td>
                        <td>{data.target_new_customers}</td>
                        <td>{data.current_new_customers}</td>
                        <td>
                          {data.target_new_customers === 0
                            ? 0
                            : roundToDecimalPlaces(
                                (data.current_new_customers /
                                  data.target_new_customers) *
                                  100
                              )}
                          %
                        </td>
                      </tr>
                      <tr>
                        <td>Visits</td>
                        <td>{data.target_customer_visits}</td>
                        <td>{data.current_customer_visits}</td>
                        <td>
                          {data.target_customer_visits === 0
                            ? 0
                            : roundToDecimalPlaces(
                                (data.current_customer_visits /
                                  data.target_customer_visits) *
                                  100
                              )}
                          %
                        </td>
                      </tr>
                      <tr
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setClosedProductIsOpen(!closedProductIsOpen)
                        }
                      >
                        <td
                          style={{
                            textDecoration: "underline",
                            color: "#1677FF",
                          }}
                        >
                          Product
                        </td>
                        <td>{data.product_metrics.length}</td>
                        <td>-</td>
                        <td>
                          {calculateAggregatePercentage(
                            activeData.product_metrics
                          )}
                          %{" "}
                          <span style={{ color: "#1677FF" }}>
                            &nbsp;&nbsp;{">>"}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div
                    className={`${styles.product_target_list} ${
                      closedProductIsOpen ? styles.active_product_list : ""
                    }`}
                  >
                    {data.product_metrics.map((data, index) => {
                      return (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                          }}
                        >
                          <div
                            style={{
                              width: "50%",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {data.name}
                          </div>
                          <div style={{ width: "20%" }}>
                            {data.target_value}
                          </div>
                          <div style={{ width: "20%" }}>
                            {data.current_value}
                          </div>
                          <div style={{ width: "10%" }}>
                            {roundToDecimalPlaces(
                              (data.current_value / data.target_value) * 100
                            )}{" "}
                            %
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
              <br />
            </div>
          ))}
        </InfiniteScroll>
      )}
      <EditStaffGoalAssign targetList={user} />
    </Drawer>
  );
};

export default TargetDetails;

const style = {
  icon_edit: {
    color: "#34c38f",
    cursor: "pointer",
    fontSize: 15,
  },
};

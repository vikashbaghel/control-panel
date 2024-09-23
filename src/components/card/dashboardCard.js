import { Card, Col, Row } from "antd";
import { accessType } from "../../config.js";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Permissions from "../../helpers/permissions";
import moment from "moment";
import { activeBeatPlanDetailsAction } from "../../redux/action/beatPlanAction.js";
import styles from "./dashboardCard.module.css";
import {
  Payment,
  Order,
  Customer,
  Lead,
  Product,
} from "../../assets/dashboardIcon";
import Staff from "../../assets/dashboardIcon/staffOutlined.svg";
import { BeatDashboardLogo, ColorBeatIcon } from "../../assets/beat/index.js";
import { BlankBeatIcon } from "../../assets/staffImages/index.js";

const DashboardOverViewCard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentDate = new Date();
  const state = useSelector((state) => state);
  const [activeBeatPlanDetailsData, setActiveBeatPlanDetailsData] = useState(
    {}
  );

  let viewStaffPermission = Permissions("VIEW_STAFF");
  let viewOrderPermission = Permissions("VIEW_ORDER");
  let viewCustomerPermission = Permissions("VIEW_CUSTOMER");
  let viewPaymentPermission = Permissions("VIEW_PAYMENT");
  let viewLeadPermission = Permissions("VIEW_LEAD");

  function DaysCount() {
    const start = new Date(
      activeBeatPlanDetailsData?.beat_route_info?.start_date
    );
    const end = new Date(activeBeatPlanDetailsData?.beat_route_info?.end_date);
    const dates = [];

    // Loop through each date and push to the dates array
    for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
      // dates.push( moment(date).format("DD.MM.YYYY")new Date(date));
      dates.push(moment(date).format("YYYY-MM-DD"));
    }
  }

  const onClickHandler = (id) => {
    navigate(`/web/beat-plan-details/${id}?myPlan=true`);
  };

  const admin = accessType === "WEB_SARE360";

  const dashboardCardOption = [
    { label: "Products", img: Product, link: "/web/product" },
    ...(viewCustomerPermission
      ? [
          {
            label: "Customer",
            img: Customer,
            link: "/web/customer",
          },
        ]
      : []),
    ...(viewStaffPermission
      ? [
          {
            label: "Staff",
            img: Staff,
            link: "/web/staff",
          },
        ]
      : []),
    ...(viewOrderPermission
      ? [
          {
            label: "Orders",
            img: Order,
            link: "/web/order/order-list",
          },
        ]
      : []),
    ...(viewPaymentPermission
      ? [
          {
            label: "Payment",
            img: Payment,
            link: "/web/payment",
          },
        ]
      : []),
    ...(viewLeadPermission
      ? [
          {
            label: "Lead",
            img: Lead,
            link: "/web/lead",
          },
        ]
      : []),
  ];

  useEffect(() => {
    if (state.getActiveBeatPlanDetails.data !== "") {
      if (state.getActiveBeatPlanDetails.data.data.error === false)
        setActiveBeatPlanDetailsData(
          state.getActiveBeatPlanDetails.data.data.data
        );
      DaysCount();
    }
  }, [state]);

  useEffect(() => {
    dispatch(
      activeBeatPlanDetailsAction(moment(currentDate).format("YYYY-MM-DD"))
    );
  }, []);

  return (
    <>
      {admin ? (
        <DashboardCardElement {...{ dashboardCardOption }} />
      ) : (
        <>
          <div className={styles.beatroute_container}>
            <div className={styles.beat_header}>
              <img
                src={BeatDashboardLogo}
                alt="beat"
                style={{ marginRight: 15 }}
              />
              Beat Plan
            </div>
            <div
              className={styles.beat_body}
              style={
                Object?.keys(activeBeatPlanDetailsData)?.length === 0
                  ? {
                      display: "flex",
                      justifyContent: "center",
                    }
                  : {}
              }
            >
              {Object?.keys(activeBeatPlanDetailsData)?.length === 0 ? (
                <div>
                  <img src={BlankBeatIcon} alt="beat" />
                  <p>You don't have active Beat Plan</p>
                </div>
              ) : (
                <>
                  <div className={styles.beat_body_head}>
                    {activeBeatPlanDetailsData.days_list?.is_cancelled ? (
                      <div className={styles.beat_cancel_tag}>Canceled</div>
                    ) : (
                      <></>
                    )}
                    <span>
                      <img
                        src={ColorBeatIcon}
                        alt="beat"
                        style={{ marginRight: 7 }}
                        width={20}
                      />{" "}
                      {activeBeatPlanDetailsData.days_list?.beat_name}
                    </span>
                    <span className={styles.date}>
                      {moment(activeBeatPlanDetailsData.days_list?.date).format(
                        "DD MMM YY"
                      )}
                    </span>
                  </div>
                  <div className={styles.beat_body_sub_head}>
                    <span className={styles.beat_name}>
                      {activeBeatPlanDetailsData.beat_route_info?.name}
                    </span>
                    <span className={styles.date} style={{ fontSize: 12 }}>
                      {moment(
                        activeBeatPlanDetailsData.beat_route_info?.start_date
                      ).format("DD MMM YY")}{" "}
                      -{" "}
                      {moment(
                        activeBeatPlanDetailsData.beat_route_info?.end_date
                      ).format("DD MMM YY")}
                    </span>
                  </div>
                  <div className={styles.beat_body_table}>
                    <div>
                      <div>Pipeline</div>
                      <div className={styles.table_name}>
                        <img
                          src={Customer}
                          alt="customer"
                          width={25}
                          style={{ marginRight: 15 }}
                        />
                        Customer
                      </div>
                      <div className={styles.table_name}>
                        {" "}
                        <img
                          src={Lead}
                          alt="lead"
                          width={25}
                          style={{ marginRight: 15 }}
                        />{" "}
                        New Lead
                      </div>
                    </div>
                    <div>
                      <div style={{ color: "#312B81" }}>Planned</div>
                      <div>
                        {
                          activeBeatPlanDetailsData.days_list
                            ?.target_customers_count
                        }
                      </div>
                      <div>
                        {
                          activeBeatPlanDetailsData.days_list
                            ?.target_leads_count
                        }
                      </div>
                    </div>
                    <div>
                      <div style={{ color: "#309F35" }}>Visited</div>
                      <div>
                        {
                          activeBeatPlanDetailsData.days_list
                            ?.achieved_customers_count
                        }
                      </div>
                      <div>
                        {
                          activeBeatPlanDetailsData.days_list
                            ?.achieved_leads_count
                        }
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            {Object?.keys(activeBeatPlanDetailsData)?.length !== 0 && (
              <div className={styles.beat_footer}>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    onClickHandler(
                      activeBeatPlanDetailsData.days_list?.beatrouteplan
                    )
                  }
                >
                  View Details
                </span>
              </div>
            )}
          </div>
          <DashboardCardElement {...{ dashboardCardOption }} />
        </>
      )}
    </>
  );
};

export default DashboardOverViewCard;

const DashboardCardElement = ({ dashboardCardOption }) => {
  return (
    <Row gutter={30}>
      {dashboardCardOption.map((item, index) => (
        <Col span={12} key={index} style={{ marginBottom: 20 }}>
          <Link to={item.link} style={linkCardStyle}>
            <Card bordered={false} className={styles.dashboard_card}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3>{item.label}</h3>
                <img src={item.img} alt="img" />
              </div>
            </Card>
          </Link>
        </Col>
      ))}
    </Row>
  );
};

const linkCardStyle = {
  display: "block",
};

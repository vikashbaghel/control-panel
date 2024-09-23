import React, { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Context from "../../context/Context";
import styles from "./viewCustomer.module.css";
import {
  ActivityIcon,
  BlankActivityIcon,
} from "../../assets/staffImages/index.js";
import { feedbackAndActivityService } from "../../redux/action/recordFollowUpAction";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "antd";
import OrderView from "../../components/viewDrawer/orderView";
import PaymentView from "../../components/viewDrawer/viewPaymentDetail";
import ViewRecordActivityComponent from "../../components/activityModal/viewRecordActivityModal.js";
import ActivityCard from "../../components/activity-card/activityCard";
import CustomerActivityCard from "../../components/viewDrawer/distributor-details/customerActivityCard.js";
import InfiniteScrollWrapper from "../../components/infinite-scroll-wrapper/infiniteScrollWrapper.js";
import { BASE_URL_V2, org_id } from "../../config.js";

const ActivityView = ({ customerId }) => {
  const navigate = useNavigate();

  return (
    <>
      <div>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1em" }}
          className="no-scrollbar"
        >
          <InfiniteScrollWrapper
            {...{
              apiUrl: `${BASE_URL_V2}/organization/${org_id}/activity/feedback/?customer_id=${customerId}&is_all_true=true`,
              height: 500,
              // formatter: (obj) => obj.activity_list || [],
            }}
          >
            {(data, key) => <CustomerActivityCard {...{ key, data }} />}
          </InfiniteScrollWrapper>
        </div>
        {/* (
          <div
            style={{
              display: "flex",
              padding: "10px 20px",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "50px",
              }}
            >
              <img src={BlankActivityIcon} alt="Activity" />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "30px",
                marginBottom: "30px",
              }}
            >
              No activity performed
            </div>
          </div>
        ) */}
        <OrderView />
        <PaymentView />
        <ViewRecordActivityComponent />
      </div>
    </>
  );
};

export default ActivityView;

import React, { useEffect, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Context from "../../context/Context";
import styles from "./lead.module.css";
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
import RecordActivityComponent from "../../components/activityModal/recordActivity.js";

const ActivityViewLead = ({ id, removeRecordActivity }) => {
  const dateFormat = "YYYY-MM-DD";
  const context = useContext(Context);
  const {
    setRecordActivityOpen,
    setAttendanceModalAction,
    setEditRecordActivityData,
  } = context;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state);
  const { addFeedBackAndActivity } = state;
  const [activityList, setActivityList] = useState([]);
  const [dateFilter, setDateFilter] = useState();

  const [editActivityData, setEditActivityData] = useState({});

  useEffect(() => {
    id &&
      dispatch(
        feedbackAndActivityService(
          "",
          id,
          dateFilter ? false : true,
          dateFilter
        )
      );
  }, [dateFilter]);

  useEffect(() => {
    if (state.getFeedBackAndActivity.data !== "") {
      if (state.getFeedBackAndActivity.data.data.error === false)
        setActivityList(state.getFeedBackAndActivity.data.data.data);
    }
    if (addFeedBackAndActivity.data !== "") {
      if (addFeedBackAndActivity.data.data.error === false) {
        if (addFeedBackAndActivity.data.status === 200) {
          dispatch(
            feedbackAndActivityService(
              "",
              id,
              true,
              dateFilter ? dateFilter : ""
            )
          );
        }
      }
    }
  }, [state]);

  const getObjectLength = (obj) => {
    if (obj === undefined || obj === null) {
      return 0;
    }
    return Object.keys(obj).length;
  };

  const activityLength = getObjectLength(activityList);

  // date handle
  const handleJoiningDateChange = (date, dateString) => {
    setDateFilter(dateString);
  };

  // Disable dates after the current date
  const disabledDate = (current) => {
    return current && current > moment().endOf("day");
  };

  return (
    <>
      {activityList && (
        <div className={styles.activity_details_main_header}>
          <div className={styles.activity_location}>
            <div className={styles.activity_details_header}>
              <img src={ActivityIcon} alt="ActivityIcon" />
              <p>Activity</p>
            </div>
            <div>
              <DatePicker
                format={dateFormat}
                onChange={handleJoiningDateChange}
                disabledDate={disabledDate}
                style={{ width: "125px", padding: "4px 11px" }}
              />
            </div>
            {!removeRecordActivity && (
              <button
                onClick={() => {
                  setAttendanceModalAction({
                    open: true,
                    handleAction: () => {
                      setEditActivityData({
                        module_type: "Lead Feedback",
                        module_id: id,
                      });
                    },
                  });
                }}
                className="button_secondary"
              >
                Record Activity
              </button>
            )}
          </div>

          {activityLength > 0 ? (
            <div className={styles.activity_details_main_box_Wrap}>
              {activityList &&
                activityList.map(
                  (item, index) =>
                    index < 10 && (
                      <ActivityCard
                        key={index}
                        data={item}
                        editPermission={!removeRecordActivity}
                      />
                    )
                )}
              {activityList?.length > 10 && (
                <p
                  className={styles.view_all}
                  onClick={() => {
                    navigate(`/web/customer-activity?lead_id=${id}`);
                  }}
                >
                  View All
                </p>
              )}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                padding: "10px 20px",
                flexDirection: "column",
              }}
            >
              <div>Recent Activity</div>
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
          )}
        </div>
      )}
      <OrderView />
      <PaymentView />
      {/* <ViewRecordActivityComponent editPermission={!removeRecordActivity} /> */}
      <RecordActivityComponent
        {...{ editActivityData }}
        onClose={() => {
          setEditActivityData({});
        }}
      />
    </>
  );
};

export default ActivityViewLead;

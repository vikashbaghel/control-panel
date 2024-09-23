import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./activity.module.css";
import { BlankActivityIcon } from "../../assets/staffImages/index.js";
import { staffAllActivityService } from "../../redux/action/recordFollowUpAction";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import ViewRecordActivityComponent from "../../components/activityModal/viewRecordActivityModal.js";
import ActivityCard from "../../components/activity-card/activityCard";
import { Staff } from "../../assets/navbarImages/index.js";
import ActivityHeader from "../../components/activity-details-header/activityHeader.js";
import { DeleteCrossIcon } from "../../assets/globle/index.js";

const ActivityView = ({ data, onClose }) => {
  const queryParameters = new URLSearchParams(window.location.search);
  const id = queryParameters.get("id");
  const date = queryParameters.get("date");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state);
  const [staffActivityList, setStaffActivityList] = useState([]);

  useEffect(() => {
    dispatch(staffAllActivityService(id, moment(date).format("YYYY-MM-DD")));
  }, [id, date]);

  useEffect(() => {
    if (state.staffFeedBackAndActivity.data !== "") {
      if (state.staffFeedBackAndActivity.data.data.error === false) {
        setStaffActivityList(state.staffFeedBackAndActivity.data.data.data);
      }
    }
  }, [state]);

  let newMapLoctaionArray =
    staffActivityList.activity_list &&
    staffActivityList.activity_list.map((tate) =>
      tate.geo_location
        ? tate.geo_location.split("(")[1].split(")")[0].split(" ")
        : ""
    );
  newMapLoctaionArray =
    newMapLoctaionArray && newMapLoctaionArray.filter((n) => n);
  let arrayWithoutDuplicateLocation = removeDuplicates(
    newMapLoctaionArray && newMapLoctaionArray.flat()
  );

  let newMapLoctaionformultiple =
    newMapLoctaionArray && JSON.stringify(newMapLoctaionArray);
  newMapLoctaionformultiple =
    newMapLoctaionformultiple &&
    newMapLoctaionformultiple
      .replaceAll("],[", "/")
      .replaceAll("]", "")
      .replaceAll("[", "")
      .replaceAll('"', "");

  function removeDuplicates(arr) {
    return [...new Set(arr)];
  }

  const getObjectLength = (obj) => {
    if (obj === undefined || obj === null) {
      return 0;
    }
    return Object.keys(obj).length;
  };

  // lenght function
  const activityLength = getObjectLength(staffActivityList);

  return (
    <>
      <div style={{ position: "relative" }}>
        <img
          src={DeleteCrossIcon}
          alt="delete"
          className={styles.cancelIcon}
          onClick={() => onClose("")}
        />
        <ActivityHeader data={staffActivityList} showArrow={false} />
        {activityLength > 0 ? (
          <div className={styles.activity_details_main_box_Wrap}>
            <p>Recent Activity</p>
            {staffActivityList.activity_list &&
              staffActivityList.activity_list.map(
                (item, index) =>
                  index < 10 && (
                    <ActivityCard
                      key={index}
                      data={item}
                      showCustomerDetail={true}
                    />
                  )
              )}
            {staffActivityList?.activity_list?.length > 10 && (
              <p
                className={styles.view_all}
                onClick={() => {
                  navigate(
                    `/web/customer-activity?userid=${id}&date=${date}&img_url=${
                      data.pic_url || Staff
                    }&name=${data.staff_name}`
                  );
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
        <ViewRecordActivityComponent />
      </div>
    </>
  );
};

export default ActivityView;

import { useEffect, useContext } from "react";
import { useState } from "react";
import Context from "../../context/Context";

import { useDispatch, useSelector } from "react-redux";
import styles from "./staff.module.css";
import { BlankActivityIcon } from "../../assets/staffImages/index.js";
import { staffAllActivityService } from "../../redux/action/recordFollowUpAction";
import moment from "moment";
import { useNavigate, useSearchParams } from "react-router-dom";
import ActivityCard from "../../components/activity-card/activityCard";
import OrderView from "../../components/viewDrawer/orderView";
import PaymentView from "../../components/viewDrawer/viewPaymentDetail";
import ViewRecordActivityComponent from "../../components/activityModal/viewRecordActivityModal.js";
import ActivityHeader from "../../components/activity-details-header/activityHeader.js";
import filterService from "../../services/filter-service";

const ActivityView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParameters = new URLSearchParams(window.location.search);
  const userid = queryParameters.get("userid");
  const staffId = queryParameters.get("id");
  const dateFilter =
    queryParameters.get("date") || moment().format("YYYY-MM-DD");

  const dispatch = useDispatch();
  const [activeParams, setActiveParams] = useState({
    page: 1,
    ...filterService.getFilters(),
  });
  const context = useContext(Context);
  const navigate = useNavigate();
  const state = useSelector((state) => state);
  const [staffActivityList, setStaffActivityList] = useState([]);

  useEffect(() => {
    dispatch(
      staffAllActivityService(
        userid,
        moment(activeParams?.date).format("YYYY-MM-DD"),
        activeParams?.page
      )
    );
  }, [activeParams]);

  useEffect(() => {
    if (state.staffFeedBackAndActivity.data !== "") {
      if (state.staffFeedBackAndActivity.data.data.error === false) {
        setStaffActivityList(state.staffFeedBackAndActivity.data.data.data);
      }
    }
    if (
      state.addFeedBackAndActivity.data !== "" &&
      !state.addFeedBackAndActivity.data.data.error
    )
      dispatch(staffAllActivityService(userid));
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

  const activityLength = getObjectLength(staffActivityList);
  useEffect(() => {
    filterService.setEventListener(setActiveParams);
  }, []);

  return (
    <>
      <ActivityHeader data={staffActivityList} />

      {activityLength > 0 ? (
        <div className={styles.activity_details_main_box_Wrap}>
          <p>Recent Activity</p>
          {staffActivityList.activity_list &&
            staffActivityList.activity_list.map((item, index) => (
              <>
                {index < 10 && (
                  <ActivityCard data={item} showCustomerDetail={true} />
                )}
                {index === 10 && (
                  <p
                    className={styles.view_all}
                    style={{ paddingBottom: "1em" }}
                    onClick={() => {
                      navigate(
                        `/web/customer-activity?staff_id=${staffId}&userid=${userid}&date=${dateFilter}`
                      );
                    }}
                  >
                    View All
                  </p>
                )}
              </>
            ))}
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
          <OrderView />

          <PaymentView />
          <ViewRecordActivityComponent />
        </div>
      )}
    </>
  );
};

export default ActivityView;

import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Context from "../../context/Context";
import styles from "./activity.module.css";
import { myActivityService } from "../../redux/action/recordFollowUpAction";
import { BlankActivityIcon } from "../../assets/staffImages/index.js";
import OrderView from "../../components/viewDrawer/orderView";
import PaymentView from "../../components/viewDrawer/viewPaymentDetail";
import ViewRecordActivityComponent from "../../components/activityModal/viewRecordActivityModal.js";
import ActivityCard from "../../components/activity-card/activityCard";
import ActivityHeader from "../../components/activity-details-header/activityHeader.js";
import Paginator from "../../components/pagination";
import filterService from "../../services/filter-service";

const MyActivities = () => {
  const dispatch = useDispatch();

  //  query Prams
  const [activeParams, setActiveParams] = useState({
    page: 1,
    ...filterService.getFilters(),
  });

  const context = useContext(Context);
  const { setLoading } = context;
  const state = useSelector((state) => state);
  const [myActivityList, setMyActivityList] = useState([]);

  // date filter state

  useEffect(() => {
    dispatch(
      myActivityService(
        moment(activeParams?.date).format("YYYY-MM-DD"),
        activeParams?.page
      )
    );
  }, [activeParams]);

  useEffect(() => {
    if (state.getMyActivity.data !== "") {
      if (state.getMyActivity.data.data.error === false) {
        setMyActivityList(state.getMyActivity.data.data.data);
        setLoading(false);
      }
    }
  }, [state]);

  const getObjectLength = (obj) => {
    if (obj === undefined || obj === null) {
      return 0;
    }
    return Object.keys(obj).length;
  };

  // lenght function
  const activityLength = getObjectLength(myActivityList);
  useEffect(() => {
    filterService.setEventListener(setActiveParams);
  }, []);

  return (
    <>
      {myActivityList && (
        <div className={styles.my_activity_main}>
          <div className={styles.my_activity_table_container}>
            <div>
              <h2>My Activity List</h2>
            </div>
            <div
              style={{
                background:
                  "linear-gradient( 121deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.2) 100% )",
                borderRadius: "10px",
              }}
            >
              <ActivityHeader data={myActivityList} />
              <div style={{ width: "100%" }}>
                {activityLength > 0 ? (
                  <div className={styles.activity_details_main_box_Wrap}>
                    <p>Recent Activity</p>
                    {myActivityList.activity_list &&
                      myActivityList.activity_list.map((item, index) => (
                        <ActivityCard
                          key={index}
                          data={item}
                          showCustomerDetail={true}
                        />
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
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* <Pagination list={myActivityList?.activity_list} /> */}
          <Paginator
            limiter={(myActivityList?.activity_list || []).length < 30}
            value={activeParams["page"]}
            onChange={(i) => {
              filterService.setFilters({ page: i });
            }}
          />

          <OrderView />
          <PaymentView />
          <ViewRecordActivityComponent />
        </div>
      )}
    </>
  );
};

export default MyActivities;

const style = {
  icon_edit: {
    color: "green",
    cursor: "pointer",
    fontSize: 15,
  },
  icon_delete: {
    color: "red",
    cursor: "pointer",
    fontSize: 15,
  },
  map_button: {
    marginTop: "60px",
    border: "1px solid blue",
    width: "150px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "5px",
  },
};

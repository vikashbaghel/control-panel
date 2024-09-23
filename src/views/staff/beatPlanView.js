import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Context from "../../context/Context";
import styles from "./staff.module.css";
import { useEffect } from "react";
import { getStaffActiveBeatPlanDetailsAction } from "../../redux/action/beatPlanAction";
import moment from "moment";
import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { BlankBeatIcon } from "../../assets/staffImages/index.js";
import {
  BeatDashboardLogo,
  ColorBeatIcon,
  Customer,
  Lead,
} from "../../assets/beat/index.js";

const BeatPlanView = () => {
  const dispatch = useDispatch();
  const context = useContext(Context);
  const navigate = useNavigate();
  const state = useSelector((state) => state);
  const { getStaffActiveBeatPlanDetails } = state;
  const queryParameters = new URLSearchParams(window.location.search);
  const userid = queryParameters.get("userid");
  const { setDateOfRow } = context;
  const [activeBeatPlanDetailsData, setActiveBeatPlanDetailsData] = useState();
  const currentDate = new Date();

  useEffect(() => {
    dispatch(
      getStaffActiveBeatPlanDetailsAction(
        moment(currentDate).format("YYYY-MM-DD"),
        userid
      )
    );
  }, []);

  useEffect(() => {
    if (getStaffActiveBeatPlanDetails.data !== "") {
      if (getStaffActiveBeatPlanDetails.data.data.error === false)
        setActiveBeatPlanDetailsData(
          getStaffActiveBeatPlanDetails.data.data.data
        );
    }
  }, [state]);

  const handleOnClick = (plan_id) => {
    if (plan_id) {
      navigate(`/web/beat-plan-details/${plan_id}`);
    }
  };

  const getObjectLength = (obj) => {
    if (obj === undefined || obj === null) {
      return 0;
    }
    return Object.keys(obj).length;
  };

  const activityLength = getObjectLength(activeBeatPlanDetailsData);

  return (
    <div className={styles.beatroute_container}>
      <div className={styles.beat_header}>
        <img src={BeatDashboardLogo} alt="beat" style={{ marginRight: 15 }} />{" "}
        Beat Plan
      </div>
      <div
        className={styles.beat_body}
        style={
          activityLength === 0
            ? {
                display: "flex",
                justifyContent: "center",
              }
            : {}
        }
      >
        {activityLength === 0 ? (
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
                  {activeBeatPlanDetailsData.days_list?.target_customers_count}
                </div>
                <div>
                  {activeBeatPlanDetailsData.days_list?.target_leads_count}
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
                  {activeBeatPlanDetailsData.days_list?.achieved_leads_count}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {activityLength !== 0 && (
        <div className={styles.beat_footer}>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              handleOnClick(
                activeBeatPlanDetailsData?.days_list?.beatrouteplan
              );
              setDateOfRow(
                activeBeatPlanDetailsData?.beat_route_info?.start_date
              );
            }}
          >
            View Details
          </span>
        </div>
      )}
    </div>
    // <>
    //   <div className={styles.beatRoute_details_header}>
    //     <div className={styles.activity_details_left}>
    //       <img src={RouteIcon} alt="RouteIcon" />
    //       <p>{activeBeatPlanDetailsData?.beat_route_info?.name}</p>
    //     </div>
    //     {activityLength > 0 && (
    //       <div className={styles.activity_details_right}>
    //         <p>
    //           {moment(
    //             activeBeatPlanDetailsData?.beat_route_info?.start_date
    //           ).format("DD MMM")}{" "}
    //           -{" "}
    //           {moment(
    //             activeBeatPlanDetailsData?.beat_route_info?.end_date
    //           ).format("DD MMM")}
    //         </p>
    //       </div>
    //     )}
    //   </div>
    //   {activityLength > 0 ? (
    //     <div
    //       className={styles.beat_details_main}
    //       style={{ position: "relative" }}
    //     >
    //       {activeBeatPlanDetailsData.days_list?.is_cancelled ? (
    //         <div className={styles.beat_cancel_tag}>Canceled</div>
    //       ) : (
    //         <></>
    //       )}
    //       <div className={styles.beat_details_date}>
    //         {daysDiffrence &&
    //           daysDiffrence?.map((date, index) => {
    //             const isCurrentDate =
    //               date === currentDate.toISOString().split("T")[0]; // Check if the date is the current date
    //             const isSelected = date === selectedDate; // Check if the date is selected

    //             return (
    //               <div
    //                 key={index}
    //                 className={
    //                   isSelected ? styles.date : styles.date_not_select
    //                 }
    //                 onClick={() => handleClickDate(date)} // Pass the date to the onClick function
    //               >
    //                 <span>{moment(date).format("DD MMM")} </span>{" "}
    //               </div>
    //             );
    //           })}
    //       </div>
    //       <div className={styles.beat_details_right}>
    //         <div className={styles.beat_details_name}>
    //           {activeBeatPlanDetailsData?.days_list &&
    //             activeBeatPlanDetailsData?.days_list.module_name}
    //         </div>
    //         <div
    //         //   className={styles.beat_details_visited_Customers_main}
    //         >
    //           <div style={{ display: "flex", flexDirection: "column" }}>
    //             <div className={styles.beat_details_visited_Customers}>
    //               <div className={styles.beat_details_visited}>
    //                 <h3>Visited</h3>
    //                 <p>
    //                   {activeBeatPlanDetailsData?.days_list
    //                     ? activeBeatPlanDetailsData?.days_list
    //                         .achieved_visited_count
    //                     : 0}
    //                 </p>
    //               </div>
    //               <div className={styles.beat_details_Customers}>
    //                 <h3>#Customers/New</h3>
    //                 <p>
    //                   {activeBeatPlanDetailsData?.days_list
    //                     ? activeBeatPlanDetailsData?.days_list
    //                         .target_customers_count
    //                     : 0}{" "}
    //                   /{" "}
    //                   {activeBeatPlanDetailsData?.days_list
    //                     ? activeBeatPlanDetailsData?.days_list
    //                         .target_visit_count
    //                     : 0}
    //                 </p>
    //               </div>
    //             </div>

    //             <div className={styles.beat_details_visited_Customers}>
    //               <div className={styles.beat_details_purpose}>
    //                 <h3>Purpose</h3>
    //                 <p>
    //                   {activeBeatPlanDetailsData?.days_list
    //                     ? activeBeatPlanDetailsData?.days_list
    //                         .achieved_visited_count
    //                     : 0}
    //                 </p>
    //               </div>
    //               <div className={styles.beat_details_purpose}>
    //                 <h3>Night Stay</h3>
    //                 <p>
    //                   {activeBeatPlanDetailsData?.days_list
    //                     ? activeBeatPlanDetailsData?.days_list
    //                         .target_customers_count
    //                     : 0}{" "}
    //                   /{" "}
    //                   {activeBeatPlanDetailsData?.days_list
    //                     ? activeBeatPlanDetailsData?.days_list
    //                         .target_visit_count
    //                     : 0}
    //                 </p>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //         <p
    //           className={styles.view_all_beat}
    //           onClick={() => {
    //             handleOnClick(
    //               activeBeatPlanDetailsData?.days_list?.beatrouteplan
    //             );
    //             setDateOfRow(
    //               activeBeatPlanDetailsData?.beat_route_info?.start_date
    //             );
    //           }}
    //         >
    //           View Details
    //         </p>
    //       </div>
    //     </div>
    //   ) : (
    //     <div
    //       style={{
    //         display: "flex",
    //         padding: "10px 20px",
    //         flexDirection: "column",
    //       }}
    //     >
    //       <div
    //         style={{
    //           display: "flex",
    //           justifyContent: "center",
    //           alignItems: "center",
    //         }}
    //       >
    //         <img src={BlankBeatIcon} alt="Activity" />
    //       </div>
    //       <div
    //         style={{
    //           display: "flex",
    //           justifyContent: "center",
    //           alignItems: "center",
    //           marginTop: "30px",
    //           marginBottom: "30px",
    //         }}
    //       >
    //         doesn’t have active Beat Plan, Create one
    //       </div>
    //     </div>
    //   )}
    // </>
  );
};

export default BeatPlanView;

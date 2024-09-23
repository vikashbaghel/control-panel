import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserGoalDetails } from "../../redux/action/goals";
import { useEffect } from "react";
import { roundToDecimalPlaces } from "../../helpers/roundToDecimal";
import styles from "./staff.module.css";
import {
  LeadIcon,
  SalesIcon,
  CollectionIcon,
  TargetIcon,
  BlankTargetIcon,
} from "../../assets/staffImages/index.js";
import { useNavigate } from "react-router";
import moment from "moment";
import ProgressCircle from "../../helpers/progressCircle.js";
import WrapText from "../../components/wrapText.js";

const TargetView = ({ id, name }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //query params
  const queryParameters = new URLSearchParams(window.location.search);
  const staffId = queryParameters.get("id");

  const state = useSelector((state) => state);

  const [targetList, setTargetList] = useState("");

  const activetargetList = targetList && [
    {
      title: "Sales",
      target: targetList.target_sales_amount,
      achieved: targetList.current_sales_amount,
      image: SalesIcon,
    },
    {
      title: "Collection",
      target: targetList.target_payment_collection,
      achieved: targetList.current_payment_collection,
      image: CollectionIcon,
    },
    {
      title: "Leads",
      target: targetList.target_new_leads,
      achieved: targetList.current_new_leads,
      image: LeadIcon,
    },
  ];

  useEffect(() => {
    id && dispatch(getUserGoalDetails(id));
  }, [id]);

  useEffect(() => {
    if (state.getUserGoalDetails.data !== "") {
      if (state.getUserGoalDetails.data.data.error === false) {
        let activetargetList = state.getUserGoalDetails.data.data.data.filter(
          (data) => data.is_active === true
        );
        setTargetList(activetargetList[0]);
      }
    }
  }, [state]);

  return (
    <>
      <div className={styles.beatRoute_details_header}>
        <div className={styles.activity_details_left}>
          <img src={TargetIcon} alt="TargetIcon" />
          <p>
            {targetList?.name ? (
              <WrapText width={150}>{targetList?.name}</WrapText>
            ) : (
              "Targets"
            )}
          </p>
        </div>
        {targetList && (
          <div className={styles.activity_details_right}>
            <p>
              {moment(targetList?.start_date).format("DD MMM")} -{" "}
              {moment(targetList?.end_date).format("DD MMM")}
            </p>
          </div>
        )}
      </div>
      {targetList ? (
        <div className={styles.target_box}>
          {activetargetList &&
            activetargetList.map((item, index) => {
              return (
                item.title && (
                  <div
                    key={index}
                    className={styles.target_sales_details_main}
                    style={item.target === 0 ? { filter: "grayscale(1)" } : {}}
                  >
                    <h3 style={{ margin: 0 }}>{item.title}</h3>
                    <img
                      src={item.image}
                      alt="sales"
                      style={{
                        position: "absolute",
                        top: -30,
                        left: "43%",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 12, color: "#309F35" }}>
                          Target
                        </div>
                        <div style={{ fontSize: 16 }}>
                          {item.title === "Sales" || item.title === "Collection"
                            ? "₹ "
                            : ""}
                          {roundToDecimalPlaces(item.target)}
                        </div>
                      </div>
                      {item.achieved === null ? (
                        <></>
                      ) : (
                        <div>
                          <div
                            style={{
                              fontSize: 12,
                              color: "#309F35",
                            }}
                          >
                            Achieved
                          </div>
                          <div style={{ fontSize: 16 }}>
                            {" "}
                            {item.title === "Sales" ||
                            item.title === "Collection"
                              ? "₹ "
                              : ""}
                            {roundToDecimalPlaces(item.achieved)}
                          </div>
                        </div>
                      )}
                      <div>
                        <ProgressCircle
                          target={item.target}
                          current={item.achieved}
                        />
                      </div>
                    </div>
                  </div>
                )
              );
            })}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1em",
            justifyContent: "center",
            alignItems: "center",
            paddingBlockEnd: "1em",
          }}
        >
          <img src={BlankTargetIcon} alt="Activity" />

          <div
            style={{
              color: "#727176",
            }}
          >
            Doesn’t have any active Target
          </div>
          <div
            className="button_primary"
            onClick={() => navigate(`/web/assign-target?id=${id}&name=${name}`)}
          >
            Assign Target
          </div>
        </div>
      )}
      <div
        className={styles.view_all}
        style={{ paddingBlockEnd: "1em" }}
        onClick={() =>
          navigate(
            `/web/target?target=Active&id=${id}&name=${name}&staff_id=${staffId}`
          )
        }
      >
        View All
      </div>
    </>
  );
};

export default TargetView;

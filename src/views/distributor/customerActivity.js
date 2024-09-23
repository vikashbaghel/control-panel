import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Context from "../../context/Context";
import styles from "./viewCustomer.module.css";
import {
  feedbackAndActivityService,
  staffAllActivityService,
} from "../../redux/action/recordFollowUpAction";
import {
  BlankActivityIcon,
  ActivityIcon,
} from "../../assets/staffImages/index.js";
import { ArrowLeft } from "../../assets/globle/index.js";
import OrderView from "../../components/viewDrawer/orderView";
import PaymentView from "../../components/viewDrawer/viewPaymentDetail";
import ViewRecordActivityComponent from "../../components/activityModal/viewRecordActivityModal.js";
import { DatePicker } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Staff as staffIcon } from "../../assets/navbarImages";
import { customerDetails } from "../../redux/action/customerAction";
import { staffDetailsById } from "../../redux/action/staffAction";
import dayjs from "dayjs";
import "./datePicker.css";
import ActivityCard from "../../components/activity-card/activityCard";
import { singleLeadDataAction } from "../../redux/action/leadManagementAction";
import filterService from "../../services/filter-service";
import Paginator from "../../components/pagination";

const CustomerActivities = () => {
  const [activeParams, setActiveParams] = useState({
    page: 1,
    ...filterService.getFilters(),
  });

  const [profileInfo, setProfileInfo] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const context = useContext(Context);
  const { setRecordActivityOpen, setLoading, setEditRecordActivityData } =
    context;
  const state = useSelector((state) => state);
  const [myActivityList, setMyActivityList] = useState([]);
  const [dateFilter, setDateFilter] = useState(
    activeParams?.staff_id || activeParams?.userid
      ? activeParams.date
        ? activeParams.date
        : moment().format("YYYY-MM-DD")
      : ""
  );
  const [isDisabled, setDisabled] = useState(
    activeParams?.customer_id
      ? true
      : moment(dateFilter).format("YYYY-MM-DD") ===
        moment().format("YYYY-MM-DD")
      ? true
      : false
  );
  // activeParams?.date filter state
  const dateFormat = "YYYY-MM-DD";

  useEffect(() => {
    if (activeParams?.customer_id) {
      dispatch(customerDetails(activeParams?.customer_id));
      dispatch(
        feedbackAndActivityService(
          activeParams?.customer_id,
          "",
          dateFilter ? false : true,
          dateFilter,
          activeParams?.page
        )
      );
      return;
    }
    if (activeParams?.staff_id) {
      dispatch(staffDetailsById(activeParams?.staff_id));
      dispatch(
        staffAllActivityService(
          activeParams?.userid,
          dateFilter,
          activeParams?.page
        )
      );
      return;
    }
    if (activeParams?.lead_id) {
      dispatch(singleLeadDataAction(activeParams?.lead_id));
      dispatch(
        feedbackAndActivityService(
          "",
          activeParams?.lead_id,
          dateFilter ? false : true,
          dateFilter,
          activeParams?.page
        )
      );
    }
    if (activeParams?.img_url) {
      dispatch(
        staffAllActivityService(
          activeParams?.userid,
          dateFilter,
          activeParams?.page
        )
      );
      setProfileInfo({ name: profileInfo.name, imgUrl: activeParams?.img_url });
    }
  }, [activeParams]);

  useEffect(() => {
    if (!activeParams?.staff_id && state.getFeedBackAndActivity.data !== "") {
      if (state.getFeedBackAndActivity.data.data.error === false) {
        setMyActivityList(state.getFeedBackAndActivity.data.data.data);
      }
    }
    if (
      activeParams?.staff_id &&
      state.staff.data !== "" &&
      state.staff.data.data.error === false
    )
      setProfileInfo({
        name: state.staff.data.data.data.name,
        imgUrl: state.staff.data.data.data.profile_pic_url,
      });
    if (
      (activeParams?.staff_id || activeParams?.img_url) &&
      state.staffFeedBackAndActivity.data !== "" &&
      state.staffFeedBackAndActivity.data.data.error === false
    ) {
      if (getObjectLength(state.staffFeedBackAndActivity.data.data.data) !== 0)
        setMyActivityList(
          state.staffFeedBackAndActivity?.data?.data?.data.activity_list
        );
      else setMyActivityList([]);
    }
    if (
      activeParams?.customer_id &&
      state.disributor_details.data !== "" &&
      state.disributor_details.data.data.error === false
    )
      setProfileInfo({
        name: state.disributor_details.data.data.data.name,
        imgUrl: state.disributor_details.data.data.data.logo_image_url,
      });
    if (
      activeParams?.lead_id &&
      state.singleLeadDataAction.data !== "" &&
      !state.singleLeadDataAction.data.data.error
    ) {
      setProfileInfo({
        name: state.singleLeadDataAction.data.data.data.business_name,
        imgUrl: state.singleLeadDataAction.data.data.data.logo_image_url,
        status: state.singleLeadDataAction.data.data.data.status,
      });
    }
    if (
      state.addFeedBackAndActivity.data !== "" &&
      !state.addFeedBackAndActivity.data.data.error
    ) {
      if (activeParams?.lead_id)
        dispatch(
          feedbackAndActivityService(
            "",
            activeParams?.lead_id,
            dateFilter ? false : true,
            dateFilter,
            activeParams?.page
          )
        );
      if (activeParams?.customer_id)
        dispatch(
          feedbackAndActivityService(
            activeParams?.customer_id,
            "",
            dateFilter ? false : true,
            dateFilter,
            activeParams?.page
          )
        );
      if (activeParams?.staff_id)
        dispatch(staffAllActivityService(activeParams?.userid, dateFilter));
    }
    setLoading(false);
  }, [state]);

  const getObjectLength = (obj) => {
    if (obj === undefined || obj === null) {
      return 0;
    }
    return Object.keys(obj).length;
  };

  // lenght function
  const activityLength = getObjectLength(myActivityList);

  let newMapLoctaionArray =
    myActivityList.activity_list &&
    myActivityList.activity_list.map((tate) =>
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

  // handle prev activeParams?.date
  const handlePreviousDate = () => {
    if (isDisabled) setDisabled(false);
    const previousDate = new Date(dateFilter);
    previousDate.setDate(previousDate.getDate() - 1);
    const newDateFilter = moment(previousDate).format("YYYY-MM-DD");
    setDateFilter(newDateFilter);
    filterService.setFilters({ date: newDateFilter });
  };
  //  handle next activeParams?.date
  const handleNextDate = () => {
    const nextDate = new Date(dateFilter);
    nextDate.setDate(nextDate.getDate() + 1);

    if (dateFilter === moment().format("YYYY-MM-DD")) {
      return;
    }
    const newDateFilter = moment(nextDate).format("YYYY-MM-DD");

    if (newDateFilter === moment().format("YYYY-MM-DD")) {
      setDisabled(true);
    }
    setDateFilter(newDateFilter);
    filterService.setFilters({ date: newDateFilter });
  };

  //date handle
  const handleJoiningDateChange = (dateString) => {
    filterService.setFilters({ date: dateString, page: 1 });
    setDateFilter(dateString);
  };

  // Disable dates after the current activeParams?.date
  const disabledDate = (current) => {
    return current && current > moment().endOf("day");
  };
  useEffect(() => {
    filterService.setEventListener(setActiveParams);
  }, []);

  return (
    <>
      {myActivityList && (
        <div className={styles.customer_activity_main}>
          <div className={styles.my_activity_table_container}>
            <div style={{ display: "flex", gap: ".5em" }}>
              <img
                src={ArrowLeft}
                onClick={() => navigate(-1)}
                style={{ cursor: "pointer" }}
                alt="back"
              />{" "}
              <h2>Activity</h2>
            </div>
            <div className={styles.activity_record_btn}>
              <p className={styles.staff_img}>
                <img
                  src={profileInfo?.imgUrl || staffIcon}
                  alt={profileInfo?.name}
                />
                {profileInfo?.name}
              </p>
              {!activeParams?.staff_id &&
                !activeParams?.date &&
                profileInfo?.status !== "Converted To Customer" &&
                profileInfo?.status !== "Rejected" && (
                  <button
                    className="button_secondary"
                    onClick={() => {
                      setEditRecordActivityData({
                        module_type: activeParams?.customer_id
                          ? "Customer Feedback"
                          : activeParams?.lead_id
                          ? "Lead Feedback"
                          : "",
                        module_id:
                          activeParams?.customer_id || activeParams?.lead_id,
                      });
                      setRecordActivityOpen(true);
                    }}
                  >
                    Record Activity
                  </button>
                )}
            </div>

            <div style={{ width: "550px" }} className={styles.activity_main}>
              <div className={styles.activity_details_header}>
                <p className={styles.activity_heading}>
                  <img src={ActivityIcon} alt="Activity" />
                  Activity
                </p>
                {activeParams?.staff_id && (
                  <div className={styles.date_heading}>
                    <LeftOutlined onClick={handlePreviousDate} />
                    <span>{moment(dateFilter).format("DD MMM YYYY")}</span>
                    <RightOutlined
                      onClick={handleNextDate}
                      style={{
                        opacity: isDisabled && ".7",
                        cursor: isDisabled && "not-allowed",
                      }}
                    />
                  </div>
                )}
                <div
                  className={
                    activeParams?.staff_id
                      ? "date_picker"
                      : "date_picker_nopadding"
                  }
                >
                  <DatePicker
                    style={{ padding: "4px 11px" }}
                    format={dateFormat}
                    onChange={(date, dateString) =>
                      handleJoiningDateChange(dateString)
                    }
                    disabledDate={disabledDate}
                    value={dateFilter ? dayjs(dateFilter, "YYYY-MM-DD") : null}
                    allowClear={activeParams?.staff_id && false}
                  />
                </div>
              </div>
              {activityLength > 0 ? (
                <>
                  <div className={styles.activity_details_main_box_Wrap}>
                    {myActivityList &&
                      myActivityList?.map((item, index) => (
                        <ActivityCard
                          key={index}
                          data={item}
                          showCustomerDetail={true}
                        />
                      ))}
                  </div>
                </>
              ) : (
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
              )}
            </div>
            <br />
            <br />
            <Paginator
              limiter={(myActivityList?.activity_list || []).length < 30}
              value={activeParams["page"]}
              onChange={(i) => {
                filterService.setFilters({ page: i });
              }}
            />
          </div>

          <OrderView />
          <PaymentView />
          <ViewRecordActivityComponent
            editPermission={
              !(
                profileInfo?.status === "Converted To Customer" ||
                profileInfo?.status === "Rejected"
              )
            }
          />
        </div>
      )}
    </>
  );
};

export default CustomerActivities;

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

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./staff.module.css";
import {
  staffBeatsAssigned,
  staffCustomersAssigned,
  staffDetailsById,
} from "../../redux/action/staffAction";
import { useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import TargetView from "./targetView";
import BeatPlanView from "./beatPlanView";
import ActivityView from "./activityView";
import OrderPaymentView from "./orderPaymentView";
import ExpensesView from "./expensesView";
import { Map } from "../../assets";
import { Staff } from "../../assets/dashboardIcon";
import { ArrowLeft } from "../../assets/globle";
import WrapText from "../../components/wrapText";

const ViewStaffDetails = () => {
  const queryParameters = new URLSearchParams(window.location.search);
  const id = queryParameters.get("id");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state);
  const [staffInfo, setStaffInfo] = useState("");
  const [viewAllRoleModalOpen, setViewAllRoleModalOpen] = useState(false);
  const [assignedCustomerList, setAssignedCustomerList] = useState([]);
  const [assignedBeatsList, setAssignedBeatsList] = useState([]);

  const [activecustomerLevel, setActivecustomerLevel] = useState("customer");

  const {
    name,
    checkin_time,
    checkout_time,
    employee_id,
    email,
    joining_date,
    profile_pic_url,
    manager_name,
    mobile,
    user,
    roles,
    customer_count,
    beat_count,
    last_location_lat,
    last_location_long,
    last_location_at,
  } = staffInfo;

  useEffect(() => {
    if (id) {
      dispatch(staffDetailsById(id));
      dispatch(staffBeatsAssigned(id));
      dispatch(staffCustomersAssigned(id));
    }
  }, []);

  useEffect(() => {
    if (state.staff.data !== "") {
      if (state.staff.data.data.error === false)
        setStaffInfo(state.staff.data.data.data);
    }
    if (
      state.staffBeatsAssigned.data !== "" &&
      state.staffBeatsAssigned.data.data.error === false
    ) {
      setAssignedBeatsList(state.staffBeatsAssigned.data.data.data);
    }
    if (
      state.staffCustomerAssigned.data !== "" &&
      state.staffCustomerAssigned.data.data.error === false
    ) {
      setAssignedCustomerList(state.staffCustomerAssigned.data.data.data);
    }
  }, [state]);

  useEffect(() => {
    const handleClickOutsideModal = (e) => {
      if (viewAllRoleModalOpen && e.target.classList.contains("modal")) {
        setViewAllRoleModalOpen(false);
      }
    };

    window.addEventListener("click", handleClickOutsideModal);

    return () => {
      window.removeEventListener("click", handleClickOutsideModal);
    };
  }, [viewAllRoleModalOpen]);

  return (
    <>
      <div className={styles.view_container}>
        <div>
          <h3>
            <img
              src={ArrowLeft}
              alt="Go back"
              onClick={() => navigate("/web/staff")}
            />
            Staff Details
          </h3>
          <div className={styles.left_container}>
            <div className={styles.profile_container}>
              <div className={styles.profile_banner}></div>
              <div className={styles.profile_image}>
                <img
                  width={"150px"}
                  height={"150px"}
                  src={profile_pic_url ? profile_pic_url : Staff}
                  alt="profile"
                />
              </div>
              <br />
              <br />
              <br />
              <br />
              <div className={styles.profile_details}>
                <p className={styles.profile_details_name}>{name}</p>
                <p className={styles.profile_details_employee_id}>
                  {employee_id}
                </p>
              </div>
              <div className={styles.profile_check_in}>
                <div className={styles.profile_check_in_start}>
                  <label>Day Started</label>
                  <p>
                    {checkin_time
                      ? moment(checkin_time).format("hh:mm a")
                      : "--:--"}
                  </p>
                </div>
                <div className={styles.profile_check_in_end}>
                  <label>Day Ended</label>
                  <p>
                    {checkout_time
                      ? moment(checkout_time).format("hh:mm a")
                      : "--:--"}
                  </p>
                </div>
              </div>
              <div className={styles.profile_details_all}>
                <div className={styles.profile_details_label_value_role}>
                  <div className={styles.profile_details_label}>
                    <label>Staff Role</label>
                  </div>
                  <div className={styles.profile_details_value_role}>
                    <label>{roles}</label>
                  </div>
                </div>
                {manager_name && (
                  <div className={styles.profile_details_label_value}>
                    <div className={styles.profile_details_label}>
                      <label>Reporting Manager</label>
                    </div>
                    <div className={styles.profile_details_value}>
                      <label>{manager_name}</label>
                    </div>
                  </div>
                )}
                {email && (
                  <div className={styles.profile_details_label_value_email}>
                    <div className={styles.profile_details_label}>
                      <label>Email ID</label>
                    </div>
                    <div className={styles.profile_details_value_email}>
                      {email}
                    </div>
                  </div>
                )}

                <div className={styles.profile_details_label_value_mobile}>
                  <div className={styles.profile_details_label}>
                    <label>Mobile Number</label>
                  </div>
                  <div className={styles.profile_details_value}>
                    <label>{mobile}</label>
                  </div>
                </div>
                {joining_date && (
                  <div className={styles.profile_details_label_value_date}>
                    <div className={styles.profile_details_label_date}>
                      <label>Date of joining</label>
                    </div>
                    <div className={styles.profile_details_value_date}>
                      <label>{joining_date}</label>
                    </div>
                  </div>
                )}

                {last_location_lat !== 0 && last_location_long !== 0 && (
                  <div className={styles.profile_details_label_value_date}>
                    <div className={styles.profile_details_label_date}>
                      <label>Last Location</label>
                    </div>
                    <div className={styles.profile_details_value_date}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: 13,
                        }}
                      >
                        <span>
                          {moment(last_location_at).format(
                            "DD-MMM-YYYY (hh:mm A)"
                          )}
                        </span>
                        <a
                          href={`https://maps.google.com/?q=${last_location_lat},${last_location_long}`}
                          target="_blank"
                        >
                          <img src={Map} alt="map" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                <div className={styles.beat_container}>
                  <div className={styles.head}>
                    <div
                      onClick={() => setActivecustomerLevel("customer")}
                      className={
                        activecustomerLevel === "customer" ? styles.active : ""
                      }
                    >
                      Customer Assigned ({customer_count})
                    </div>
                    <div
                      onClick={() => setActivecustomerLevel("beat")}
                      className={
                        activecustomerLevel === "beat" ? styles.active : ""
                      }
                    >
                      Beats Assigned ({beat_count})
                    </div>
                  </div>
                  {activecustomerLevel === "customer"
                    ? assignedCustomerList?.map((ele, index) => {
                        return (
                          index < 4 && (
                            <div className={styles.beat_list} key={index}>
                              <WrapText width={200}>{ele.name}</WrapText>
                              <div className={styles.beat_list_text_light}>
                                {ele.address_line_1 &&
                                  ele.address_line_1 + ", "}
                                {ele.state}
                              </div>
                            </div>
                          )
                        );
                      })
                    : assignedBeatsList?.map(
                        (ele, index) =>
                          index < 4 && (
                            <div className={styles.beat_list} key={index}>
                              <WrapText width={200}>{ele.name}</WrapText>
                              <p className={styles.beat_list_text_light}>
                                {ele.customer_count} customers
                              </p>
                            </div>
                          )
                      )}

                  <div
                    className={styles.view_all_group}
                    onClick={() => {
                      if (activecustomerLevel === "beat") {
                        navigate(
                          `/web/beat-list?beats_staff_id=${id}&type=beat`
                        );
                        return;
                      }
                      navigate(
                        `/web/customer?staff_id=${id}&name=${name}&type=assigned customers`
                      );
                    }}
                  >
                    View All
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ExpensesView />
        </div>
        <div style={{ width: "35%" }}>
          <div className={styles.center_container}>
            <div className={styles.activity_main}>
              <ActivityView />
            </div>
          </div>
        </div>
        <div>
          <div className={styles.right_container}>
            <div className={styles.beat_main}>
              <BeatPlanView id={user} />
            </div>

            <div className={styles.target_main}>
              <TargetView id={user} name={name} />
            </div>

            <OrderPaymentView />
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewStaffDetails;

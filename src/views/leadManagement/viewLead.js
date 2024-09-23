import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./lead.module.css";
import {
  singleLeadDataAction,
  updateLeadStatus,
} from "../../redux/action/leadManagementAction";
// import Avatar from "../../assets/avatar.png";
import { Staff } from "../../assets/dashboardIcon";
import { Button, Tooltip } from "antd";
import moment from "moment";
import ActivityViewLead from "./activityView";
import { useNavigate } from "react-router-dom";
import { feedbackAndActivityService } from "../../redux/action/recordFollowUpAction";
import ConfirmApprove from "../../components/confirmModals/confirmApprove";
import Context from "../../context/Context";
import { StoreFrontIcon } from "../../assets/globle";
import leftArrowIcon from "../../assets/globle/arrow-left.svg";
import { Map } from "../../assets";
import RejectReasonModal from "../../helpers/rejectReason";
import Cookies from "universal-cookie";
import Permissions from "../../helpers/permissions";
import { CommentRender } from "../../components/activityModal/viewRecordActivityModal";

const cookies = new Cookies();

const ViewLeadComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const context = useContext(Context);
  const { setIsConfirmApproveOpen, setShowRejectReason } = context;
  const state = useSelector((state) => state);
  const queryParameters = new URLSearchParams(window.location.search);
  const lead_id = queryParameters.get("id");

  const [leadData, setLeadData] = useState("");

  let approveLeadPermission = Permissions("APPROVE_LEAD");
  let selfApproveLeadPermission = Permissions("APPROVE_SELF_LEAD");
  const staff_id = parseInt(cookies.get("rupyzLoginData")?.user_id);

  const {
    id,
    status,
    logo_image_url,
    business_name,
    mobile,
    email,
    contact_person_name,
    gstin,
    city,
    designation,
    address_line_1,
    comments,
    created_by_name,
    created_at,
    map_location_lat,
    map_location_long,
    created_by,
  } = leadData;

  // setting the incoming values from API request in initial State
  useEffect(() => {
    if (state.singleLeadDataAction.data !== "") {
      if (state.singleLeadDataAction.data.data.error === false) {
        setLeadData(state.singleLeadDataAction.data.data.data);
      }
    }
    if (state.addFeedBackAndActivity.data !== "") {
      if (state.addFeedBackAndActivity.data.data.error === false) {
        if (state.addFeedBackAndActivity.data.status === 200) {
          dispatch(feedbackAndActivityService("", lead_id, false, ""));
        }
      }
    }
  }, [state]);

  // calling API initially
  useEffect(() => {
    lead_id !== "" && dispatch(singleLeadDataAction(lead_id));
  }, []);

  const handleStatusChange = (value) => {
    if (value === "Rejected") {
      setShowRejectReason(true);
      return;
    }
    setIsConfirmApproveOpen(true);
  };

  const handleUpdateStatus = () => {
    setTimeout(() => {
      lead_id !== "" && dispatch(singleLeadDataAction(lead_id));
    }, 500);
  };

  return (
    <div className={styles.container_fluid}>
      <div className={styles.container}>
        <div className={styles.view_lead_heading}>
          <img src={leftArrowIcon} alt="Back" onClick={() => navigate(-1)} />
          <h2>Lead Details</h2>
        </div>
        <div className={styles.left_container}>
          <div className={styles.profile_container}>
            <div className={styles.profile_img}>
              <img src={logo_image_url || Staff} />
            </div>
            <div className={styles.profile_details}>
              <Tooltip title={business_name}>
                <p className={styles.profile_details_name}>
                  {business_name}
                  {leadData.source === "STOREFRONT" ? (
                    <Tooltip
                      placement="top"
                      title={"This Lead is generated from Storefront"}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          display: "flex",
                          alignItems: "center",
                          textAlign: "center",
                          justifyContent: "center",
                        }}
                      >
                        ( <img src={StoreFrontIcon} alt="img" width={15} />
                        Storefront )
                      </span>
                    </Tooltip>
                  ) : (
                    <></>
                  )}
                </p>
              </Tooltip>
            </div>
            {status === "Approved" ? (
              <div className={styles.profile_approval_button}>
                <button
                  className="button_primary"
                  onClick={() => {
                    navigate(
                      `/web/customer/add-customer/?type=lead&lead_id=${lead_id}`
                    );
                  }}
                >
                  Convert To Customer
                </button>
              </div>
            ) : status === "Converted To Customer" ? (
              <div className={styles.profile_approval_button}>
                <Button disabled>Converted To Customer</Button>
              </div>
            ) : status === "Pending" ? (
              <div className={styles.profile_approval_button}>
                {(selfApproveLeadPermission && staff_id === created_by) ||
                (approveLeadPermission && staff_id !== created_by) ? (
                  <>
                    <button
                      className="button_primary"
                      onClick={() => handleStatusChange("Approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="button_secondary"
                      onClick={() => handleStatusChange("Rejected")}
                      style={{ color: "red" }}
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <Button style={{ color: "red" }} disabled>
                    {status}
                  </Button>
                )}
              </div>
            ) : status === "Rejected" ? (
              <div className={styles.profile_approval_button}>
                <Button style={{ color: "red" }} disabled>
                  Rejected
                </Button>
              </div>
            ) : (
              <></>
            )}
            <RejectReasonModal
              submitReason={(reason) => {
                dispatch(updateLeadStatus(id, "Rejected", reason));
                handleUpdateStatus();
                setShowRejectReason(false);
              }}
            />
            <ConfirmApprove
              submitReason={() => {
                dispatch(updateLeadStatus(id, "Approved"));
                handleUpdateStatus();
                setIsConfirmApproveOpen(false);
              }}
              title={"Lead"}
            />
            <div className={styles.profile_details_all}>
              {contact_person_name && (
                <div className={styles.profile_details}>
                  <div>Contact Person :</div>
                  <div title={contact_person_name}>{contact_person_name}</div>
                </div>
              )}
              {designation && (
                <div className={styles.profile_details}>
                  <div>Designation :</div>
                  <div>{designation}</div>
                </div>
              )}
              {mobile && (
                <div className={styles.profile_details}>
                  <div>Mobile Number :</div>
                  <div>{mobile}</div>
                </div>
              )}
              {email && (
                <div className={styles.profile_details}>
                  <div>Email ID :</div>
                  <div title={email}>{email}</div>
                </div>
              )}
              {gstin && (
                <div className={styles.profile_details}>
                  <div>GST Number :</div>
                  <div>{gstin}</div>
                </div>
              )}

              <div className={styles.profile_details}>
                <div>Address :</div>
                <div className={styles.profile_details_value_address}>
                  <div>
                    {address_line_1 && address_line_1 + ", "}{" "}
                    {city && city + ", "}
                    {leadData?.state}
                  </div>
                  {map_location_lat && map_location_long ? (
                    <a
                      href={`https://maps.google.com/?q=${map_location_lat},${map_location_long}`}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <img src={Map} alt="map" />
                    </a>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              {comments !== "" && (
                <div className={styles.profile_details}>
                  <div>Comments / Notes :</div>
                  <div className={styles.profile_details_value_address}>
                    <CommentRender comment={comments} />
                  </div>
                </div>
              )}

              <div className={styles.profile_details}>
                <div className={styles.profile_details_label_date}>
                  <label>
                    Created By {created_by_name} on{" "}
                    {moment(created_at).format("DD MMM YY")}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className={styles.center_container}>
          <div className={styles.activity_main}>
            <ActivityViewLead
              id={lead_id}
              removeRecordActivity={
                status === "Converted To Customer" || status === "Rejected"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewLeadComponent;

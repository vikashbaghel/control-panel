import { Drawer } from "antd";
import React, { useEffect, useState } from "react";
import {
  DISTRIBUTOR_VISIT,
  FULL_DAY,
  HALF_DAY,
  JOINT_ACTIVITY,
  MARK_LEAVE,
  OFFICE_VISIT,
  OTHERS,
  REGULAR_BEAT,
} from "../../assets/attendance";
import { Map } from "../../assets";
import styles from "./markAttendance.module.css";
import moment from "moment";
import { getStartEndDayAttandanceDetail } from "../../redux/action/attendance";
import { ImageViewer } from "../image-uploader/ImageUploader";
import Cookies from "universal-cookie";
import { Staff } from "../../assets/navbarImages";

const cookies = new Cookies();

const AttendanceDetailView = ({
  attendanceDetailOpen,
  setAttendanceDetailOpen,
}) => {
  const activityList = {
    REGULAR_BEAT: {
      img: REGULAR_BEAT,
      label: "Regular Beat",
    },
    JOINT_ACTIVITY: {
      img: JOINT_ACTIVITY,
      label: "Joint Activity",
    },
    MARK_LEAVE: { img: MARK_LEAVE, label: "Mark Leave" },
    OFFICE_VISIT: {
      img: OFFICE_VISIT,
      label: "Ho / Office Visit",
    },
    DISTRIBUTOR_VISIT: {
      img: DISTRIBUTOR_VISIT,
      label:
        cookies.get("rupyzCustomerLevelConfig") &&
        `${cookies.get("rupyzCustomerLevelConfig")["LEVEL-1"]} / ${
          cookies.get("rupyzCustomerLevelConfig")["LEVEL-2"]
        } Visit`,
    },
    OTHERS: { img: OTHERS, label: "Others" },

    HALF_DAY: {
      img: HALF_DAY,
      label: "Half Day",
    },
    FULL_DAY: {
      img: FULL_DAY,
      label: "Full Day",
    },
    Present: {
      img: FULL_DAY,
      label: "Full Day",
    },
  };
  const [detail, setDetail] = useState({});
  const [previewImage, setPreviewImage] = useState({ open: false, url: null });

  const onClose = () => {
    setAttendanceDetailOpen({ open: false, detail: {} });
  };

  const callingDetail = async () => {
    let res =
      attendanceDetailOpen.open &&
      (await getStartEndDayAttandanceDetail(
        attendanceDetailOpen.detail.module_id
      ));
    setDetail(res);
  };

  useEffect(() => {
    callingDetail();
  }, [attendanceDetailOpen.detail]);

  const attendance =
    attendanceDetailOpen.detail.action === "Check In" ? "start" : "end";

  return (
    detail && (
      <Drawer
        open={attendanceDetailOpen.open}
        onClose={onClose}
        title={
          <div style={{ color: "#000", textAlign: "center", fontSize: 18 }}>
            Day {`${attendance === "start" ? "Started" : "Ended"}`}
          </div>
        }
        width={550}
      >
        <div className={styles.detail_container}>
          <div className={styles.activity_head}>
            <img
              src={
                activityList[detail[attendanceKeyArrays[attendance].action]]
                  ?.img
              }
              alt="icon"
            />
            <div>
              <div className={styles.head_name}>
                {
                  activityList[detail[attendanceKeyArrays[attendance].action]]
                    ?.label
                }
              </div>
              <div className={styles.head_date}>
                {moment(detail.created_at).format("DD MMM YYYY , hh:mm A")}
              </div>
            </div>
          </div>
          <br />
          {detail.created_by_name && (
            <div className={styles.activity_body}>
              <label>Staff</label>
              <div
                className={styles.activity_location}
                style={{ alignItems: "flex-start" }}
              >
                <div>{detail.created_by_name}</div>
              </div>
            </div>
          )}
          {detail?.joint_staff_ids_info?.length > 0 && (
            <>
              <br />
              <div className={styles.activity_body}>
                <label>Joint Activity</label>
                <div className={styles.activity_joint_activity}>
                  {detail?.joint_staff_ids_info.map((item, ind) => (
                    <div
                      key={ind}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        columnGap: 15,
                        rowGap: 35,
                      }}
                    >
                      <img
                        src={item.pic_url || Staff}
                        width={30}
                        height={30}
                        style={{ borderRadius: "50%" }}
                      />
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          <br />
          {detail[attendanceKeyArrays[attendance].geo_address] && (
            <div className={styles.activity_body}>
              <label>Location</label>
              <div
                className={styles.activity_location}
                style={{ alignItems: "flex-start" }}
              >
                <div>{detail[attendanceKeyArrays[attendance].geo_address]}</div>
                {!!(
                  detail[attendanceKeyArrays[attendance].geo_lat] &&
                  detail[attendanceKeyArrays[attendance].geo_lng]
                ) && (
                  <a
                    href={`https://maps.google.com/?q=${
                      detail[attendanceKeyArrays[attendance].geo_lat]
                    },${detail[attendanceKeyArrays[attendance].geo_lng]}`}
                    rel="noreferrer noopener"
                    target="_blank"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <img src={Map} alt="map" />
                  </a>
                )}
              </div>
            </div>
          )}
          {detail[attendanceKeyArrays[attendance].comment] && (
            <>
              <br />
              <div className={styles.activity_body}>
                <label>Comment</label>
                <div className={styles.activity_comment}>
                  {detail[attendanceKeyArrays[attendance].comment]}
                </div>
              </div>
            </>
          )}
          {detail[attendanceKeyArrays[attendance].image]?.length > 0 && (
            <>
              <br />
              <div className={styles.activity_body}>
                <label>Selfie</label>
                <div className={styles.activity_selfie}>
                  {detail[attendanceKeyArrays[attendance].image]?.map(
                    (item, index) => (
                      <img
                        src={item.url}
                        alt="selfie"
                        width={100}
                        height={"auto"}
                        key={index}
                        onClick={() =>
                          setPreviewImage({ open: true, url: item.url })
                        }
                        style={{ cursor: "pointer" }}
                      />
                    )
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        <ImageViewer {...{ previewImage, setPreviewImage }} />
      </Drawer>
    )
  );
};

export default AttendanceDetailView;

const attendanceKeyArrays = {
  start: {
    action: "activity_type",
    comment: "start_day_comments",
    image: "start_day_images_info",
    geo_address: "start_day_geo_address",
    geo_lat: "start_day_geo_location_lat",
    geo_lng: "start_day_geo_location_long",
  },
  end: {
    action: "attendance_type",
    comment: "end_day_comments",
    image: "end_day_images_info",
    geo_address: "end_day_geo_address",
    geo_lat: "end_day_geo_location_lat",
    geo_lng: "end_day_geo_location_long",
  },
};

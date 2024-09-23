import { Button, Col, Modal, Row, Space, notification } from "antd";
import React, { useEffect, useState } from "react";
import styles from "./markAttendance.module.css";
import {
  JOINT_ACTIVITY,
  REGULAR_BEAT,
  MARK_LEAVE,
  OFFICE_VISIT,
  DISTRIBUTOR_VISIT,
  OTHERS,
  FULL_DAY,
  HALF_DAY,
  Comment,
  Add,
  Subtract,
  CameraFront,
  AddPoto,
} from "../../assets/attendance";
import TextArea from "antd/es/input/TextArea";
import Camera from "../camera";
import MultiSelectSearch from "../selectSearch/multiSelectSearch";
import { ListItemDesign } from "../listItemDesign";
import Cookies from "universal-cookie";
import { updateStartEndAttendance } from "../../redux/action/attendance";
import { BASE_URL_V2, org_id } from "../../config";
import { singleUploadImage } from "../../helpers/uploadImage";
import { getGeoLocationAndAddress } from "../../services/location-service";
import Permissions from "../../helpers/permissions";
import { preference } from "../../services/preference-service";

const cookies = new Cookies();

const StartEndDayModal = ({ attendanceModalOpen, setAttendanceModalOpen }) => {
  const isPhotoRequired =
    (attendanceModalOpen.type === "start" &&
      preference.get("attendance_start_day_image_required")) ||
    (attendanceModalOpen.type === "end" &&
      preference.get("attendance_end_day_image_required"));
  const data = {
    start: {
      title: <>What is your day plan? 🤔</>,
      activityList: [
        {
          img: REGULAR_BEAT,
          label: "Regular Beat",
          value: "REGULAR_BEAT",
        },
        {
          img: JOINT_ACTIVITY,
          label: "Joint Activity",
          value: "JOINT_ACTIVITY",
        },
        { img: MARK_LEAVE, label: "Mark Leave", value: "MARK_LEAVE" },
        {
          img: OFFICE_VISIT,
          label: "Ho / Office Visit",
          value: "OFFICE_VISIT",
        },
        {
          img: DISTRIBUTOR_VISIT,
          label:
            cookies.get("rupyzCustomerLevelConfig") &&
            `${cookies.get("rupyzCustomerLevelConfig")["LEVEL-1"]} / ${
              cookies.get("rupyzCustomerLevelConfig")["LEVEL-2"]
            } Visit`,
          value: "DISTRIBUTOR_VISIT",
        },
        { img: OTHERS, label: "Others", value: "OTHERS" },
      ],
    },
    end: {
      title: <>How was your day? 🤔</>,
      activityList: [
        {
          img: HALF_DAY,
          label: "Half Day",
          value: "HALF_DAY",
        },
        {
          img: FULL_DAY,
          label: "Full Day",
          value: "FULL_DAY",
        },
      ],
    },
  };

  let { activityList } = data[attendanceModalOpen.type] || {};

  const [formInput, setFormInput] = useState(initalInput);
  const [loader, setLoader] = useState(false);
  const [jointActivityInput, setJointActivityInput] = useState();
  const [staffListCount, setStaffListCount] = useState(0);

  const onclose = () => {
    setAttendanceModalOpen({
      open: false,
      type: "",
    });
    setFormInput(initalInput);
    setLoader(false);
  };

  const handleSubmit = () => {
    if (!formInput.activity) {
      notification.warning({ message: "Please select an activity type" });
      return;
    }
    if (isPhotoRequired && formInput.images.length === 0) {
      notification.warning({ message: "Please upload your selfie" });
      return;
    }
    if (cookies.get("rupyzLocationEnable") === "true") {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          setLoader(true);
          getGeoLocationAndAddress()
            .then((response) => {
              updateAttendance(response.lat, response.lng, response.address);
            })
            .catch((error) => console.log(error));
          return;
        }
        openNotification();
        // Don't do anything if the permission was denied.
      });
      return;
    }
    setLoader(true);
    updateAttendance();
  };

  const [api, contextHolder] = notification.useNotification();
  const openNotification = () => {
    const key = `open${Date.now()}`;
    const btn = (
      <Space>
        <button className="button_primary" onClick={() => api.destroy()}>
          OK
        </button>
        <button
          className="button_secondary"
          onClick={() => {
            api.destroy(key);
            updateAttendance();
          }}
        >
          Continue without Location
        </button>
      </Space>
    );
    api.open({
      message:
        "Location access is Blocked. Change your location settings in browser",
      btn,
      key,
    });
  };

  const updateAttendance = async (lat = 0, lng = 0, address = "") => {
    let tempImageArray = [];
    for (let i = 0; i < formInput.images.length; i++) {
      const file = await singleUploadImage(formInput.images[i]);
      tempImageArray.push(file);
    }

    let apiData = {};
    const startDay = attendanceModalOpen.type === "start";
    Object.assign(apiData, {
      action: startDay ? "Check In" : "Check Out",
      [attendanceKeyArrays[attendanceModalOpen.type].action]:
        formInput.activity,
      [attendanceKeyArrays[attendanceModalOpen.type].comment]:
        formInput.comment,
      [attendanceKeyArrays[attendanceModalOpen.type].image]: tempImageArray,
      joint_staff_ids: formInput.joint_staff_ids,
      geo_location_lat: lat,
      geo_location_long: lng,
      geo_address: address,
      location_permission: lat && lng ? true : false,
    });

    let res = await updateStartEndAttendance(apiData);
    if (res) {
      attendanceModalOpen["callback"] && (await attendanceModalOpen.callback());
      onclose(res);
    }
    setLoader(false);
  };

  const checkStaffListCount = (data) => {
    setStaffListCount(data.data.length);
  };

  useEffect(() => {
    jointActivityInput &&
      jointActivityInput.setListner({ callback: checkStaffListCount });
  }, [jointActivityInput]);

  return (
    <div>
      {contextHolder}
      <Modal
        open={attendanceModalOpen.open}
        onCancel={onclose}
        width={600}
        zIndex={10000}
        title={
          <div className={styles.modal_head}>
            {data[attendanceModalOpen.type]?.title}
          </div>
        }
        footer={
          <div className={styles.modal_footer}>
            <Button
              className="button_primary"
              loading={loader}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        }
        centered
      >
        <div className={styles.modal_body}>
          <label>
            Select Activity <span style={{ color: "#f00" }}>*</span>
          </label>
          <Row className={styles.activity_group}>
            {(activityList || []).map((value, index) => {
              const disabled =
                value.value === "JOINT_ACTIVITY" &&
                (!Permissions("VIEW_STAFF") || !staffListCount);
              return (
                <Col
                  key={index}
                  span={12}
                  style={{
                    ...GridItemStyle(activityList.length, index),
                    cursor: !disabled ? "pointer" : "not-allowed",
                  }}
                  onClick={() =>
                    !disabled &&
                    setFormInput((prev) => ({
                      ...prev,
                      activity: value.value,
                      joint_staff_ids:
                        value.value !== "JOINT_ACTIVITY"
                          ? []
                          : prev.joint_staff_ids,
                    }))
                  }
                  className={
                    disabled
                      ? styles.disabled
                      : formInput.activity === value.value
                      ? styles.active_activity
                      : ""
                  }
                >
                  <img
                    src={value.img}
                    alt={value.value}
                    width={24}
                    height={24}
                  />{" "}
                  {value.label}
                </Col>
              );
            })}
          </Row>
          <div
            style={{
              overflow: "hidden",
              height: formInput.activity === "JOINT_ACTIVITY" ? 65 : 0,
              transition: "height 0.4s ease-in-out",
            }}
          >
            <br />
            <MultiSelectSearch
              apiUrl={`${BASE_URL_V2}/organization/${org_id}/staff/`}
              images={true}
              listItem={(ele) => <ListItemDesign list={ele} />}
              params={{ placeholder: "Add Joint Activity Staff" }}
              value={formInput.joint_staff_ids}
              onChange={(value) =>
                setFormInput((prev) => ({ ...prev, joint_staff_ids: value }))
              }
              setInterface={setJointActivityInput}
            />
            <br />
          </div>
          <br />
          <CommentContainer {...{ formInput, setFormInput }} />
          <br />
          <CameraContainer
            {...{
              formInput,
              setFormInput,
              isPhotoRequired,
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default StartEndDayModal;

const initalInput = {
  activity: "",
  comment: "",
  joint_staff_ids: [],
  images: [],
};

const GridItemStyle = (n, index) => {
  let borderRadiusIndex = [0, 1, n - 1, n - 2];
  if (borderRadiusIndex.includes(index)) {
    return {
      borderRadius: [
        ...borderRadiusIndex.map((x, i) => (index === x ? "10px" : "0px")),
      ].join(" "),
    };
  } else return {};
};

const CommentContainer = ({ formInput, setFormInput }) => {
  const [showOption, setShowOption] = useState(false);

  return (
    <div style={{ borderBottom: "2px dashed #ddd", paddingBottom: 5 }}>
      <div className={styles.modal_label_container}>
        <span>
          <img src={Comment} alt="comment" /> Write a Comment 💬
        </span>
        <span
          onClick={() => setShowOption(!showOption)}
          style={{ cursor: "pointer" }}
        >
          {showOption ? (
            <img src={Subtract} alt="add" />
          ) : (
            <img src={Add} alt="add" />
          )}
        </span>
      </div>
      <div
        style={{
          overflow: "hidden",
          height: showOption ? 75 : 0,
          transition: "height 0.4s ease-in-out",
        }}
      >
        <TextArea
          value={formInput.comment}
          onChange={(e) =>
            setFormInput((prev) => ({ ...prev, comment: e.target.value }))
          }
        />
      </div>
    </div>
  );
};

const CameraContainer = ({ formInput, setFormInput, isPhotoRequired }) => {
  const [showOption, setShowOption] = useState(false);

  return (
    <div style={{ borderBottom: "2px dashed #ddd", paddingBottom: 5 }}>
      <div className={styles.modal_label_container}>
        <span>
          <img src={CameraFront} alt="comment" /> Let's take a selfie!
          {isPhotoRequired && <span style={{ color: "red" }}>*</span>} 🤳
        </span>
        {formInput.images.length < 6 && (
          <span
            onClick={() => setShowOption(!showOption)}
            style={{ cursor: "pointer" }}
          >
            <img src={AddPoto} alt="add" />
          </span>
        )}
      </div>
      <div
        style={{
          overflow: "hidden",
          height:
            formInput.images.length === 0
              ? 0
              : formInput.images.length <= 5
              ? 95
              : formInput.images.length <= 6 && 190,
          transition: "height 0.4s ease-in-out",
        }}
      >
        <Camera {...{ showOption, setShowOption, formInput, setFormInput }} />
      </div>
    </div>
  );
};

const attendanceKeyArrays = {
  start: {
    action: "activity_type",
    comment: "start_day_comments",
    image: "start_day_images",
  },
  end: {
    action: "attendance_type",
    comment: "end_day_comments",
    image: "end_day_images",
  },
};

import React, { useContext, useEffect, useState } from "react";
import Context from "../../context/Context.js";
import { Col, Drawer, Modal } from "antd";
//api called
import Styles from "./recordActivity.module.css";
import moment from "moment";
import { EditIcon } from "../../assets/globle/index.js";
import RecordActivityComponent from "./recordActivity.js";
import { Map } from "../../assets/index.js";
import { ImageViewer } from "../image-uploader/ImageUploader.js";
import { fetchFeedbackActivityById } from "../../redux/action/recordFollowUpAction.js";
import PreviewFormValues from "./PreviewFormValues.js";
import Cookies from "universal-cookie";
import customerIcon from "../../assets/distributor/customer-img.svg";
import WrapText from "../wrapText.js";

const ViewRecordActivityComponent = ({
  activityId,
  onClose,
  editPermission = true,
  type = "drawer",
}) => {
  const [activityData, setActivityData] = useState({});

  async function fetchActivityData(id) {
    const data = await fetchFeedbackActivityById(id);
    if (data && (data.data || {})["id"]) {
      setActivityData(data.data);
    } else {
      onClose();
    }
  }

  useEffect(() => {
    if (activityId) {
      fetchActivityData(activityId);
    }
  }, [activityId]);

  if (type === "modal") {
    return (
      <Modal
        centered
        open={!!(activityId && Object.keys(activityData).length)}
        footer={null}
        onCancel={onClose}
        style={{ padding: "0px !important" }}
        className={Styles.record_activity_main}
        width={600}
        title={
          <div
            style={{
              padding: 15,
              textAlign: "center",
              fontSize: 18,
              fontWeight: 600,
              fontFamily: "Poppins",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: 450,
              margin: "auto",
            }}
          >
            {activityData.feedback_type}
          </div>
        }
      >
        <ActivityViewDetails
          {...{ activityData, editPermission, onClose, type: "modal" }}
        />
      </Modal>
    );
  } else {
    return (
      <Drawer
        open={!!(activityId && Object.keys(activityData).length)}
        title={
          <div
            style={{
              textAlign: "center",
              fontSize: 18,
              fontWeight: 600,
              fontFamily: "Poppins",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: 450,
            }}
          >
            {activityData.feedback_type}
          </div>
        }
        onClose={onClose}
        width={550}
      >
        <ActivityViewDetails
          {...{
            activityData,
            editPermission,
            onClose,
            type: "drawer",
          }}
        />
      </Drawer>
    );
  }
};

export default ViewRecordActivityComponent;

const ActivityViewDetails = ({
  activityData,
  editPermission,
  onClose,
  type,
}) => {
  const cookies = new Cookies();

  const context = useContext(Context);
  const { setAttendanceModalAction } = context;

  const [previewImage, setPreviewImage] = useState({ open: false, url: null });
  const [editActivityData, setEditActivityData] = useState({});

  return (
    <>
      <div
        className={type === "modal" && Styles.record_activity_body_main_view}
        style={{ fontFamily: "Poppins", padding: "10px 20px" }}
      >
        <div>
          <div className={Styles.space_between}>
            <div className={Styles.flex}>
              <img
                src={activityData?.module_type_pic || customerIcon}
                alt="profile"
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 10,
                }}
              />
              <div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>
                  <WrapText width={200}>
                    {activityData?.customer_name || activityData?.business_name}
                  </WrapText>
                </div>
                <div className={Styles.color_grey}>
                  {moment(activityData.created_at).format(
                    "DD MMM YYYY, hh:mm A"
                  )}
                </div>
              </div>
            </div>

            {(cookies.get("rupyzLoginData")?.user_id ||
              cookies.get("rupyzAdminId")) === `${activityData?.created_by}` &&
              editPermission && (
                <button
                  onClick={() => {
                    setAttendanceModalAction({
                      open: true,
                      handleAction: () => {
                        setEditActivityData({ ...activityData });
                      },
                    });
                  }}
                  className="button_secondary"
                >
                  <img width={"13px"} src={EditIcon} alt="" /> Edit
                </button>
              )}
          </div>
          <br />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: ".5fr 1fr",
              rowGap: "1em",
            }}
          >
            <div className={Styles.color_grey}>Created By :</div>

            <div
              className={Styles.bold_black}
              style={{ textTransform: "capitalize" }}
            >
              {activityData?.created_by_name}
            </div>

            {activityData?.geo_address &&
              activityData?.geo_location_lat &&
              activityData?.geo_location_long && (
                <>
                  <div className={Styles.color_grey}>Last Updated at :</div>
                  <div className={Styles.space_between}>
                    <p className={Styles.bold_black}>
                      {activityData?.geo_address}
                    </p>
                    <a
                      href={`https://maps.google.com/?q=${activityData?.geo_location_lat},${activityData?.geo_location_long}`}
                      rel="noreferrer noopener"
                      target="_blank"
                    >
                      <img src={Map} alt="map" />
                    </a>
                  </div>
                </>
              )}

            <PreviewFormValues formItems={activityData.custom_form_data} />
          </div>
        </div>
      </div>
      <ImageViewer {...{ previewImage, setPreviewImage }} />
      <RecordActivityComponent
        {...{ editActivityData }}
        onSave={(v) => {
          v && onClose();
        }}
        onClose={() => {
          setEditActivityData({});
        }}
      />
    </>
  );
};

export const CommentRender = ({ comment = "" }) => {
  const replaceParams = {
    "\n": "<br/>",
  };
  let __html = `<div>${comment}</div>`;
  Object.keys(replaceParams).map((k) => {
    __html = __html.replaceAll(k, replaceParams[k]);
  });
  return <div dangerouslySetInnerHTML={{ __html }} />;
};

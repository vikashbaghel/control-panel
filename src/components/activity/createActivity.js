import { Button, Form, Modal, Space, notification } from "antd";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { convertToUTC, removeEmpty } from "../../helpers/globalFunction";
import Cookies from "universal-cookie";
import { singleUploadImage } from "../../helpers/uploadImage";
import { feedbackAndActivityAddService } from "../../redux/action/recordFollowUpAction";
import { SelectFeedbackType } from "../activityModal/recordActivity";
import { DatePickerInput } from "../form-elements/datePickerInput";
import TextArea from "antd/es/input/TextArea";
import ImageUploader from "../image-uploader/ImageUploader";
import { feedbackAndActivity } from "../../redux/constant";
import { getGeoLocationAndAddress } from "../../services/location-service";

const cookies = new Cookies();

const CreateActivity = ({ isModalOpen = false, isModalClose }) => {
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { feedbackActivityById, addFeedBackAndActivity } = state;

  const [activityId, setActivityId] = useState();
  const [module, setModule] = useState({ id: 0, type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [geolocation, setGeolocation] = useState({
    latitude: 0,
    longitude: 0,
    address: "",
  });

  const format = "DD-MM-YYYY hh:mm A";

  const onClose = () => {
    reset();
    isModalClose(false);
    dispatch({
      type: feedbackAndActivity.GET_FEEDBACK_ACTIVITY,
      payload: "",
    });
  };

  const reset = () => {
    form.resetFields();
    setModule({ id: 0, type: "" });
    setActivityId("");
  };

  const disabledDate = (current) => {
    return current && current < moment().startOf("day");
  };

  const handleCallingEditAPI = async () => {
    let formValue = form.getFieldsValue();
    setIsLoading(true);
    let tempImgList = formValue.pics.filter((file) => !file.id);
    let tempImgId = formValue.pics
      .filter((file) => file.id)
      .map((fileId) => fileId.id);

    let apiData = {
      feedback_type: formValue.feedback_type,
      module_type: module.type,
      module_id: module.id,
      comments: formValue.comments,
      due_datetime: formValue.due_datetime
        ? convertToUTC(formValue.due_datetime)
        : "",
      geo_location_lat: geolocation.latitude,
      geo_location_long: geolocation.latitude,
      geo_address: geolocation.address,
      location_permission:
        geolocation.latitude && geolocation.latitude ? true : false,
    };

    if (tempImgList.length !== 0) {
      for (let i = 0; i < tempImgList.length; i++) {
        const file = await singleUploadImage(tempImgList[i]);
        tempImgId.push(file);
      }
    }
    let tempData = { ...apiData, pics: tempImgId };
    dispatch(feedbackAndActivityAddService(removeEmpty(tempData), activityId));
  };

  const handleSubmit = () => {
    if (cookies.get("rupyzLocationEnable") === "true") {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          handleCallingEditAPI(activityId);
          return;
        }
        openNotification();
      });
      return;
    }
    handleCallingEditAPI(activityId);
  };

  const openNotification = () => {
    const key = `open${Date.now()}`;
    const btn = (
      <Space>
        <button
          className="button_primary"
          onClick={() => {
            notification.destroy();
          }}
        >
          OK
        </button>
        <button
          className="button_secondary"
          onClick={() => {
            notification.destroy(key);
            handleSubmit();
          }}
        >
          Continue without Location
        </button>
      </Space>
    );
    notification.open({
      message:
        "Location access is Blocked. Change your location settings in browser",
      btn,
      key,
    });
  };

  useEffect(() => {
    if (feedbackActivityById.data && !feedbackActivityById.data.data.error) {
      let tempData = feedbackActivityById.data.data.data;
      form.setFieldsValue({
        feedback_type: tempData.feedback_type,
        comments: tempData.comments,
        due_datetime: tempData.due_datetime
          ? moment(tempData.due_datetime).format(format)
          : "",
        pics: tempData.pics_urls,
      });
      setModule((prev) => ({
        ...prev,
        id: tempData.module_id,
        type: tempData.module_type,
      }));
      setActivityId(tempData.id);
    }
    if (
      addFeedBackAndActivity.data &&
      !addFeedBackAndActivity.data.data.error &&
      addFeedBackAndActivity.data.status === 200
    ) {
      onClose();
    }
  }, [state]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {});
    getGeoLocationAndAddress()
      .then((response) => {
        setGeolocation((prev) => ({
          ...prev,
          latitude: response.lat,
          longitude: response.lng,
          address: response.address,
        }));
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <Modal
      title={
        <div
          style={{
            padding: 15,
            textAlign: "center",
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          {activityId ? "Update " : "Record "}Activity
        </div>
      }
      width={650}
      onCancel={onClose}
      open={isModalOpen}
      centered
      footer={[null]}
    >
      <Form
        form={form}
        layout="vertical"
        validateMessages={{
          required: "${label} is required.",
        }}
        initialValues={{ pics: [] }}
        requiredMark={(label, info) => (
          <div>
            {label} {info.required && <span style={{ color: "red" }}>*</span>}
          </div>
        )}
        onFinish={handleSubmit}
      >
        <div style={{ padding: "10px 20px 0px 20px" }}>
          <Form.Item
            label="Activity Type"
            name="feedback_type"
            style={{ font: 16 }}
            rules={[{ required: true }]}
          >
            <SelectFeedbackType />
          </Form.Item>
          <Form.Item label="Comments" name="comments" style={{ font: 16 }}>
            <TextArea placeholder="Enter Comment" />
          </Form.Item>
          <Form.Item label="Follow up Date and Time" name="due_datetime">
            <DatePickerInput
              showTime={true}
              format={"DD-MM-YYYY hh:mm A"}
              params={{
                disabledDate: disabledDate,
              }}
            />
          </Form.Item>
          {cookies.get("rupyzGalleryEnable") === "true" ? (
            <Form.Item
              label="Upload Photos / Docs"
              name="pics"
              style={{ font: 16 }}
            >
              <ImageUploader maxCount={6} accept=".jpeg,.png,.jpg,.pdf" />
            </Form.Item>
          ) : (
            <Form.Item
              label="Enable the Gallery Photos From Setting Preferences"
              name="pics"
              style={{ font: 16 }}
            ></Form.Item>
          )}
        </div>

        <div
          style={{
            display: "flex",
            background: "#fff",
            alignItems: "center",
            padding: 15,
            justifyContent: "end",
            gap: 20,
            borderRadius: "0 0 10px 10px",
          }}
        >
          <Button
            className="button_secondary"
            onClick={onClose}
            style={{ padding: "0px 20px", borderRadius: 8 }}
            type="button"
          >
            Cancel
          </Button>
          <Button
            className="button_primary"
            htmlType="submit"
            loading={isLoading}
          >
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateActivity;

const initialFormValues = {
  feedback_type: null,
  module_type: "",
  pics: [],
  comments: "",
  due_datetime: "",
  geo_location_lat: "",
  geo_location_long: "",
  module_id: "",
};

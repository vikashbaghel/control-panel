// https://team-1624359381274.atlassian.net/wiki/spaces/RUPYZ/pages/edit-v2/180748290#ACTIVITY-Form-(Add/Edit)

import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Context from "../../context/Context";
import { Space, notification, Modal, Form, Button } from "antd";
import { BASE_URL_V2, org_id } from "../../config";
import Cookies from "universal-cookie";
import {
  getActivityFormByType,
  updateActivity,
} from "../../redux/action/recordFollowUpAction";
import Styles from "./recordActivity.module.css";
import { convertToUTC } from "../../helpers/globalFunction";
import SingleSelectSearch from "../../components/selectSearch/singleSelectSearch";
import { feedbackAndActivity } from "../../redux/constant";
import { getGeoLocationAndAddress } from "../../services/location-service";
import CustomForm, {
  createPostFormData,
  getCustomFieldValues,
} from "../../views/custom-forms";

const RecordActivityComponent = ({
  editActivityData,
  onClose,
  onCheckOut,
  onSave,
}) => {
  const [form] = Form.useForm();
  const context = useContext(Context);
  const dispatch = useDispatch();

  const { setCheckOutModal, setGeoLocationAction } = context;
  const [geoLocationLat, setGeoLocationLat] = useState("");
  const [geoLocationLong, setGeoLocationLong] = useState("");
  const [geoAddress, setGeoAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activityFormData, setActivityFormData] = useState([]);

  const queryParameters = new URLSearchParams(window.location.search);

  const cookies = new Cookies();

  const handleSubmit = async (formValues, payload = {}) => {
    const custom_form_data = await createPostFormData(
      formValues,
      activityFormData
    );

    const formData = {
      custom_form_data,
      feedback_type: formValues.feedback_type.name,
      module_id: editActivityData?.module_id,
      module_type: queryParameters.get("name")
        ? "Customer Feedback"
        : editActivityData?.module_type,
      sub_module_type: formValues.feedback_type.name,
      sub_module_id: formValues.feedback_type.id,
      comments: formValues.comments,
      due_datetime: formValues.due_datetime
        ? convertToUTC(formValues.due_datetime)
        : "",
      geo_location_lat: payload.lat,
      geo_location_long: payload.long,
      geo_address: payload.address,
    };
    setIsLoading(false);

    const res = await updateActivity(formData, editActivityData.id || "");

    if (res && res.status === 200) {
      if (
        editActivityData.module_type === "Customer Feedback" &&
        !editActivityData.id
      ) {
        setCheckOutModal({
          open: true,
          handleAction: onClose,
          handleCheckOut: () => {
            onCheckOut();
            onClose();
          },
        });
      } else {
        onClose();
      }
      onSave && onSave(true);
      setIsLoading(false);
      dispatch({
        type: feedbackAndActivity.ADD_CUSTOMER_ACTIVITY,
        payload: res,
      });
      dispatch({
        type: feedbackAndActivity.GET_FEEDBACK_ACTIVITY,
        payload: "",
      });
      setTimeout(() => {
        dispatch({
          type: feedbackAndActivity.ADD_CUSTOMER_ACTIVITY,
          payload: "",
        });
      }, 200);
    } else setIsLoading(false);
  };

  const getFormItems = async (id) => {
    if (!id) {
      setActivityFormData([]);
      return;
    }
    const data = await getActivityFormByType(id);
    if (data) {
      setActivityFormData(data.data.data.sections[0].form_items);
    }
  };

  const onFinish = async (e) => {
    if (isLoading) return;
    setIsLoading(true);
    if (cookies.get("rupyzLocationEnable") === "true") {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          handleSubmit(e, {
            lat: geoLocationLat || 0,
            long: geoLocationLong || 0,
            address: geoAddress || "",
          });
          return;
        }
        openNotification(e);
      });
      return;
    }
    handleSubmit(e);
  };

  const openNotification = (e) => {
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
            handleSubmit(e);
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
      onClose: () => {
        setIsLoading(false);
      },
    });
  };

  const onFeedbackTypeChange = async (value) => {
    form.resetFields();
    await getFormItems(value?.id);
    form.setFieldsValue({
      feedback_type: value,
    });
  };

  useEffect(() => {
    if (editActivityData.module_type === "Customer Feedback") {
      setGeoLocationAction({
        open: true,
        handleAction: onClose,
        customer_id: editActivityData?.module_id,
      });
    }
  }, [editActivityData]);

  useEffect(() => {
    getGeoLocationAndAddress()
      .then((response) => {
        setGeoLocationLat(response.lat);
        setGeoLocationLong(response.lng);
        setGeoAddress(response.address);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (editActivityData && Object.keys(editActivityData).length) {
      let customFieldValues = {};
      if (editActivityData.custom_form_data) {
        setActivityFormData(editActivityData.custom_form_data);
        customFieldValues = getCustomFieldValues(
          editActivityData.custom_form_data
        );
      }
      form.setFieldsValue({
        feedback_type: {
          name:
            editActivityData.feedback_type || editActivityData.sub_module_type,
          id: editActivityData.feedback_id || editActivityData.sub_module_id,
        },
        ...customFieldValues,
      });
      getFormItems(editActivityData.sub_module_id);
    } else if (!Object.keys(editActivityData || {}).length) {
      form.resetFields();
      setActivityFormData([]);
    }
  }, [editActivityData]);

  return (
    <>
      <Modal
        centered
        open={!!Object.keys(editActivityData).length}
        className={Styles.record_activity_main}
        width={600}
        onCancel={onClose}
        title={
          <div
            style={{
              padding: 10,
              textAlign: "center",
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            {editActivityData.id ? "Update Activity" : "Record Activity"}
          </div>
        }
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
          onFinish={onFinish}
        >
          <div style={{ padding: "10px 20px 0px 20px", minHeight: 150 }}>
            <Form.Item
              label="Activity Type"
              name="feedback_type"
              style={{ font: 16 }}
              rules={[{ required: true }]}
            >
              <SelectFeedbackType onChange={onFeedbackTypeChange} />
            </Form.Item>

            <CustomForm form_items={activityFormData} />
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
    </>
  );
};

export default RecordActivityComponent;

export function SelectFeedbackType({ onChange, value }) {
  const activityAPI = `${BASE_URL_V2}/organization/${org_id}/activity/followup/?dd=true`;
  return (
    <SingleSelectSearch
      apiUrl={activityAPI}
      value={(value || {}).id || ""}
      onChange={(data) => onChange && onChange(data)}
      params={{ placeholder: "Search Activity", allowClear: false }}
      setInterface={({ reset, data }) => {
        let selection;
        if ((value || {}).name) {
          data.map((v, i) => {
            if (v.name === value.name) {
              selection = v;
            }
          });
        }
        if (selection && selection.id !== value.id) {
          onChange(selection);
        }
      }}
    />
  );
}

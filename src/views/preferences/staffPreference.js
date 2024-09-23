import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Switch } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  staffAddPreferencesAction,
  staffPreferencesAction,
} from "../../redux/action/preferencesAction";
import styles from "./preferences.module.css";

const StaffPreferences = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { getStaffPrefernce, addStaffPrefernce } = state;
  const initialValues = {
    push_notifications: false,
    whatsapp_opt_in: false,
  };
  const [formValues, setFormValues] = useState(initialValues);

  useEffect(() => {
    if (getStaffPrefernce.data && !getStaffPrefernce.data.data.error) {
      setFormValues((prev) => ({
        ...prev,
        push_notifications: getStaffPrefernce.data.data.data.push_notifications,
        whatsapp_opt_in: getStaffPrefernce.data.data.data.whatsapp_opt_in,
      }));
    }
    if (addStaffPrefernce.data && !addStaffPrefernce.data.data.error) {
      initialApiCall();
    }
  }, [getStaffPrefernce, addStaffPrefernce]);

  const initialApiCall = () => dispatch(staffPreferencesAction());

  const handleSubmitPreferences = () =>
    dispatch(staffAddPreferencesAction(formValues));

  useEffect(() => initialApiCall(), []);

  return (
    <div>
      <h2 className="page_title">Profile Settings</h2>
      <br />
      <div className={styles.conatiner}>
        {profileOptions.map((item, index) => (
          <div key={index}>
            <div style={label}>{item.label}</div>
            <Switch
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, [item.state]: e }))
              }
              value={formValues[item.state]}
              checkedChildren={<CheckOutlined style={{ fontSize: "15px" }} />}
              unCheckedChildren={<CloseOutlined style={{ fontSize: "15px" }} />}
            />
          </div>
        ))}
      </div>
      <br />
      <div style={{ display: "flex", justifyContent: "end" }}>
        <Button
          onClick={handleSubmitPreferences}
          className="button_primary"
          htmlType="submit"
          style={{ width: "200px", height: 40 }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default StaffPreferences;

const label = {
  fontWeight: "500",
  fontSize: "16px",
};

const profileOptions = [
  { label: "App Notification", state: "push_notifications" },
  { label: "WhatsApp Notification", state: "whatsapp_opt_in" },
];

import React, { useEffect, useState } from "react";
import { Content } from "antd/es/layout/layout";
import Styles from "./settings.module.css";
import {
  RoleIcon,
  StaffMappingIcon,
  CategoryIcon,
  ChartIcon,
  CustomerLevelIcon,
  ImagegalleryIcon,
  OrderSettingIcon,
  LocationIcon,
  ManagementIcon,
  offlineMode as offlineModeImg,
  EnableCheckIn,
  autoAssignIcon,
  StartdayEnddayphoto,
} from "../../assets/settings";
import { useDispatch, useSelector } from "react-redux";
import {
  addPreferencesAction,
  preferencesAction,
} from "../../redux/action/preferencesAction";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { Form, Input, Switch, notification } from "antd";

const PreferencesComponents = () => {
  const [activePanel, setActivePanel] = useState(false);

  const dispatch = useDispatch();
  const { performance } = useSelector((state) => state);
  const [level1, setLevel1] = useState("");
  const [level2, setLevel2] = useState("");
  const [level3, setLevel3] = useState("");
  const [levelData, setLevelData] = useState({});
  const [preferences, setPreferences] = useState(
    preferenceList.reduce((acc, curr) => {
      acc[curr.name] = false;
      if (curr.subList) {
        curr.subList.forEach((sub) => (acc[sub.name] = false));
      }
      return acc;
    }, {})
  );

  useEffect(() => {
    dispatch(preferencesAction());
  }, []);

  useEffect(() => {
    if (performance.data && !performance.data.data.error) {
      const infoTemp = performance.data.data.data;
      setPreferences((prev) => ({
        ...prev,
        staff_customer_mapping: infoTemp.staff_customer_mapping,
        disable_gallery_photo: infoTemp.disable_gallery_photo,
        enable_roles_permission: infoTemp.enable_roles_permission,
        enable_hierarchy_management: infoTemp.enable_hierarchy_management,
        enable_customer_level_order: infoTemp.enable_customer_level_order,
        auto_approve_orders: infoTemp.auto_approve_orders,
        auto_dispatch_orders: infoTemp.auto_dispatch_orders,
        minimum_order_amount: infoTemp.minimum_order_amount,
        enable_analytics_calculation: infoTemp.enable_analytics_calculation,
        enable_customer_category_mapping:
          infoTemp.enable_customer_category_mapping,
        auto_approve_beat_plan: infoTemp.auto_approve_beat_plan,
        location_tracking: infoTemp.location_tracking,
        activity_geo_fencing: infoTemp.activity_geo_fencing,
        live_location_tracking: infoTemp.live_location_tracking,
        allow_offline_mode: infoTemp.allow_offline_mode,
        activity_check_in_required: infoTemp.activity_check_in_required,
        activity_check_in_show_image_input:
          infoTemp.activity_check_in_show_image_input,
        activity_check_in_image_required:
          infoTemp.activity_check_in_image_required,
        auto_assign_child_customers_to_staff:
          infoTemp.auto_assign_child_customers_to_staff,
        activity_allow_telephonic_order:
          infoTemp.activity_allow_telephonic_order,
        attendance_start_day_image_required:
          infoTemp.attendance_start_day_image_required,
        attendance_end_day_image_required:
          infoTemp.attendance_end_day_image_required,
      }));
      setLevelData(infoTemp.customer_level_config);
    }
  }, [performance]);

  function handleSubmitPreferences() {
    let apiData = { ...preferences };
    Object.assign(apiData, {
      customer_level_config: {
        "LEVEL-1": level1 ? level1 : levelData["LEVEL-1"],
        "LEVEL-2": level2 ? level2 : levelData["LEVEL-2"],
        "LEVEL-3": level3 ? level3 : levelData["LEVEL-3"],
      },
    });
    dispatch(addPreferencesAction(apiData));
    setTimeout(() => {
      dispatch(preferencesAction());
    }, 500);
  }

  const showNotification = (parentTitle) => {
    notification.warning({
      description: `Please enable "${parentTitle}" first.`,
    });
  };

  const handleSwitchChange = (name, value) => {
    setPreferences((prev) => {
      const updated = { ...prev, [name]: value };

      const parentItem = preferenceList.find((item) => item.name === name);
      if (parentItem && parentItem.subList && !value) {
        parentItem.subList.forEach((sub) => {
          updated[sub.name] = value;
        });
      }

      preferenceList.forEach((item) => {
        if (item.subList) {
          item.subList.forEach((sub) => {
            if (sub.control && sub.control.includes(name)) {
              updated[sub.name] = false;
            }
          });
        }
      });

      return updated;
    });
  };

  const handleSubSwitchChange = (
    parentName,
    subName,
    value,
    control = "",
    hideControl = false
  ) => {
    let parentList = preferenceList.find((item) => item.name === parentName);
    let controlList = parentList.subList.filter((list) => list.control)[0];
    let obj = {};
    if (controlList && subName === controlList.control && !value) {
      obj[controlList.name] = value;
    }
    if (control && !preferences[control]) {
      showNotification(
        parentList.subList.find((item) => item.name === control).title
      );
      return;
    }

    if (!preferences[parentName] && !hideControl) {
      showNotification(parentList.title);
      return;
    }

    setPreferences((prev) => ({
      ...prev,
      ...obj,
      [subName]: value,
    }));
  };

  return (
    <div>
      <Content
        style={{
          padding: "0 0 0 24px",
          margin: 0,
          height: "82vh",
          background: "transparent",
        }}
      >
        <Form
          layout="horizontal"
          style={{ display: "flex", gap: "20px", flexDirection: "column" }}
        >
          {preferenceList.map((pref) => (
            <div key={pref.name} className={Styles.preference_card}>
              <div>
                <div className={Styles.card_header}>
                  <img src={pref.img} alt="icon" width={35} />
                  <span>{pref.title}</span>
                </div>
                <div className={Styles.card_body}>{pref.discription}</div>
                {pref.typeof === "input" ? (
                  <Form.Item label="" key={pref.name}>
                    <Input
                      style={{ width: 100 }}
                      value={preferences[pref.name]}
                      onChange={(event) =>
                        handleSwitchChange(
                          pref.name,
                          Number(event.target.value)
                        )
                      }
                    />
                  </Form.Item>
                ) : (
                  !pref.hideControl && (
                    <Form.Item label="" key={pref.name}>
                      <Switch
                        checked={preferences[pref.name]}
                        onChange={(value) =>
                          handleSwitchChange(pref.name, value)
                        }
                      />
                    </Form.Item>
                  )
                )}
              </div>

              {pref.subList && (
                <>
                  {pref.subList.map((sub) => (
                    <div key={sub.name}>
                      <div className={Styles.card_header}>
                        <div></div>
                        <span>{sub.title}</span>
                      </div>
                      <div className={Styles.card_body}>{sub.discription}</div>
                      <Form.Item key={sub.name} label={""}>
                        <Switch
                          checked={preferences[sub.name]}
                          onChange={(value) =>
                            handleSubSwitchChange(
                              pref.name,
                              sub.name,
                              value,
                              sub.control,
                              pref.hideControl
                            )
                          }
                        />
                      </Form.Item>
                    </div>
                  ))}
                </>
              )}
            </div>
          ))}
        </Form>
        <div
          className={
            activePanel !== true ? "custom-collapse" : "custom-collapse-active"
          }
          style={{ marginTop: 20 }}
        >
          <div
            className={`custom-collapse-panel ${activePanel ? "active" : ""}`}
          >
            <div
              className="custom-collapse-header"
              onClick={() => setActivePanel(!activePanel)}
            >
              <span>Set Customer Level</span>
              {activePanel ? (
                <CaretUpOutlined style={{ color: "#727176" }} />
              ) : (
                <CaretDownOutlined style={{ color: "#727176" }} />
              )}
            </div>
            {activePanel && (
              <div
                className="custom-collapse-content"
                style={{ fontFamily: "Poppins" }}
              >
                <div className="custom-collapse-content-item">
                  <div>Level 1 (Contain Level 2)</div>
                  <div>
                    <input
                      width={"200px"}
                      defaultValue={levelData["LEVEL-1"]}
                      onChange={(e) => setLevel1(e.target.value)}
                    />
                  </div>
                </div>

                <div className="custom-collapse-content-item">
                  <div>Level 2 (Contain Level 3)</div>
                  <div>
                    <input
                      width={"200px"}
                      onChange={(e) => setLevel2(e.target.value)}
                      defaultValue={levelData["LEVEL-2"]}
                    />
                  </div>
                </div>

                <div className="custom-collapse-content-item">
                  <div>Level 3 </div>
                  <div>
                    <input
                      width={"200px"}
                      defaultValue={levelData["LEVEL-3"]}
                      onChange={(e) => setLevel3(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={Styles.button_css}>
          <button className="button_primary" onClick={handleSubmitPreferences}>
            Save
          </button>
        </div>
      </Content>
    </div>
  );
};

export default PreferencesComponents;

const preferenceList = [
  {
    title: "Staff Customer Mapping",
    name: "staff_customer_mapping",
    img: StaffMappingIcon,
    discription:
      "Enable for mapping customer to staff. Once enabled, only mapped customer will be visible to the respective staff.",
  },
  {
    title: "Disable gallery Photos",
    name: "disable_gallery_photo",
    img: ImagegalleryIcon,
    discription:
      "Disable photos to be uploaded from mobile's gallery. Once disabled, photos can be uploaded in the app only from the mobile camera.",
  },
  {
    title: "Mandatory photo upload while marking attendance",
    img: StartdayEnddayphoto,
    hideControl: true,
    discription: (
      <div style={{ width: 290 }}>
        Make photo uploads mandatory for the staff while marking start day and
        end day. <br />
      </div>
    ),
    subList: [
      {
        title: "Start Day",
        name: "attendance_start_day_image_required",
        discription: "",
      },
      {
        title: "End Day",
        name: "attendance_end_day_image_required",
        discription: "",
      },
    ],
  },
  {
    title: "Enable check-in check-out",
    name: "activity_check_in_required",
    img: EnableCheckIn,
    discription: (
      <div>
        Enable staff to mark check-in and check-out times for seamless tracking.
        <br />
        <div
          style={{
            color: "#000",
            fontSize: 12,
            fontWeight: 600,
            display: "flex",
            gap: 5,
          }}
        >
          <span style={{ color: "red" }}>*</span> Please enable geo-fencing to
          ensure your staff can check-in only within a 50-meter radius of the
          customer's location.
        </div>
      </div>
    ),
    subList: [
      {
        title: "Take photo while Check In",
        name: "activity_check_in_show_image_input",
        discription: "",
      },
      {
        title: "Make photo taking mandatory",
        name: "activity_check_in_image_required",
        discription: "",
        control: "activity_check_in_show_image_input",
      },
      {
        title: "Telephonic Order",
        name: "activity_allow_telephonic_order",
        discription: "To bypass geo-fencing when check-in/check-out is enabled",
      },
    ],
  },
  {
    title: "Role & permission",
    name: "enable_roles_permission",
    img: RoleIcon,
    discription:
      "Enable for creating various roles & permission for those roles.",
  },
  {
    title: "Hierarchy Management",
    name: "enable_hierarchy_management",
    img: ManagementIcon,
    discription: "Enable to create a custom hierarchy for an organization.",
  },
  {
    title: "Customer level ordering",
    name: "enable_customer_level_order",
    img: CustomerLevelIcon,
    discription:
      "Enable for sharing & notification to your primary & secondary level. If not enabled, mapped primary level will not get order notifications & actions.",
    subList: [
      {
        title: "Order Auto Approved",
        name: "auto_approve_orders",
        discription: "",
      },
      {
        title: "Auto Dispatch",
        name: "auto_dispatch_orders",
        discription: "",
      },
    ],
  },
  {
    title: "Min. Order Amount",
    name: "minimum_order_amount",
    img: OrderSettingIcon,
    discription:
      "Enable to set the min. order value for your organization. Once enabled for an amount, no order will be allowed to be taken below that min. order amount",
    typeof: "input",
  },
  {
    title: "Analytics",
    name: "enable_analytics_calculation",
    img: ChartIcon,
    discription:
      "Enable to get the analytics order and activity data. If disabled, system will not be able to generate any analytics and reports.",
  },
  {
    title: "Customer Product-Category",
    name: "enable_customer_category_mapping",
    img: CategoryIcon,
    discription:
      "Enable for mapping desired product category to set of customers. Once enabled, only mapped product category will be visible to the respective customers.",
  },
  {
    title: "Auto assign all the mapped child customer to staff",
    name: "auto_assign_child_customers_to_staff",
    img: autoAssignIcon,
    discription:
      "If this is on, all the mapped customer of a parent will be auto assigned to the staff. Including all the child customers that will be added in the future.",
  },
  {
    title: "Auto Approve Beat Plan",
    name: "auto_approve_beat_plan",
    img: CategoryIcon,
    discription:
      "Enable to Auto Approve all the Beat Plan of All Staff as soon its get created.",
  },
  {
    title: "Track Activity Location",
    name: "location_tracking",
    img: LocationIcon,
    discription:
      "Enable to track the location of staff / users for the orders & activities.",
    subList: [
      {
        title: "Geo-Fencing",
        name: "activity_geo_fencing",
        discription:
          "This Will Resrict Staff to Perform Activity (like Taking Order, Payment) on Customer within 50m of Customer’s geo-location.",
      },
      {
        title: "Live Location Trace",
        name: "live_location_tracking",
        discription:
          "Enable this to track the live location of staff on Map. Tracking will done between Start of the Day to End of the Day/8PM Max.",
      },
    ],
  },
  {
    title: "Offline Mode",
    name: "allow_offline_mode",
    img: offlineModeImg,
    discription: (
      <div>
        This will allow staffs to run app without internet, but only few feature
        will work such as Lead, Customer, Order, Payment, Activity, etc.
        <br />
        <span style={{ color: "red" }}>Geo-Fencing</span> and{" "}
        <span style={{ color: "red" }}>Location Tracking</span> Will not Work in
        Offline Mode .
      </div>
    ),
  },
];

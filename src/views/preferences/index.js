import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, theme, Card, Switch, Form, notification, Divider } from "antd";
import { Content } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addPreferencesAction,
  preferencesAction,
} from "../../redux/action/preferencesAction";
import styles from "./preferences.module.css";

const Preferences = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const navigate = useNavigate();
  const [getChecked, setGetChecked] = useState(false);
  const [getRoleChecked, setGetRoleChecked] = useState(false);
  const [orderMinValue, setOrderMinValue] = useState("");
  const [locationTracking, setLocationTracking] = useState(false);
  const [hierarchyManagement, setHierarchyManagement] = useState(false);
  const [level1, setLevel1] = useState("");
  const [level2, setLevel2] = useState("");
  const [level3, setLevel3] = useState("");
  const [levelData, setLevelData] = useState({});
  const [analyticsManagment, setAnalyticsManagment] = useState(false);
  const [galleryEnable, setGalleryEnable] = useState(false);
  const [customerLevelOrderEnable, setCustomerLevelOrderEnable] =
    useState(false);
  const [customerCategoryMappingEnable, setCustomerCategoryMappingEnable] =
    useState(false);
  const [orderAutoApproved, setOrderAutoApproved] = useState(false);
  const [autoDispatch, setAutoDispatch] = useState(false);

  useEffect(() => {
    dispatch(preferencesAction());
  }, []);

  useEffect(() => {
    if (state.performance.data !== "") {
      if (state.performance.data.data.error === false) {
        setOrderMinValue(state.performance.data.data.data.minimum_order_amount);
        setGetChecked(state.performance.data.data.data.staff_customer_mapping);
        setGetRoleChecked(
          state.performance.data.data.data.enable_roles_permission
        );
        setLocationTracking(state.performance.data.data.data.location_tracking);
        setHierarchyManagement(
          state.performance.data.data.data.enable_hierarchy_management
        );
        setLevelData(state.performance.data.data.data.customer_level_config);
        setAnalyticsManagment(
          state.performance.data.data.data.enable_analytics_calculation
        );
        setGalleryEnable(
          state.performance.data.data.data.disable_gallery_photo
        );
        setCustomerLevelOrderEnable(
          state.performance.data.data.data.enable_customer_level_order
        );
        setCustomerCategoryMappingEnable(
          state.performance.data.data.data.enable_customer_category_mapping
        );
        setOrderAutoApproved(
          state.performance.data.data.data.auto_approve_orders
        );
        setAutoDispatch(state.performance.data.data.data.auto_dispatch_orders);
      }
    }
  }, [state]);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  function handleSubmitPreferences() {
    const apiData = {
      staff_customer_mapping: getChecked,
      enable_roles_permission: getRoleChecked,
      minimum_order_amount: orderMinValue
        ? parseFloat(orderMinValue)
        : state.performance.data.data.data.minimum_order_amount,
      location_tracking: locationTracking,
      enable_hierarchy_management: hierarchyManagement,
      enable_analytics_calculation: analyticsManagment,
      customer_level_config: {
        "LEVEL-1": level1 ? level1 : levelData["LEVEL-1"],
        "LEVEL-2": level2 ? level2 : levelData["LEVEL-2"],
        "LEVEL-3": level3 ? level3 : levelData["LEVEL-3"],
      },
      disable_gallery_photo: galleryEnable,
      enable_customer_level_order: customerLevelOrderEnable,
      enable_customer_category_mapping: customerCategoryMappingEnable,
      auto_approve_orders: orderAutoApproved,
      auto_dispatch_orders: autoDispatch,
    };
    dispatch(addPreferencesAction(apiData));
  }

  return (
    <div>
      <h2 className="page_title">
        Preferences
        <div className="breadcrumb">
          <span onClick={() => navigate("/web")}>Home </span>
          <span onClick={() => navigate("/web/customer-category")}>
            {" "}
            / Preferences
          </span>
        </div>
      </h2>
      <Content
        style={{
          padding: 24,
          margin: 0,
          // minHeight: "105vh",
          background: colorBgContainer,
          position: "relative",
        }}
      >
        <Card style={{ marginBottom: "7px" }}>
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginLeft: "6px",
                marginBottom: "10px",
              }}
            >
              <div>
                <label style={{ fontWeight: "bold", fontSize: "15px" }}>
                  Minimum Order Amount
                </label>
              </div>
              <div>
                <input
                  onChange={(e) => setOrderMinValue(e.target.value)}
                  style={{
                    width: "95%",
                    height: "40px",
                    borderRadius: "5px",
                    // marginBottom: "10px",
                    border: "1px solid gray",
                    paddingLeft: "5px",
                  }}
                  defaultValue={orderMinValue}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
            </div>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                // marginBottom: "50px",
              }}
            >
              <p style={marginStyleForP}>Staff and Customer Mapping </p>{" "}
              <p style={marginStyleForP}>
                <Switch
                  onChange={(e) => setGetChecked(e)}
                  checkedChildren={
                    <CheckOutlined style={{ fontSize: "15px" }} />
                  }
                  unCheckedChildren={
                    <CloseOutlined style={{ fontSize: "15px" }} />
                  }
                  checked={getChecked}
                />
              </p>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <p style={marginStyleForP}>Enable Role Permission </p>{" "}
            <p style={marginStyleForP}>
              <Switch
                onChange={(e) => setGetRoleChecked(e)}
                checkedChildren={<CheckOutlined style={{ fontSize: "15px" }} />}
                unCheckedChildren={
                  <CloseOutlined style={{ fontSize: "15px" }} />
                }
                checked={getRoleChecked}
              />
            </p>
          </div>
          <Form>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <p style={marginStyleForP}>Hierarchy Management </p>{" "}
              <p style={marginStyleForP}>
                <Switch
                  onChange={(e) => setHierarchyManagement(e)}
                  checkedChildren={
                    <CheckOutlined style={{ fontSize: "15px" }} />
                  }
                  unCheckedChildren={
                    <CloseOutlined style={{ fontSize: "15px" }} />
                  }
                  checked={hierarchyManagement}
                />
              </p>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <p style={marginStyleForP}>Location Tracking </p>{" "}
              <p style={marginStyleForP}>
                <Switch
                  onChange={(e) => setLocationTracking(e)}
                  checkedChildren={
                    <CheckOutlined style={{ fontSize: "15px" }} />
                  }
                  unCheckedChildren={
                    <CloseOutlined style={{ fontSize: "15px" }} />
                  }
                  checked={locationTracking}
                />
              </p>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <p style={marginStyleForP}>Analytics Calculation</p>{" "}
              <p style={marginStyleForP}>
                <Switch
                  onChange={(e) => setAnalyticsManagment(e)}
                  checkedChildren={
                    <CheckOutlined style={{ fontSize: "15px" }} />
                  }
                  unCheckedChildren={
                    <CloseOutlined style={{ fontSize: "15px" }} />
                  }
                  checked={analyticsManagment}
                />
              </p>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <p style={marginStyleForP}>Disable Gallery Photo </p>{" "}
              <p style={marginStyleForP}>
                <Switch
                  onChange={(e) => setGalleryEnable(e)}
                  checkedChildren={
                    <CheckOutlined style={{ fontSize: "15px" }} />
                  }
                  unCheckedChildren={
                    <CloseOutlined style={{ fontSize: "15px" }} />
                  }
                  checked={galleryEnable}
                />
              </p>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 15,
              }}
            >
              <p style={marginStyleForP}>
                Enable Customer-Product Category Mapping{" "}
              </p>{" "}
              <p style={marginStyleForP}>
                <Switch
                  onChange={(e) => setCustomerCategoryMappingEnable(e)}
                  checkedChildren={
                    <CheckOutlined style={{ fontSize: "15px" }} />
                  }
                  unCheckedChildren={
                    <CloseOutlined style={{ fontSize: "15px" }} />
                  }
                  checked={customerCategoryMappingEnable}
                />
              </p>
            </div>
            {/* Customer Category Mapping */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p style={marginStyleForP}>Enable Customer Level Ordering</p>{" "}
              <p style={marginStyleForP}>
                <Switch
                  onChange={(e) => {
                    setCustomerLevelOrderEnable(e);
                    if (e) return;
                    setOrderAutoApproved(e);
                    setAutoDispatch(e);
                  }}
                  checkedChildren={
                    <CheckOutlined style={{ fontSize: "15px" }} />
                  }
                  unCheckedChildren={
                    <CloseOutlined style={{ fontSize: "15px" }} />
                  }
                  checked={customerLevelOrderEnable}
                />
              </p>
            </div>
            <ul className={styles.enable_customer_level_order}>
              <li
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "2px",
                  paddingRight: 6,
                  fontWeight: 600,
                }}
              >
                <span>Order Auto Approved</span>
                <Switch
                  size="small"
                  onChange={(e) =>
                    customerLevelOrderEnable
                      ? setOrderAutoApproved(e)
                      : notification.warning({
                          message: "Enable Customer Level Order",
                        })
                  }
                  checkedChildren={
                    <CheckOutlined style={{ fontSize: "15px" }} />
                  }
                  unCheckedChildren={
                    <CloseOutlined style={{ fontSize: "15px" }} />
                  }
                  checked={orderAutoApproved}
                />
              </li>
              <li
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "2px",
                  paddingRight: 6,
                  fontWeight: 600,
                }}
              >
                <span>Auto Dispatch</span>
                <Switch
                  size="small"
                  onChange={(e) =>
                    customerLevelOrderEnable
                      ? setAutoDispatch(e)
                      : notification.warning({
                          message: "Enable Customer Level Order",
                        })
                  }
                  checkedChildren={
                    <CheckOutlined style={{ fontSize: "15px" }} />
                  }
                  unCheckedChildren={
                    <CloseOutlined style={{ fontSize: "15px" }} />
                  }
                  checked={autoDispatch}
                />
              </li>
            </ul>
            <Divider />
            {/* Customer Level */}
            <div style={{ marginTop: "15px", marginBottom: "15px" }}>
              <h2 style={{ fontWeight: "900", fontSize: "18px" }}>
                Set Customer Level
              </h2>
              <div style={{ marginLeft: "15px" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <label
                      style={{
                        fontWeight: "bold",
                        fontSize: "15px",
                        marginBottom: "50px",
                      }}
                    >
                      Level 1 ( Contain Level 2 )
                    </label>
                  </div>
                  <div>
                    <input
                      onChange={(e) => setLevel1(e.target.value)}
                      style={{
                        width: "95%",
                        height: "40px",
                        borderRadius: "5px",
                        marginBottom: "10px",
                        border: "1px solid gray",
                        paddingLeft: "5px",
                        fontWeight: "bold",
                      }}
                      defaultValue={levelData["LEVEL-1"]}
                    />
                  </div>
                </div>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <label style={{ fontWeight: "bold", fontSize: "15px" }}>
                      Level 2 ( Contain Level 3 )
                    </label>
                  </div>
                  <div>
                    <input
                      onChange={(e) => setLevel2(e.target.value)}
                      style={{
                        width: "95%",
                        height: "40px",
                        borderRadius: "5px",
                        marginBottom: "10px",
                        border: "1px solid gray",
                        paddingLeft: "5px",
                        fontWeight: "bold",
                      }}
                      defaultValue={levelData["LEVEL-2"]}
                    />
                  </div>
                </div>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <label style={{ fontWeight: "bold", fontSize: "15px" }}>
                      Level 3
                    </label>
                  </div>
                  <div>
                    <input
                      onChange={(e) => setLevel3(e.target.value)}
                      style={{
                        width: "95%",
                        height: "40px",
                        borderRadius: "5px",
                        marginBottom: "10px",
                        border: "1px solid gray",
                        paddingLeft: "5px",
                        fontWeight: "bold",
                      }}
                      defaultValue={levelData["LEVEL-3"]}
                    />
                  </div>
                </div>
              </div>
            </div>
            <br />
          </Form>
        </Card>

        <br />
        <Button
          onClick={handleSubmitPreferences}
          style={{
            width: "300px",
            position: "absolute",
            bottom: 70,
            right: 40,
          }}
          type="primary"
          htmlType="submit"
        >
          Submit
        </Button>
      </Content>
    </div>
  );
};

export default Preferences;

const marginStyleForP = {
  margin: "5px",
  fontWeight: "bold",
  fontSize: "15px",
};
const stylefonts = {
  fontWeight: "bold",
};

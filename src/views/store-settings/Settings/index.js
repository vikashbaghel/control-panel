import React, { useState, useEffect } from "react";
import { Space, Spin, notification } from "antd";
import ColorForm from "./ColorForm";
import FontSelect from "./FontSelect";
import { configurationService } from "../../../redux/action/storefrontAction";
import Domain from "../Domain";
import HeaderForm from "./HeaderForm";
import FooterForm from "./FooterForm";
import AppInfo from "../AppInfo";

export const forms = [
  {
    name: "color",
    component: ColorForm,
  },
  {
    name: "font",
    component: FontSelect,
  },
];

export default function General() {
  const [config, setConfig] = useState({});

  const updateConfiguration = async (values) => {
    const response = await configurationService.update(values);
    if (response) {
      const { data, message } = response;
      if (data) {
        notification.success({ message });
      } else if (message) {
        notification.error({ message });
      }
    }
    fetchConfiguration();
  };

  const fetchConfiguration = async () => {
    const { data } = await configurationService.fetch();
    if (data) {
      setConfig(data);
    }
  };

  useEffect(() => {
    fetchConfiguration();
  }, []);

  if (!Object.keys(config).length) {
    return (
      <Space align="middle">
        <Spin />
        <div>Fetching configurations</div>
      </Space>
    );
  }

  return (
    <>
      <Space direction="vertical" size="middle" style={{ flex: 1 }}>
        <div style={styles.heading}>Settings</div>
        <Domain />
        <br />
        <AppInfo />
        <br />
        <div style={styles.heading}>Header Settings</div>
        <HeaderForm {...{ config, updateConfiguration }} />
        <br />
        <div style={styles.heading}>Footer Settings</div>
        <FooterForm {...{ config, updateConfiguration }} />
      </Space>
    </>
  );
}

const styles = {
  heading: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 22,
    color: "#000000",
  },
  subheading: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 18,
    color: "#000000",
  },
};

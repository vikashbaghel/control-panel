import { theme, Space, Layout, Row, Col } from "antd";
import { Content } from "antd/es/layout/layout";
import {
  FileTextFilled,
  PictureFilled,
  StarFilled,
  SettingFilled,
  InfoCircleFilled,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import General from "./General";
import Pages from "./Pages";
import Slides from "./Slides";
import Testimonials from "./Testimonials";
import Teams from "./Teams";
import Achievements from "./Achievements";
import Settings from "./Settings";
import SEO from "./SEO";
import {
  seoIcon,
  testimonialIcon,
  teamIcon,
  paymentGateway,
} from "../../assets/navbarImages/storefront";
import RazorpayAuthorization from "./Payment-gateway";
import filterService from "../../services/filter-service";

const { Sider } = Layout;

const StoreSettings = () => {
  const navigate = useNavigate();

  const [activeParams, setActiveParams] = useState({
    tab: "general",
    ...filterService.getFilters(),
  });

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const tabsList = {
    general: {
      name: "General",
      icon: <InfoCircleFilled style={style.link_icon} />,
      component: <General />,
    },
    pages: {
      name: "Pages",
      icon: <FileTextFilled style={style.link_icon} />,
      component: <Pages />,
    },
    sliders: {
      name: "Sliders",
      icon: <PictureFilled style={style.link_icon} />,
      component: <Slides />,
    },
    testimonials: {
      name: "Testimonials",
      icon: (
        <img src={testimonialIcon} alt="testimonial" style={style.link_icon} />
      ),
      component: <Testimonials />,
    },
    "our-team": {
      name: "Our Team",
      icon: <img src={teamIcon} alt="team" style={style.link_icon} />,
      component: <Teams />,
    },
    "our-achievement": {
      name: "Our Achievement",
      icon: <StarFilled style={style.link_icon} />,
      component: <Achievements />,
    },
    settings: {
      name: "Settings",
      icon: <SettingFilled style={style.link_icon} />,
      component: <Settings />,
    },
    seo: {
      name: "SEO",
      icon: <img src={seoIcon} alt="seo" style={style.link_icon} />,
      component: <SEO />,
    },
    "payment-gateway": {
      name: "Payment Gateway",
      icon: <img src={paymentGateway} alt="payment" style={style.link_icon} />,
      component: <RazorpayAuthorization />,
    },
  };

  useEffect(() => {
    filterService.setEventListener(setActiveParams);
  }, []);

  return (
    <div style={{ flex: 1 }}>
      <h2 className="page_title">
        <Space size="middle">
          <ArrowLeftOutlined onClick={() => navigate(-1)} />
          Storefront
        </Space>
        <div className="breadcrumb">
          <span onClick={() => navigate("/web")}>Home </span>
          <span onClick={() => navigate("/web/storefront")}>
            {" "}
            / StoreFront{" "}
          </span>
        </div>
      </h2>
      <br />
      <Row gutter={24}>
        <Col>
          <Sider style={style.sider} trigger={null}>
            {Object.keys(tabsList).map((key, i) => (
              <div key={i} className="clickable">
                <Space
                  size={6}
                  align="middle"
                  style={{
                    width: "100%",
                    padding: 14,
                    fontWeight: "500",
                    borderBottom: "1px solid #FFF",
                    ...(activeParams["tab"] === key
                      ? {
                          color: "#001A72",
                          backgroundColor: "#F0F0F6",
                        }
                      : { color: "#727176" }),
                  }}
                  onClick={() =>
                    filterService.setFilters({ page: "", tab: key })
                  }
                >
                  <div />
                  <div
                    className={activeParams["tab"] === key ? "theme-fill" : ""}
                  >
                    {tabsList[key]["icon"]}
                  </div>
                  <div />
                  <div style={{ lineHeight: "24px" }}>
                    {tabsList[key]["name"]}
                  </div>
                </Space>
              </div>
            ))}
          </Sider>
        </Col>
        <Col style={{ flex: 1 }}>
          <Content
            style={{
              margin: 0,
              minHeight: "82vh",
              //background: colorBgContainer,
            }}
          >
            <div style={{ display: "flex" }}>
              {tabsList[activeParams["tab"]]["component"]}
            </div>
          </Content>
        </Col>
      </Row>
    </div>
  );
};

export default StoreSettings;

const style = {
  sider: {
    overflow: "auto",
    scrollbarWidth: 5,
    background: "rgba(255, 255, 255, 0.35)",
    borderRadius: 10,
  },
  link_icon: {
    height: 24,
    width: 24,
    objectFit: "contain",
    fontSize: 24,
  },
};

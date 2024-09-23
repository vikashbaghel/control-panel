import { EllipsisOutlined } from "@ant-design/icons";
import {
  Avatar,
  Card,
  Col,
  Descriptions,
  Row,
  Skeleton,
  Space,
  Spin,
} from "antd";
import React, { useEffect, useState } from "react";
import tcIcon from "../../../assets/beat/customer.svg";
import pcIcon from "../../../assets/pc-icon.svg";
import outputIcon from "../../../assets/output.svg";
import { customerInsightsAction } from "../../../redux/action/customerVewDetails";
import moment from "moment";

const CustomerInsightsView = ({ customer }) => {
  const [data, setData] = useState();
  const [loader, setLoader] = useState(true);
  async function fetchInsights() {
    if (customer.id) {
      setLoader(true);
      const data = await customerInsightsAction(customer.id);
      if ((data || {}).error === false) {
        if (data.data) {
          let { lifetime_pc_count, lifetime_tc_count } = data.data;
          setData({
            ...data.data,
            productive_output_percentage: lifetime_tc_count
              ? ((lifetime_pc_count / lifetime_tc_count) * 100).toFixed(2)
              : 0,
          });
        }
      }
      setLoader(false);
    }
  }
  useEffect(() => {
    fetchInsights(customer.id);
  }, [customer.id]);
  return <Col>{!!data ? <InsightCard {...{ data }} /> : []}</Col>;
};

const InsightCard = ({ data }) => {
  const stats = [
    {
      icon: <img src={tcIcon} style={styles.insight_icon} alt="tc" />,
      title: "TC",
      key: "lifetime_tc_count",
    },
    {
      icon: <img src={pcIcon} style={styles.insight_icon} alt="pc" />,
      title: "PC",
      key: "lifetime_pc_count",
      valueKey: "total_order_amount",
    },
    {
      icon: <img src={outputIcon} style={styles.insight_icon} alt="output" />,
      title: "Output",
      key: "productive_output_percentage",
      unit: "%",
    },
  ];
  return (
    <Col className="app-card-layout fadeIn">
      <Row style={styles.insight_cards}>
        {stats.map((obj, i) => (
          <Col
            key={i}
            flex={1}
            style={{
              ...styles.insight_item,
              ...(i < stats.length - 1 ? styles.divider_vertical : {}),
            }}
          >
            <Row justify={"space-between"} align={"middle"}>
              <Col>
                <Space direction="vertical" align="center">
                  {obj.icon}
                  <h4 style={styles.insight_title}>{obj.title}</h4>
                </Space>
              </Col>
              <Col align="end">
                <h2 style={styles.insight_value}>
                  {data[obj.key]}
                  {obj.unit || ""}
                </h2>
                {obj.valueKey && (
                  <h3 style={{ margin: 0 }}>₹{data[obj.valueKey]}</h3>
                )}
              </Col>
            </Row>
          </Col>
        ))}
      </Row>
      <Col style={{ padding: 24 }}>
        <Descriptions
          size="small"
          column={1}
          contentStyle={{ display: "flex", justifyContent: "flex-end" }}
          colon={false}
        >
          {[
            { label: "Last Visit Date", key: "last_visit_date", type: "date" },
            { label: "Last Order Date", key: "last_order_date", type: "date" },
            {
              label: "Last Order Value",
              key: "last_order_value",
              type: "amount",
            },
            {
              label: "Avg Order Value historic",
              key: "avg_order_value_historic",
              type: "amount",
            },
          ].map((obj) => (
            <Descriptions.Item {...obj}>
              {obj.type === "date" && data[obj.key] ? (
                moment(data[obj.key]).format("DD MMM YYYY")
              ) : obj.type === "amount" ? (
                <>₹{data[obj.key] || 0}</>
              ) : (
                data[obj.key]
              )}
            </Descriptions.Item>
          ))}
        </Descriptions>
      </Col>
    </Col>
  );
};

const styles = {
  insight_cards: {
    borderBottom: "2px solid #ffffff",
  },
  divider_vertical: {
    borderRight: "2px solid #ffffff",
  },
  insight_item: {
    padding: "12px 24px",
  },
  insight_icon: {
    height: 20,
    width: 30,
    objectFit: "contain",
  },
  insight_title: {
    fontSize: 12,
    color: "#383838",
    margin: 0,
  },
  insight_value: {
    color: "#312B81",
    margin: 0,
  },
};

export default CustomerInsightsView;

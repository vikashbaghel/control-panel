import { Button, Card, Checkbox, Col, Input, Row, Space, Table } from "antd";
import WhatsappIcon from "../../../assets/whatsapp.svg";
import { useEffect, useState } from "react";
import {
  fetchWhatsappSettings,
  updateWhatsappSettings,
} from "../../../redux/action/whatsappSettingsAction";

const contact = {
  mobile: "9289859284",
  text: "Hi! I want to create a Rupyz WhatsApp Account.",
};

const links = {
  contactTeam: `https://wa.me/+91${contact.mobile}?text=${contact.text}`,
  setupGuide:
    "https://sparkly-scraper-3ee.notion.site/Whatsapp-White-label-Intergration-Docs-d888ee33721e475eaf7155babf7b047b",
  createTemplate:
    "https://www.notion.so/Whatsapp-White-label-Intergration-Docs-d888ee33721e475eaf7155babf7b047b?pvs=4#55eca475d1a54dfd9dd100c5eb88b9d0",
  checkTemplateStatus:
    "https://www.notion.so/Whatsapp-White-label-Intergration-Docs-d888ee33721e475eaf7155babf7b047b?pvs=4#62c70aff7ead4d678d772e93b7d6fbb1",
  createCampaigns:
    "https://www.notion.so/Whatsapp-White-label-Intergration-Docs-d888ee33721e475eaf7155babf7b047b?pvs=4#98c416c8378045d0b4ac1df0901302aa",
  getApiKey:
    "https://www.notion.so/Whatsapp-White-label-Intergration-Docs-d888ee33721e475eaf7155babf7b047b?pvs=4#a9e799fd6833486d8f45c1f851a00b39",
};

const steps = [
  {
    label: "Have you created an account with Rupyz whatsapp ?",
    key: "is_account_created",
    guide: (
      <Row gutter={4}>
        <Col>
          <span style={{ fontSize: 12, color: "#727176" }}>To create :</span>
        </Col>
        <Col>
          <span style={{ color: "#727176" }}>
            Contact our customer support team -
          </span>
        </Col>
        <Col>
          <Space>
            <Col style={{ height: 24 }}>
              <img src={WhatsappIcon} style={{ height: "100%" }} />
            </Col>
            <a type="default" target="_blank" href={links.contactTeam}>
              +91 {contact.mobile}
            </a>
          </Space>
        </Col>
      </Row>
    ),
  },
  {
    label: "Have you created template messages ?",
    key: "is_template_created",
    guide: (
      <Space>
        <span style={{ fontSize: 12, color: "#727176" }}>If no? :</span>
        <a type="default" target="_blank" href={links.createTemplate}>
          Create template messages
        </a>
      </Space>
    ),
  },
  {
    label: "Are your messages verified by Meta ?",
    key: "is_meta_verified",
    guide: (
      <a type="default" target="_blank" href={links.checkTemplateStatus}>
        Check status of template messages
      </a>
    ),
  },
  {
    label: "Have you created campaigns ?",
    key: "is_campaigns_created",
    guide: (
      <Space>
        <span style={{ fontSize: 12, color: "#727176" }}>If no? :</span>
        <a type="default" target="_blank" href={links.createCampaigns}>
          Create campaigns
        </a>
      </Space>
    ),
  },
];

const columns = [
  { title: "Name", dataIndex: "name" },
  { title: "Action", dataIndex: "component", align: "right" },
];

const WhatsappWhiteLabel = () => {
  const [data, setData] = useState({});
  const [loader, setLoader] = useState(false);
  const [isAccountCreated, setIsAccountCreated] = useState(false);

  const fetchData = async () => {
    setLoader(true);
    const response = await fetchWhatsappSettings();
    if ((response || {}).data) {
      setData(response.data);
      setIsAccountCreated(response.data["is_account_created"]);
    }
    setLoader(false);
  };

  const handleSave = async (payload = {}) => {
    setLoader(true);
    await updateWhatsappSettings(payload);
    fetchData();
  };

  const getDataSource = (data = {}) => [
    ...steps.map((step, index) => {
      let isPreviousPending = !(index === 0 || data[steps[index - 1].key]);
      let isPending = !data[step.key];
      let isActive = isPending && !isPreviousPending;
      let isNextActive =
        !isPending &&
        (index + 1 === steps.length || !data[steps[index + 1].key]);
      return {
        name: (
          <Space direction="vertical">
            <div
              style={{
                color: "black",
                opacity: isActive || !isPending ? 1 : 0.25,
              }}
            >
              {step.label}
            </div>
            {isActive ? step.guide : []}
          </Space>
        ),
        component: (
          <Col
            style={{
              padding: 12,
              opacity: isActive || !isPending ? 1 : 0.25,
              ...(isActive || isNextActive ? {} : { pointerEvents: "none" }),
            }}
          >
            <Checkbox
              key={`${step.key}=${data[step.key]}`}
              defaultChecked={data[step.key]}
              onChange={() => {
                setData((prev) => {
                  let payload = { ...prev, [step.key]: !data[step.key] };
                  // updateData(payload);
                  return payload;
                });
              }}
            />
          </Col>
        ),
      };
    }),
  ];

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Row style={{ height: 50 }} justify={"space-between"} align={"middle"}>
        <Col>
          <a type="default" target="_blank" href={links.setupGuide}>
            Learn how to setup
          </a>
        </Col>
        <Col>
          {isAccountCreated ? (
            <Button
              className="button_secondary"
              style={styles.secondaryButton}
              href="https://www.whatsapp.rupyz.com/"
              target="_blank"
            >
              <Space>
                <Col style={{ height: 24 }}>
                  <img src={WhatsappIcon} style={{ height: "100%" }} />
                </Col>
                <div style={{ color: "#727176", fontSize: 14 }}>WhatsApp</div>
              </Space>
            </Button>
          ) : (
            []
          )}
        </Col>
      </Row>
      <Table
        loading={loader}
        {...{ columns }}
        dataSource={getDataSource(data)}
        pagination={false}
      />
      <Card className="app-card-layout">
        <Space direction="vertical" style={{ width: "100%" }}>
          <Row justify={"space-between"} align={"middle"}>
            <Col>API Key</Col>
            <Col>
              <span style={{ fontSize: 12, color: "#727176" }}>
                * Please ensure all the above task are completed and marked done
                to enable API key
              </span>
            </Col>
          </Row>
          <Input
            placeholder="Enter API Key here"
            disabled={!data["is_campaigns_created"]}
            value={data["api_key"]}
            onChange={(e) => {
              setData((prev) => ({ ...prev, api_key: e.target.value }));
            }}
          />
          {data["is_campaigns_created"] ? (
            <a type="default" target="_blank" href={links.getApiKey}>
              How to get API Key
            </a>
          ) : (
            []
          )}
        </Space>
      </Card>
      <Col align="right">
        <Button className="button_primary" onClick={() => handleSave(data)}>
          Save
        </Button>
      </Col>
    </Space>
  );
};

const styles = {
  secondaryButton: { height: 44, padding: 8, borderColor: "#fff" },
};

export default WhatsappWhiteLabel;

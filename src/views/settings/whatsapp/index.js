import { Col, Tabs } from "antd";
import WhatsappNotification from "./whatsappNotification";
import WhatsappWhiteLabel from "./whatsappWhiteLabel";

const items = [
  {
    key: "1",
    label: "Notifications",
    children: <WhatsappNotification />,
  },
  {
    key: "2",
    label: "White-label Integration",
    children: <WhatsappWhiteLabel />,
  },
];

const WhatsappSettings = () => {
  return (
    <Col style={styles.container}>
      <Tabs
        className="app-tab-layout"
        defaultActiveKey="1"
        items={items}
        onChange={(v) => {}}
        size="small"
      />
    </Col>
  );
};

const styles = {
  container: {
    flex: 1,
    width: "100%",
    padding: "0px 24px",
  },
};

export default WhatsappSettings;

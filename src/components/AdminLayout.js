import { Col, Row, Space } from "antd";
import { Content } from "antd/es/layout/layout";
import SearchInput from "./search-bar/searchInput";

const AdminLayout = (props) => {
  return (
    <div className="table_list">
      {props?.title && (
        <h2
          className="page_title"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          {props.title}
        </h2>
      )}
      {props?.subTitle}
      <div className={"admin-layout-container"}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: "82vh",
            background: "transparent",
          }}
        >
          {props?.tableFilter}
          <Row justify={"space-between"} align="middle" style={{ gap: "8px" }}>
            {props.leftPanel}
            {props.search && (
              <Col>
                <SearchInput {...props.search} />
              </Col>
            )}
            <Col>
              <Space size={"middle"} align="center">
                {props.panel || []}
              </Space>
            </Col>
          </Row>
          <br />
          {props.children}
        </Content>
      </div>
    </div>
  );
};

export default AdminLayout;

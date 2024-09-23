import { theme, Dropdown, Space, Table, Button, Col, Row } from "antd";
import { Content } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Line } from "react-chartjs-2";
import { Link } from "react-router-dom";
import BreadcrumbHeader from "../../components/breadcrumb";
import {
  productAction,
  categoryAction,
  customerAction,
  staffAction,
} from "../../redux/action/analyticsAction";
// import LineChart from "../chart/lineChart";

const CustomerStaffSalse = () => {
  const [productlist, setProductList] = useState("");
  const [stafflist, setStaffList] = useState("");
  const [customerlist, setCustomertList] = useState("");
  const [categorylist, setCategoryList] = useState("");
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  useEffect(() => {
    dispatch(productAction());
    dispatch(categoryAction());
    dispatch(customerAction());
    dispatch(staffAction());
  }, []);

  useEffect(() => {
    if (state.customeranalytics.data !== "") {
      if (state.customeranalytics.data.data.error === false) {
        setCustomertList(state.customeranalytics.data.data.data);
      }
    }
    if (state.staffanalytics.data !== "") {
      if (state.staffanalytics.data.data.error === false)
        setStaffList(state.staffanalytics.data.data.data);
    }
    if (state.productanalytics.data !== "") {
      if (state.productanalytics.data.data.error === false)
        setProductList(state.productanalytics.data.data.data);
    }
    if (state.categoryanalytics.data !== "") {
      if (state.categoryanalytics.data.data.error === false)
        setCategoryList(state.categoryanalytics.data.data.data);
    }
  }, [state]);

  //columns Customer
  const columnsCustomer = [
    {
      title: "Order",
      dataIndex: "customer_name",
    },
    {
      title: "Sales Amount",
      dataIndex: "total_amount_sales",
    },
    {
      title: "Order %",
      dataIndex: "order",
      render: (text, record) => <div>-</div>,
    },
  ];

  // columns Staff
  const columnsStaff = [
    {
      title: "Staff Name",
      dataIndex: "user_name",
    },
    {
      title: "Received Amount",
      dataIndex: "total_amount_payment_received",
    },
    {
      title: "Sales Amount",
      dataIndex: "total_amount_sales",
    },
    {
      title: "Order %",
      dataIndex: "order",
      render: (text, record) => <div>-</div>,
    },
  ];

  // columns Category
  const columnsCategory = [
    {
      title: "Category",
      dataIndex: "category_dict[0]",
      render: (text, record) => (
        <div>{record.category_dict && record.category_dict[0].category}</div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "category_dict[0]",
      render: (text, record) => (
        <div>{record.category_dict && record.category_dict[0].total_price}</div>
      ),
    },
    {
      title: "Order %",
      dataIndex: "order",
      render: (text, record) => <div>-</div>,
    },
  ];

  // columns Product
  const columnsProduct = [
    {
      title: "Name",
      dataIndex: "product_dict[0]",
      render: (text, record) => (
        <div>{record.product_dict && record.product_dict[0].name}</div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "product_dict[0]",
      render: (text, record) => (
        <div>{record.product_dict && record.product_dict[0].total_price}</div>
      ),
    },
    {
      title: "Category",
      dataIndex: "product_dict[0]",
      render: (text, record) => (
        <div>{record.product_dict && record.product_dict[0].category}</div>
      ),
    },
    {
      title: "Order %",
      dataIndex: "order",
      render: (text, record) => <div>-</div>,
    },
  ];

  const style = {
    icon: {
      color: "#34C38F",
      cursor: "pointer",
      fontSize: 18,
    },
  };

  // const {
  //     token: { colorBgContainer },
  // } = theme.useToken();

  return (
    <div
      className="site-card-wrapper"
      style={{
        // padding: 24,
        marginBottom: "50px",
        // background: colorBgContainer,
      }}
    >
      {/* <div>
                    <h2>Analytics</h2>
                </div> */}
      {/* <Content
                style={{
                    padding: 24,
                    marginBottom: '10px',
                    background: colorBgContainer,
                }}
            > */}
      <div
        className="site-card-wrapper"
        style={{
          // padding: 24,
          marginBottom: "10px",
          // background: colorBgContainer,
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <div>
              <h3>Customer Wise Sales</h3>
            </div>

            <Table
              pagination={false}
              columns={columnsCustomer}
              dataSource={customerlist !== 0 ? customerlist.slice(0, 4) : ""}
            />
            {
              <div style={{ textAlign: "end", marginTop: "5px" }}>
                <Button type="primary">
                  <Link
                    to="/web/analytics/customer-sales-view-more"
                    onClick={() => dispatch(customerAction())}
                    style={{ color: "white" }}
                  >
                    View More
                  </Link>
                </Button>
              </div>
            }
          </Col>

          <Col span={12}>
            <div>
              <h3>Staff Wise Sales</h3>
            </div>

            <Table
              pagination={false}
              columns={columnsStaff}
              dataSource={stafflist !== 0 ? stafflist.slice(0, 4) : ""}
            />
            {
              <div style={{ textAlign: "end", marginTop: "5px" }}>
                <Button type="primary">
                  <Link
                    to="/web/analytics/staff-sales-view-more"
                    style={{ color: "white" }}
                  >
                    View More
                  </Link>
                </Button>
              </div>
            }
          </Col>
        </Row>
      </div>
      {/* </Content> */}

      {/* <Content
                style={{
                    padding: 24,
                    marginTop: '10px',
                    background: colorBgContainer,
                }}
            > */}
      {/* <div className="site-card-wrapper">
                    <Row gutter={16}>
                        <Col span={12}>
                            <div>
                                <h3>Top Product</h3>
                            </div>

                            <Table
                                pagination={false}
                                columns={columnsProduct}
                                dataSource={productlist !== 0 ? productlist.slice(0, 4) : ''}
                            />
                            {<div style={{ textAlign: "end", marginTop: "5px" }}>
                                <Button type="primary"><Link to='/web/analytics/product-sales-view-more' style={{ color: "white" }}>View More</Link></Button>
                            </div>}
                        </Col>
                    </Row>
                </div> */}

      {/* </Content> */}
    </div>
  );
};

export default CustomerStaffSalse;

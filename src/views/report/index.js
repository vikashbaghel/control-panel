import React, { useEffect, useState } from "react";
import { useNavigate, NavLink, Routes, Route } from "react-router-dom";
import { Content } from "antd/es/layout/layout";
import { Col, Row, Space, Layout, theme } from "antd";
import {
  OrderReportIcon,
  PaymentReportIcon,
  ProductReportIcon,
  ExpenseReportIcon,
  AttendanceReportIcon,
  PendingOrderReportIcon,
  CustomerWisePendingOrderReportIcon,
} from "../../assets/navbarImages/report";
import ReportOrder from "./report-order";
import ReportPayment from "./report-payment";
import ReportProduct from "./report-product";
import ReportExpense from "./report-expense";
import ReportAttendance from "./report-attendance";
import {
  EmployeeWiseProductReport,
  LeadReportUnSelectedIcon,
} from "../../assets/settings";
import LeadReport from "./report-lead/leadReport";
import { Activities, Customer } from "../../assets/navbarImages";
import ActivityReport from "./report-activity";
import CustomerReport from "./report-customer";
import PendingOrderReport from "./report-pending-order";
import EmployeeWiseProductReportBlock from "./employeeWiseProductReport";
import CustomerWisePendingOrderReportBlock from "./customerWisePendingOrderReport";
import Permissions from "../../helpers/permissions";

const Report = () => {
  const { Sider } = Layout;
  const navigate = useNavigate();

  let createOrderDetail = Permissions("CREATE_ORDER_DETAILED_REPORT");
  let createOrderSummary = Permissions("CREATE_ORDER_SUMMARY_REPORT");
  let createOrderDump = Permissions("CREATE_ORDER_DUMP_REPORT");

  let createPaymentSummary = Permissions("CREATE_PAYMENT_SUMMARY_REPORT");
  let createProductSummary = Permissions("CREATE_PRODUCT_SUMMARY_REPORT");
  let createExpenseDetail = Permissions("CREATE_EXPENSE_DETAILED_REPORT");
  let createExpenseSummary = Permissions("CREATE_EXPENSE_SUMMARY_REPORT");
  let createAttendanceDetail = Permissions("CREATE_ATTENDANCE_DETAILED_REPORT");
  let createAttendanceSummary = Permissions("CREATE_ATTENDANCE_SUMMARY_REPORT");
  let createActivityDetail = Permissions("CREATE_ACTIVITY_DETAILED_REPORT");
  let createActivitySummary = Permissions("CREATE_ACTIVITY_SUMMARY_REPORT");
  let createCustomerSummary = Permissions("CREATE_CUSTOMER_SUMMARY_REPORT");
  let createEmployeeWiseProduct = Permissions(
    "CREATE_EMPLOYEE_WISE_PRODUCT_REPORT"
  );
  let createCustomerWisePendingOrder = Permissions(
    "CREATE_CUSTOMER_WISE_PENDING_ORDER_REPORT"
  );
  let createLeadDetail = Permissions("CREATE_LEAD_DETAILED_REPORT");
  let createLeadSummary = Permissions("CREATE_LEAD_SUMMARY_REPORT");
  let createProductWisePendingOrder = Permissions(
    "CREATE_PRODUCT_WISE_PENDING_ORDER_REPORT"
  );

  const pages = [
    ...(createOrderDetail || createOrderSummary || createOrderDump
      ? [
          {
            name: "Order Report",
            icon: (
              <img alt="order" src={OrderReportIcon} style={style.link_icon} />
            ),
            component: <ReportOrder />,
            pathname: "order",
          },
        ]
      : []),
    ...(createPaymentSummary
      ? [
          {
            name: "Payment Report",
            icon: (
              <img
                alt="payment"
                src={PaymentReportIcon}
                style={style.link_icon}
              />
            ),
            component: <ReportPayment />,
            pathname: "payment",
          },
        ]
      : []),
    ...(createProductSummary
      ? [
          {
            name: "Product Report",
            icon: (
              <img
                alt="product"
                src={ProductReportIcon}
                style={style.link_icon}
              />
            ),
            component: <ReportProduct />,
            pathname: "product",
          },
        ]
      : []),
    ...(createExpenseDetail || createExpenseSummary
      ? [
          {
            name: "Expense Report",
            icon: (
              <img
                alt="expense"
                src={ExpenseReportIcon}
                style={style.link_icon}
              />
            ),
            component: <ReportExpense />,
            pathname: "expense",
          },
        ]
      : []),
    ...(createAttendanceDetail || createAttendanceSummary
      ? [
          {
            name: "Attendance Report",
            icon: (
              <img
                alt="attendance"
                src={AttendanceReportIcon}
                style={style.link_icon}
              />
            ),
            component: <ReportAttendance />,
            pathname: "attendance",
          },
        ]
      : []),
    ...(createActivityDetail || createActivitySummary
      ? [
          {
            name: "Activity Report",
            icon: (
              <img
                src={Activities}
                alt="activity report"
                style={style.link_icon}
              />
            ),
            component: <ActivityReport />,
            pathname: "activity",
          },
        ]
      : []),
    ...(createCustomerSummary
      ? [
          {
            name: "Customer Report",
            icon: (
              <img
                src={Customer}
                alt="customer report"
                style={style.link_icon}
              />
            ),
            component: <CustomerReport />,
            pathname: "customer",
          },
        ]
      : []),
    ...(createEmployeeWiseProduct
      ? [
          {
            name: "Employee Wise Product Report",
            icon: (
              <img
                src={EmployeeWiseProductReport}
                alt="report"
                style={style.link_icon}
              />
            ),
            component: <EmployeeWiseProductReportBlock />,
            pathname: "employee-wise-product-report",
          },
        ]
      : []),
    ...(createCustomerWisePendingOrder
      ? [
          {
            name: "Customer Wise Pending Order",
            icon: (
              <img
                src={CustomerWisePendingOrderReportIcon}
                alt="report"
                style={style.link_icon}
              />
            ),
            component: <CustomerWisePendingOrderReportBlock />,
            pathname: "customer-wise-pending-order",
          },
        ]
      : []),
    ...(createLeadDetail || createLeadSummary
      ? [
          {
            name: "Lead Report",
            icon: (
              <img
                alt="lead"
                src={LeadReportUnSelectedIcon}
                style={style.link_icon}
              />
            ),
            component: <LeadReport />,
            pathname: "lead",
          },
        ]
      : []),
    ...(createProductWisePendingOrder
      ? [
          {
            name: "Product Wise Pending Order Report",
            icon: (
              <img
                src={PendingOrderReportIcon}
                alt="pending"
                style={style.link_icon}
              />
            ),
            component: <PendingOrderReport />,
            pathname: "pending-order",
          },
        ]
      : []),
  ];

  const fetchActivePage = () => {
    let activeRoute = -1;
    let pathname = window.location.pathname.replace("/web/report/", "");
    pages.map((obj, i) => {
      if (pathname === obj.pathname) {
        activeRoute = i;
      }
    });
    if (activeRoute === -1) {
      navigate(`/web/report/${pages[0]["pathname"]}`);
      return 0;
    } else return activeRoute;
  };
  const [activePage, setActivePage] = useState(fetchActivePage());

  useEffect(() => {
    setActivePage(fetchActivePage());
  }, [window.location.pathname]);

  return (
    <Col>
      <h2 className="page_title">Report</h2>
      <br />
      <Row gutter={24}>
        <Col>
          <Sider style={style.sider} trigger={null}>
            {pages.map((obj, i) => (
              <NavLink key={i} to={`/web/report/${obj["pathname"]}`}>
                <Space
                  size={6}
                  style={{
                    width: "100%",
                    padding: 14,
                    fontWeight: "500",
                    borderBottom: "1px solid #FFF",
                    ...(activePage === i
                      ? {
                          color: "#001A72",
                          backgroundColor: "#F0F0F6",
                        }
                      : { color: "#727176" }),
                  }}
                >
                  <div />
                  <div
                    style={{ fontSize: 20 }}
                    className={activePage === i ? "theme-fill" : ""}
                  >
                    {obj.icon}
                  </div>
                  <div />
                  <div>{obj.name}</div>
                </Space>
              </NavLink>
            ))}
          </Sider>
        </Col>
        <Content>
          <Row
            gutter={24}
            style={{
              display: "flex",
              width: "calc(100vw - 340px)",
              paddingLeft: "2.5em",
            }}
          >
            <Routes>
              {pages.map((obj, i) => (
                <Route key={i} path={obj["pathname"]} element={obj.component} />
              ))}
            </Routes>
          </Row>
        </Content>
      </Row>
    </Col>
  );
};

export default Report;

const style = {
  sider: {
    overflow: "auto",
    scrollbarWidth: 5,
    background: "rgba(255, 255, 255, 0.35)",
    borderRadius: 10,
  },
  link_icon: {
    fontSize: 24,
    height: 24,
  },
};

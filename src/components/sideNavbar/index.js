/* eslint-disable react/jsx-no-undef */
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import styles from "./siderNavbar.module.css";
import Context from "../../context/Context";
import Cookies from "universal-cookie";
import Permissions from "../../helpers/permissions";
import {
  OverView,
  Product,
  Target,
  Staff,
  Customer,
  Order,
  Lead,
  Storefront,
  Payment,
  Activities,
  Expense,
  Settings,
  Report,
  StaffRole,
  ActiveOverView,
  ActiveProduct,
  ActiveTarget,
  ActiveStaff,
  ActiveCustomer,
  ActiveOrder,
  ActiveReport,
  ActiveStaffRole,
  ActiveLead,
  ActiveStorefront,
  ActivePayment,
  ActiveActivities,
  ActiveExpense,
  ActiveSettings,
  BeatPlan,
  ActiveBeatPlan,
  Activegallery,
  gallery,
} from "../../assets/navbarImages";
import { WhatsAppIcon } from "../../assets/settings";
import logo from "../../assets/logo-colored.png";
import packageInfo from "../../../package.json";
import { preference } from "../../services/preference-service";

const SideNavbar = () => {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const context = useContext(Context);
  const { collapsed, setCollapsed } = context;

  const queryParameters = new URLSearchParams(window.location.search);
  const target = queryParameters.get("target") === "team";

  let reimbursementApprovalPermission = Permissions("REIMBURSEMENT_APPROVAL");
  let viewStaffPermission = Permissions("VIEW_STAFF");
  let viewTargetTemplate = Permissions("VIEW_TARGET_TEMPLATE");
  const viewOrderPermission = Permissions("VIEW_ORDER");
  let viewPaymentPermission = Permissions("VIEW_PAYMENT");
  let viewLeadPermission = Permissions("VIEW_LEAD");

  const [dropDownOpen, setDropDownOpen] = useState([]);

  const handleCollapse = () => {
    setCollapsed(true);

    setDropDownOpen([]);
  };

  let hierarchy = cookies.get("rupyzLoginData");
  hierarchy = hierarchy && hierarchy.hierarchy;

  const admin = cookies.get("rupyzAccessType") === "WEB_SARE360" ? true : false;

  const path = window.location.pathname;

  const dashboard = path === "/web";
  const product = path === "/web/product";
  const addProduct = path === "/web/product/add-product";
  const productBulk = path === "/web/bulk-uploading-product";
  const myTargets = path === "/web/target";
  const targetSettings =
    path === "/web/target-setting" ||
    path === "/web/create-target" ||
    path === "/web/assign-target";
  const teamTargets = path === "/web/team-targets";
  const staff = path === "/web/staff";
  const staffBulk = path === "/web/bulk-uploading-staff";
  const staffCustomerMappingBulk =
    path === "/web/bulk-uploading-staff-customer-mapping";
  const staffCustomerMap =
    path === "/web/bulk-uploading-staff-customer-mapping";
  const staffAdd =
    path === "/web/staff/add-staff" || path === "/web/staff/add-staff/";
  const staffEdit = path === "/web/staff/edit-staff";
  const attendance = path === "/web/attendance";
  const customer = path === "/web/customer";
  const customerAdd = path == "/web/customer/add-customer";
  // const customerDetail = path == "/web/customer/view-customer/";
  const customerBulk = path === "/web/bulk-uploading-customer";
  const bulkCustomerBeat = path === "/web/bulk-uploading-customer-beat-mapping";
  const customerProduct = path === "/web/distributor/product-list";
  const customerCart = path === "/web/distributor/product-list/cart";
  const customerCartAddress = path.includes(
    "/web/distributor/product-list/cart/address"
  );
  const order =
    path === "/web/order/order-list" ||
    path.includes("/web/order/update-order/address/");
  const orderUpdate = path === "/web/order/update-order/";
  const orderDetails = path === "/web/order/order-details";
  const lead = path === "/web/lead";
  const leadAdd = path === "/web/add-lead/" || path === "/web/add-lead";
  const leadDetails = path === "/web/view-lead/";
  const payment = path === "/web/payment" || path === "/web/payment/";
  const storefront = path === "/web/storefront";
  const reports =
    path === "/web/report/order" ||
    path === "/web/report/payment" ||
    path === "/web/report/product" ||
    path === "/web/report/expense" ||
    path === "/web/report/attendance" ||
    path === "/web/report/lead" ||
    path === "/web/report/pending-order" ||
    path === "/web/report/customer" ||
    path === "/web/report/performance" ||
    path === "/web/report/activity";
  const staffRoles = path === "/web/staff-roles";
  const staffRolesCreate = path === "/web/staff-roles/create-roles";
  const staffRolesUpdate = path === "/web/staff-roles/update-roles";
  const myActivity = path === "/web/my-activity";
  const teamActivity = path === "/web/team-activity";
  const expenses = path.includes("/web/expense-tracker");
  const addExpenses =
    path === "/web/expense-tracker/add-expense" ||
    path === "/web/expense-tracker/add-expense/";
  const expenseApproval = path === "/web/approval-request-tracker";
  const beatPlan = path === "/web/beat-plan";
  const myBeatPlan = path === "/web/my-beat-plan";
  const beatDetails = path.split("/")[2] === "beat-plan-details";
  const beatList = path === "/web/beat-list";
  const staffView = path === "/web/staff/view-details/";
  const settings =
    path === "/web/setting" ||
    path === "/web/custom-form/activity" ||
    path === "/web/custom-form/customer" ||
    path === "/web/custom-report/order-pdf" ||
    path === "/web/custom-report/dispatch-pdf";
  const PictureGallery = path === "/web/picture-gallery";

  const optionList = [
    {
      lable: "Overview",
      img: OverView,
      activImg: ActiveOverView,
      activeLink: dashboard,
      link: "/web",
      // dropDown: [{ label: "Dashboard", link: "/web", activeLink: dashboard }],
    },
    {
      lable: "Product",
      img: Product,
      activImg: ActiveProduct,
      activeLink: product || addProduct || productBulk,
      dropDown: [
        { label: "Product List", link: "/web/product", activeLink: product },
        ...(admin
          ? [
              {
                label: "Bulk Upload",
                link: "/web/bulk-uploading-product",
                activeLink: productBulk,
                dataTestId: "bulk-upload-product",
              },
            ]
          : []),
      ],
    },
    {
      lable: "Beat",
      img: BeatPlan,
      activImg: ActiveBeatPlan,
      activeLink: myBeatPlan || beatPlan || beatDetails || beatList,
      dropDown: [
        {
          label: "Beat List",
          link: "/web/beat-list",
          activeLink: beatList,
        },
        ...(!admin
          ? [
              {
                label: "My Beat Plan",
                link: "/web/my-beat-plan",
                activeLink: myBeatPlan,
              },
            ]
          : []),
        {
          label: `${!admin ? "Teams " : ""}Beat Plan`,
          link: "/web/beat-plan",
          activeLink: beatPlan,
        },
      ],
    },
    {
      lable: "Target",
      img: Target,
      activImg: ActiveTarget,
      activeLink: myTargets || targetSettings || teamTargets,
      dropDown: [
        { label: "My Target", link: "/web/target", activeLink: myTargets },
        ...(viewTargetTemplate
          ? [
              {
                label: "Target Template",
                link: "/web/target-setting",
                activeLink: targetSettings && !target,
              },
            ]
          : []),
        ...(hierarchy || admin
          ? [
              {
                label: "Team Targets",
                link: "/web/team-targets",
                activeLink: teamTargets || target,
              },
            ]
          : []),
      ],
    },
    ...(viewStaffPermission
      ? [
          {
            lable: "Staff",
            img: Staff,
            activImg: ActiveStaff,
            activeLink:
              staff ||
              staffBulk ||
              staffAdd ||
              staffEdit ||
              staffView ||
              staffCustomerMappingBulk ||
              staffCustomerMap,
            dropDown: [
              {
                label: "Staff List",
                link: "/web/staff",
                activeLink: staff || staffAdd || staffEdit || staffView,
              },
              ...(admin
                ? [
                    {
                      label: "Bulk Upload",
                      link: "/web/bulk-uploading-staff",
                      activeLink: staffBulk,
                      dataTestId: "bulk-upload-staff",
                    },
                    {
                      label: "Staff-Customer Mapping Bulk Uploading",
                      link: "/web/bulk-uploading-staff-customer-mapping",
                      activeLink: staffCustomerMappingBulk,
                    },
                  ]
                : []),
            ],
          },
        ]
      : []),
    {
      lable: "Customer",
      img: Customer,
      activImg: ActiveCustomer,
      activeLink:
        customer ||
        customerAdd ||
        // customerDetail ||
        customerBulk ||
        customerProduct ||
        customerCart ||
        customerCartAddress ||
        bulkCustomerBeat,
      dropDown: [
        {
          label: "Customer List",
          link: "/web/customer",
          activeLink:
            customer ||
            customerAdd ||
            // customerDetail ||
            customerProduct ||
            // customerDetail ||
            customerCart ||
            customerCartAddress,
        },
        ...(admin
          ? [
              {
                label: "Bulk Upload",
                link: "/web/bulk-uploading-customer",
                activeLink: customerBulk,
                dataTestId: "bulk-upload-customer",
              },
              {
                label: "Customer-Beat Mapping Bulk Uploading",
                link: "/web/bulk-uploading-customer-beat-mapping",
                activeLink: bulkCustomerBeat,
              },
            ]
          : []),
      ],
    },
    ...(viewOrderPermission
      ? [
          {
            lable: "Order",
            img: Order,
            activImg: ActiveOrder,
            activeLink: order || orderDetails || orderUpdate,
            link: "/web/order/order-list",
          },
        ]
      : []),
    ...(viewLeadPermission
      ? [
          {
            lable: "Lead",
            img: Lead,
            activImg: ActiveLead,
            activeLink: lead || leadAdd || leadDetails,
            link: "/web/lead",
          },
        ]
      : []),
    ...(viewPaymentPermission
      ? [
          {
            lable: "Payment",
            img: Payment,
            activImg: ActivePayment,
            activeLink: payment,
            link: "/web/payment",
          },
        ]
      : []),

    {
      lable: "Picture Gallery",
      img: gallery,
      activImg: Activegallery,
      activeLink: PictureGallery,
      link: "/web/picture-gallery",
    },

    ...(admin
      ? [
          {
            lable: "Storefront",
            img: Storefront,
            activImg: ActiveStorefront,
            activeLink: storefront,
            link: "/web/storefront",
          },
        ]
      : []),
    ...(Permissions("CREATE_ORDER_DETAILED_REPORT") ||
    Permissions("CREATE_ORDER_SUMMARY_REPORT") ||
    Permissions("CREATE_ORDER_DUMP_REPORT") ||
    Permissions("CREATE_PAYMENT_SUMMARY_REPORT") ||
    Permissions("CREATE_PRODUCT_SUMMARY_REPORT") ||
    Permissions("CREATE_EXPENSE_DETAILED_REPORT") ||
    Permissions("CREATE_EXPENSE_SUMMARY_REPORT") ||
    Permissions("CREATE_ATTENDANCE_DETAILED_REPORT") ||
    Permissions("CREATE_ATTENDANCE_SUMMARY_REPORT") ||
    Permissions("CREATE_ACTIVITY_DETAILED_REPORT") ||
    Permissions("CREATE_ACTIVITY_SUMMARY_REPORT") ||
    Permissions("CREATE_CUSTOMER_SUMMARY_REPORT") ||
    Permissions("CREATE_EMPLOYEE_WISE_PRODUCT_REPORT") ||
    Permissions("CREATE_CUSTOMER_WISE_PENDING_ORDER_REPORT") ||
    Permissions("CREATE_LEAD_DETAILED_REPORT") ||
    Permissions("CREATE_LEAD_SUMMARY_REPORT") ||
    Permissions("CREATE_PRODUCT_WISE_PENDING_ORDER_REPORT")
      ? [
          {
            lable: "Report",
            img: Report,
            activImg: ActiveReport,
            activeLink: reports,
            link: "/web/report",
          },
        ]
      : []),
    ...(admin && preference.get("whatsapp_white_label")?.is_account_created
      ? [
          {
            lable: "Rupyz Whatsapp",
            img: WhatsAppIcon,
            externalLink: "https://www.whatsapp.rupyz.com/",
          },
        ]
      : []),
    ...(admin
      ? [
          {
            lable: "Staff Roles",
            img: StaffRole,
            activImg: ActiveStaffRole,
            activeLink: staffRoles || staffRolesCreate || staffRolesUpdate,
            link: "/web/staff-roles",
          },
        ]
      : []),
    {
      lable: "Activities",
      img: Activities,
      activImg: ActiveActivities,
      activeLink: teamActivity,
      link: "/web/team-activity",
    },
    {
      lable: "Expense",
      img: Expense,
      activImg: ActiveExpense,
      activeLink: expenses || addExpenses || expenseApproval,
      dropDown: [
        {
          label: "My Expense",
          link: "/web/expense-tracker",
          activeLink: expenses || addExpenses,
        },
        ...(reimbursementApprovalPermission
          ? [
              {
                label: " Approval",
                link: "/web/approval-request-tracker",
                activeLink: expenseApproval,
              },
            ]
          : []),
      ],
    },
    ...(Permissions("VIEW_PRODUCT_CATEGORY") ||
    Permissions("VIEW_CUSTOMER_TYPE") ||
    Permissions("VIEW_LEAD_CATEGORY") ||
    Permissions("VIEW_UNIT")
      ? [
          {
            lable: "Settings",
            img: Settings,
            activImg: ActiveSettings,
            activeLink: settings,
            link: `/web/setting?tab=${
              Permissions("VIEW_PRODUCT_CATEGORY")
                ? "Product Category"
                : Permissions("VIEW_CUSTOMER_TYPE")
                ? "Customer Type"
                : Permissions("VIEW_LEAD_CATEGORY")
                ? "Lead Category"
                : "Product Unit"
            }`,
          },
        ]
      : []),
  ];

  return (
    <div
      className={`${styles.sider_container} ${
        collapsed ? styles.sider_container_collapsed : ""
      }`}
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={handleCollapse}
    >
      {optionList.map((item, index) => {
        let linkActive = dropDownOpen.includes(item.lable);
        return (
          <div key={index} className={styles.option_container}>
            <div
              className={`${styles.option} ${
                collapsed ? styles.open_option : ""
              } ${item.activeLink ? styles.active_option : ""}`}
              onClick={() =>
                item.link
                  ? navigate(item.link)
                  : item.externalLink
                  ? window.open(item.externalLink, "_blank")
                  : dropDownOpen.includes(item.lable)
                  ? setDropDownOpen(
                      dropDownOpen.filter((value) => value !== item.lable)
                    )
                  : setDropDownOpen([...dropDownOpen, item.lable])
              }
            >
              <div>
                <img
                  src={item.activeLink ? item.activImg : item.img}
                  alt={item.lable}
                  style={{ width: 24 }}
                />
                <div>{item.lable}</div>
              </div>
              {item.dropDown && <DownArrow isOpen={linkActive} />}
            </div>
            <div
              className={`${styles.dropDown_option}`}
              style={
                linkActive
                  ? {
                      height: item.dropDown.length * 45,
                      transition: "height 0.2s ease-in-out",
                    }
                  : { height: 0, transition: "height 0.2s ease-in-out" }
              }
            >
              {item.dropDown?.map((ele, ind) => (
                <div
                  key={ind}
                  onClick={() => ele.link && navigate(ele.link)}
                  className={ele.activeLink ? styles.active_option : ""}
                  data-testid={ele.dataTestId}
                >
                  {ele.label}
                </div>
              ))}
            </div>
            {/* {item.dropDown && linkActive && (
            )} */}
          </div>
        );
      })}
      <br />
      <br />
      <div style={{ textAlign: "center" }}>
        {collapsed ? (
          <div className={styles.powered_by_container} style={{ height: 60 }}>
            <img
              src={logo}
              alt="img"
              width={50}
              className="clickable"
              onClick={() => navigate("/web")}
            />
            <div></div>
          </div>
        ) : (
          <div className={styles.powered_by_container}>
            <div>
              Powered by&nbsp;&nbsp;
              <img
                src={logo}
                alt="img"
                width={50}
                className="clickable"
                onClick={() => navigate("/web")}
              />
            </div>
            <div> V {packageInfo.version}</div>
          </div>
        )}
      </div>
      <br />
      <br />
    </div>
  );
};

export default SideNavbar;

const DownArrow = ({ isOpen }) => {
  return (
    <div className={styles.down_arrow}>
      {isOpen ? <UpOutlined /> : <DownOutlined />}
    </div>
  );
};

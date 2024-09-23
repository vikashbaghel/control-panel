import { lazy } from "react";
import AddAddress from "../views/cart/addAddress";
import ActivityDetailLogs from "../views/activities/teamActivity/ActivityDetailLogs";
import BulkCustomerBeatMap from "../views/bulkProduct/bulkCustomerBeatMap";

// Convert all imports to lazy loading
const Dashboard = lazy(() => import("../views/dashboard"));
const Product = lazy(() => import("../views/product"));
const AddProduct = lazy(() => import("../views/product/form/addProduct"));
const BulkProduct = lazy(() => import("../views/bulkProduct/bulkProduct"));
const BulkStaff = lazy(() => import("../views/bulkProduct/bulkStaff"));
const BulkStaffCustomerMap = lazy(() =>
  import("../views/bulkProduct/bulkStaffCustomerMap")
);
const BulkCustomer = lazy(() => import("../views/bulkProduct/bulkCustomer"));
const ProductGallery = lazy(() => import("../views/Gallery/index"));
const Staff = lazy(() => import("../views/staff"));
const Distributor = lazy(() => import("../views/distributor"));
const AddCustomer = lazy(() => import("../views/distributor/addCustomer"));
const Retailer = lazy(() => import("../views/retailer"));
const Order = lazy(() => import("../views/order"));
const OrderDetails = lazy(() => import("../views/order/orderDetails"));
const Payment = lazy(() => import("../views/payment"));
const CustomerCategory = lazy(() => import("../views/customer-category"));
const LeadCategory = lazy(() => import("../views/lead-category"));
const ViewLeadComponent = lazy(() =>
  import("../views/leadManagement/viewLead")
);
const AddNewCustomerCategory = lazy(() =>
  import("../components/viewDrawer/addCustomerCategoryDrower")
);
const Report = lazy(() => import("../views/report"));
const CustomReport = lazy(() => import("../views/custom-report"));
const ProductCardView = lazy(() => import("../views/product/productCardView"));
const Cart = lazy(() => import("../views/cart"));
const UpdateOrder = lazy(() => import("../views/cart/updateOrder"));
const Address = lazy(() => import("../views/cart/address"));
const Preferences = lazy(() => import("../views/preferences"));
const RolesPermission = lazy(() => import("../views/roles-permission"));
const LeadManagement = lazy(() => import("../views/leadManagement"));
const Attendance = lazy(() => import("../views/attendance"));
const AddLeadForm = lazy(() => import("../views/leadManagement/addLeadForm"));
const ReimbursementTracker = lazy(() =>
  import("../views/reimbursement-tracker")
);
const AddExpenseHeadComponent = lazy(() =>
  import("../views/reimbursement-tracker/addExpenseHead")
);
const AddExpenseComponent = lazy(() =>
  import("../views/reimbursement-tracker/addExpense")
);
const ApprovalReimbursementTracker = lazy(() =>
  import("../views/reimbursement-tracker/approvalRequest")
);
const MyActivities = lazy(() => import("../views/activities"));
const TeamActivities = lazy(() => import("../views/activities/teamActivity"));
const CustomerActivities = lazy(() =>
  import("../views/distributor/customerActivity")
);
const AddPricingGroup = lazy(() =>
  import("../views/pricing-group/addPricingGroup")
);
const BulkUpload = lazy(() =>
  import("../views/settings/pricingGroupBulk/bulkUpload")
);
const Goal = lazy(() => import("../views/goal"));
const IndividualTarget = lazy(() => import("../views/goal/individualTarget"));
const CreateTarget = lazy(() => import("../views/goal/createTarget"));
const AssignTarget = lazy(() => import("../views/goal/assignTarget"));
const TeamTargets = lazy(() => import("../views/goal/teamTargets"));
const BeatListNew = lazy(() => import("../views/beat-list"));
const BeatList = lazy(() => import("../views/beat-list"));
const StaffPreferences = lazy(() =>
  import("../views/preferences/staffPreference")
);
const StoreSettings = lazy(() => import("../views/store-settings"));
const CustomerType = lazy(() => import("../views/customer-type"));
const BeatPlanList = lazy(() => import("../views/beat-plan"));
const BeatPlanDetails = lazy(() =>
  import("../views/beat-plan/beatPlanDetails")
);
const ApprovalBeatPlanList = lazy(() =>
  import("../views/beat-plan/approvalBeatPlanList")
);
const StaffAllBeatPlanList = lazy(() =>
  import("../views/beat-plan/staffBeatPlanList")
);
const AdminSetting = lazy(() => import("../views/settings/admin"));
const StaffForm = lazy(() => import("../views/staff/staffForm"));
const ViewStaffDetails = lazy(() => import("../views/staff/viewStaffDetails"));
const IndividualBeatList = lazy(() =>
  import("../views/staff/individualBeatList")
);
const CustomFormCreate = lazy(() =>
  import("../views/custom-forms/CustomFormCreate")
);
const PaymentsReceived = lazy(() => import("../views/razorpay-payments"));
const SettingsComponent = lazy(() => import("../views/settings"));
const CheckoutOrder = lazy(() => import("../views/cart/checkoutOrder"));

export const links = {
  PRICING_GROUP_BULK_UPLOAD: "/pricing-group/bulk-upload",
};
export const routeLinks = {
  PRICING_GROUP_BULK_UPLOAD: "/web/pricing-group/bulk-upload",
};

const routes = [
  { path: "/", element: <Dashboard /> },
  { path: "/product", element: <Product /> },
  { path: "/product/add-product", element: <AddProduct /> },
  { path: "/bulk-uploading-product", element: <BulkProduct /> },
  { path: "/bulk-uploading-staff", element: <BulkStaff /> },
  {
    path: "/bulk-uploading-staff-customer-mapping",
    element: <BulkStaffCustomerMap />,
  },
  {
    path: "/bulk-uploading-customer-beat-mapping",
    element: <BulkCustomerBeatMap />,
  },
  { path: "/bulk-uploading-customer", element: <BulkCustomer /> },
  { path: "/picture-gallery", element: <ProductGallery /> },
  { path: "/staff/*", element: <Staff /> },
  { path: "/customer", element: <Distributor /> },
  { path: "/customer/add-customer", element: <AddCustomer /> },
  // { path: "/retailer", element: <Retailer /> },
  { path: "/order/*", element: <Order /> },
  { path: "/order/order-details", element: <OrderDetails /> },
  { path: "/payment", element: <Payment /> },
  { path: "/customer-category", element: <CustomerCategory /> },
  { path: "/lead-category", element: <LeadCategory /> },
  { path: "/view-lead", element: <ViewLeadComponent /> },
  { path: "/addnew-customer-category", element: <AddNewCustomerCategory /> },
  { path: "/report/*", element: <Report /> },
  { path: "/custom-report/:id", element: <CustomReport /> },
  { path: "/distributor/product-list", element: <ProductCardView /> },
  { path: "/distributor/product-list/cart", element: <Cart /> },
  { path: "/order/update-order", element: <UpdateOrder /> },
  {
    path: "/distributor/product-list/cart/address/:customer_id",
    element: <Address />,
  },
  { path: "/preferences", element: <Preferences /> },
  { path: "/staff-roles/*", element: <RolesPermission /> },
  { path: "/lead", element: <LeadManagement /> },
  // { path: "/attendance", element: <Attendance /> },
  { path: "/add-lead", element: <AddLeadForm /> },
  { path: "/expense-tracker", element: <ReimbursementTracker /> },
  {
    path: "/expense-tracker/add-expense-head",
    element: <AddExpenseHeadComponent />,
  },
  { path: "/expense-tracker/add-expense", element: <AddExpenseComponent /> },
  {
    path: "/approval-request-tracker",
    element: <ApprovalReimbursementTracker />,
  },
  { path: "/team-activity", element: <TeamActivities /> },
  { path: "/team-activity/details/:id", element: <ActivityDetailLogs /> },
  { path: "/customer-activity", element: <CustomerActivities /> },
  { path: "/product-pricing", element: <AddPricingGroup /> },
  { path: links.PRICING_GROUP_BULK_UPLOAD, element: <BulkUpload /> },
  { path: "/target-setting", element: <Goal /> },
  { path: "/target", element: <IndividualTarget /> },
  { path: "/create-target", element: <CreateTarget /> },
  { path: "/assign-target", element: <AssignTarget /> },
  { path: "/team-targets", element: <TeamTargets /> },
  { path: "beat-list", element: <BeatListNew /> },
  { path: "/beat", element: <BeatList /> },
  { path: "/profile-settings", element: <StaffPreferences /> },
  { path: "/storefront", element: <StoreSettings /> },
  { path: "/customer-type", element: <CustomerType /> },
  { path: "/my-beat-plan", element: <BeatPlanList /> },
  { path: "/beat-plan-details/:beatPlan_id", element: <BeatPlanDetails /> },
  { path: "/beat-plan", element: <ApprovalBeatPlanList /> },
  {
    path: "/staff-beat-plan/:staff_id/:name",
    element: <StaffAllBeatPlanList />,
  },
  { path: "/admin-setting", element: <AdminSetting /> },
  { path: "/setting", element: <SettingsComponent /> },
  { path: "/staff/add-staff", element: <StaffForm /> },
  { path: "/staff/view-details/", element: <ViewStaffDetails /> },
  { path: "/beat-list", element: <IndividualBeatList /> },
  { path: "/custom-form/:identifier", element: <CustomFormCreate /> },
  { path: "/payment-received", element: <PaymentsReceived /> },
  { path: "/order/checkout/:customer_id", element: <CheckoutOrder /> },
  {
    path: "/distributor/product-list/cart/address/create",
    element: <AddAddress />,
  },
];

export default routes;

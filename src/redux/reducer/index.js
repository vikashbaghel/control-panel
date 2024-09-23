import { combineReducers } from "redux";
import {
  authLoginReducer,
  authVarifyOTPReducer,
  contactUsReducer,
  fcmPushNotificationReducer,
  underMaintenanceReducer,
} from "./authReducer";

import {
  deleteOrderReducer,
  dispatchHistoryReducer,
  dispatchOrderReducer,
  lrUpdateOrderReducer,
  orderReducer,
  updateStatusReducer,
} from "./orderReducer";
import {
  paymentActionAddPaymentReducer,
  paymentByIdReducer,
  paymentReducer,
  deletePaymentReducer,
  paymentActionUpdateStatusReducer,
} from "./paymentReducer";
import {
  AddCustomerReducer,
  customerDetailsReducer,
  customerDistributorReducer,
  customerEditReducer,
  customerLevelDistributorSearchReducer,
  deleteCustomerReducer,
  getSearchCategoryMappingAssignReducer,
  getStaffAssignMappingReducer,
  searchStaffAssignReducer,
  customerClientsReducer,
} from "./customerReducer";
import {
  AddStaffReducer,
  getStaffDetailsReducer,
  searchCustomerAssignReducer,
  staffDeleteReducer,
  staffDetailsByIdReducer,
  staffEditReducer,
  staffOrderReducer,
  staffPaymentReducer,
  staffReducer,
  staffListReducer,
  staffCustomerAssignedReducer,
  staffBeatsAssignedReducer,
} from "./staffReducer";

import {
  addProductReducer,
  deleteProductReducer,
  getProductReducer,
  productReducer,
  productViewReducer,
  searchProductReducer,
} from "./productReducer";
import {
  createReportOrderReducer,
  reportOrderReducer,
  supportReportFieldReducer,
} from "./reportOrderReducer";
import {
  createReportPaymentReducer,
  reportPaymentReducer,
} from "./reportPaymentReducer";
import {
  addProductCategoryReducer,
  deleteProductCategoryReducer,
  editProductCategoryReducer,
  productCategoryDetailsReducer,
  productCategoryReducer,
} from "./productCategoryReducer";
import {
  addNewCustomerCategoryReducer,
  customerCategoryReducer,
  editCustomerCategoryReducer,
} from "./customerCategoryReducer";
import { orderViewReducer } from "./orderViewReducer";
import { dashboardOverviewReducer } from "./dashboardOverviewReducer";
import { panReducer } from "./panReducer";
import {
  customerAnalyticsReducer,
  categoryAnalyticsReducer,
  staffAnalyticsReducer,
  productAnalyticsReducer,
  chartAnalyticsReducer,
} from "./analyticsReducer";
import {
  addressDetailReducer,
  addressListReducer,
  submitOrderReducer,
  updateNewAddressReducer,
  updateOldAddressReducer,
  updateOrderReducer,
  whatsappRequiredReducer,
} from "./checkoutReducer";
import {
  bulkNewUploadingReducer,
  bulkUploadingReducer,
} from "./bulkUploadingReducer";
import { distributionDetialReducer } from "./distributorDetailsReducer";
import { orderDetaisGetByIdReducer } from "./orderDetailsGetByIdReducer";
import { paymentGetByIdReducer } from "./getPaymentByIdReducer";
import {
  preferencesReducer,
  staffAddPreferencesReducer,
  staffPreferencesReducer,
} from "./preferencesReducer";

import {
  permissionReducer,
  rolePermissionReducer,
  staffRoleAddReducer,
  staffRoleDeleteReducer,
  staffRoleEditReducer,
} from "./rolePermissionReducer";

import {
  productUnitAddReducer,
  productUnitDeleteReducer,
  productUnitReducer,
} from "./productunitReducer";
import {
  createReportProductReducer,
  reportProductReducer,
} from "./reportProductReducer";
import {
  editStaffProfileDetailsReducer,
  editUserProfileDetailsReducer,
  profileEditReducer,
  profileReducer,
  staffProfileReducer,
  userProfileDetailsReducer,
} from "./profileReducer";
import { gstReducer } from "./gstReducer";
import {
  addLeadCategoryReducer,
  createLeadReducer,
  deleteLeadCategoryReducer,
  deleteLeadReducer,
  leadCategoryDetailsReducer,
  leadCategoryListReducer,
  leadListReducer,
  leadReportReducer,
  mobileNumberCheckReducer,
  searchLeadCategoryListReducer,
  searchLeadListReducer,
  singleLeadDataActionReducer,
  updateLeadCategoryReducer,
  updateLeadReducer,
  updateLeadStatusReducer,
} from "./leadManagementReducer";
import {
  AddReibursementItemReducer,
  AddReimbursementReducer,
  reibursementDeleteReducer,
  reibursementEditReducer,
  reibursementItemDeleteReducer,
  reibursementItemDetailsReducer,
  reibursementItemEditReducer,
  reibursementListReducer,
  reimbursementReducer,
  reimbursementTrackerDetailsReducer,
} from "./reimbursementReducer";
import {
  approvalReimbursementReducer,
  approvalReimbursementStatusReducer,
} from "./approvalReimbursementReducer";
import {
  getStaffActivityReducer,
  getTeamActivityReducer,
  myActivityReducer,
  AddFeedBackAndActivityReducer,
  checkInReducer,
  EditFeedBackAndActivityReducer,
  feedBackAndActivityReducer,
  feedbackActivityByIdReducer,
} from "./feedBackAndActivityReducer";
import {
  addPricingGroupReducer,
  addProductPricingReducer,
  deletePricingGroupReducer,
  editPricingGroupReducer,
  editTelescopicPricingGroupReducer,
  pricingGroupListReducer,
  pricingGroupReducer,
  productPricingListReducer,
  telescopicPricingListReducer,
  updateTelescopicPricingGroupReducer,
} from "./pricingGroupReducer";
import {
  getNotificationReducer,
  updateNotificationReducer,
} from "./pushNotificationReducer";
import {
  deleteAttendanceReducer,
  getAttendanceReducer,
  updateAttendanceReducer,
} from "./attendanceReducer";
import {
  createGoalTemplateReducer,
  customAssignGoalsReducer,
  deleteGoalsReducer,
  getGoalByIdReducer,
  getGoalTemplateReducer,
  getSelfTargetDetailsReducer,
  getUserGoalDetailsReducer,
  searchGoalTemplateReducer,
  updateGoalTemplateReducer,
  updateStaffTargetReducer,
  getSatffGoalReducer,
  getTargetDetailsByIdReducer,
  deleteUserTargetReducer,
  getTeamTargetListReducer,
} from "./goalsReducer";
import {
  AddBeatReducer,
  DeleteBeatReducer,
  EditBeatReducer,
  beatDetailsByBeatPlanIdReducer,
  beatDetailsReducer,
  beatMappingReducer,
  beatReducer,
} from "./beatReducer";
import {
  addCustomerTypeReducer,
  customerTypeReducer,
  deleteCustomerTypeReducer,
  editCustomerTypeReducer,
} from "./customerTypeReducer";
import {
  AddBeatPlanDailyReducer,
  AddBeatPlanReducer,
  activeBeatPlanDetailsReducer,
  approvalBeatPlanDetailsReducer,
  approvalBeatPlanListReducer,
  beatPlanCustomerReducer,
  beatPlanDetailByIdReducer,
  beatPlanDetailsReducer,
  beatPlanEditReducer,
  beatPlanLeadReducer,
  beatPlanReducer,
  beatPlanRootReducer,
  deleteBeatPlanReducer,
  getStaffActiveBeatPlanDetailsReducer,
} from "./beatPlanReducer";

// import {
//   AddFeedBackAndActivityReducer,
//   checkInReducer,
//   EditFeedBackAndActivityReducer,
//   feedBackAndActivityReducer,
//   getStaffActivityReducer,
// } from "./feedBackAndActivityReducer";
import {
  adminListReducer,
  createAdminReducer,
  deleteAdminReducer,
  veifyAdminOTPReducer,
} from "./adminSettingReducer";
import {
  createReportExpenseReducer,
  reportExpenseReducer,
} from "./reportExpenseReducer";
import {
  createReportAttendanceReducer,
  reportAttendanceReducer,
} from "./reportAttendanceReducer";
import {
  createTemplateReducer,
  deleteTemplateReducer,
  getReportTemplateListReducer,
  getReportTemplateReducer,
} from "./reportTemplateReducer";
import { pincodeAutoFillReducer } from "./pincodeAutoFillReducer";
import {
  deleteFollowUpReminderReducer,
  followUpReminderDetailsReducer,
} from "./reminderReducer";
import {
  customActivityListReducer,
  detailCustomActivityReducer,
  createCustomActivityReducer,
  updateCustomActivityReducer,
  deleteCustomActivityReducer,
} from "./customActivityTypeReducer";

const RootReducer = combineReducers({
  authLogin: authLoginReducer,
  authVarifyOTP: authVarifyOTPReducer,
  contactUs: contactUsReducer,
  fcmPushNotification: fcmPushNotificationReducer,
  underMaintenance: underMaintenanceReducer,

  order: orderReducer,
  orderCreate: createReportOrderReducer,
  supportReportField: supportReportFieldReducer,

  payment: paymentReducer,
  paymentRecordCreate: createReportPaymentReducer,
  deletePayment: deletePaymentReducer,

  customerDistributor: customerDistributorReducer,
  getCustomerDetails: customerDetailsReducer,
  addCustomer: AddCustomerReducer,
  editCustomer: customerEditReducer,
  staffAssignMappings: getStaffAssignMappingReducer,
  deleteCustomer: deleteCustomerReducer,
  searchStaffAssign: searchStaffAssignReducer,
  getCustomerLevelSearchList: customerLevelDistributorSearchReducer,
  getCustomerCategorySearchList: getSearchCategoryMappingAssignReducer,
  getCustomerClients: customerClientsReducer,

  staff: staffReducer,
  staffList: staffListReducer,
  staffAdd: AddStaffReducer,
  staffEdit: staffEditReducer,
  staffDelete: staffDeleteReducer,
  staffOrder: staffOrderReducer,
  staffPayment: staffPaymentReducer,
  searchCustomerAssign: searchCustomerAssignReducer,
  staff_details_by_id: staffDetailsByIdReducer,
  staffCustomerAssigned: staffCustomerAssignedReducer,
  staffBeatsAssigned: staffBeatsAssignedReducer,

  product: productReducer,
  productView: productViewReducer,
  searchProduct: searchProductReducer,
  addProduct: addProductReducer,
  deleteProduct: deleteProductReducer,
  getProductCategoryDetails: productCategoryDetailsReducer,
  getDeleteProductCategoryDelete: deleteProductCategoryReducer,

  productCategory: productCategoryReducer,
  editProductCategory: editProductCategoryReducer,
  addProductCategory: addProductCategoryReducer,

  customerCategory: customerCategoryReducer,
  editcustomerCategory: editCustomerCategoryReducer,
  addNewCustomerCategory: addNewCustomerCategoryReducer,

  reportOrder: reportOrderReducer,
  orderView: orderViewReducer,
  updateStatus: updateStatusReducer,

  reportPayment: reportPaymentReducer,
  reportProduct: reportProductReducer,
  createReportProduct: createReportProductReducer,

  reportExpense: reportExpenseReducer,
  createReportExpense: createReportExpenseReducer,

  reportAttendance: reportAttendanceReducer,
  createReportAttendance: createReportAttendanceReducer,

  productView: productViewReducer,
  getProduct: getProductReducer,

  dashboardOverview: dashboardOverviewReducer,

  chart: chartAnalyticsReducer,
  customeranalytics: customerAnalyticsReducer,
  categoryanalytics: categoryAnalyticsReducer,
  staffanalytics: staffAnalyticsReducer,
  productanalytics: productAnalyticsReducer,

  addressList: addressListReducer,
  addressDetail: addressDetailReducer,
  updateNewAddress: updateNewAddressReducer,
  updateOldAddress: updateOldAddressReducer,
  submitOrder: submitOrderReducer,
  whatsappRequired: whatsappRequiredReducer,
  updateOrder: updateOrderReducer,
  dispatchOrder: dispatchOrderReducer,
  dispatchHistory: dispatchHistoryReducer,
  lrUpdateOrder: lrUpdateOrderReducer,
  deleteOrder: deleteOrderReducer,

  bulkUploadingCsv: bulkUploadingReducer,

  panDetails: panReducer,
  disributor_details: distributionDetialReducer,
  order_detail_byid: orderDetaisGetByIdReducer,

  payment_detail_byid: paymentGetByIdReducer,
  paymentById: paymentByIdReducer,
  paymentActionAddPayment: paymentActionAddPaymentReducer,
  paymentActionUpdateStatus: paymentActionUpdateStatusReducer,

  performance: preferencesReducer,
  getStaffPrefernce: staffPreferencesReducer,
  addStaffPrefernce: staffAddPreferencesReducer,

  rolesPermission: rolePermissionReducer,
  permissionList: permissionReducer,
  staffRoleAdd: staffRoleAddReducer,
  staffRoleEdit: staffRoleEditReducer,
  staffRoleDelete: staffRoleDeleteReducer,
  getStaffDetails: getStaffDetailsReducer,

  panDetails: panReducer,

  productUnit: productUnitReducer,
  productUnitAdd: productUnitAddReducer,
  productUnitDelete: productUnitDeleteReducer,

  profile: profileReducer,
  editProfile: profileEditReducer,
  profileDetails: userProfileDetailsReducer,
  editUserProfileDetails: editUserProfileDetailsReducer,
  staffProfileDetails: staffProfileReducer,
  editStaffProfileDetails: editStaffProfileDetailsReducer,

  gst: gstReducer,

  // lead
  leadCategoryList: leadCategoryListReducer,
  searchLeadCategoryList: searchLeadCategoryListReducer,
  addLeadCategory: addLeadCategoryReducer,
  leadCategoryDetails: leadCategoryDetailsReducer,
  updateLeadCategory: updateLeadCategoryReducer,
  deleteLeadCategory: deleteLeadCategoryReducer,
  leadList: leadListReducer,
  searchLeadList: searchLeadListReducer,
  createLead: createLeadReducer,
  updateLead: updateLeadReducer,
  deleteLead: deleteLeadReducer,
  updateLeadStatus: updateLeadStatusReducer,
  mobileNumberCheck: mobileNumberCheckReducer,
  singleLeadDataAction: singleLeadDataActionReducer,
  leadReport: leadReportReducer,

  reibursementTracker: reimbursementReducer,
  addReibursement: AddReimbursementReducer,
  editReibursement: reibursementEditReducer,
  getReibursmentList: reibursementListReducer,
  getReibursementTrackerDetails: reimbursementTrackerDetailsReducer,
  addReibursementItem: AddReibursementItemReducer,
  getReimbursementItemDetails: reibursementItemDetailsReducer,
  getReibursementItemEdit: reibursementItemEditReducer,
  deleteReibursement: reibursementDeleteReducer,
  deleteReibursementItem: reibursementItemDeleteReducer,

  approvalReibursementTracker: approvalReimbursementReducer,
  approvalReimbursementStatus: approvalReimbursementStatusReducer,

  getFeedBackAndActivity: feedBackAndActivityReducer,
  addFeedBackAndActivity: AddFeedBackAndActivityReducer,
  editFeedBackAndActivity: EditFeedBackAndActivityReducer,
  staffFeedBackAndActivity: getStaffActivityReducer,
  getTeamActivity: getTeamActivityReducer,
  getMyActivity: myActivityReducer,
  staffFeedBackAndActivity: getStaffActivityReducer,
  feedbackActivityById: feedbackActivityByIdReducer,
  checkInAction: checkInReducer,

  getPricingGroup: pricingGroupReducer,
  getPricingGroupingList: pricingGroupListReducer,
  addPricingGroup: addPricingGroupReducer,
  addProductPricing: addProductPricingReducer,
  editPricingGroup: editPricingGroupReducer,
  teleScopicPricingList: telescopicPricingListReducer,
  deletePricingGroup: deletePricingGroupReducer,
  editTelescopicGroup: editTelescopicPricingGroupReducer,
  updateTelescopicPricingGroup: updateTelescopicPricingGroupReducer,

  // notifications Reducers
  getNotification: getNotificationReducer,
  updateNotification: updateNotificationReducer,

  // attendance Reducers
  getAttendance: getAttendanceReducer,
  updateAttendance: updateAttendanceReducer,
  deleteAttendance: deleteAttendanceReducer,

  // Goal
  getGoalTemplate: getGoalTemplateReducer,
  getGoalById: getGoalByIdReducer,
  createGoalTemplate: createGoalTemplateReducer,
  updateGoalTemplate: updateGoalTemplateReducer,
  deleteGoals: deleteGoalsReducer,
  customAssignGoals: customAssignGoalsReducer,
  getUserGoalDetails: getUserGoalDetailsReducer,
  getSelfTargetDetails: getSelfTargetDetailsReducer,
  updateStaffTarget: updateStaffTargetReducer,
  searchGoalTemplate: searchGoalTemplateReducer,
  getSatffGoalDetails: getSatffGoalReducer,
  getTargetDetailsById: getTargetDetailsByIdReducer,
  deletedTargetDetails: deleteUserTargetReducer,
  teamTargetList: getTeamTargetListReducer,

  // Beat
  getBeat: beatReducer,
  addBeat: AddBeatReducer,
  editBeat: EditBeatReducer,
  deleteBeat: DeleteBeatReducer,
  getBeatDetails: beatDetailsReducer,
  getBeatMapping: beatMappingReducer,
  getBeatDetailsByBeatPlanId: beatDetailsByBeatPlanIdReducer,

  //customer Type
  getCustomerType: customerTypeReducer,
  addCustomerType: addCustomerTypeReducer,
  editCustomerType: editCustomerTypeReducer,
  deleteCustomerType: deleteCustomerTypeReducer,

  // addBeatPlan
  addBeatPlan: AddBeatPlanReducer,
  AddBeatPlanDaily: AddBeatPlanDailyReducer,
  getBeatPlanRoot: beatPlanRootReducer,
  deleteBeatPlan: deleteBeatPlanReducer,
  getActiveBeatPlanDetails: activeBeatPlanDetailsReducer,
  getBeatPlanDetails: beatPlanDetailsReducer,
  getBeatPlanCustomer: beatPlanCustomerReducer,
  approvalBeatPlanDetails: approvalBeatPlanDetailsReducer,
  getBeatPlanDetailById: beatPlanDetailByIdReducer,
  editBeatPlan: beatPlanEditReducer,
  getStaffActiveBeatPlanDetails: getStaffActiveBeatPlanDetailsReducer,
  getApprovalBeatPlanList: approvalBeatPlanListReducer,

  // admin settings
  createAdmin: createAdminReducer,
  veifyAdminOTP: veifyAdminOTPReducer,
  adminList: adminListReducer,
  deleteAdmin: deleteAdminReducer,

  // bulk upload
  bulkNewUploading: bulkNewUploadingReducer,

  // Reducer for Report Template
  getReportTemplateList: getReportTemplateListReducer,
  getReportTemplate: getReportTemplateReducer,
  createTemplate: createTemplateReducer,
  deleteTemplate: deleteTemplateReducer,

  // City and state Autofill through the pincode
  pincodeAutoFill: pincodeAutoFillReducer,

  // reminder notification
  followUpReminderDetailsReducer,
  deleteFollowUpReminderReducer,

  // Custom Activity Type
  customActivityListReducer,
  detailCustomActivityReducer,
  createCustomActivityReducer,
  updateCustomActivityReducer,
  deleteCustomActivityReducer,
});

export default RootReducer;

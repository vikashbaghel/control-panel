import React, { useEffect, useState } from "react";
import Context from "./Context";
import {
  INITIAL_ATTENDANCE_MODAL,
  INITIAL_CHECKOUT_MODAL,
  INITIAL_DISCARD_MODAL,
  INITIAL_GEO_LOCATION_ACTION,
} from "../generic/contextConstant";

const ContextState = (props) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [reminderIsOpen, setReminderIsOpen] = useState(false);
  const [orderViewOpen, setOrderViewOpen] = useState(false);
  const [productViewOpen, setProductViewOpen] = useState(false);
  const [editAddressViewOpen, setEditAddressViewOpen] = useState(false);
  const [contactUsViewOpen, setContactUsViewOpen] = useState(false);
  const [noteViewOpen, setNoteViewOpen] = useState(false);
  const [distributorData, setDistributorData] = useState("");
  const [cartNumber, setCartNumber] = useState(false);
  const [updateCartQty, setUpdateCartQty] = useState(false);
  const [removingItem, setRemovingItem] = useState(false);
  const [staffViewOpen, setStaffViewOpen] = useState(false);
  const [listDiscount, setListDiscount] = useState([]);
  const [newAddressData, setnewAddressData] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [newStaffData, setNewStaffData] = useState("");
  const [newResponse, setNewResponse] = useState("");
  const [newStaffViewOrder, setNewStaffViewOrder] = useState("");
  const [id, setId] = useState("");
  const [editdistributorOpen, setEditDistributorOpen] = useState(false);
  const [categoryFlag, setCategoryFlag] = useState(false);
  const [editDistributorData, setEditDistributorData] = useState("");
  const [openViewDistributorDetails, setOpenViewDistributorDetails] =
    useState(false);
  const [addreatailer, setAddretailer] = useState(false);
  const [bulkUploadCSVOpen, setBulkUploadCSVOpen] = useState(false);
  const [openDistributorOrder_Payment, setOpenDistributorOrder] =
    useState(false);
  const [tableType, setTableType] = useState("");
  const [editRoles, setEditRoles] = useState("");
  const [productListViewOpen, setProductListViewOpen] = useState(false);
  const [updateOrderList, setupdateOrderList] = useState("");
  const [updateAddress, setUpdateAddress] = useState(false);
  const [isShipmentQtyChange, setIsShipmentQtyChange] = useState(false);
  const [dispatchHistoryViewOpen, setDispatchHistoryViewOpen] = useState(false);
  const [editProductUnitOpen, setEditProductUnitOpen] = useState(false);
  const [editProductUnitValue, setEditProductUnitValue] = useState("");
  const [productCategorySelect, setProductCategorySelect] = useState("");
  const [productCategorySelectOpen, setProductCategorySelectOpen] =
    useState("");
  const [selectFilterValue, setSelectFilterValue] = useState("");
  const [distributorDetails, setDistributorDetails] = useState("");
  const [editRetailerOpen, setEditRetailerOpen] = useState(false);
  const [retailerDetails, setRetailerDetails] = useState("");
  const [distributorOrderViewOpen, setDistributorOrderViewOpen] =
    useState(false);

  const [paymentDetailsOpen, setPaymentDetailsOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState("");
  const [shippedOrderData, setShippedOrderData] = useState("");
  const [editCustomerCategoryOpen, setEditCustomerCategoryOpen] =
    useState(false);
  const [editCustomerCategoryData, setEditCustomerCategoryData] = useState("");
  const [editProductCategoryOpen, setEditProductCategoryOpen] = useState(false);
  const [editProductCategoryData, setEditProductCategoryData] = useState("");
  const [addProductCategoryOpen, setAddProductCategoryOpen] = useState(false);

  const [profileViewUpdateOpen, setProfileViewUpdateOpenOpen] = useState(false);
  const [leadCategoryVieOpen, setLeadCategoryVieOpen] = useState(false);
  const [editLeadCategoryViewOpen, setEditLeadCategoryViewOpen] =
    useState(false);
  const [leadCategoryData, setLeadCategoryData] = useState("");

  const [createReimbursementOpen, setCreateReimbursementOpen] = useState(false);
  const [editReimbursementOpen, setEditReimbursementOpen] = useState(false);
  const [editReimbursementData, setEditReimbursementData] = useState("");
  const [viewReimbursementOpen, setViewReimbursementOpen] = useState(false);

  const [createReimbursementItemOpen, setCreateReimbursementItemOpen] =
    useState(false);
  const [editReimbursementItemOpen, setEditReimbursementItemOpen] =
    useState(false);
  const [editReimbursementItemData, setEditReimbursementItemData] =
    useState("");
  const [viewReimbursementItemOpen, setViewReimbursementItemOpen] =
    useState(false);

  const [approvalReimbursementItemData, setApprovalReimbursementItemData] =
    useState(false);

  const [recordActivityOpen, setRecordActivityOpen] = useState(false);

  const [recordActivityData, setRecordActivityData] = useState("");
  const [recordActivityViewOpen, setRecordActivityViewOpen] = useState(false);
  const [recordLeadActivityData, setRecordLeadActivityData] = useState("");

  const [categorySearchViewOpen, setCategorySearchViewOpen] = useState(false);
  const [searchLeadCategory, setSearchLeadCategory] =
    useState("All Categories");
  const [AttendanceModalOpen, setAttendanceModalOpen] = useState(false);

  const [selectAllColumn, setSelectAllColumn] = useState([]);

  const [createGoalViewOpen, setCreateGoalViewOpen] = useState(false);
  const [updateGoalViewOpen, setUpdateGoalViewOpen] = useState(false);
  const [editStaffTargetAssign, setEditStaffTargetAssign] = useState(false);
  const [targetDetailViewOpen, setTargetDetailViewOpen] = useState(false);
  const [addBeatOpen, setAddBeatOpen] = useState(false);
  const [editBeatOpen, setEditBeatOpen] = useState(false);
  const [editBeatData, setEditBeatData] = useState("");

  const [addCustomerTypeOpen, setAddCustomerTypeOpen] = useState(false);
  const [editCustomerTypeOpen, setEditCustomerTypeOpen] = useState(false);
  const [editCustomerTypeData, setEditCustomerTypeData] = useState("");
  const [productPricingGroupData, setProductPricingGroupData] = useState("");
  const [productPricingGroupEditOpen, setProductPricingGroupEditOpen] =
    useState(false);
  const [productPricingGroupAddOpen, setProductPricingGroupAddOpen] =
    useState(false);
  const [productPricingData, setProductPricingData] = useState("");
  const [addProductPricingOpen, setAddProductPricingOpen] = useState(false);
  const [moduleData, setModuleData] = useState("");
  const [createAdminIsOpen, setCreateAdminIsOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [productData, setProductData] = useState([]);
  const [addBeatPlanOpen, setAddBeatPlanOpen] = useState(false);
  const [addBeatPlanDetailsOpen, setAddBeatPlanDetailsOpen] = useState(false);
  const [beatPlanData, setBeatPlanData] = useState("");
  const [listType, setListType] = useState("");
  const [dateOfRow, setDateOfRow] = useState("");

  const [selectedStaffId, setSelectedStaffId] = useState("");

  // Delete Open State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  // expense submitted Open State
  const [isSubmittedOpen, setIsSubmittedlOpen] = useState(false);

  // for reject reason Modal
  const [showRejectReason, setShowRejectReason] = useState(false);

  // for confirm Approve
  const [isConfirmApproveOpen, setIsConfirmApproveOpen] = useState(false);

  // Report Template id
  const [reportTemplateId, setReportTemplateId] = useState("");

  // for Loader
  const [loading, setLoading] = useState(false);

  // for edit record activity data
  const [editRecordActivityData, setEditRecordActivityData] = useState("");

  //for open distributor drawer
  const [openDistributorDrawer, setOpenDistributorDrawer] = useState(false);

  //  for customer drawer filters
  const [customerDrawerFilters, setCustomerDrawerFilters] = useState({});

  const [deleteModalTitle, setDeleteModalTitle] = useState("");
  // attendance Modal state
  const [attendanceModalAction, setAttendanceModalAction] = useState(
    INITIAL_ATTENDANCE_MODAL
  );

  // for Geo-location fencing
  const [geoLocationAction, setGeoLocationAction] = useState(
    INITIAL_GEO_LOCATION_ACTION
  );
  //for daily sales report used in my activities
  const [salesReportDrawerOpen, setSalesDrawerOpen] = useState({
    open: false,
    id: "",
  });

  // for discard modal
  const [discardModalAction, setDiscardModalAction] = useState(
    INITIAL_DISCARD_MODAL
  );

  // for checkout modal
  const [checkOutModal, setCheckOutModal] = useState(INITIAL_CHECKOUT_MODAL);

  return (
    <Context.Provider
      value={{
        isProfileDropdownOpen,
        setIsProfileDropdownOpen,
        collapsed,
        setCollapsed,
        isNotificationOpen,
        setIsNotificationOpen,
        reminderIsOpen,
        setReminderIsOpen,
        productViewOpen,
        setProductViewOpen,
        distributorData,
        setDistributorData,
        orderViewOpen,
        setOrderViewOpen,
        cartNumber,
        setCartNumber,
        updateCartQty,
        setUpdateCartQty,
        removingItem,
        setRemovingItem,
        staffViewOpen,
        setStaffViewOpen,
        editAddressViewOpen,
        setEditAddressViewOpen,
        newAddressData,
        setnewAddressData,
        noteViewOpen,
        setNoteViewOpen,
        listDiscount,
        setListDiscount,
        totalAmount,
        setTotalAmount,
        contactUsViewOpen,
        setContactUsViewOpen,
        id,
        setId,
        editdistributorOpen,
        setEditDistributorOpen,
        categoryFlag,
        setCategoryFlag,
        editDistributorData,
        setEditDistributorData,
        openViewDistributorDetails,
        setOpenViewDistributorDetails,
        addreatailer,
        setAddretailer,
        setNewStaffData,
        newStaffData,
        newResponse,
        setNewResponse,
        newStaffViewOrder,
        setNewStaffViewOrder,

        bulkUploadCSVOpen,
        setBulkUploadCSVOpen,
        openDistributorOrder_Payment,
        setOpenDistributorOrder,
        tableType,
        setTableType,
        editRoles,
        setEditRoles,
        productListViewOpen,
        setProductListViewOpen,
        updateOrderList,
        setupdateOrderList,
        updateAddress,
        setUpdateAddress,
        isShipmentQtyChange,
        setIsShipmentQtyChange,
        dispatchHistoryViewOpen,
        setDispatchHistoryViewOpen,
        editProductUnitOpen,
        setEditProductUnitOpen,
        editProductUnitValue,
        setEditProductUnitValue,
        productCategorySelect,
        setProductCategorySelect,
        productCategorySelectOpen,
        setProductCategorySelectOpen,
        selectFilterValue,
        setSelectFilterValue,
        setDistributorDetails,
        distributorDetails,
        editRetailerOpen,
        setEditRetailerOpen,
        retailerDetails,
        setRetailerDetails,
        distributorOrderViewOpen,
        setDistributorOrderViewOpen,
        paymentDetailsOpen,
        setPaymentDetailsOpen,
        paymentDetails,
        setPaymentDetails,
        shippedOrderData,
        setShippedOrderData,
        editCustomerCategoryOpen,
        setEditCustomerCategoryOpen,
        editCustomerCategoryData,
        setEditCustomerCategoryData,
        editProductCategoryOpen,
        setEditProductCategoryOpen,
        editProductCategoryData,
        setEditProductCategoryData,
        addProductCategoryOpen,
        setAddProductCategoryOpen,
        profileViewUpdateOpen,
        setProfileViewUpdateOpenOpen,
        leadCategoryVieOpen,
        setLeadCategoryVieOpen,
        editLeadCategoryViewOpen,
        setEditLeadCategoryViewOpen,
        leadCategoryData,
        setLeadCategoryData,
        createReimbursementOpen,
        setCreateReimbursementOpen,
        editReimbursementOpen,
        setEditReimbursementOpen,
        editReimbursementData,
        setEditReimbursementData,
        viewReimbursementOpen,
        setViewReimbursementOpen,
        createReimbursementItemOpen,
        setCreateReimbursementItemOpen,
        editReimbursementItemOpen,
        setEditReimbursementItemOpen,
        editReimbursementItemData,
        setEditReimbursementItemData,
        viewReimbursementItemOpen,
        setViewReimbursementItemOpen,
        approvalReimbursementItemData,
        setApprovalReimbursementItemData,
        recordActivityOpen,
        setRecordActivityOpen,
        recordActivityData,
        setRecordActivityData,
        recordActivityViewOpen,
        setRecordActivityViewOpen,
        recordLeadActivityData,
        setRecordLeadActivityData,

        categorySearchViewOpen,
        setCategorySearchViewOpen,
        searchLeadCategory,
        setSearchLeadCategory,
        productPricingGroupAddOpen,
        setProductPricingGroupAddOpen,
        productPricingGroupData,
        setProductPricingGroupData,
        productPricingGroupEditOpen,
        setProductPricingGroupEditOpen,
        productPricingData,
        setProductPricingData,
        addProductPricingOpen,
        setAddProductPricingOpen,
        AttendanceModalOpen,
        setAttendanceModalOpen,
        selectAllColumn,
        setSelectAllColumn,
        updateGoalViewOpen,
        setUpdateGoalViewOpen,
        createGoalViewOpen,
        setCreateGoalViewOpen,
        targetDetailViewOpen,
        setTargetDetailViewOpen,
        editStaffTargetAssign,
        setEditStaffTargetAssign,
        addBeatOpen,
        setAddBeatOpen,
        editBeatOpen,
        setEditBeatOpen,
        editBeatData,
        setEditBeatData,
        addCustomerTypeOpen,
        setAddCustomerTypeOpen,
        editCustomerTypeOpen,
        setEditCustomerTypeOpen,
        editCustomerTypeData,
        setEditCustomerTypeData,
        productData,
        setProductData,
        moduleData,
        setModuleData,
        addBeatPlanOpen,
        setAddBeatPlanOpen,
        addBeatPlanDetailsOpen,
        setAddBeatPlanDetailsOpen,
        beatPlanData,
        setBeatPlanData,
        listType,
        setListType,
        dateOfRow,
        setDateOfRow,
        selectedStaffId,
        setSelectedStaffId,
        createAdminIsOpen,
        setCreateAdminIsOpen,
        previewOpen,
        setPreviewOpen,
        previewImage,
        setPreviewImage,
        deleteModalOpen,
        setDeleteModalOpen,

        paymentModalOpen,
        setPaymentModalOpen,

        isSubmittedOpen,
        setIsSubmittedlOpen,

        // for reject modal
        showRejectReason,
        setShowRejectReason,

        // for confirm Approve
        isConfirmApproveOpen,
        setIsConfirmApproveOpen,

        // report Template
        reportTemplateId,
        setReportTemplateId,

        // for loader
        loading,
        setLoading,

        //for edit record data
        editRecordActivityData,
        setEditRecordActivityData,

        //for distributor details drawer
        openDistributorDrawer,
        setOpenDistributorDrawer,

        // customer drawer filters
        customerDrawerFilters,
        setCustomerDrawerFilters,

        //delete modal title
        deleteModalTitle,
        setDeleteModalTitle,
        attendanceModalAction,
        setAttendanceModalAction,

        geoLocationAction,
        setGeoLocationAction,
        // sales report drawer
        salesReportDrawerOpen,
        setSalesDrawerOpen,

        // for discard modal
        discardModalAction,
        setDiscardModalAction,

        // for checkout modal
        checkOutModal,
        setCheckOutModal,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default ContextState;

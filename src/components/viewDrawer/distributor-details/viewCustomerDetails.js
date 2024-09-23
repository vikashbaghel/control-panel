import "./drawerstyles.css";
import { Drawer } from "antd";
import Cookies from "universal-cookie";
import styles from "./styles.module.css";
import {
  customerDetails,
  deleteCustomer,
} from "../../../redux/action/customerAction";
import Context from "../../../context/Context";
import { ArrowLeft } from "../../../assets/globle";
import { Order } from "../../../assets/navbarImages";
import CustomerDetailCard from "./customerDetailCard";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import ConfirmDelete from "../../confirmModals/confirmDelete";
import CustomerDownLevelList from "./customerDownLevelList";
import CustomerProfileDetails from "./cutomerProfileDetails";
import { useNavigate } from "react-router-dom";
import ActivityView from "../../../views/distributor/activityView";
import activityIcon from "../../../assets/distributor/activity.svg";
import OrderViewComponent from "../../../views/distributor/orderView";
import TranferPopupConfirmation from "../../../views/distributor/tranferPopup";
import LoaderInPage from "../../loader/LoaderInPage";
import filterService from "../../../services/filter-service";
import CheckIn from "../../../views/distributor/checkIn/checkIn";
import CustomerInsightsView from "./CustomerInsightsView";
import SelectParentCustomerForOrder from "../../../views/distributor/checkIn/SelectParentCustomerForOrder";
import CheckInCustomer from "../../../views/distributor/checkIn";
import InsightsIcon from "../../../assets/insights.svg";

const cookies = new Cookies();

export default function ViewCustomerDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const context = useContext(Context);
  const state = useSelector((state) => state);

  const queryParameters = new URLSearchParams(window.location.search);
  const customerId = queryParameters.get("id");
  const viewDetails = queryParameters.get("view_details");
  const isCustomerClient = queryParameters.get("customer_client");

  const {
    distributorDetails,
    openDistributorDrawer,
    customerDrawerFilters,
    setOpenDistributorDrawer,
    setCustomerDrawerFilters,
    setDeleteModalOpen,
    setDeleteModalTitle,
  } = context;

  const [customerData, setCustomerData] = useState({});
  const [clientDetials, setClientDetails] = useState({});

  // for the customer transfer popup permission
  const [showTranferPopup, setShowTranferPopup] = useState(false);
  const [childCount, setChildCount] = useState();

  const [isLoading, setIsLoading] = useState(false);

  const [checkInModal, setCheckInModal] = useState({
    open: false,
    detail: {},
  });
  const [selectParentModal, setSelectParentModal] = useState({});

  const customerLevelList = cookies.get("rupyzCustomerLevelConfig");
  const filterComponents = {
    insights: <CustomerInsightsView customer={customerData} />,
    order: <OrderViewComponent />,
    activity: <ActivityView customerId={customerData.id} />,
    customer: <CustomerDownLevelList data={customerData} />,
  };

  const handleClose = () => {
    setOpenDistributorDrawer(false);
    setCustomerData({});
    setCustomerDrawerFilters({});
    filterService.setFilters({
      id: "",
      customer_client: "",
      view_details: "",
    });
  };

  useEffect(() => {
    if (customerId && openDistributorDrawer) {
      setIsLoading(true);
      dispatch(customerDetails(customerId));
    }
  }, [customerId, openDistributorDrawer]);

  useEffect(() => {
    const clientDetails = getDownLevelDetails(customerLevelList, customerData);
    setClientDetails(clientDetails);

    if (
      Object.keys(customerData).length === 0 &&
      Object.keys(clientDetials).length === 0
    ) {
      setIsLoading(true);
    } else setIsLoading(false);
  }, [customerData]);

  useEffect(() => {
    if (
      state.disributor_details.data !== "" &&
      !state.disributor_details.data.data.error
    )
      setCustomerData(state.disributor_details.data.data.data);
    if (
      openDistributorDrawer &&
      state.deleteCustomer.data &&
      !state.deleteCustomer.data.data.error
    ) {
      if (!state?.deleteCustomer?.data?.params?.check_children) {
        setDeleteModalOpen(false);
        setOpenDistributorDrawer(false);
        filterService.setFilters({ id: "" });
      } else if (state.deleteCustomer?.data?.data?.data?.is_used) {
        setChildCount(state.deleteCustomer?.data?.data?.data?.child_count);
        setShowTranferPopup(true);
      } else {
        setDeleteModalOpen(true);
        setDeleteModalTitle("Customer");
      }
    }
  }, [state]);

  return (
    <>
      <Drawer
        open={customerId && openDistributorDrawer}
        onClose={handleClose}
        title={
          <div className={styles.back_btn}>
            {(isCustomerClient || viewDetails) && (
              <img
                src={ArrowLeft}
                alt="back"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate(-1);
                }}
              />
            )}
            <div className={styles.title}>
              Customer
              {viewDetails ? " Profile" : " Details"}
            </div>
          </div>
        }
        headerStyle={{ borderBottom: "none", paddingBlockStart: "2em" }}
        width={"550px"}
      >
        {isLoading ? (
          <div
            style={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LoaderInPage />
          </div>
        ) : viewDetails ? (
          <CustomerProfileDetails />
        ) : (
          <div className={styles.customer_details_drawer}>
            <div style={{ paddingInline: "2em" }}>
              <CustomerDetailCard data={customerData} hideActionButton={true} />
              <div style={{ marginTop: 20 }}>
                <CheckInCustomer
                  detail={customerData}
                  // telephoniceOrderCallback={onClose}
                  onCheckOutAction={() => setOpenDistributorDrawer(false)}
                />
              </div>
            </div>
            <div className={styles.more_activities}>
              <p
                className={`${styles.filters} ${
                  customerDrawerFilters?.activeTab === "insights" &&
                  styles.active_filter
                }`}
                onClick={() =>
                  setCustomerDrawerFilters({ activeTab: "insights" })
                }
              >
                <img src={InsightsIcon} alt="insights" />
                Insights
              </p>
              <p
                className={`${styles.filters} ${
                  customerDrawerFilters?.activeTab === "order" &&
                  styles.active_filter
                }`}
                onClick={() => setCustomerDrawerFilters({ activeTab: "order" })}
              >
                <img src={Order} alt="order" />
                Order
              </p>
              <p
                className={`${styles.filters} ${
                  customerDrawerFilters?.activeTab === "activity" &&
                  styles.active_filter
                }`}
                onClick={() =>
                  setCustomerDrawerFilters({ activeTab: "activity" })
                }
              >
                <img src={activityIcon} alt="activity" />
                Activity
              </p>
              {clientDetials?.count > 0 && (
                <p
                  className={`${styles.filters} ${
                    customerDrawerFilters?.activeTab === "customer" &&
                    styles.active_filter
                  }`}
                  onClick={() =>
                    setCustomerDrawerFilters({ activeTab: "customer" })
                  }
                >
                  <img src={activityIcon} alt="activity" />
                  <span>
                    {clientDetials?.count}
                    &nbsp;
                    {clientDetials?.levelName}
                  </span>
                </p>
              )}
            </div>
            <div className={styles.list}>
              {filterComponents[customerDrawerFilters?.activeTab]}
            </div>
          </div>
        )}
        <ConfirmDelete
          title={"Customer"}
          confirmValue={(data) => {
            if (data) {
              dispatch(
                deleteCustomer(distributorDetails?.id, false, {
                  check_children: false,
                })
              );
            }
          }}
        />
        {/* <RecordActivityComponent /> */}
      </Drawer>
      <CheckIn
        {...{ checkInModal, setCheckInModal }}
        onchange={() => {
          setIsLoading(true);
          dispatch(customerDetails(customerId));
        }}
      />
      <TranferPopupConfirmation
        isOpen={showTranferPopup}
        onChange={(e) => {
          setShowTranferPopup(e?.toggle);
        }}
        details={{ ...distributorDetails, childCount }}
      />
      <SelectParentCustomerForOrder
        {...{ selectParentModal, setSelectParentModal }}
      />
    </>
  );
}

export const getDownLevelDetails = (customerLevelList, data) => {
  if (Object.keys(data).length === 0) return {};
  let count = 0;
  if (data?.customer_level === "LEVEL-3") return { count };
  if (data?.customer_level === "LEVEL-1") {
    count = data?.level_2_customer_count;
  }
  if (data?.customer_level === "LEVEL-2") {
    count = data?.level_3_customer_count;
  }
  const levelName =
    customerLevelList[
      "LEVEL-" +
        (Number(data?.customer_level[data?.customer_level?.length - 1]) + 1)
    ];

  return { count, levelName };
};

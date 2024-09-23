import React, { useContext, useState } from "react";
import Cookies from "universal-cookie";
import CheckIn from "./checkIn";
import Context from "../../../context/Context";
import ChooseActivity from "./chooseActivity";
import RecordActivityComponent from "../../../components/activityModal/recordActivity";
import AlreadyCheckInModal from "./alreadyCheckInModal";
import filterService from "../../../services/filter-service";
import cartService from "../../../services/cart-service";
import { useNavigate } from "react-router-dom";
import { preference } from "../../../services/preference-service";
import SelectParentCustomerForOrder from "./SelectParentCustomerForOrder";
import RecordPayment from "../../../components/viewDrawer/recordPayment";

const cookies = new Cookies();

const CheckInCustomer = ({ detail, onCallingOrder, onCheckOutAction }) => {
  const navigate = useNavigate();
  const { setAttendanceModalAction, setCartNumber, setOpenDistributorDrawer } =
    useContext(Context);
  const initialValue = { open: false, detail: {} };
  const [checkInModal, setCheckInModal] = useState(initialValue);
  const [chooseActivityModal, setChooseActivityModal] = useState(initialValue);
  const [editActivityData, setEditActivityData] = useState({});
  const [alreadCheckedModal, setAlreadCheckedModal] = useState(initialValue);

  const isCheckInRequired = preference.get("activity_check_in_required");
  const checkInCustomer = JSON.parse(localStorage.getItem("CheckInCustomer"));
  const [selectParentModal, setSelectParentModal] = useState({});

  const placeOrderWithNewCustomer = async (record) => {
    setAttendanceModalAction({
      open: true,
      handleAction: () => {
        setCartNumber(0);
        cartService.initCart(record);
        navigate(
          `/web/distributor/product-list?id=${record.id}&name=${record.name}`
        );
      },
    });
  };

  const onActivity = (value) => {
    switch (value) {
      case "telephonic_order":
        if (checkInCustomer?.id !== value.id) {
          return setAlreadCheckedModal({ open: true, detail: value });
        } else {
          setSelectParentModal({
            handleAction: (data) => {
              cookies.set("telephonic_order", true, { path: "/" });
              onCallingOrder && onCallingOrder();
              placeOrderWithNewCustomer(data);
            },
            detail,
          });
        }
        break;

      case "check_in":
        if (checkInCustomer?.id !== value.id) {
          return setAlreadCheckedModal({ open: true, detail: value });
        }
        setCheckInModal({
          open: true,
          detail: detail,
        });
        break;

      default:
        setChooseActivityModal({
          open: true,
          detail: detail,
        });
        break;
    }
  };

  const callingCustomerAPI = () => {
    if (window.location.pathname === "/web/customer") {
      filterService.setFilters({ page: "" });
    }
    onCheckOutAction();
  };

  const onCreateNewActivity = (record, value = {}) => {
    setAttendanceModalAction({
      open: true,
      handleAction: () => {
        setEditActivityData({
          module_id: record?.id,
          module_type: "Customer Feedback",
          sub_module_type: value.name,
          sub_module_id: value.id,
        });
      },
    });
  };

  return (
    <div>
      {detail.id !== checkInCustomer?.id && isCheckInRequired ? (
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          {preference.get("activity_allow_telephonic_order") && (
            <button
              className="button_secondary"
              style={{
                width: "100%",
                opacity:
                  checkInCustomer.id && checkInCustomer.id === detail.id
                    ? 0.5
                    : 1,
              }}
              onClick={() => {
                onActivity("telephonic_order");
              }}
              disabled={checkInCustomer.id && checkInCustomer.id === detail.id}
            >
              Telephonic Order
            </button>
          )}
          <button
            className={"button_primary"}
            style={{ width: "100%", borderRadius: 5 }}
            onClick={() => onActivity("check_in")}
          >
            Check In
          </button>
        </div>
      ) : (
        <>
          <button
            className="button_primary"
            style={{ width: "100%", borderRadius: 5 }}
            onClick={() => onActivity("choose_activity")}
          >
            Choose Activity
          </button>
        </>
      )}

      {/* Modal for record activity */}
      <RecordActivityComponent
        {...{ editActivityData }}
        onClose={() => {
          setEditActivityData({});
        }}
        onCheckOut={() => {
          callingCustomerAPI();
          setChooseActivityModal({ open: false, detail: {} });
        }}
      />

      {/* Modal for checkin  */}
      <CheckIn
        {...{ checkInModal, setCheckInModal }}
        onchange={() => callingCustomerAPI()}
      />

      {/* modal for choose activity */}
      <ChooseActivity
        {...{ chooseActivityModal, setChooseActivityModal }}
        onSelectActivityType={(value) => onCreateNewActivity(detail, value)}
        onNewOrderPlace={() => onCallingOrder && onCallingOrder()}
        onCheckOut={() => {
          callingCustomerAPI();
          setChooseActivityModal({ open: false, detail: {} });
        }}
      />

      {/* Modal for Already check in */}
      <AlreadyCheckInModal
        {...{ alreadCheckedModal, setAlreadCheckedModal }}
        onCheckOut={() => {
          callingCustomerAPI();
        }}
      />

      <SelectParentCustomerForOrder
        {...{ selectParentModal, setSelectParentModal }}
      />
    </div>
  );
};

export default CheckInCustomer;

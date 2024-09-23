import { useContext, useEffect, useState } from "react";
import styles from "./chooseActivity.module.css";
import { Col, Modal, notification, Row } from "antd";
import {
  NEW_ORDER,
  NO_ORDER,
  RETURN,
  STOCK_UPDATE,
  PAYMENTS,
  ACTIVITYTYPE,
  CHECK_OUT,
} from "../../../assets/activityIcons";
import Context from "../../../context/Context";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { customActivityList } from "../../../redux/action/customActivitytype";
import { preference } from "../../../services/preference-service";
import cartService from "../../../services/cart-service";
import Permissions from "../../../helpers/permissions";
import SelectParentCustomerForOrder from "./SelectParentCustomerForOrder";
import RecordPayment from "../../../components/viewDrawer/recordPayment";

const ChooseActivity = ({
  chooseActivityModal,
  setChooseActivityModal,
  onSelectActivityType,
  onCheckOut,
  onNewOrderPlace,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { customActivityListReducer } = useSelector((state) => state);
  const { open, detail } = chooseActivityModal;
  let createOrderPermission = Permissions("CREATE_ORDER");
  let createPaymentPermission = Permissions("CREATE_PAYMENT");

  const [selectedActivity, setSelectedActivity] = useState("");
  const [activityList, setActivityList] = useState([]);

  const [selectParentModal, setSelectParentModal] = useState({});

  const { setAttendanceModalAction, setCheckOutModal, setCartNumber } =
    useContext(Context);

  const [recordpaymentview, setRecordPaymentViewOpen] = useState({
    open: false,
    deatil: null,
  });

  const onClose = () => {
    setChooseActivityModal({ open: false, detail: {} });
    setSelectedActivity("");
  };

  const onNewOrder = (data) => {
    setAttendanceModalAction({
      open: true,
      handleAction: () => {
        setCartNumber(0);
        cartService.initCart(data);
        navigate(
          `/web/distributor/product-list?id=${detail.id}&name=${detail.name}`
        );
        onNewOrderPlace && onNewOrderPlace();
      },
    });
  };

  const onPayment = () => {
    setAttendanceModalAction({
      open: true,
      handleAction: () => {
        setRecordPaymentViewOpen({ open: true, detail });
      },
    });
  };

  const disableList = [
    !createPaymentPermission && "PAYMENTS",
    !createOrderPermission && "NEW_ORDER",
    !preference.get("activity_check_in_required") && "CHECK_OUT",
  ];

  const onSelect = (value) => {
    switch (value) {
      case "NEW_ORDER":
        setSelectParentModal({ handleAction: onNewOrder, detail });
        break;
      case "NO_ORDER":
        activityList
          .filter((item) => item.name === "No Order")
          .map((item) => onSelectActivityType(item));
        break;
      case "PAYMENTS":
        onPayment();
        break;
      case "CHECK_OUT":
        setCheckOutModal({
          open: true,
          openConfirm: false,
          handleAction: onClose,
          handleCheckOut: () => {
            onClose();
            onCheckOut();
          },
        });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    dispatch(customActivityList());
    setSelectedActivity("");
  }, []);

  useEffect(() => {
    if (
      customActivityListReducer.data &&
      !customActivityListReducer.data.data.error
    ) {
      setActivityList(customActivityListReducer.data.data.data);
    }
  }, [customActivityListReducer]);

  return (
    <div>
      <Modal
        open={open}
        onCancel={onClose}
        width={700}
        title={<div className={styles.modal_head}>Choose Activity</div>}
        footer={[]}
        centered
        zIndex={1000}
      >
        <div className={styles.modal_body}>
          <Row className={styles.activity_group}>
            {(data || []).map((value, index) => {
              const disabled = disableList.includes(value.value);
              const noOrderShow =
                activityList.filter((ele) => ele.name !== "No Order").length ===
                  activityList.length && index === 1;

              return (
                !noOrderShow && (
                  <>
                    {index === data.length - 1 &&
                      activityList.map((ele, ind) => {
                        return (
                          ele.name !== "No Order" && (
                            <Col
                              key={ind}
                              span={12}
                              style={{
                                cursor: "pointer",
                                borderBottomLeftRadius:
                                  ind === activityList.length - 1 &&
                                  activityList.length % 2 !== 0
                                    ? 10
                                    : 0,
                              }}
                              onClick={() => {
                                onSelectActivityType(ele);
                                setSelectedActivity(ele.id);
                              }}
                              className={
                                selectedActivity === ele.id
                                  ? styles.active_activity
                                  : ""
                              }
                            >
                              <div
                                style={{
                                  display: "flex",
                                  gap: 10,
                                  alignItems: "center",
                                  paddingLeft: 20,
                                  color:
                                    selectedActivity === ele.id && "#312B81",
                                }}
                                className={
                                  selectedActivity === ele.id
                                    ? "theme-fill"
                                    : ""
                                }
                              >
                                <img
                                  src={ACTIVITYTYPE}
                                  alt={ele.name}
                                  width={24}
                                  height={24}
                                />
                                {ele.name}
                              </div>
                            </Col>
                          )
                        );
                      })}
                    <Col
                      key={index}
                      span={
                        index === data.length - 1 &&
                        (data.length + activityList.length) % 2 === 0
                          ? 24
                          : 12
                      }
                      style={{
                        ...GridItemStyle(
                          data.length - 1,
                          (data.length + activityList.length) % 2 === 0
                            ? data.length - 1
                            : null,
                          index
                        ),
                        cursor: !disabled ? "pointer" : "not-allowed",
                      }}
                      onClick={() => {
                        if (!disabled) {
                          onSelect(value.value);
                          setSelectedActivity(value.value);
                        } else if (
                          value.value === "NEW_ORDER" &&
                          !createOrderPermission
                        ) {
                          notification.warning({
                            message:
                              "You don't have permission to create a new order",
                          });
                        }
                      }}
                      className={
                        disabled
                          ? styles.disabled
                          : selectedActivity === value.value
                          ? styles.active_activity
                          : ""
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "center",
                          paddingLeft: 20,
                          color:
                            index === data.length - 1
                              ? "#E10000"
                              : selectedActivity === value.value && "#312B81",
                        }}
                        className={
                          index === data.length - 1
                            ? ""
                            : selectedActivity === value.value
                            ? "theme-fill"
                            : ""
                        }
                      >
                        <img
                          src={value.img}
                          alt={value.value}
                          width={24}
                          height={24}
                        />
                        {value.label}
                      </div>
                    </Col>
                  </>
                )
              );
            })}
          </Row>
        </div>
      </Modal>
      <SelectParentCustomerForOrder
        {...{ selectParentModal, setSelectParentModal }}
      />
      <RecordPayment
        {...{ recordpaymentview, setRecordPaymentViewOpen, onCheckOut }}
      />
    </div>
  );
};

export default ChooseActivity;

const GridItemStyle = (n1, n2, index) => {
  let borderRadiusIndex = [0, 1, n1, n2];
  if (borderRadiusIndex.includes(index)) {
    return {
      borderRadius: [
        ...borderRadiusIndex.map((x, i) => (index === x ? "10px" : "0px")),
      ].join(" "),
    };
  } else return {};
};

const data = [
  {
    img: NEW_ORDER,
    label: "New Order",
    value: "NEW_ORDER",
  },
  {
    img: NO_ORDER,
    label: "No Order",
    value: "NO_ORDER",
  },
  // {
  //   img: RETURN,
  //   label: "Return",
  //   value: "RETURN",
  // },
  // {
  //   img: STOCK_UPDATE,
  //   label: "Stock Update",
  //   value: "STOCK_UPDATE",
  // },
  {
    img: PAYMENTS,
    label: "New Payments",
    value: "PAYMENTS",
  },
  {
    img: CHECK_OUT,
    label: "Check Out",
    value: "CHECK_OUT",
  },
];

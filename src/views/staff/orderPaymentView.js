import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./staff.module.css";
import {
  staffOrderService,
  staffPaymentService,
} from "../../redux/action/staffAction";
import { useState } from "react";
import {
  OrderIcon,
  PaymentIcon,
  BlankPaymentIcon,
  BlankOrderIcon,
} from "../../assets/staffImages/index.js";
import moment from "moment";
import { capitalizeFirst } from "../dashboard";
import { roundToDecimalPlaces } from "../../helpers/roundToDecimal";
import { useNavigate } from "react-router-dom";
import { toIndianCurrency } from "../../helpers/convertCurrency";
import {
  OrderStatusView,
  PaymentStatusView,
} from "../../components/statusView.js";

const OrderPaymentView = () => {
  const queryParameters = new URLSearchParams(window.location.search);
  const id = queryParameters.get("id");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state);
  const [isOrderList, setIsOrderList] = useState(true);
  // state for order list
  const [staffOrderData, setStaffOrderData] = useState([]);
  // state for payment list
  const [staffPaymentData, setStaffPaymentData] = useState([]);

  useEffect(() => {
    if (id) {
      dispatch(staffOrderService(id));
      dispatch(staffPaymentService(id));
    }
  }, []);

  useEffect(() => {
    if (state.staffOrder.data !== "") {
      if (state.staffOrder.data.data.error === false) {
        state.staffOrder.data.data.data.map((ele) => {
          ele.orderBy = ele.created_by.first_name;
          ele.fullName = ele.customer.name;
          ele.created_at = moment(ele.created_at).format("DD-MMM-YYYY");
        });
        setStaffOrderData(state.staffOrder.data.data.data);
      }
    }
    if (state.staffPayment.data !== "") {
      if (state.staffPayment.data.data.error === false) {
        state.staffPayment.data.data.data.map((ele) => {
          ele.fullName = ele.customer.name;
          ele.created_at = moment(ele.created_at).format("DD-MMM-YYYY");
          ele.order_by =
            ele.created_by.first_name + " " + ele.created_by.last_name;
        });
        setStaffPaymentData(state.staffPayment.data.data.data);
      }
    }
  }, [state]);

  return (
    <>
      <div className={styles.order_payment_main}>
        <div className={styles.order_payment_details_header}>
          <div
            className={
              isOrderList
                ? styles.order_details_left_after_click
                : styles.order_details_left
            }
          >
            <img src={OrderIcon} alt="OrderIcon" />
            <p
              onClick={() => {
                setIsOrderList(true);
              }}
            >
              Order/Sales
            </p>
          </div>
          <div
            className={
              isOrderList === false
                ? styles.payment_details_left_after_click
                : styles.payment_details_left
            }
          >
            <img src={PaymentIcon} alt="PaymentIcon" />
            <p
              onClick={() => {
                setIsOrderList(false);
              }}
            >
              Payment
            </p>
          </div>
        </div>
        <div
          // className={styles.order_list_container}
          className={styles.target_box}
        >
          {isOrderList ? (
            <>
              {staffOrderData?.length > 0 ? (
                <div className={styles.order_list_container}>
                  {staffOrderData?.map((data, ind) => {
                    let color =
                      data.delivery_status === "Received"
                        ? "#1D97F5"
                        : data.delivery_status === "Delivered" ||
                          data.delivery_status === "Shipped" ||
                          data.delivery_status === "Partial Shipped"
                        ? "#288948"
                        : data.delivery_status === "Approved" ||
                          data.delivery_status === "Processing" ||
                          data.delivery_status === "Ready to dispatch"
                        ? "#F1A248"
                        : "#F1A248";
                    let backgroundColor =
                      data.delivery_status === "Received"
                        ? "#E5F4FF"
                        : data.delivery_status === "Delivered" ||
                          data.delivery_status === "Shipped" ||
                          data.delivery_status === "Partial Shipped"
                        ? "#E0FFE9"
                        : data.delivery_status === "Approved" ||
                          data.delivery_status === "Processing" ||
                          data.delivery_status === "Ready to dispatch"
                        ? "#FFF3E4"
                        : "#FEF8F1";
                    return ind < 4 ? (
                      <div key={ind} className={styles.order_details_main}>
                        <div className={styles.list_header}>
                          <span>{data?.order_id}</span>
                          <span>{data?.created_at}</span>
                        </div>

                        <div className={styles.list_header}>
                          <span className={styles.order_name}>
                            {capitalizeFirst(data?.fullName)}
                          </span>
                          <span>{data?.payment_option_check}</span>
                        </div>
                        <div className={styles.list_middle}>
                          <span className={styles.order_amount}>
                            {toIndianCurrency(data?.total_amount)}
                          </span>
                          <OrderStatusView status={data?.delivery_status} />
                        </div>
                      </div>
                    ) : (
                      <></>
                    );
                  })}
                  {staffOrderData?.length > 4 && (
                    <p
                      className={styles.view_all}
                      onClick={() => {
                        navigate(`/web/order/order-list?staff_id=${id}`);
                      }}
                    >
                      View All
                    </p>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    padding: "10px 20px",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img src={BlankOrderIcon} alt="Activity" />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "30px",
                      marginBottom: "30px",
                    }}
                  >
                    doesn’t have any Orders
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {staffPaymentData.length > 0 ? (
                <div className={styles.order_list_container}>
                  {staffPaymentData?.map((data, ind) => {
                    return ind < 4 ? (
                      <div key={ind} className={styles.order_details_main}>
                        <div className={styles.list_header}>
                          <span>{data.payment_number}</span>
                          <span>{data.created_at}</span>
                        </div>

                        <div className={styles.list_header}>
                          <span className={styles.order_name}>
                            {capitalizeFirst(data.fullName)}
                          </span>
                          <span className={styles.order_amount}>
                            {toIndianCurrency(data.amount)}
                          </span>
                          {/* <span>{data.payment_option_check.split("_").join(" ")}</span> */}
                        </div>
                        <div className={styles.list_middle}>
                          <span>
                            <p>
                              Payment Mode :{" "}
                              <b style={{ color: "black" }}>
                                {data.payment_mode}
                              </b>
                            </p>
                            <p>
                              Transaction ID :{" "}
                              <b style={{ color: "black" }}>
                                {data.transaction_ref_no}
                              </b>
                            </p>
                          </span>
                          <PaymentStatusView status={data.status} />
                        </div>
                      </div>
                    ) : (
                      <></>
                    );
                  })}
                  {staffPaymentData?.length > 4 && (
                    <p
                      className={styles.view_all}
                      onClick={() => {
                        navigate(`/web/payment/?staff_id=${id}`);
                      }}
                    >
                      View All
                    </p>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    padding: "10px 20px",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "50px",
                    }}
                  >
                    <img src={BlankPaymentIcon} alt="Activity" />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "30px",
                      marginBottom: "30px",
                    }}
                  >
                    doesn’t have any Payments
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderPaymentView;

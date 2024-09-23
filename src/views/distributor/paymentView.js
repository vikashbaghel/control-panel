import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./viewCustomer.module.css";
import { BlankPaymentIcon } from "../../assets/staffImages/index.js";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { paymentActionByIDAction } from "../../redux/action/getPaymentByIdAction";
import { roundToDecimalPlaces } from "../../helpers/roundToDecimal";
import RecordPayment from "../../components/viewDrawer/recordPayment";
import { PaymentStatusView } from "../../components/statusView.js";

const PaymentViewComponent = ({ info }) => {
  const queryParameters = new URLSearchParams(window.location.search);
  const id = queryParameters.get("id");
  const customer_id = queryParameters.get("name");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state);
  const [customerPaymentList, setCustomerPaymentList] = useState([]);

  useEffect(() => {
    dispatch(paymentActionByIDAction(id));
  }, [id]);

  const [recordpaymentview, setRecordPaymentViewOpen] = useState({
    open: false,
    deatil: null,
  });

  useEffect(() => {
    if (state.payment_detail_byid.data !== "") {
      if (state.payment_detail_byid.data.data.error === false)
        setCustomerPaymentList(state.payment_detail_byid.data.data.data);
    }
    if (state.paymentActionAddPayment.data !== "") {
      if (state.paymentActionAddPayment.data.data.error === false) {
        if (state.paymentActionAddPayment.data.status === 200) {
          dispatch(paymentActionByIDAction(id));
          setRecordPaymentViewOpen({ open: true, detail: null });
        }
      }
    }
  }, [state]);

  function removeDuplicates(arr) {
    return [...new Set(arr)];
  }

  const getObjectLength = (obj) => {
    if (obj === undefined || obj === null) {
      return 0;
    }
    return Object.keys(obj).length;
  };

  // lenght function
  const paymentLength = getObjectLength(customerPaymentList);

  return (
    <>
      <div className={styles.payment_main}>
        <div className={styles.activity_details_header}>
          <div style={{ display: "flex", gap: "8px" }}>
            <p>Payment</p>
          </div>
          <div>
            <button
              className="button_secondary"
              style={{ padding: "5px 7px" }}
              onClick={() => {
                setRecordPaymentViewOpen({ open: true, detail: info });
              }}
            >
              Record Payment
            </button>
          </div>
        </div>

        {paymentLength > 0 ? (
          <div className={styles.activity_details_main_box_Wrap}>
            {customerPaymentList &&
              customerPaymentList.slice(0, 3).map((item, index) => {
                return (
                  <div
                    key={index}
                    bordered={false}
                    className={styles.activity_details_main_box}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "0px",
                      }}
                    >
                      <h5
                        style={{
                          margin: "0px",
                          color: "#B7B7B7",
                        }}
                      >
                        {" "}
                        {item.payment_number}
                      </h5>

                      <h5
                        style={{
                          margin: "0px",
                          color: "#B7B7B7",
                        }}
                      >
                        {moment(item.created_at).format("DD MMM YYYY")}
                      </h5>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 0px",
                      }}
                    >
                      <div
                        style={{
                          margin: "0",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        ₹ {roundToDecimalPlaces(item.amount)}
                      </div>
                      <div style={{ margin: "0", fontSize: "10px" }}>
                        {/* {item.payment_option_check.replace(/_/g, ' ')} */}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 0px",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            margin: "0",
                            fontSize: "12px",
                            display: "flex",
                          }}
                        >
                          Entered by :{" "}
                          <div
                            style={{
                              margin: "0",
                              fontSize: "12px",
                              paddingLeft: "5px",
                              fontWeight: "600",
                            }}
                          >
                            {item.created_by.first_name}{" "}
                            {item.created_by.last_name}
                          </div>
                        </div>
                        <div
                          style={{
                            margin: "0",
                            fontSize: "12px",
                            display: "flex",
                          }}
                        >
                          Payment Mode :{" "}
                          <div
                            style={{
                              margin: "0",
                              fontSize: "12px",
                              paddingLeft: "5px",
                              fontWeight: "600",
                            }}
                          >
                            {item.payment_mode}
                          </div>
                        </div>
                        <div
                          style={{
                            margin: "0",
                            fontSize: "12px",
                            display: "flex",
                          }}
                        >
                          Transaction ID :{" "}
                          <div
                            style={{
                              margin: "0",
                              fontSize: "12px",
                              paddingLeft: "5px",
                              fontWeight: "600",
                            }}
                          >
                            {item.transaction_ref_no}
                          </div>
                        </div>
                      </div>
                      <PaymentStatusView status={item.status} />
                    </div>
                  </div>
                );
              })}
            {paymentLength > 3 && (
              <p
                className={styles.view_all}
                onClick={() => {
                  navigate(`/web/payment?customer_id=${id}`);
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
              doesn’t have any Payment
            </div>
          </div>
        )}
        <RecordPayment {...{ recordpaymentview, setRecordPaymentViewOpen }} />
      </div>
    </>
  );
};

export default PaymentViewComponent;

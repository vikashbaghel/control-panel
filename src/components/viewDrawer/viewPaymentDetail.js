import React, { useContext } from "react";
import Context from "../../context/Context";
import { CloseOutlined } from "@ant-design/icons";
import { Drawer } from "antd";
import { toIndianCurrency } from "../../helpers/convertCurrency";
import styles from "../viewDrawer/order.module.css";
import eyeIcon from "../../assets/eye.svg";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import ModalForImagePreview from "../modalForImagePreview/ModalForPreview";

const PaymentView = () => {
  const context = useContext(Context);
  const state = useSelector((state) => state);
  const {
    paymentDetailsOpen,
    setPaymentDetailsOpen,
    paymentDetails,
    setPaymentDetails,
    setPreviewOpen,
    setPreviewImage,
  } = context;

  const onClose = () => {
    setPaymentDetailsOpen(false);
    setPaymentDetails("");
  };

  useEffect(() => {
    if (state.paymentById.data !== "") {
      if (state.paymentById.data.data.error === false) {
        setPaymentDetails(state.paymentById.data.data.data);
      }
    }
  }, [state]);

  return (
    <Drawer
      className="container"
      title={
        <>
          <CloseOutlined onClick={onClose} />
          &nbsp;&nbsp;&nbsp; <span>Payment Details</span>{" "}
        </>
      }
      width={420}
      closable={false}
      onClose={onClose}
      open={paymentDetailsOpen}
      style={{ overflowY: "auto" }}
    >
      {paymentDetails && (
        <div>
          <div style={{ display: "flex" }}>
            <p>Customer Name : </p>
            <p style={{ fontWeight: "600", color: "rgb(8, 134, 210)" }}>
              {" "}
              &nbsp; {paymentDetails.customer.name}
            </p>
          </div>
          <div style={{ display: "flex" }}>
            <p>Date : </p>
            <p style={{ fontWeight: "600" }}>
              {" "}
              &nbsp;{paymentDetails.created_at}
            </p>
          </div>

          <div style={{ display: "flex" }}>
            <p>Payment Amount : </p>
            <p style={{ fontWeight: "600", color: "rgb(49, 43, 129)" }}>
              {" "}
              &nbsp;{toIndianCurrency(paymentDetails.amount)}
            </p>
          </div>
          <div style={{ display: "flex" }}>
            <p>Mode of Payment : </p>
            <p style={{ fontWeight: "600" }}>
              {" "}
              &nbsp;{paymentDetails.payment_mode}
            </p>
          </div>
          <div style={{ display: "flex" }}>
            <p>Transaction Ref : </p>
            <p style={{ fontWeight: "600" }}>
              {" "}
              &nbsp;{paymentDetails.transaction_ref_no}
            </p>
          </div>
          <div style={{ display: "flex" }}>
            <p>Payment Id : </p>
            <p style={{ fontWeight: "600" }}>
              {" "}
              &nbsp;{paymentDetails.payment_number}
            </p>
          </div>
          <div style={{ display: "flex" }}>
            <p>Status : </p>
            <p
              style={
                paymentDetails.status === "Approved"
                  ? { color: "green", fontWeight: "600" }
                  : paymentDetails.status === "Pending"
                  ? { color: "#d4b106", fontWeight: "600" }
                  : paymentDetails.status === "Dishonour"
                  ? { color: "red", fontWeight: "600" }
                  : ""
              }
            >
              &nbsp;
              {paymentDetails.status === "Dishonour"
                ? "Rejected"
                : paymentDetails.status}
            </p>
          </div>
          <div style={{ display: "flex" }}>
            <p>Notes / Comments : </p>
            <div style={{ width: 230, paddingLeft: 10 }}>
              <p
                style={{
                  fontWeight: "600",
                }}
              >
                {" "}
                &nbsp;{paymentDetails.comment}
              </p>
            </div>
          </div>
          {paymentDetails.status === "Dishonour" ? (
            <div style={{ display: "flex" }}>
              <p>Reject Reason : </p>
              <p> &nbsp;{paymentDetails.reject_reason}</p>
            </div>
          ) : (
            ""
          )}
          {/* {paymentDetails.payment_image_url !== "" ? (
              <div style={{ position:'absolute', bottom:'5%', left:'68%' }}>
                <a
                  style={{
                    background: "#1677ff",
                    height: "32px",
                    borderRadius: "6px",
                    width: "80px",
                    paddingLeft: "20px",
                  }}
                  href={paymentDetails.payment_image_url}
                >
                  Download
                </a>
              </div>
            ) : (
              ""
            )} */}
          <div>
            <h5 style={{ color: "#B7B7B7" }}>Photos / Docs</h5>
            <div className={styles.img_view}>
              {paymentDetails &&
                paymentDetails.payment_images_info &&
                paymentDetails.payment_images_info.map((data, index) => {
                  return (
                    <div
                      style={{ position: "relative" }}
                      className={styles.view_img_preview_container}
                    >
                      <div>
                        <img
                          width="88px"
                          height="88px"
                          style={{ margin: "6px 6px 2px 6px" }}
                          src={data.url}
                        />
                      </div>
                      <img
                        width={30}
                        src={eyeIcon}
                        alt="View"
                        className={styles.view_img_preview}
                        onClick={() => {
                          setPreviewOpen(true);
                          setPreviewImage(data.url);
                        }}
                      />{" "}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
      <ModalForImagePreview />
    </Drawer>
  );
};
export default PaymentView;

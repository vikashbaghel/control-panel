import React, { useContext, useEffect, useRef, useState } from "react";
import { ArrowLeft } from "../../../assets/globle";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./checkout.module.css";
import { Form, Input, notification, Select, Space } from "antd";
import FormInput from "../../../components/form-elements/formInput";
import { toIndianCurrency } from "../../../helpers/convertCurrency";
import Cookies from "universal-cookie";
import TextArea from "antd/es/input/TextArea";
import ImageUploader, {
  uploadImage,
} from "../../../components/image-uploader/ImageUploader";
import { Add, Comment, Subtract } from "../../../assets/attendance";
import AddressSection from "./addressSection";
import { useDispatch, useSelector } from "react-redux";
import {
  addressDetail as addressDetailAPI,
  submitOrder,
  updateOrder,
} from "../../../redux/action/checkoutAction";
import { roundToDecimalPlaces } from "../../../helpers/roundToDecimal";
import { getGeoLocationAndAddress } from "../../../services/location-service";
import Context from "../../../context/Context";
import OrderSuccessModal from "./orderSuccessModal";
import { DatePickerInput } from "../../../components/form-elements/datePickerInput";
import formService from "../../../services/form-service";

const constants = {
  formId: "CHECKOUT_FORM",
};

const paymentOptions = [
  {
    value: "FULL_ADVANCE",
    label: "Full Payment in Advance",
  },
  {
    value: "PARTIAL_ADVANCE",
    label: "Partial Payment",
  },
  {
    value: "PAY_ON_DELIVERY",
    label: "Payment on Delivery",
  },
  {
    value: "PAYMENT_ON_NEXT_ORDER",
    label: "Payment On Next Order",
  },
  {
    value: "CREDIT_DAYS",
    label: "Credit Days",
  },
];

const paymentModeOptions = [
  {
    value: "Cash",
    label: "Cash",
  },
  { value: "Cheque / DD", label: "Cheque / DD" },
  { value: "Net Banking", label: "Net Banking" },
  { value: "UPI", label: "UPI" },
  { value: "Debit / Credit Card", label: "Debit / Credit Card" },
  { value: "third_party", label: "Third-Party" },
  { value: "other", label: "Other" },
];

const cookies = new Cookies();

const CheckoutOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [form] = Form.useForm();
  const { setLoading } = useContext(Context);

  const { addressDetail } = useSelector((state) => state);

  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentOption, setPaymentOption] = useState("");
  const [openSuccessWindow, setOpenSuccessWindow] = useState({
    open: false,
    handleAction: null,
  });

  let { cartDetails, cartData, totalAmount } = JSON.parse(
    localStorage.getItem("payment-details") || "{}"
  );
  let { distributor, discountList, otherChargesList } = cartDetails || {};
  let customer_id = (distributor || {})["id"];

  //check if user tries to checkout for different distributor
  if (parseInt(customer_id) !== parseInt(params.customer_id || 0)) {
    navigate("/web/distributor/product-list/cart");
  }

  //order details for edit order
  let { orderDetail, orderId } = {
    orderDetail: {},
    orderId: "",
    ...cartDetails,
  };

  let formInstanceId = `${customer_id}-${orderId || "CREATE"}`;

  function paymentAgainstOrder(order) {
    return {
      purchase_order_number: order.purchase_order_number || "",
      payment_option_check: order.payment_option_check || "",
      order_images: order.order_images_info || [],
      expected_delivery_date: order.expected_delivery_date || "",
      comment: order.comment || "",
      admin_comment: order.admin_comment || "",
      amount: order.amount || "",
      payment_mode: order.payment_details?.payment_mode || "",
      transaction_ref_no: order.payment_details?.transaction_ref_no || "",
      payment_amount: order.payment_details?.amount || "",
      remaining_payment_days: order.remaining_payment_days || "",
    };
  }

  const appendFields = {
    FULL_ADVANCE: (
      <>
        <Form.Item label="Payment Amount" name="amount">
          <Input readOnly />
        </Form.Item>
        <Form.Item
          label="Payment Mode"
          name="payment_mode"
          rules={[{ required: true }]}
        >
          <Select options={paymentModeOptions} />
        </Form.Item>
        <Form.Item label="Transaction Ref.No" name="transaction_ref_no">
          <Input placeholder="Enter Transaction Ref.No" maxLength={25} />
        </Form.Item>
      </>
    ),
    PARTIAL_ADVANCE: (
      <>
        <Form.Item
          label={
            <>
              <span>Payment Amount&nbsp;&nbsp;</span>
              <span style={{ color: "green", fontSize: 10 }}>
                (Total amount : {toIndianCurrency(totalAmount)})
              </span>
            </>
          }
          name="payment_amount"
          rules={[{ required: true }]}
        >
          <FormInput type="num" params={{ placeholder: "₹" }} />
        </Form.Item>
        <Form.Item
          label="Payment Mode"
          name="payment_mode"
          rules={[{ required: true }]}
        >
          <Select options={paymentModeOptions} />
        </Form.Item>
        <Form.Item label="Transaction Ref.No" name="transaction_ref_no">
          <Input placeholder="Enter Transaction Ref.No" maxLength={25} />
        </Form.Item>
        <Form.Item
          label="Remaining Payment After"
          name="remaining_payment_days"
          rules={[{ required: true }]}
        >
          <FormInput
            type="num"
            params={{ placeholder: "Enter", addonAfter: "Days" }}
          />
        </Form.Item>
      </>
    ),
    CREDIT_DAYS: (
      <>
        <Form.Item
          label="Remaining Payment After"
          name="remaining_payment_days"
          rules={[{ required: true }]}
        >
          <FormInput
            type="num"
            params={{
              placeholder: "Enter",
              addonAfter: "Days",
            }}
            required
          />
        </Form.Item>
      </>
    ),
  };

  const onFinish = (formData) => {
    setLoading(true);
    formData = {
      ...formData,
      customer_id: parseInt(customer_id),
      address: selectedAddress.id,
      items: cartData || [],
      discount_details: (discountList || []).map((data) => ({
        name: data.name,
        value: roundToDecimalPlaces(data.value),
        type: data.type,
      })),
      charges_details: otherChargesList,
      ref_image: 2,
      amount: roundToDecimalPlaces(totalAmount),
      is_telephonic_order:
        cookies.get("telephonic_order") === "true" ? true : false,
    };
    if (formData?.payment_option_check === "FULL_ADVANCE")
      formData = {
        ...formData,
        payment_amount: roundToDecimalPlaces(totalAmount),
      };
    else if (formData?.payment_option_check === "PARTIAL_ADVANCE")
      formData = {
        ...formData,
        payment_amount: roundToDecimalPlaces(formData.payment_amount),
      };

    if (cookies.get("rupyzLocationEnable") === "true") {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          getGeoLocationAndAddress()
            .then((response) => {
              apiCallingForOrderSubmit({
                ...formData,
                geo_location_lat: response.lat,
                geo_location_long: response.lng,
                geo_address: response.address,
                location_permission: true,
              });
            })
            .catch((error) => {
              setLoading(false);
            });
          return;
        }
        setLoading(false);
        openNotification(
          { ...formData, location_permission: false },
          apiCallingForOrderSubmit
        );
      });
      return;
    }
    apiCallingForOrderSubmit({ ...formData, location_permission: false });
  };

  const apiCallingForOrderSubmit = async (formData) => {
    setLoading(true);
    let prevImages = formData.order_images
      ?.filter((ele) => ele.id)
      .map((ele) => ele.id);
    let newImages = formData.order_images?.filter((ele) => !ele.id);
    let result = [];
    if (formData.order_images && newImages?.length > 0) {
      result = await uploadImage(newImages)
        .then((res) => res)
        .catch((error) => setLoading(false));
    }
    const response = orderId
      ? await updateOrder(
          {
            ...formData,
            order_images: [...(prevImages || []), ...result],
            fullfilled_by_id:
              JSON.parse(localStorage.getItem("cart-details") || {})
                ?.orderDetail?.fullfilled_by_id || 0,
          },
          orderId
        )
      : await submitOrder({
          ...formData,
          fullfilled_by_id:
            JSON.parse(localStorage.getItem("cart-details") || {})?.distributor
              ?.parent_id || 0,
          order_images: [...(prevImages || []), ...result],
        });
    if (response && response.status === 200) {
      setLoading(false);
      setOpenSuccessWindow({
        open: true,
        handleAction: () => {
          formService.setFormValues(constants.formId, formInstanceId, {});
          form.resetFields();
        },
      });
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(addressDetailAPI(customer_id, orderDetail?.address?.id));
    const initialValues = {
      ...(orderId ? paymentAgainstOrder(orderDetail) : {}), //in case of edit order
      ...(formService.getFormState(constants.formId, formInstanceId).values ||
        {}),
    };
    //setup payment option form
    switch (distributor?.payment_term) {
      case "Advance":
        setPaymentOption("FULL_ADVANCE");
        form.setFieldsValue({ payment_option_check: "FULL_ADVANCE" });
        break;
      case "Payment On Next Order":
        setPaymentOption("PAYMENT_ON_NEXT_ORDER");
        form.setFieldsValue({ payment_option_check: "PAYMENT_ON_NEXT_ORDER" });
        break;
      case "Payment On Delivery":
        setPaymentOption("PAY_ON_DELIVERY");
        form.setFieldsValue({ payment_option_check: "PAY_ON_DELIVERY" });
        break;
      case "7 Days":
      case "10 Days":
      case "15 Days":
      case "21 Days":
      case "30 Days":
      case "45 Days":
      case "60 Days":
      case "75 Days":
      case "90 Days":
        setPaymentOption("CREDIT_DAYS");
        form.setFieldsValue({
          payment_option_check: "CREDIT_DAYS",
        });
    }
    if (initialValues?.payment_option_check) {
      form.setFieldsValue(initialValues);
      setPaymentOption(initialValues.payment_option_check);
    }
  }, []);

  useEffect(() => {
    if (addressDetail.data && addressDetail.data.data.error === false) {
      setSelectedAddress(addressDetail.data.data.data);
    }
  }, [addressDetail]);

  useEffect(() => {
    form.setFieldValue("amount", totalAmount);
  }, [totalAmount]);

  return (
    <div style={{ fontFamily: "Poppins" }}>
      <h4
        className="page_title"
        style={{
          display: "flex",
          alignContent: "center",
          fontSize: 20,
          gap: 10,
        }}
      >
        <img
          src={ArrowLeft}
          alt="arrow"
          onClick={() => navigate(-1)}
          style={{ cursor: "pointer" }}
        />
        Checkout
      </h4>
      <div className={styles.main_container}>
        <Form
          form={form}
          className={styles.order_summary_container}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={(label, info) => (
            <div>
              {label} {info.required && <span style={{ color: "red" }}>*</span>}
            </div>
          )}
          validateMessages={{
            required: "${label} is required.",
          }}
          onValuesChange={(_, values) => {
            formService.setFormValues(constants.formId, formInstanceId, values);
          }}
        >
          <div className={styles.conatiner_head}>Order Summary</div>
          <div className={styles.section}>
            <Form.Item
              label="Purchase Order (PO) Number"
              name="purchase_order_number"
            >
              <Input
                placeholder="Enter Purchase Order (PO) Number"
                style={{
                  height: 45,
                  padding: "5px !important",
                  borderWidth: 2,
                }}
              />
            </Form.Item>
          </div>
          <div className={styles.section}>
            <div className={styles.section_head}>Payment Against Order</div>
            <Form.Item
              label="Payment Options"
              name={"payment_option_check"}
              rules={[{ required: true }]}
            >
              <Select
                options={paymentOptions}
                placeholder="Select Payment Option"
                allowClear
                onChange={(v) => setPaymentOption(v)}
              />
            </Form.Item>
            {paymentOption && appendFields[paymentOption]}
          </div>
          <div className={styles.section}>
            <Form.Item label="Order Attachments (max 6)" name="order_images">
              <ImageUploader
                maxCount={6}
                message="Attachments above 5MB will be compressed dynamically"
                accept=".jpeg,.png,.jpg,.pdf"
              />
            </Form.Item>
          </div>
          <div className={styles.section}>
            <Form.Item
              label="Expected Delivery Date"
              name="expected_delivery_date"
            >
              <DatePickerInput
                format={"YYYY-MM-DD"}
                params={{ style: { width: "100%", padding: "10px" } }}
              />
            </Form.Item>
            <div style={{ marginBottom: 10 }}>Comments</div>
            <CommentContainer label="General Comment" name="comment" />
            <br />
            <CommentContainer label="Comment for Admin" name="admin_comment" />
            <br />
          </div>
        </Form>
        <AddressSection
          onFinish={() => form.submit()}
          {...{ selectedAddress, customer_id }}
        />
      </div>
      <OrderSuccessModal
        {...{ openSuccessWindow, setOpenSuccessWindow, orderId, customer_id }}
      />
    </div>
  );
};

export default CheckoutOrder;

const CommentContainer = ({ label, name }) => {
  const [showOption, setShowOption] = useState(false);

  const node = useRef();
  const handleDomClick = (e) => {
    if (!node.current?.contains(e.target)) {
      setShowOption(false);
    }
  };

  useEffect(() => {
    if (showOption) document.addEventListener("click", handleDomClick);
    return () => {
      document.removeEventListener("click", handleDomClick);
    };
  }, [showOption]);

  return (
    <div
      style={{ borderBottom: "2px dashed #ddd", paddingBottom: 5 }}
      ref={node}
    >
      <div className={styles.modal_label_container}>
        <span>
          <img src={Comment} alt="comment" /> {label} 💬
        </span>
        <span
          onClick={() => setShowOption(!showOption)}
          style={{ cursor: "pointer" }}
        >
          {showOption ? (
            <img src={Subtract} alt="add" />
          ) : (
            <img src={Add} alt="add" />
          )}
        </span>
      </div>
      <div
        style={{
          overflow: "hidden",
          height: showOption ? 100 : 0,
          transition: "height 0.4s ease-in-out",
        }}
      >
        <Form.Item label="" name={`${name}`}>
          <TextArea rows={3} placeholder={`Enter ${label}`} />
        </Form.Item>
      </div>
    </div>
  );
};

const openNotification = (v, apiCallingForOrderSubmit) => {
  const key = `open${Date.now()}`;
  const btn = (
    <Space>
      <button
        className="button_primary"
        onClick={() => {
          notification.destroy();
        }}
      >
        OK
      </button>
      <button
        className="button_secondary"
        onClick={() => {
          notification.destroy(key);
          apiCallingForOrderSubmit(v);
        }}
      >
        Continue without Location
      </button>
    </Space>
  );
  notification.open({
    message:
      "Location access is Blocked. Change your location settings in browser",
    btn,
    key,
  });
};

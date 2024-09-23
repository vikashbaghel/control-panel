// https://team-1624359381274.atlassian.net/wiki/spaces/RUPYZ/pages/edit-v2/180748290#Payment-Form-(Add)

import { useContext, useState } from "react";
import Context from "../../context/Context";
import { notification, Space, Modal, Form, Input, Select, Button } from "antd";
import { paymentActionAddPayment } from "../../redux/action/paymentAction";
import Cookies from "universal-cookie";
import { useEffect } from "react";
import { decimalInputValidation } from "../../helpers/regex";
import FormInput from "../form-elements/formInput";
import TextArea from "antd/es/input/TextArea";
import ImageUploader, { uploadImage } from "../image-uploader/ImageUploader";
import { DatePickerInput } from "../form-elements/datePickerInput";
import { getGeoLocationAndAddress } from "../../services/location-service";

const RecordPayment = ({
  recordpaymentview,
  setRecordPaymentViewOpen,
  onCheckOut,
}) => {
  const { open, detail } = recordpaymentview;

  const context = useContext(Context);
  const cookies = new Cookies();

  const { setGeoLocationAction, setLoading, setCheckOutModal } = context;
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      customer: detail?.name?.toUpperCase(),
    });
  }, [detail]);

  useEffect(() => {
    if (recordpaymentview) {
      setGeoLocationAction({
        open: true,
        handleAction: onClose,
        customer_id: detail?.id,
      });
    }
  }, [recordpaymentview]);

  const onClose = () => {
    form.resetFields();
    setIsLoading(false);
    setRecordPaymentViewOpen({ open: false, detail: null });
  };

  const handleUploadSubmit = async (formData) => {
    formData = {
      ...formData,
      customer_id: detail.id,
    };

    if (formData.payment_images && formData.payment_images?.length > 0) {
      const result = await uploadImage(formData.payment_images);
      if (result.length > 0) {
        formData = { ...formData, payment_images: result };
      } else setLoading(false);
    } else formData = { ...formData, payment_images: [] };

    // sending form values to the api
    const response = await paymentActionAddPayment(formData);
    if (response && response.status === 200) {
      setIsLoading(false);
      setCheckOutModal({
        open: true,
        handleAction: onClose,
        handleCheckOut: () => {
          onClose();
          onCheckOut();
        },
      });
    } else setIsLoading(false);
  };

  const handleSubmit = async () => {
    let formData = form.getFieldsValue();
    if (isLoading) return;
    setIsLoading(true);
    if (cookies.get("rupyzLocationEnable") === "true") {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          getGeoLocationAndAddress()
            .then((response) => {
              handleUploadSubmit({
                ...formData,
                geo_location_lat: response.lat,
                geo_location_long: response.lng,
                geo_address: response.address,
                location_permission: true,
              });
            })
            .catch((error) => console.log(error));
          return;
        }
        openNotification({ ...formData, location_permission: false });
        // Don't do anything if the permission was denied.
      });
      return;
    }

    handleUploadSubmit({ ...formData, location_permission: false });
  };

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (v) => {
    const key = `open${Date.now()}`;
    const btn = (
      <Space>
        <button
          className="button_primary"
          onClick={() => {
            setIsLoading(false);
            api.destroy();
          }}
        >
          OK
        </button>
        <button
          className="button_secondary"
          onClick={() => {
            api.destroy(key);
            handleUploadSubmit(v);
          }}
        >
          Continue without Location
        </button>
      </Space>
    );
    api.open({
      message:
        "Location access is Blocked. Change your location settings in browser",
      btn,
      key,
      onClose: () => {
        setIsLoading(false);
      },
    });
  };

  return (
    <>
      {detail && (
        <Modal
          className="container"
          title={
            <div
              style={{
                padding: 15,
                textAlign: "center",
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              Record Payment
            </div>
          }
          width={650}
          onCancel={onClose}
          open={open}
          centered
          footer={null}
          zIndex={1001}
        >
          {contextHolder}
          <Form
            form={form}
            colon={false}
            layout="vertical"
            onFinish={handleSubmit}
            scrollToFirstError={true}
            requiredMark={(label, info) => (
              <div>
                {label}{" "}
                {info.required && <span style={{ color: "red" }}>*</span>}
              </div>
            )}
            validateMessages={{
              required: "${label} is required.",
            }}
          >
            <div style={{ padding: "20px" }}>
              <Form.Item label="Name" name="customer">
                <Input readOnly />
              </Form.Item>
              <Form.Item
                label="Amount"
                name="amount"
                required
                rules={[{ required: true }]}
              >
                <Input
                  placeholder="Amount"
                  maxLength={9}
                  onKeyPress={decimalInputValidation}
                />
              </Form.Item>

              <Form.Item
                label="Mode of Payment"
                name="payment_mode"
                required
                rules={[{ required: true }]}
              >
                <Select placeholder="Select Mode" options={paymentOptionList} />
              </Form.Item>
              <Form.Item label="Transaction ID" name="transaction_ref_no">
                <FormInput params={{ placeholder: "Transation ID" }} />
              </Form.Item>
              <Form.Item label="Transaction Date" name="transaction_timestamp">
                <DatePickerInput
                  format={"YYYY-MM-DD"}
                  params={{ style: { width: "100%", padding: "10px" } }}
                />
              </Form.Item>
              <Form.Item label="Comments" name="comment">
                <TextArea placeholder="comments" rows={5} />
              </Form.Item>
              <Form.Item
                label={
                  <>
                    Upload Photos/Docs{" "}
                    <span style={{ fontSize: 12, color: "#919191" }}>
                      (You can upload upto 6 files)
                    </span>
                  </>
                }
                name="payment_images"
              >
                <ImageUploader accept={".jpeg,.png,.jpg,.pdf"} maxCount={6} />
              </Form.Item>
            </div>

            <div
              style={{
                display: "flex",
                background: "#fff",
                padding: 15,
                justifyContent: "flex-end",
                borderRadius: "0 0 10px 10px",
              }}
            >
              <button
                className="button_secondary"
                style={{ paddingBlock: 0, marginRight: 20 }}
                onClick={onClose}
              >
                Cancel
              </button>
              <Button
                className="button_primary"
                htmlType="submit"
                loading={isLoading}
              >
                Save
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </>
  );
};
export default RecordPayment;

const paymentOptionList = [
  {
    value: "Cash",
    label: "Cash",
  },
  {
    value: "Cheque/DD",
    label: "Cheque / DD",
  },
  {
    value: "Net Banking",
    label: "Net Banking",
  },
  {
    value: "UPI",
    label: "UPI",
  },
  {
    value: "Debit / Credit Card",
    label: "Debit / Credit Card",
  },
  {
    value: "Third-Party",
    label: "Third-Party",
  },
  {
    value: "Other",
    label: "Other",
  },
];

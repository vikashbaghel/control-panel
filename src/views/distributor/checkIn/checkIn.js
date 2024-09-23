import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Modal, notification, Space } from "antd";
import { MapPin } from "../../../assets";
import ImageUploader, {
  uploadImage,
} from "../../../components/image-uploader/ImageUploader";
import Context from "../../../context/Context";
import Cookies from "universal-cookie";
import { customerCheckInCheckOut } from "../../../redux/action/customerCheckInCheckOut";
import { getGeoLocationAndAddress } from "../../../services/location-service";
import { preference } from "../../../services/preference-service";
import WrapText from "../../../components/wrapText";

const CheckIn = ({ checkInModal, setCheckInModal, onchange }) => {
  const cookies = new Cookies();
  const [form] = Form.useForm();
  const { open, detail } = checkInModal;

  const { setGeoLocationAction } = useContext(Context);
  const [loading, setLoading] = useState(false);

  const onClose = () => {
    form.resetFields();
    setCheckInModal({ open: false, detail: {} });
  };

  const callingCheckInAPI = async (value) => {
    setLoading(true);

    await customerCheckInCheckOut
      .checkIn(value)
      .then((res) => {
        if (!res.error) {
          localStorage.setItem("CheckInCustomer", JSON.stringify(detail));
          onchange();
        }
        setLoading(false);
        onClose();
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const handleSubmit = async (value) => {
    setLoading(true);
    const res = await uploadImage(value.img || []);
    const formValue = { customer_id: detail.id, images: res };
    if (cookies.get("rupyzLocationEnable") === "true") {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          getGeoLocationAndAddress()
            .then((response) => {
              callingCheckInAPI({
                ...formValue,
                geo_location_lat: response.lat,
                geo_location_long: response.lng,
                geo_address: response.address,
              });
            })
            .catch((error) => console.log(error));
          return;
        }
        openNotification(formValue);
      });
      return;
    }
    callingCheckInAPI(formValue);
  };

  const openNotification = (values) => {
    const key = `open${Date.now()}`;
    const btn = (
      <Space>
        <button
          className="button_primary"
          onClick={() => {
            notification.destroy(key);
          }}
        >
          OK
        </button>
        <button
          className="button_secondary"
          onClick={() => {
            notification.destroy(key);
            callingCheckInAPI(values);
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
      onClose: () => setLoading(false),
    });
  };

  useEffect(() => {
    if (open) {
      cookies.set("telephonic_order", false, { path: "/" });
      setGeoLocationAction({
        open: true,
        handleAction: onClose,
        customer_id: detail.id,
      });
    }
  }, [open]);

  return (
    <div>
      <Modal
        open={open}
        onCancel={onClose}
        centered
        width={600}
        title={
          <div
            style={{
              padding: 10,
              textAlign: "center",
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            Check In
          </div>
        }
        footer={
          <div
            style={{
              display: "flex",
              background: "#fff",
              padding: 15,
              justifyContent: "flex-end",
              borderRadius: "0 0 10px 10px",
            }}
          >
            <Button
              data-testid="submitButton"
              loading={loading}
              className="button_primary"
              onClick={() => {
                if (preference.get("activity_check_in_show_image_input")) {
                  form.submit();
                } else {
                  handleSubmit({});
                }
              }}
            >
              Submit
            </Button>
          </div>
        }
        style={{ fontFamily: "Poppins" }}
      >
        <div>
          <div
            style={{
              margin: 20,
              borderRadius: "10px",
              border: "2px solid #FFF",
              background: "#F4F4F4",
              padding: " 20px",
            }}
          >
            <h2
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontWeight: 600,
                margin: 0,
                fontSize: 18,
                marginBottom: 5,
              }}
            >
              <img src={MapPin} alt="map" />
              <WrapText width={500}>{detail.name}</WrapText>
            </h2>
            <div
              style={{
                marginLeft: 30,
                color: "#727176",
                display: "flex",
                gap: 5,
              }}
            >
              Do you want to check in at :{" "}
              <WrapText width={200}>{detail.name}</WrapText>
            </div>
            <div
              style={{
                marginLeft: 30,
                fontSize: 12,
                marginTop: 10,
                fontWeight: 600,
              }}
            >
              <span style={{ color: "red" }}>* </span>You won't be able to check
              out from a customer if no activity is performed.
            </div>
          </div>

          {preference.get("activity_check_in_show_image_input") && (
            <div style={{ borderTop: "2px solid #fff" }}>
              <Form
                form={form}
                style={{ margin: "10px 20px 0 20px" }}
                onFinish={handleSubmit}
                validateMessages={{
                  required: "Image is required.",
                }}
              >
                <Form.Item
                  label=""
                  name="img"
                  rules={[
                    {
                      required: preference.get(
                        "activity_check_in_image_required"
                      ),
                    },
                  ]}
                >
                  <ImageUploader
                    message={
                      <>
                        Take a Photo of the store before checking In{" "}
                        {preference.get("activity_check_in_image_required") ? (
                          <span style={{ color: "red" }}>*</span>
                        ) : (
                          ""
                        )}
                      </>
                    }
                    maxCount={6}
                  />
                </Form.Item>
              </Form>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default CheckIn;

// https://team-1624359381274.atlassian.net/wiki/spaces/RUPYZ/pages/edit-v2/180748290#LEAD-Form-(Add/Edit)s

import React, { useContext, useEffect } from "react";
import styles from "./lead.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, WhatsAppIcon } from "../../assets/globle";
import { useDispatch, useSelector } from "react-redux";
import { preferencesAction } from "../../redux/action/preferencesAction";
import Cookies from "universal-cookie";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Spin,
  Input,
  Modal,
  Space,
  notification,
} from "antd";
import {
  leadCategoryAction,
  mobileNumberCheck,
  singleLeadDataAction,
  updateLead,
} from "../../redux/action/leadManagementAction";
import AddLeadCategoryComponent from "../settings/addLeadCategory";
import GoogleMaps from "../../components/googleModal/googleMap";
import ImageUploader, {
  uploadImage,
} from "../../components/image-uploader/ImageUploader";
import moment from "moment";
import { getDetailsFromPincode } from "../../redux/action/pincodeAutoFill";
import FormInput from "../../components/form-elements/formInput";
import SelectLeadCategory from "./selectLeadCategory";
import dayjs from "dayjs";
import { regex } from "../../components/form-elements/regex";
import StateSelectSearch from "../../components/selectSearch/stateSelectSearch";
import BackConfirmationModal from "../../components/back-confirmation/BackConfirmationModal";
import Context from "../../context/Context";
import { getGeoLocationAndAddress } from "../../services/location-service";

const AddLeadForm = () => {
  const dateFormat = "YYYY-MM-DD";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { mobileNumberCheck: isNumberUsed } = state;
  const cookies = new Cookies();
  const queryParameters = new URLSearchParams(window.location.search);
  const lead_id = queryParameters.get("id");

  const context = useContext(Context);
  const { setDiscardModalAction } = context;
  const [isValueChange, setIsValueChange] = useState(false);

  const [formInput, setFormInput] = useState(initialInput);
  const [leadData, setLeadData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(lead_id ? true : false); // New state for page loading

  const [mapToogleBtn, setMapToogleBtn] = useState({
    lat: 0,
    long: 0,
  });
  const [mobileIsExists, setMobileIsExists] = useState(false);

  // calling API initially
  useEffect(() => {
    dispatch(preferencesAction());
  }, []);

  const [form] = Form.useForm();

  // setting the incoming values from API request in initial State
  useEffect(() => {
    if (state.singleLeadDataAction.data !== "") {
      if (state.singleLeadDataAction.data.data.error === false) {
        setLeadData(state.singleLeadDataAction.data.data.data);
      }
    }
    if (
      isNumberUsed.data &&
      !isNumberUsed.data.data.error &&
      isNumberUsed.data.is_exists
    )
      setMobileIsExists(true);
    if (lead_id) {
      setIsPageLoading(false); // Stop loading after data is set
    }
  }, [state]);

  // calling API initially
  useEffect(() => {
    if (lead_id) {
      setIsPageLoading(true); // Start loading when editing a lead
      dispatch(singleLeadDataAction(lead_id));
    }
  }, [lead_id]);

  // setting the form Input fields is there is any id present
  const handleCustomerDetails = (leadData) => {
    if (lead_id) {
      form.setFieldsValue({
        lead_category_name: {
          id: leadData?.lead_category,
          name: leadData?.lead_category_name,
        },
        gstin: leadData?.gstin,
        business_name: leadData?.business_name,
        contact_person_name: leadData?.contact_person_name,
        designation: leadData?.designation,
        mobile: leadData?.mobile,
        email: leadData?.email,
        address_line_1: leadData?.address_line_1,
        pincode: leadData?.pincode,
        city: leadData?.city,
        state: leadData?.state,
        follow_update: leadData?.follow_update
          ? dayjs(leadData?.follow_update, dateFormat)
          : "",
        comments: leadData?.comments,
        logo_image:
          leadData.logo_image && leadData.logo_image_url
            ? [
                {
                  id: leadData.logo_image,
                  url: leadData.logo_image_url,
                },
              ]
            : [],
      });
      setFormInput((prevState) => ({
        ...prevState,
        init_map_location: lead_id ? !!leadData.map_location_lat : true,
        map_location_lat: leadData.map_location_lat,
        map_location_long: leadData.map_location_long,
        geo_address: leadData.geo_address || "",
        mobile: leadData?.mobile,
      }));
      setMapToogleBtn({
        lat: leadData.map_location_lat,
        long: leadData.map_location_long,
      });
      return;
    }
  };

  useEffect(() => {
    handleCustomerDetails(leadData);
  }, [leadData]);

  // handle customer add form
  const handleSubmit = async (formData) => {
    if (isLoading) return;

    setIsLoading(true);
    const { geo_address, map_location_lat, map_location_long } = formInput;

    formData = {
      ...formData,
      geo_address,
      map_location_lat,
      map_location_long,
      lead_category: formData.lead_category_name.id,
      lead_category_name: formData.lead_category_name.name,
      follow_update: formData?.follow_update
        ? formData?.follow_update.format("YYYY-MM-DD")
        : "",
    };

    if (formData.logo_image[0].url && formData.logo_image[0].id)
      delete formData.logo_image;
    else if (formData.logo_image.length > 0) {
      const result = await uploadImage(formData.logo_image);
      if (result.length > 0) {
        formData = { ...formData, logo_image: result[0] };
      } else setIsLoading(false);
    }

    if (cookies.get("rupyzLocationEnable") === "true") {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          getGeoLocationAndAddress()
            .then((response) => {
              apiCallingForAddLead({
                ...formData,
                geo_location_lat: response.lat,
                geo_location_long: response.lng,
                activity_geo_address: response.address,
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
    apiCallingForAddLead({ ...formData, location_permission: false });
  };

  const apiCallingForAddLead = async (values) => {
    const response = await updateLead(lead_id, values);

    if (response && response.status === 200) {
      setIsLoading(false);
      setFormInput(initialInput);
      navigate(-1);
    } else setIsLoading(false);
  };

  const fetchDetailsFromPincode = async (pincode) => {
    const res = await getDetailsFromPincode(pincode);
    if (res) {
      form.setFieldsValue(res);
    }
  };

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (values) => {
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
            apiCallingForAddLead(values);
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

  const closeMobileNumberModal = () => {
    setMobileIsExists(false);
  };

  const disabledDates = (current) => {
    return current < moment(current).startOf("day");
  };

  const handleValuesChange = () => {
    setIsValueChange(true);
  };

  return (
    <Spin spinning={isPageLoading}>
      <Form
        style={{ opacity: isPageLoading ? 0 : 1 }}
        form={form}
        colon={false}
        layout="vertical"
        onFinish={handleSubmit}
        scrollToFirstError={true}
        initialValues={{ is_details_send_to_user: true }}
        requiredMark={(label, info) => (
          <div>
            {label} {info.required && <span style={{ color: "red" }}>*</span>}
          </div>
        )}
        validateMessages={{
          required: "${label} is required.",
        }}
        onValuesChange={handleValuesChange}
      >
        <div className={styles.form_top_section}>
          {contextHolder}
          <div>
            <Button
              className="button_primary"
              htmlType="submit"
              loading={isLoading}
            >
              Save
            </Button>
            <Button
              className="button_secondary"
              style={{ paddingBlock: 0 }}
              type="button"
              onClick={() => {
                setDiscardModalAction({
                  open: true,
                  handleAction: () => navigate(-1),
                });
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
        <div className={styles.add_edit_from}>
          <h2>
            <img
              src={ArrowLeft}
              alt="arrow"
              onClick={() => {
                setDiscardModalAction({
                  open: true,
                  handleAction: () => navigate(-1),
                });
              }}
            />
            &nbsp; {lead_id ? "Update" : "Create"} Lead
          </h2>

          <div className={styles.form}>
            <Form.Item
              label="Lead Category"
              name="lead_category_name"
              required
              rules={[
                { required: true },
                {
                  validator: (_, value) => {
                    if (value?.id) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error());
                  },
                },
              ]}
            >
              <SelectLeadCategory />
            </Form.Item>

            <Form.Item label="GST No." name="gstin">
              <FormInput
                type="alnum"
                params={{
                  maxLength: 15,
                  placeholder: "Enter GST No",
                }}
                formatter={(v) => {
                  return v.toUpperCase();
                }}
              />
            </Form.Item>

            <Form.Item
              label="Business Name"
              name="business_name"
              required
              rules={[{ required: true }]}
            >
              <FormInput
                type="businessName"
                params={{ maxLength: 150, placeholder: "Enter Business Name" }}
              />
            </Form.Item>

            <Col>
              <Form.Item
                label="Images"
                name="logo_image"
                required
                rules={[
                  { required: true },
                  {
                    validator: (_, value) => {
                      if (value?.length === 1) {
                        return Promise.resolve();
                      }
                      return Promise.reject();
                    },
                  },
                ]}
              >
                <ImageUploader />
              </Form.Item>
            </Col>
          </div>

          <div className={styles.form}>
            <Form.Item label="Contact Person" name="contact_person_name">
              <FormInput
                type="alpha"
                params={{
                  placeholder: "Enter Contact Person",
                }}
              />
            </Form.Item>

            <Form.Item label="Designation" name="designation">
              <Input placeholder="Enter Designation" />
            </Form.Item>

            <Form.Item
              label="Mobile No."
              name={"mobile"}
              required
              rules={[
                { required: true },
                {
                  validator: (_, value) => {
                    if (
                      value?.toString().length === 10 &&
                      formInput?.mobile !== value
                    )
                      dispatch(mobileNumberCheck(value));
                    if (value?.toString().length === 10) {
                      return Promise.resolve();
                    }
                    return Promise.reject();
                  },
                },
              ]}
            >
              <FormInput
                type="num"
                params={{ maxLength: 10, placeholder: "Enter Mobile No." }}
              />
            </Form.Item>
            <Form.Item
              label="Email ID"
              name="email"
              rules={[
                {
                  validator: (_, value) => {
                    if (!value || value.match(regex["email"]))
                      return Promise.resolve();
                    else
                      return Promise.reject(
                        new Error("Please enter a valid email")
                      );
                  },
                },
              ]}
            >
              <Input placeholder="Enter Email ID" />
            </Form.Item>
          </div>

          <div className={styles.form}>
            <Form.Item
              label="Address"
              name="address_line_1"
              required
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter Address" />
            </Form.Item>

            <Form.Item label="Pincode" name="pincode">
              <FormInput
                type="num"
                params={{
                  placeholder: "Enter Pincode",
                  maxLength: 6,
                }}
                formatter={(v) => {
                  if (v.length === 6) {
                    fetchDetailsFromPincode(v);
                  }
                  return v;
                }}
              />
            </Form.Item>

            <Form.Item
              label="City"
              name="city"
              required
              rules={[{ required: true }]}
            >
              <FormInput
                type="city"
                params={{
                  placeholder: "Enter City",
                  maxLength: 30,
                }}
              />
            </Form.Item>

            <Form.Item
              label="State"
              name="state"
              required
              rules={[{ required: true }]}
            >
              <StateSelectSearch />
            </Form.Item>

            <GoogleMaps
              title="Lead"
              type={lead_id ? "edit" : "add"}
              marker={{
                lat: formInput.map_location_lat,
                lng: formInput.map_location_long,
                geo_address: formInput.geo_address,
                init_map_location: formInput.init_map_location,
              }}
              handleMarker={(location) => {
                setFormInput((prevState) => ({
                  ...prevState,
                  map_location_lat:
                    location?.lat && location?.lng ? location.lat : 0,
                  map_location_long:
                    location?.lat && location?.lng ? location.lng : 0,
                  geo_address: location?.geo_address || "",
                  init_map_location: location.init_map_location,
                }));
              }}
            />
          </div>
          <div className={styles.form}>
            <Form.Item label="Follow up date" name="follow_update">
              <DatePicker
                format={dateFormat}
                disabledDate={disabledDates}
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item label="Comments / Notes" name="comments">
              <Input.TextArea rows={5} />
            </Form.Item>

            {!lead_id && (
              <Form.Item name="is_details_send_to_user" valuePropName="checked">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Checkbox
                    defaultChecked={true}
                    name="is_details_send_to_user"
                    style={{ position: "absolute", marginTop: 30 }}
                  />
                  <img
                    src={WhatsAppIcon}
                    alt="img"
                    style={{ marginLeft: 25 }}
                    width={20}
                  />
                  <div style={{ marginLeft: 10 }}>Send updates on Whatsapp</div>
                </div>
              </Form.Item>
            )}
          </div>
          <AddLeadCategoryComponent data={""} pageCount={""} />

          <div className={styles.form_button}>
            <Button
              className="button_primary"
              htmlType="submit"
              loading={isLoading}
            >
              Save
            </Button>

            <Button
              className="button_secondary"
              style={{ paddingBlock: 0 }}
              type="button"
              onClick={() => {
                setDiscardModalAction({
                  open: true,
                  handleAction: () => navigate(-1),
                });
              }}
            >
              Cancel
            </Button>
          </div>

          <Modal
            open={mobileIsExists}
            onCancel={closeMobileNumberModal}
            title={
              <div
                style={{
                  padding: 15,
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                Mobile Number Already Exists
              </div>
            }
            footer={[
              <div
                style={{
                  marginTop: 20,
                  display: "flex",
                  background: "#fff",
                  padding: 15,
                  flexDirection: "row-reverse",
                  borderRadius: "0 0 10px 10px",
                }}
                className={styles.edit_header}
              >
                <button
                  className="button_primary"
                  style={{ marginRight: 20 }}
                  onClick={() => {
                    closeMobileNumberModal();
                    form.setFieldValue("mobile", "");
                    setFormInput((prevState) => ({ ...prevState, mobile: "" }));
                  }}
                >
                  Remove
                </button>
                <button
                  className="button_secondary"
                  style={{ marginRight: 20 }}
                  onClick={closeMobileNumberModal}
                >
                  Proceed with Same Number
                </button>
              </div>,
            ]}
          >
            <div style={{ margin: "0 20px", fontSize: 16, fontWeight: 500 }}>
              Lead has already been registered with this Phone Number !
            </div>
          </Modal>
        </div>
        <BackConfirmationModal {...{ isValueChange }} />
      </Form>
    </Spin>
  );
};

export default AddLeadForm;

const initialInput = {
  init_map_location: true,
  map_location_lat: 0,
  map_location_long: 0,
  geo_address: "",
};

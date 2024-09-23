import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Context from "../../context/Context";
import { Modal, Form, Input, Spin } from "antd";
import { accessType } from "../../config";
import {
  profileAction,
  profileEditService,
} from "../../redux/action/profileAction";
import { gstAction } from "../../redux/action/gstAction";
import Cookies from "universal-cookie";
import { getDetailsFromPincode } from "../../redux/action/pincodeAutoFill";
import styles from "./profileViewUpdate.module.css";
import StateSelectSearch from "../selectSearch/stateSelectSearch";
import ImageUploader, { uploadImage } from "../image-uploader/ImageUploader";
import FormInput from "../form-elements/formInput";
import { regex } from "../form-elements/regex";

const ProfileView = () => {
  const cookies = new Cookies();
  const dispatch = useDispatch();
  const context = useContext(Context);
  const [form] = Form.useForm();

  const { profileViewUpdateOpen, setProfileViewUpdateOpenOpen } = context;
  const state = useSelector((state) => state);

  const [activeForm, setActiveForm] = useState("");
  const [loading, setLoading] = useState(false);

  const onClose = () => {
    form.resetFields();
    setProfileViewUpdateOpenOpen("");
  };

  const setInitialFormValues = (type) => {
    const profileDetails = state.profile.data.data.data;

    if (type === "General")
      form.setFieldsValue({
        logo_image: profileDetails.logo_image
          ? [
              {
                id: profileDetails.logo_image,
                url: profileDetails.logo_image_url,
              },
            ]
          : [],
        primary_gstin: profileDetails.primary_gstin,
        legal_name: profileDetails.legal_name,
        mobile: profileDetails.mobile,
        email: profileDetails.email,
        address_line_1: profileDetails.address_line_1,
        pincode: profileDetails.pincode,
        city: profileDetails.city,
        state: profileDetails.state,
        first_name: profileDetails.first_name,
        last_name: profileDetails.last_name,
      });
    else {
      form.setFieldsValue({
        name: profileDetails.bank_detail.name,
        account_number: profileDetails.bank_detail.account_number,
        ifsc_code: profileDetails.bank_detail.ifsc_code,
        address: profileDetails.bank_detail.address,
        swift_code: profileDetails.bank_detail.swift_code,
        qr_code: profileDetails.bank_detail.qr_code_url
          ? [
              {
                id: profileDetails.bank_detail.qr_code,
                url: profileDetails.bank_detail.qr_code_url,
              },
            ]
          : [],
      });
    }
  };

  const handleSubmit = async (v) => {
    setLoading(true);
    const imgKeyName = activeForm === "General" ? "logo_image" : "qr_code";

    if (v[imgKeyName]?.[0]?.id) {
      v = {
        ...v,
        [imgKeyName]: v[imgKeyName][0].id,
      };
    } else if (v[imgKeyName].length) {
      const result = await uploadImage(v[imgKeyName]);
      if (result.length) v = { ...v, [imgKeyName]: result[0] };
    } else v = { ...v, [imgKeyName]: 0 };

    if (activeForm === "Bank Details") v = { bank_detail: { ...v } };

    const res = await profileEditService(v);
    if (res && res.status === 200) {
      if (activeForm === "General")
        cookies.set("rupyzUserName", v.legal_name, { path: "/" });
      dispatch(profileAction());
      onClose();
    }

    setLoading(false);
  };

  useEffect(() => {
    setActiveForm(profileViewUpdateOpen);
    if (state.profile.data && !state.profile.data.data.error) {
      setInitialFormValues(profileViewUpdateOpen);
    }
  }, [profileViewUpdateOpen]);

  return (
    <>
      {accessType === "WEB_SARE360" ? (
        <Modal
          title={
            <div className={styles.modal_title}>Edit Organization Profile</div>
          }
          width={700}
          onCancel={onClose}
          open={profileViewUpdateOpen}
          centered
          footer={null}
          styles={{ header: { marginBottom: 0 } }}
        >
          <Spin spinning={loading}>
            <div className={styles.form_options}>
              {["General", "Bank Details"].map((ele) => (
                <div
                  className={activeForm === ele && styles.active_form_option}
                  style={{ flex: 1, fontWeight: 500, paddingBlock: 12 }}
                  onClick={() => {
                    setActiveForm(ele);
                    setInitialFormValues(ele);
                  }}
                >
                  {ele}
                </div>
              ))}
            </div>
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
              <div style={{ padding: "2em 2em 0" }}>
                {activeForm === "General" ? (
                  <GeneralFormItems {...{ form }} />
                ) : (
                  <BankDetailFormItems />
                )}
              </div>
              <div className={styles.modal_footer_buttons}>
                <button className="button_secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="button_primary">
                  Update
                </button>
              </div>
            </Form>
          </Spin>
        </Modal>
      ) : (
        <></>
      )}
    </>
  );
};

export default ProfileView;

const GeneralFormItems = ({ form }) => {
  const dispatch = useDispatch();

  const fetchDetailsFromPincode = async (pincode) => {
    const res = await getDetailsFromPincode(pincode);
    if (res) {
      form.setFieldsValue(res);
    }
  };

  return (
    <>
      <Form.Item
        label="Logo"
        name="logo_image"
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
        <ImageUploader params={{ id: "logo_image" }} />
      </Form.Item>

      <Form.Item label="GST" name="primary_gstin">
        <FormInput
          params={{
            maxLength: 15,
            placeholder: "Enter GST",
          }}
          formatter={(v) => {
            if (v.length === 15) {
              dispatch(gstAction(v));
            }
            return v.toUpperCase();
          }}
        />
      </Form.Item>
      <Form.Item label="Company Name" name="legal_name">
        <FormInput
          type="alnumSpace"
          params={{ placeholder: "Enter Company Name" }}
        />
      </Form.Item>
      <Form.Item
        label="Mobile"
        name="mobile"
        rules={[
          {
            validator: (_, value) => {
              if (!value || value?.toString().length === 10) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("Please enter a valid mobile number")
              );
            },
          },
        ]}
      >
        <FormInput
          type="num"
          params={{
            placeholder: "Enter Mobile Number",
            maxLength: 10,
          }}
        />
      </Form.Item>
      <Form.Item
        label="Mail"
        name="email"
        rules={[
          {
            validator: (_, value) => {
              if (!value || value.match(regex["email"]))
                return Promise.resolve();
              return Promise.reject(new Error("Please enter a valid email"));
            },
          },
        ]}
      >
        <Input placeholder="Enter Email Id" />
      </Form.Item>
      <Form.Item label="Address" name="address_line_1">
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
      <Form.Item label="City" name="city">
        <FormInput
          type="city"
          params={{
            placeholder: "Enter City",
            maxLength: 30,
          }}
        />
      </Form.Item>
      <Form.Item label="State" name="state">
        <StateSelectSearch />
      </Form.Item>
      <Form.Item label="First Name" name="first_name">
        <Input placeholder="Enter First Name" />
      </Form.Item>
      <Form.Item label="Last Name" name="last_name">
        <Input placeholder="Enter Last Name" />
      </Form.Item>
    </>
  );
};

const BankDetailFormItems = () => {
  return (
    <>
      <Form.Item label="Bank Name" name="name">
        <Input placeholder="Enter Bank Name" />
      </Form.Item>
      <Form.Item label="Account No." name="account_number">
        <FormInput
          type="num"
          params={{ maxLength: 16, placeholder: "Enter Account No." }}
        />
      </Form.Item>
      <Form.Item label="IFSC Code" name="ifsc_code">
        <Input placeholder="Enter IFSC Code" maxLength={11} />
      </Form.Item>
      <Form.Item label="Bank Address" name="address">
        <Input placeholder="Enter Bank Address" />
      </Form.Item>
      <Form.Item label="SWIFT Code" name="swift_code">
        <Input placeholder="Enter SWIFT Code" maxLength={11} />
      </Form.Item>
      <Form.Item label="Qr Code" name="qr_code">
        <ImageUploader params={{ id: "qr_code" }} />
      </Form.Item>
    </>
  );
};

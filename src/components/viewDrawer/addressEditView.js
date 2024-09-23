// https://team-1624359381274.atlassian.net/wiki/spaces/RUPYZ/pages/edit-v2/180748290#Address-(Add/Edit)

import React, { useContext, useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, Modal } from "antd";
import Context from "../../context/Context";
import { useDispatch } from "react-redux";
import { addressList, updateAddress } from "../../redux/action/checkoutAction";
import { getDetailsFromPincode } from "../../redux/action/pincodeAutoFill";
import StateSelectSearch from "../selectSearch/stateSelectSearch";
import FormInput from "../form-elements/formInput";
import { useParams } from "react-router";

const AddressEditView = () => {
  const dispatch = useDispatch();
  const context = useContext(Context);
  const {
    editAddressViewOpen,
    setnewAddressData,
    setEditAddressViewOpen,
    newAddressData,
  } = context;
  const { customer_id } = useParams();

  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (newAddressData) {
      form.setFieldsValue({
        name: newAddressData.name,
        address_line_1: newAddressData.address_line_1,
        city: newAddressData.city,
        pincode: newAddressData.pincode,
        address_line_2: newAddressData.address_line_2,
        state: newAddressData.state,
        is_default: newAddressData.is_default,
      });
    }
  }, [newAddressData]);

  const onClose = () => {
    setEditAddressViewOpen(false);
    setnewAddressData("");
  };

  const fetchDetailsFromPincode = async (pincode) => {
    const res = await getDetailsFromPincode(pincode);
    if (res) {
      form.setFieldsValue(res);
    }
  };

  const handleSubmit = async (formData) => {
    formData = newAddressData.id
      ? {
          ...formData,
          id: newAddressData.id,
        }
      : formData;

    const response = await updateAddress(customer_id, formData);
    if (response && response.status === 200) {
      setIsLoading(false);
      form.resetFields();
      dispatch(addressList(customer_id));
      onClose();
    } else setIsLoading(false);
    return;
  };

  return (
    <Modal
      title={
        <div
          style={{
            padding: 15,
            textAlign: "center",
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          Edit Address
        </div>
      }
      width={700}
      onCancel={onClose}
      open={editAddressViewOpen}
      centered
      footer={[
        <div
          style={{
            display: "flex",
            gap: 20,
            justifyContent: "end",
            background: "#fff",
            padding: "10px 20px",
            borderRadius: "0 0 10px 10px",
          }}
        >
          <button className="button_secondary" type="button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="button_primary"
            htmlType="submit"
            loading={isLoading}
            style={{ borderRadius: "5px" }}
            onClick={() => form.submit()}
          >
            Submit
          </button>
        </div>,
      ]}
    >
      <Form
        form={form}
        colon={false}
        layout="vertical"
        onFinish={handleSubmit}
        scrollToFirstError={true}
        initialValues={{ address_line_2: "" }}
        requiredMark={(label, info) => (
          <div>
            {label} {info.required && <span style={{ color: "red" }}>*</span>}
          </div>
        )}
        validateMessages={{
          required: "${label} is required.",
        }}
      >
        <div style={{ paddingInline: "20px" }}>
          <Form.Item
            label="Address Type"
            name="name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Office, Gowdown etc." />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address_line_1"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter the Address" />
          </Form.Item>
          <Form.Item
            label="Pincode"
            name="pincode"
            rules={[
              { required: true },
              {
                validator: (_, v) => {
                  if (v?.length === 6) return Promise.resolve();
                  return Promise.reject();
                },
              },
            ]}
          >
            <FormInput
              type="num"
              params={{
                placeholder: "Enter the Pincode",
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
          <Form.Item label="City" name="city" rules={[{ required: true }]}>
            <FormInput
              type="city"
              params={{
                placeholder: "Enter City",
                maxLength: 30,
              }}
            />
          </Form.Item>
          <Form.Item label="State" name="state" rules={[{ required: true }]}>
            <StateSelectSearch />
          </Form.Item>
          <Form.Item label="Landmark" name="address_line_2">
            <Input placeholder="Enter the Landmark" />
          </Form.Item>
          <div style={{ display: "flex", gap: "1em", height: 30 }}>
            <Form.Item name="is_default" valuePropName="checked">
              <Checkbox name="is_default" />
            </Form.Item>
            <p style={{ margin: 0, paddingTop: 4 }}>
              Make this Primary Address
            </p>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default AddressEditView;

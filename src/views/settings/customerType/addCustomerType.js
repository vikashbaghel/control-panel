// https://team-1624359381274.atlassian.net/wiki/spaces/RUPYZ/pages/edit-v2/180748290#Settings

import { Form, Input, Modal } from "antd";
import React, { useContext, useEffect } from "react";
import Context from "../../../context/Context";
import { useDispatch, useSelector } from "react-redux";
import Styles from "../settings.module.css";
import {
  addNewCustomerTypeAction,
  customerTypeAction,
  editCustomerTypeAction,
} from "../../../redux/action/cutomerTypeAction";

const AddCustomerTypeComponent = ({ data, pageCount }) => {
  const [form] = Form.useForm();
  const state = useSelector((state) => state);
  const { addCustomerType, editCustomerType } = state;
  const dispatch = useDispatch();
  const context = useContext(Context);
  const { addCustomerTypeOpen, setAddCustomerTypeOpen } = context;

  const onClose = () => {
    form.resetFields();
    setAddCustomerTypeOpen(false);
  };

  const onSubmit = (value) => {
    if (data)
      return dispatch(
        editCustomerTypeAction({ name: value.name, id: data.id })
      );
    dispatch(addNewCustomerTypeAction(value));
  };

  useEffect(() => {
    if (
      (editCustomerType.data &&
        !editCustomerType.data.data.error &&
        editCustomerType.data.status === 200) ||
      (addCustomerType.data &&
        !addCustomerType.data.data.error &&
        addCustomerType.data.status === 200)
    ) {
      onClose();
      dispatch(customerTypeAction("", pageCount));
    }
  }, [addCustomerType, editCustomerType]);

  useEffect(() => {
    if (data) return form.setFieldsValue({ name: data?.name });
    form.setFieldsValue({ name: "" });
  }, [data, addCustomerTypeOpen]);

  return (
    <>
      <Modal
        centered
        title={
          <div
            style={{
              padding: 15,
              textAlign: "center",
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {data === "" ? "Create New Customer Type" : "Update Customer Type"}
          </div>
        }
        open={addCustomerTypeOpen}
        onCancel={onClose}
        className={Styles.product_category_main}
        width={600}
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
          >
            <button className="button_primary" onClick={() => form.submit()}>
              {data ? "Update" : "Create"}
            </button>
            <button
              className="button_secondary"
              style={{ marginRight: 20 }}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>,
        ]}
      >
        <Form
          form={form}
          onFinish={onSubmit}
          layout="vertical"
          style={{ padding: "10px 20px 0 20px" }}
          validateMessages={{
            required: "${label} is required.",
          }}
          requiredMark={(label, info) => (
            <div>
              {label} {info.required && <span style={{ color: "red" }}>*</span>}
            </div>
          )}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
              },
              {
                validator: (_, value) => {
                  if (!value || value.match(/^[a-zA-Z0-9#\/(),.+\-:&% ]*$/)) {
                    return Promise.resolve();
                  } else
                    return Promise.reject(
                      new Error("Please enter a valid Name")
                    );
                },
              },
            ]}
          >
            <Input placeholder="Enter Name" />
          </Form.Item>
          {data && (
            <div
              style={{
                paddingTop: 10,
                fontFamily: "Poppins",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              * Changing the customer type name updates it in all associated
              customers.
            </div>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default AddCustomerTypeComponent;

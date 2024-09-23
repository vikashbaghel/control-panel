// https://team-1624359381274.atlassian.net/wiki/spaces/RUPYZ/pages/edit-v2/180748290#Settings

import { Modal, Form, Input, Button, notification } from "antd";
import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Context from "../../context/Context";
import Styles from "./settings.module.css";
import {
  addLeadCategory,
  leadCategoryAction,
  updateLeadCategory,
} from "../../redux/action/leadManagementAction";

const AddLeadCategoryComponent = ({ data = {}, pageCount = "" }) => {
  const state = useSelector((state) => state);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const context = useContext(Context);
  const { editLeadCategoryViewOpen, setEditLeadCategoryViewOpen } = context;

  const onClose = () => {
    setEditLeadCategoryViewOpen(false);
    form.resetFields();
  };

  useEffect(() => {
    if (
      (state.addLeadCategory.data &&
        !state.addLeadCategory.data.data.error &&
        state.addLeadCategory.data.status === 200) ||
      (state.updateLeadCategory.data &&
        !state.updateLeadCategory.data.data.error &&
        state.updateLeadCategory.data.status === 200)
    ) {
      onClose();
      setTimeout(() => {
        pageCount && dispatch(leadCategoryAction("", pageCount));
      }, 400);
    }
  }, [state]);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data?.name,
      });
    } else {
      form.resetFields();
    }
  }, [data, editLeadCategoryViewOpen]);

  useEffect(() => {
    if (data) {
      dispatch(leadCategoryAction("", pageCount));
    }
  }, []);

  const onSubmit = (value) => {
    if (data.id) {
      if (data.name === value.name) {
        notification.success({
          message: "Lead Category updated successfully!",
        });
        onClose();
      } else {
        dispatch(updateLeadCategory(data.id, value));
      }
    } else {
      dispatch(addLeadCategory(value));
    }

    return;
  };

  return (
    <>
      <Modal
        centered
        open={editLeadCategoryViewOpen}
        className={Styles.product_category_main}
        style={{ padding: "0px !important" }}
        width={600}
        onCancel={onClose}
        title={
          <div
            style={{
              padding: 15,
              textAlign: "center",
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {data ? "Update Lead Category" : "Create New Lead Category"}
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
          >
            <Button className="button_primary" onClick={() => form.submit()}>
              {data ? "Update" : "Create"}
            </Button>
            <Button
              className="button_secondary"
              style={{ marginRight: 20, paddingBlock: 0 }}
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>,
        ]}
      >
        <div style={{ padding: "10px 20px" }}>
          <Form
            input={initialInput}
            form={form}
            onFinish={onSubmit}
            labelCol={{ span: 24 }}
            style={{ marginBottom: 0 }}
            validateMessages={{
              required: "${label} is required.",
            }}
            requiredMark={(label, info) => (
              <div>
                {label}{" "}
                {info.required && <span style={{ color: "red" }}>*</span>}
              </div>
            )}
          >
            <Form.Item
              name="name"
              label="Lead Category Name"
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
              style={{ marginBottom: "8px" }}
            >
              <Input
                placeholder="Enter Category Name"
                onKeyPress={(e) => {
                  if (!/^[a-zA-Z0-9#\/(),.+\-:&% ]*$/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default AddLeadCategoryComponent;

const initialInput = {
  name: "",
};

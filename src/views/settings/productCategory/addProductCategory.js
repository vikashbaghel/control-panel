// https://team-1624359381274.atlassian.net/wiki/spaces/RUPYZ/pages/edit-v2/180748290#Settings

import { Form, Modal, notification, Checkbox, Input, Button } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Context from "../../../context/Context";
import Styles from "../settings.module.css";
import {
  editProductCategoryAction,
  productCategoryAction,
} from "../../../redux/action/productCategoryAction";

const AddProductCategoryComponent = ({ data, pageCount, refetch = true }) => {
  const state = useSelector((state) => state);

  const dispatch = useDispatch();
  const context = useContext(Context);
  const { addProductCategoryOpen, setAddProductCategoryOpen } = context;
  const [form] = Form.useForm();

  const onClose = () => {
    setAddProductCategoryOpen(false);
    form.resetFields(); // Reset form fields when closing the modal
  };

  useEffect(() => {
    if (state.editProductCategory.data !== "") {
      if (state.editProductCategory.data.data.error === false) {
        if (state.editProductCategory.data.status === 200) {
          onClose();
          setTimeout(() => {
            dispatch(productCategoryAction("", pageCount));
          }, 400);
        }
      }
    }
  }, [state]);

  const fetchDataById = (data) => {
    if (data?.id) {
      const fetchedData = {
        name: data?.name,
        is_menu: data?.is_menu,
        is_featured: data?.is_featured,
      };
      form.setFieldsValue(fetchedData); // Set form fields with fetched data
      return;
    }
    form.resetFields(); // Reset form fields if no data is fetched
  };

  useEffect(() => {
    fetchDataById(data);
  }, [addProductCategoryOpen]);

  const onSubmit = (value) => {
    dispatch(
      editProductCategoryAction({
        ...value,
        ...(data?.id ? { id: data.id } : {}),
      })
    );
    if (!refetch) {
      return onClose();
    }
  };

  return (
    <>
      <Modal
        centered
        open={addProductCategoryOpen}
        onCancel={onClose}
        style={{ padding: "0px !important" }}
        className="add_product_settings"
        width={600}
        title={
          <div
            style={{
              padding: 15,
              textAlign: "center",
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {!data ? "Add New Product Category" : "Update Product Category"}
          </div>
        }
        footer={[
          <div
            style={{
              display: "flex",
              background: "#fff",
              padding: 15,
              justifyContent: "end",
              gap: 20,
              borderRadius: "0 0 10px 10px",
            }}
          >
            <Button
              className="button_secondary"
              style={{ paddingBlock: 0 }}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button className="button_primary" onClick={() => form.submit()}>
              {data ? "Update" : "Create"}
            </Button>
          </div>,
        ]}
      >
        <Form
          form={form}
          onFinish={onSubmit}
          initialValues={initialInput}
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
            name="name"
            label="Name"
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
            style={{ marginBottom: "0px", padding: "0px" }}
          >
            <Input placeholder="Enter Product Category" />
          </Form.Item>

          {data?.id && (
            <div
              style={{
                paddingTop: 10,
                fontFamily: "Poppins",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              * Changing the product category name updates it in all associated
              products.
            </div>
          )}

          <div className={Styles.product_category_body_checked}>
            {" "}
            <Form.Item name="is_menu" valuePropName="checked">
              <Checkbox>Is Menu</Checkbox>
            </Form.Item>
            <Form.Item name="is_featured" valuePropName="checked">
              <Checkbox>Is Featured</Checkbox>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default AddProductCategoryComponent;

const initialInput = {
  name: "",
  is_menu: false,
  is_featured: false,
};

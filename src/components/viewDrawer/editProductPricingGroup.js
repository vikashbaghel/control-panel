import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Context from "../../context/Context";
import { CloseOutlined, UploadOutlined } from "@ant-design/icons";
import { Drawer, Button, Select, Form, Input } from "antd";

import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import styles from "../viewDrawer/order.module.css";
import ProductPricing from "../productPricing/productPricing";
import ShowHideSelect from "../productPricing/productPricing";
import {
  addPricingGroup,
  editPricingGroup,
  pricingGroupListService,
} from "../../redux/action/pricingGroupAction";

const { TextArea } = Input;

const EditProductPricing = () => {
  const context = useContext(Context);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formInput, setFormInput] = useState("");
  const state = useSelector((state) => state);
  const {
    productPricingGroupAddOpen,
    setProductPricingGroupAddOpen,
    setProductPricingData,
    productPricingData,
    productPricingGroupData,
    setProductPricingGroupData,

    setProductPricingGroupEditOpen,
    productPricingGroupEditOpen,
  } = context;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [record, setRecord] = useState("");

  let record1 =
    state.addPricingGroup.data && state.addPricingGroup.data.data.data;

  useEffect(() => {
    if (state.addPricingGroup.data !== "") {
      if (state.addPricingGroup.data.data.error === false) {
        setRecord(state.addPricingGroup.data.data.data);
      }
    }
  }, [state]);

  const onClose = () => {
    setProductPricingGroupEditOpen(false);
    setProductPricingGroupData("");
  };

  const onFinish = (values) => {
    if (values.name !== "") {
      const apiData = {
        id: productPricingGroupData.id,
        name: name ? name : productPricingGroupData.name,
        description: description ? description : "",
      };
      setFormInput(apiData);
      dispatch(editPricingGroup(apiData));
      setProductPricingGroupEditOpen(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  function removeEmpty(obj) {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v != null)
    );
  }

  if (productPricingGroupAddOpen === true) {
    setProductPricingData("");
  }

  return (
    <>
      {productPricingGroupData && (
        <Drawer
          className="container"
          title={
            <>
              <CloseOutlined onClick={onClose} />{" "}
              <span>Edit Pricing Group</span>{" "}
            </>
          }
          width={500}
          closable={false}
          onClose={onClose}
          open={productPricingGroupEditOpen}
          style={{ overflowY: "auto" }}
        >
          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              maxWidth: 600,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            {/* Name Input */}
            <Form.Item name="name" required>
              <label style={{ fontWeight: "400" }}>
                Name :<sup style={{ color: "red" }}>*</sup>
              </label>
              <Input
                onChange={(e) => setName(e.target.value)}
                style={{ width: "450px", height: "50px" }}
                defaultValue={
                  productPricingGroupData && productPricingGroupData.name
                }
              />
            </Form.Item>

            {/* Description TextArea */}
            <Form.Item name="description" style={{ width: "450px" }}>
              <label style={{ fontWeight: "400" }}>Description :</label>
              <TextArea
                onChange={(e) => setDescription(e.target.value)}
                autoSize={{
                  minRows: 5,
                  maxRows: 5,
                }}
                style={{ width: "507px ", maxWidth: "450px" }}
                defaultValue={
                  productPricingGroupData && productPricingGroupData.description
                }
              />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <div
                style={{
                  position: "fixed",
                  marginTop: "335px",
                  marginLeft: "-144px",
                }}
              >
                <Button
                  style={{ height: "40px" }}
                  type="primary"
                  htmlType="submit"
                >
                  Update
                </Button>
                <Button
                  style={{ marginLeft: "20px", height: "40px" }}
                  htmlType="submit"
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Drawer>
      )}
    </>
  );
};
export default EditProductPricing;

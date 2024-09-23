import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Context from "../../context/Context";
import { CloseOutlined } from "@ant-design/icons";
import { Drawer, Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { addPricingGroup } from "../../redux/action/pricingGroupAction";

const { TextArea } = Input;

const CreateProductPricing = () => {
  const context = useContext(Context);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formInput, setFormInput] = useState("");
  const state = useSelector((state) => state);
  const {
    productPricingGroupAddOpen,
    setProductPricingGroupAddOpen,
    setProductPricingData,
  } = context;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  // const [disabled, setDisabled] = useState(false);
  const [record, setRecord] = useState("");

  // let record1 =
  //   state.addPricingGroup.data && state.addPricingGroup.data.data.data;

  useEffect(() => {
    if (state.addPricingGroup.data !== "") {
      if (state.addPricingGroup.data.data.error === false) {
        setRecord(state.addPricingGroup.data.data.data);
        setTimeout(() => {
          navigate(
            `/web/product-pricing/?name=${state.addPricingGroup.data.data.data.name}&id=${state.addPricingGroup.data.data.data.id}`
          );
          window.location.reload();
        }, 500);
      }
    }
  }, [state]);

  const onClose = () => {
    setProductPricingGroupAddOpen(false);
  };

  const onFinish = (values) => {
    if (values.name !== "") {
      const apiData = {
        name: name,
        description: description ? description : "",
      };
      setFormInput(apiData);
      dispatch(addPricingGroup(apiData));
      onClickHnadler();
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

  const onClickHnadler = () => {};

  if (productPricingGroupAddOpen === true) {
    setProductPricingData("");
  }

  return (
    <>
      <Drawer
        className="container"
        title={
          <>
            <CloseOutlined onClick={onClose} /> <span>Add Pricing Group</span>{" "}
          </>
        }
        width={500}
        closable={false}
        onClose={onClose}
        open={productPricingGroupAddOpen}
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
              required
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
                position: "absolute",
                bottom: "-300px",
                display: "flex",
                justifyContent: "space-between",
                width: "150%",
                right: "0px",
              }}
            >
              <Button
                style={{ height: "40px", width: "48%" }}
                type="primary"
                htmlType="submit"
                disabled={name === "" ? true : false}
              >
                Save & Continue
              </Button>
              <Button
                style={{ height: "40px", width: "48%" }}
                htmlType="submit"
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};
export default CreateProductPricing;

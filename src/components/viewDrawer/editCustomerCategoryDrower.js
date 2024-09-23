import React, { useContext, useState, useEffect } from "react";
import Context from "../../context/Context";
import { CloseOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { Button, Drawer, Form, Input } from "antd";
import { editCustomerCategoryAction } from "../../redux/action/customerCategoryAction";
import { useDispatch, useSelector } from "react-redux";

const EditCustomerCategory = () => {
  const context = useContext(Context);
  const navigate = useNavigate();
  const state = useSelector((state) => state);
  const {
    editCustomerCategoryOpen,
    setEditCustomerCategoryOpen,
    editCustomerCategoryData,
    setEditCustomerCategoryData,
  } = context;
  const [formInput, setFormInput] = useState("");
  const dispatch = useDispatch();

  const onClose = () => {
    setEditCustomerCategoryOpen(false);
    setEditCustomerCategoryData("");
  };

  const onFinish = (values) => {
    if (values.name !== "") {
      const apiData = {
        id: editCustomerCategoryData.id,
        name: values.name
          ? values.name
          : editCustomerCategoryData.name
          ? editCustomerCategoryData.name
          : "",
        discount_value: values.discount_value
          ? Number(values.discount_value)
          : editCustomerCategoryData.discount_value
          ? Number(editCustomerCategoryData.discount_value)
          : "",
      };
      setFormInput(apiData);
      dispatch(editCustomerCategoryAction(apiData));
    }
  };

  useEffect(() => {
    if (state.editcustomerCategory.data !== "") {
      if (state.editcustomerCategory.data.data.error === false) {
        if (state.editcustomerCategory.data.status === 200) {
          navigate("/web/customer-category");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }
    }
  }, [state]);

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Drawer
        className="container"
        title={
          <>
            <CloseOutlined onClick={onClose} /> &nbsp;&nbsp;&nbsp;
            <span>Edit Customer Category</span>{" "}
          </>
        }
        width={520}
        closable={false}
        onClose={onClose}
        open={editCustomerCategoryOpen}
        style={{ overflowY: "auto" }}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Name"
            name="name"
            required
            // rules={[{  message: 'Please input Customer category' }]}
          >
            <Input
              defaultValue={
                editCustomerCategoryData && editCustomerCategoryData.name
              }
              required
            />
          </Form.Item>

          <Form.Item
            label="Discount in (%)"
            name="discount_value"
            // rules={[{  message: 'Please input Discount Value' }]}
          >
            <Input
              defaultValue={
                editCustomerCategoryData &&
                editCustomerCategoryData.discount_value
              }
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};
export default EditCustomerCategory;

const style = {
  lable: {
    lineHeight: "40px",
    color: "black",
  },
};

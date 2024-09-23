import React, { useContext, useState, useEffect } from "react";
import Context from "../../context/Context";
import { CloseOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { Button, Drawer, Form, Input } from "antd";
import { editCustomerCategoryAction } from "../../redux/action/customerCategoryAction";
import { useDispatch, useSelector } from "react-redux";
import {
  customerTypeAction,
  editCustomerTypeAction,
} from "../../redux/action/cutomerTypeAction";

const EditCustomerType = () => {
  const context = useContext(Context);
  const navigate = useNavigate();
  const state = useSelector((state) => state);
  const {
    editCustomerTypeOpen,
    setEditCustomerTypeOpen,
    editCustomerTypeData,
    setEditCustomerTypeData,
  } = context;
  const [formInput, setFormInput] = useState("");
  const dispatch = useDispatch();

  const onClose = () => {
    setEditCustomerTypeOpen(false);
    setEditCustomerTypeData("");
  };

  const onFinish = (values) => {
    if (values.name !== "") {
      const apiData = {
        id: editCustomerTypeData.id,
        name: values.name
          ? values.name
          : editCustomerTypeData.name
          ? editCustomerTypeData.name
          : "",
      };
      setFormInput(apiData);
      dispatch(editCustomerTypeAction(apiData));
    }
  };

  useEffect(() => {
    if (state.editCustomerType.data !== "") {
      if (state.editCustomerType.data.data.error === false) {
        dispatch(customerTypeAction());
        onClose();
      }
    }
  }, [state]);

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      {editCustomerTypeData && (
        <Drawer
          className="container"
          title={
            <>
              <CloseOutlined onClick={onClose} /> &nbsp;&nbsp;&nbsp;
              <span>Edit Customer Type</span>{" "}
            </>
          }
          width={520}
          closable={false}
          onClose={onClose}
          open={editCustomerTypeOpen}
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
                defaultValue={editCustomerTypeData && editCustomerTypeData.name}
                required
              />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Drawer>
      )}
    </>
  );
};
export default EditCustomerType;

const style = {
  lable: {
    lineHeight: "40px",
    color: "black",
  },
};

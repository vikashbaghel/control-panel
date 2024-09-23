import React, { useContext, useEffect } from "react";
import Context from "../../context/Context";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Drawer, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewCustomerTypeAction,
  customerTypeAction,
} from "../../redux/action/cutomerTypeAction";

const AddNewCustomerType = () => {
  const context = useContext(Context);
  // const { addCustomerTypeOpen, setAddCustomerTypeOpen } = context;
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const [form] = Form.useForm();

  const onClose = () => {
    // setAddCustomerTypeOpen(false);
    form.resetFields();
  };

  const onFinish = (values) => {
    if (values.name !== "") {
      const apiData = {
        name: values.name,
      };
      // setFormInput(apiData);
      dispatch(addNewCustomerTypeAction(apiData));
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    if (state.addCustomerType.data !== "") {
      if (state.addCustomerType.data.data.error === false) {
        dispatch(customerTypeAction());
        onClose();
      }
    }
  }, [state]);

  return (
    <>
      <Drawer
        className="container"
        title={
          <>
            <CloseOutlined onClick={onClose} /> &nbsp;&nbsp;&nbsp;
            <span>Add Customer Type</span>{" "}
          </>
        }
        width={520}
        closable={false}
        onClose={onClose}
        // open={addCustomerTypeOpen}
        style={{ overflowY: "auto" }}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item label="Name" name="name" required>
            <Input required />
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
export default AddNewCustomerType;

const style = {
  lable: {
    lineHeight: "40px",
    color: "black",
  },
};

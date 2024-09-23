import { Button, Drawer, Form, Input } from "antd";
import React, { useEffect } from "react";
import { useContext } from "react";
import Context from "../../context/Context";
import { CloseOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  addLeadCategory,
  leadCategoryAction,
} from "../../redux/action/leadManagementAction";

const AddLeadCategoryView = () => {
  const context = useContext(Context);
  const { leadCategoryVieOpen, setLeadCategoryVieOpen } = context;
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const [form] = Form.useForm();

  const onClose = () => {
    setLeadCategoryVieOpen(false);
    form.resetFields();
  };

  const onFinish = (values) => {
    const apiData = values;
    dispatch(addLeadCategory(apiData));
    setTimeout(() => {
      dispatch(leadCategoryAction());
    }, 400);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    if (state.addLeadCategory.data !== "") {
      if (state.addLeadCategory.data.data.error === false) {
        onClose();
      }
    }
  }, [state]);

  return (
    <Drawer
      className="container"
      title={
        <>
          <CloseOutlined onClick={onClose} /> &nbsp;&nbsp;&nbsp;
          <span>Create Lead Category</span>{" "}
        </>
      }
      width={520}
      closable={false}
      onClose={onClose}
      open={leadCategoryVieOpen}
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
        <Form.Item label="Lead category Name" name="name" required>
          <Input required size="large" />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddLeadCategoryView;

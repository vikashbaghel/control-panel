import { Button, Drawer, Form, Input } from "antd";
import React from "react";
import { useContext } from "react";
import Context from "../../context/Context";
import { CloseOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  leadCategoryAction,
  updateLeadCategory,
} from "../../redux/action/leadManagementAction";
import { useEffect } from "react";
import { useSelector } from "react-redux/es/exports";

const EditLeadCategoryView = () => {
  const context = useContext(Context);
  const {
    editLeadCategoryViewOpen,
    setEditLeadCategoryViewOpen,
    leadCategoryData,
    setLeadCategoryData,
  } = context;
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  const [name, setName] = useState("");

  const onClose = () => {
    setEditLeadCategoryViewOpen(false);
    setLeadCategoryData("");
    setName("");
  };

  const onFinish = (e) => {
    e.preventDefault(e);
    const apiData = { name: name ? name : leadCategoryData.name };
    dispatch(updateLeadCategory(leadCategoryData.id, apiData));
    setTimeout(() => {
      dispatch(leadCategoryAction());
    }, 400);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    if (state.leadCategoryDetails.data !== "") {
      if (state.leadCategoryDetails.data.data.error === false) {
        setLeadCategoryData(state.leadCategoryDetails.data.data.data);
      }
    }
    if (state.updateLeadCategory.data !== "") {
      if (state.updateLeadCategory.data.data.error === false) {
        onClose();
      }
    }
  }, [state]);

  return leadCategoryData ? (
    <Drawer
      className="container"
      title={
        <>
          <CloseOutlined onClick={onClose} /> &nbsp;&nbsp;&nbsp;
          <span>Edit Lead Category</span>{" "}
        </>
      }
      width={520}
      closable={false}
      onClose={onClose}
      open={editLeadCategoryViewOpen}
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
          label="Lead category Name"
          name="name"
          required
          // rules={[{  message: 'Please input Customer category' }]}
        >
          <Input
            required
            size="large"
            defaultValue={leadCategoryData.name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" onClick={onFinish}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  ) : (
    <></>
  );
};

export default EditLeadCategoryView;

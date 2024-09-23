import React, { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Drawer, Form, Input, Card } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import Context from "../../context/Context";
import { productUnitAddService } from "../../redux/action/productUnitAction";

const EditNewProductUnit = () => {
  const dispatch = useDispatch();
  const context = useContext(Context);
  const {
    editProductUnitOpen,
    setEditProductUnitOpen,
    editProductUnitValue,
    setEditProductUnitValue,
  } = context;
  const [formInput, setFormInput] = useState("");

  const onClose = () => {
    setEditProductUnitOpen(false);
    setEditProductUnitValue("");
  };

  const onFinish = (values) => {
    if (values.name !== "") {
      const apiData = {
        id: editProductUnitValue.id,
        name: values.name ? values.name : editProductUnitValue.name,
      };
      setFormInput(apiData);
      dispatch(productUnitAddService(apiData));
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  /* eslint-disable no-template-curly-in-string */
  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };

  return (
    <>
      {editProductUnitValue && (
        <Drawer
          title={
            <>
              <CloseOutlined onClick={onClose} />
              &nbsp;&nbsp;&nbsp; Update Product Unit
            </>
          }
          width={520}
          closable={false}
          onClose={onClose}
          open={editProductUnitOpen}
          style={{ overflowY: "auto" }}
        >
          <Form
            {...layout}
            // name="nest-messages"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            validateMessages={validateMessages}
          >
            <Card>
              <Form.Item style={{ fontWeight: "600" }} name="name" label="Name">
                <Input defaultValue={editProductUnitValue.name} />
              </Form.Item>

              <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Card>
          </Form>
        </Drawer>
      )}
    </>
  );
};

export default EditNewProductUnit;

import React, { useContext } from "react";
import Context from "../../context/Context";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Drawer, Form, Input } from "antd";
import {
  addNewCustomerCategoryAction,
  customerCategoryAction,
} from "../../redux/action/customerCategoryAction";
import { useDispatch } from "react-redux";

const AddNewCustomerCategory = () => {
  const context = useContext(Context);
  const { orderViewOpen, setOrderViewOpen, categoryFlag, setCategoryFlag } =
    context;
  const dispatch = useDispatch();

  const onClose = () => {
    setCategoryFlag(false);
  };

  const onFinish = (values) => {
    if (values.name !== "") {
      const apiData = {
        name: values.name,
        discount_value: values.discount_value,
      };
      // setFormInput(apiData);
      dispatch(addNewCustomerCategoryAction(apiData));
      setTimeout(() => {
        dispatch(customerCategoryAction(1));
        onClose();
      }, 500);
    }
  };

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
            <span>Add New Category</span>{" "}
          </>
        }
        width={520}
        closable={false}
        onClose={onClose}
        open={categoryFlag}
        style={{ overflowY: "auto" }}
      >
        {/* <Form
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
          size="large"
        >
          <label style={style.lable}>
            Category Name{" "}
            <span style={{ color: "red", fontSize: "20px" }}>*</span>
          </label>

          <Input
            placeholder="Category Name"
            prefix={<UserOutlined />}
            allowclear={{
              clearIcon: <CloseCircleTwoTone twoToneColor="red" />,
            }}
            rules={[
              { required: true, message: "please enter a category name" },
            ]}
            value={categoryName}
            onChange={(e) => {
              setCategoryName(e.target.value);
              if (e.target.value.length > 0) {
                setError(false);
              } else {
                setError(true);
              }
            }}
          />
          <p>
            {error ? (
              <span style={{ color: "red" }}>Customer Name Can Not Empty</span>
            ) : (
              ""
            )}
          </p>
          <label style={style.lable}>Discount in (%) </label>
          <Input
            allowclear={{
              clearIcon: <CloseCircleTwoTone twoToneColor="red" />,
            }}
            placeholder="Discount in (%)"
            value={discount}
            // type="number"
            onKeyDown={(e) => {
              if (!/[0-9.]/.test(e.key)) {
                e.preventDefault();
              }
            }}
            inputmode="numeric"
            onChange={(e) => setDiscount(e.target.value)}
          />

          <div style={{ marginTop: 20, display: "flex" }}>
            <Button
              type="primary"
              style={{ marginRight: 15 }}
              onClick={handleAddCategory}
            >
              Submit
            </Button>
            <Button onClick={onClose} danger>
              Cancel
            </Button>
          </div>
        </Form> */}
        <Form
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

          <Form.Item label="Discount in (%)" name="discount_value">
            <Input />
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
export default AddNewCustomerCategory;

const style = {
  lable: {
    lineHeight: "40px",
    color: "black",
  },
};

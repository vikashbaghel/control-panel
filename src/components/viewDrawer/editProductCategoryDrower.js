import React, { useContext, useState, useEffect } from "react";
import Context from "../../context/Context";
import { CloseOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { Button, Checkbox, Drawer, Form, Input, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  editProductCategoryAction,
  productCategoryAction,
  productCategoryDetailsAction,
} from "../../redux/action/productCategoryAction";
import KnowMore from "../../assets/know-more.svg";
import IsMenu from "../../assets/is-menu-tooltip.gif";
import IsFeature from "../../assets/is-feature-tooltip.gif";
import DefaultImage from "../../assets/default-image.svg";

const EditProductCategory = () => {
  const context = useContext(Context);
  const state = useSelector((state) => state);
  const {
    editProductCategoryData,
    setEditProductCategoryData,
    editProductCategoryOpen,
    setEditProductCategoryOpen,
  } = context;
  const dispatch = useDispatch();
  const [isMenu, setIsMenu] = useState();
  const [isFeature, setIsFeature] = useState();
  const [newData, setNewData] = useState("");
  const [gifLoop, setGifLoop] = useState("");

  const onClose = () => {
    setEditProductCategoryOpen(false);
    setEditProductCategoryData("");
    setNewData("");
  };

  const onFinish = (values) => {
    if (values.name !== "") {
      const apiData = {
        id: editProductCategoryData.id,
        name: values.name ? values.name : newData.name ? newData.name : "",
        is_menu: isMenu,
        is_featured: isFeature,
      };
      dispatch(editProductCategoryAction(apiData));
      setTimeout(() => {
        dispatch(productCategoryAction());
      }, 500);
    }
  };

  useEffect(() => {
    dispatch(productCategoryDetailsAction(editProductCategoryData.id));
  }, [editProductCategoryData.id]);

  useEffect(() => {
    if (state.getProductCategoryDetails.data !== "") {
      if (state.getProductCategoryDetails.data.data.error === false) {
        setNewData(state.getProductCategoryDetails.data.data.data);
      }
    }
  }, [state]);

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleMouseEnter = (event, data) => {
    event.target.src = data;
  };

  const handleMouseLeave = (event, data) => {
    event.target.src = data;
  };

  return (
    <>
      {newData && (
        <Drawer
          className="container"
          title={
            <>
              <CloseOutlined onClick={onClose} /> &nbsp;&nbsp;&nbsp;
              <span>Edit Product Category</span>{" "}
            </>
          }
          width={520}
          closable={false}
          onClose={onClose}
          open={editProductCategoryOpen}
          style={{ overflowY: "auto" }}
        >
          <Form
            name="basic"
            labelCol={{ span: 11 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="Name"
              name="name"
              required
              // rules={[{  message: 'Please input Customer category' }]}
            >
              <Input defaultValue={newData && newData.name} required />
            </Form.Item>
            <Form.Item
              label={
                <div style={{ display: "flex", alignItems: "center" }}>
                  Set in Menu bar
                  <Tooltip
                    style={{ width: "300px" }}
                    placement="bottom"
                    title={
                      <div>
                        Selected category will be shown in the top header mean
                        bar of the website
                        <img
                          src={gifLoop}
                          alt="img"
                          style={{ width: "100%" }}
                        />
                      </div>
                    }
                  >
                    <img
                      src={KnowMore}
                      alt="img"
                      style={{ margin: "0 10px" }}
                      onMouseEnter={() => setGifLoop(IsMenu)}
                      onMouseLeave={() => setGifLoop(DefaultImage)}
                    />
                  </Tooltip>
                </div>
              }
              name="is_menu"
            >
              <Checkbox
                onChange={(e) => setIsMenu(e.target.checked)}
                defaultChecked={newData.is_menu === true ? true : false}
              />
            </Form.Item>
            <Form.Item
              label={
                <div style={{ display: "flex", alignItems: "center" }}>
                  Set as Featured product
                  <Tooltip
                    style={{ width: "300px" }}
                    placement="bottom"
                    title={
                      <div>
                        You can select up to 3 categories to feature on the main
                        landing page of our website.
                        <img
                          src={IsFeature}
                          alt="img"
                          style={{ width: "100%" }}
                        />
                      </div>
                    }
                  >
                    <img
                      src={KnowMore}
                      alt="img"
                      style={{ margin: "0 10px" }}
                      onMouseEnter={() => setGifLoop(IsFeature)}
                      onMouseLeave={() => setGifLoop(DefaultImage)}
                    />
                  </Tooltip>
                </div>
              }
              name="Is_feature"
            >
              <Checkbox
                onChange={(e) => setIsFeature(e.target.checked)}
                defaultChecked={newData.is_featured === true ? true : false}
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
export default EditProductCategory;

const style = {
  lable: {
    lineHeight: "40px",
    color: "black",
  },
};

import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Context from "../../context/Context";
import {
  CloseCircleTwoTone,
  CloseOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Drawer, Button, Select, Form, Input, Switch } from "antd";

import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import styles from "../viewDrawer/pricing.module.css";
import ProductPricing from "../productPricing/productPricing";
import ShowHideSelect from "../productPricing/productPricing";
import {
  addPricingGroup,
  addProductPricingGroup,
  pricingGroupListService,
} from "../../redux/action/pricingGroupAction";
import {
  searchProduct,
  searchProductPricing,
} from "../../redux/action/productAction";
import { useParams } from "react-router-dom";

const { TextArea } = Input;
const { Search } = Input;

const { Option } = Select;

const AddNewProductPricing = () => {
  const context = useContext(Context);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formInput, setFormInput] = useState("");
  const state = useSelector((state) => state);

  const { addProductPricingOpen, setAddProductPricingOpen } = context;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [toggles, setToggles] = useState(false);
  const [price, setPrice] = useState("");
  const [Discount, setDiscount] = useState("");

  const [inputList, setInputList] = useState([{ qty: "", price: "" }]);
  const [record, setRecord] = useState("");
  const [searchProduct, setSearchProduct] = useState([]);
  const [searchSelectValue, setSearchSelectValue] = useState("");

  const [showData, setShowData] = useState("");

  useEffect(() => {
    if (state.addPricingGroup.data !== "") {
      if (state.addPricingGroup.data.data.error === false) {
        setRecord(state.addPricingGroup.data.data.data);
      }
    }
    if (state.searchProduct.data !== "") {
      if (state.searchProduct.data.data.error === false) {
        setSearchProduct(state.searchProduct.data.data.data);
      }
    }
  }, [state]);

  const { id, Pricing_name } = useParams();

  useEffect(() => {
    dispatch(searchProductPricing());
  }, []);

  // useEffect(() => {
  //   if (state.addPricingGroup.data !== "") {
  //     if (state.addPricingGroup.data.data.error === false) {
  //       setRecord(state.addPricingGroup.data.data.data);
  //     }
  //   }
  // }, [state]);

  const onClose = () => {
    setAddProductPricingOpen(false);
  };

  const onFinish = (values) => {
    if (values.name !== "") {
      const apiData = {
        name: name,
        description: description ? description : "",
      };
      setFormInput(apiData);
      dispatch(addProductPricingGroup(apiData));
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

  // Search for product
  const onSearch = (e) => {
    setSearchValue(e.target.value);
    // if (searchValue.length > 1) {
    if (e.target.value.length > 2) {
      let apiData = {
        name: e.target.value,
      };
      dispatch(searchProductPricing(apiData));
    }
  };

  const onChange = (checked) => {
    setToggles(checked);
  };

  // handle input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setInputList([...inputList, { qty: "", price: "" }]);
  };

  const handleDataFilter = (e) => {
    let newFilterData = searchProduct.filter((item) => item.id === e);
    setShowData(newFilterData);
  };

  return (
    <>
      <Drawer
        className="container"
        title={
          <>
            <CloseOutlined onClick={onClose} /> <span>Add Product Pricing</span>{" "}
          </>
        }
        width={600}
        closable={false}
        onClose={onClose}
        open={addProductPricingOpen}
        style={{ overflowY: "hidden", padding: "0px" }}
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
            overflowY: "hidden",
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div
            style={{ height: "600px", overflowY: "auto", overflowX: "hidden" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "20px",
              }}
            >
              <label style={{ fontWeight: "600" }}>Search Product :</label>
              <div style={{ display: "flex", gap: "20px" }}>
                <Search
                  placeholder="Search..."
                  size="large"
                  onChange={onSearch}
                  // allowclear={{
                  //   clearIcon: <CloseCircleTwoTone twoToneColor="red" />,
                  // }}
                  style={{ width: 230 }}
                />
                <Select
                  showSearch
                  style={{ width: 230 }}
                  onChange={(e) => {
                    handleDataFilter(e);
                    setSearchSelectValue(e);
                  }}
                  // onChange={onSearch}
                  placeholder="Select a value"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {searchProduct.map((item, index) => (
                    <Option key={item.index} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
            {/* Name Input */}

            <Form.Item name="name" required>
              <label style={{ fontWeight: "600" }}>
                Product Name :<sup style={{ color: "red" }}>*</sup>
              </label>
              <Input
                onChange={(e) => setName(e.target.value)}
                style={{ width: "480px", height: "50px" }}
                value={showData[0] && showData[0].name}
              />
            </Form.Item>

            <div>
              <div style={{ display: "flex", gap: "30px" }}>
                <Form.Item name="name" required>
                  <label style={{ fontWeight: "600" }}>Code</label>
                  <Input
                    style={{ width: "220px", height: "50px" }}
                    disabled
                    value={showData[0] && showData[0].code}
                    price
                  />
                </Form.Item>

                <Form.Item name="name">
                  <label style={{ fontWeight: "600" }}>Base Price :</label>
                  <Input
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: "220px", height: "50px" }}
                    value={showData[0] && showData[0].price}
                    disabled
                  />
                </Form.Item>
              </div>

              {/* <div style={{ display: "flex", gap: "20px" }}>
                <Form.Item name="name" required>
                  <label style={{ fontWeight: "600" }}>Set Price </label>
                  <Input
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: "220px", height: "50px" }}
                  />
                </Form.Item>

                <Form.Item name="name" required>
                  <label style={{ fontWeight: "600" }}>Price % </label>
                  <Input
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: "220px",
                      height: "50px",
                      marginRight: "40px",
                    }}
                  />
                </Form.Item>
              </div> */}

              {/* <div style={{ display: "flex" }}>
                <Form.Item name="name" required>
                  <label style={{ fontWeight: "600" }}>Target Price</label>
                  <Input
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: "210px", height: "50px" }}
                  />
                </Form.Item>

                <Form.Item name="name" required>
                  <label style={{ fontWeight: "600" }}>Price %</label>
                  <Input
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: "210px", height: "50px" }}
                  />
                </Form.Item>
              </div> */}
            </div>

            <div>
              <label style={{ fontWeight: "600" }}>Telescopic Price </label>
              <Switch onChange={onChange} />
            </div>

            {toggles ? (
              <>
                <div>
                  {inputList.map((x, i) => {
                    return (
                      <div
                        style={{
                          border: "1px solid #D9D9D9",
                          borderRadius: "8px",
                          padding: "15px",
                          marginTop: "30px",
                          width: "460px",
                        }}
                      >
                        <div style={{ display: "flex", gap: "50px" }}>
                          <Form.Item name="qty" required>
                            <label style={{ fontWeight: "600" }}>Qty</label>
                            <Input
                              // onChange={(e) => setName(e.target.value)}
                              style={{ width: "200px", height: "40px" }}
                              // value={x.qty}
                              name="qty"
                              onChange={(e) => handleInputChange(e, i)}
                            />
                          </Form.Item>

                          <Form.Item required>
                            <label style={{ fontWeight: "600" }}>
                              Base Price :
                            </label>
                            <Input
                              // onChange={(e) => setName(e.target.value)}
                              style={{ width: "200px", height: "40px" }}
                              value={x.price}
                              disabled
                            />
                          </Form.Item>
                        </div>

                        <div style={{ display: "flex", gap: "50px" }}>
                          <Form.Item name="set_price" required>
                            <label style={{ fontWeight: "600" }}>
                              Set Price
                            </label>
                            <Input
                              // onChange={(e) => setName(e.target.value)}
                              style={{ width: "200px", height: "40px" }}
                              defaultValue={x.set_price}
                              name="price"
                              onChange={(e) => {
                                handleInputChange(e, i);
                                setPrice(e.target.value);
                              }}
                            />
                          </Form.Item>

                          <Form.Item name="price" required>
                            <label style={{ fontWeight: "600" }}>
                              Price % :
                            </label>
                            <Input
                              // onChange={(e) => setName(e.target.value)}
                              style={{ width: "200px", height: "40px" }}
                              defaultValue={x.price}
                              // onChange={(e) => handleInputChange(e, i)}
                              onChange={(e) => {
                                handleInputChange(e, i);
                                setDiscount(e.target.value);
                              }}
                            />
                          </Form.Item>
                        </div>
                        <div></div>
                      </div>
                    );
                  })}
                  {/* {inputList.length - 1 === i && */}
                  <Button
                    style={{
                      height: "40px",
                      marginTop: "20px",
                      marginBottom: "20px",
                    }}
                    htmlType="submit"
                    onClick={handleAddClick}
                    type="primary"
                  >
                    + Add More
                  </Button>
                  {/* } */}
                </div>
              </>
            ) : (
              <></>
            )}
          </div>

          <div style={{ borderTop: "1px solid #D9D9D9" }}>
            <Form.Item>
              <div
                style={{ position: "absolute", display: "flex", gap: "20px" }}
              >
                <Button
                  style={{ height: "40px" }}
                  type="primary"
                  htmlType="submit"
                >
                  Save
                </Button>
                <Button style={{ height: "40px" }} htmlType="submit">
                  Cancel
                </Button>
              </div>
            </Form.Item>
          </div>
        </Form>
      </Drawer>
    </>
  );
};
export default AddNewProductPricing;

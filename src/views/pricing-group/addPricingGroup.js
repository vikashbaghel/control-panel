import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  addProductPricingGroup,
  deleteProductFromPricingGroup,
  telescopicPricingList,
  updateTelescopicPricingGroup,
} from "../../redux/action/pricingGroupAction";
import { Content } from "antd/es/layout/layout";
import { Popconfirm, Tooltip, notification } from "antd";
import { searchProductPricing } from "../../redux/action/productAction";
import { InfoCircleOutlined } from "@ant-design/icons";
import Mines from "../../assets/mines-button.svg";
import { roundToDecimalPlaces } from "../../helpers/roundToDecimal";
import { ArrowLeft, DeleteIcon, EditIcon } from "../../assets/globle";
import { PlusIcon } from "../../assets/settings/index";
import { toIndianCurrency } from "../../helpers/convertCurrency";
import { NoPhoto } from "../../assets";
import styles from "./pricng.module.css";
import ConfirmDelete from "../../components/confirmModals/confirmDelete";
import { useContext } from "react";
import Context from "../../context/Context";

const AddPricingGroup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state);
  const context = useContext(Context);
  const { setDeleteModalOpen } = context;
  const [searchParams, setSearchParams] = useSearchParams();
  const [record, setRecord] = useState({
    id: searchParams.get("id"),
    name: searchParams.get("name"),
    description: searchParams.get("description"),
    "product-count": searchParams.get("product-count"),
  });

  const regex = /^-?\d*(\.\d{0,2})?$/;

  const [telescopicList, setTelescopicList] = useState([]);
  const [search, setSearch] = useState("");
  const [activeRow, setActiveRow] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({});

  const [enableTelescopicForAll, setEnableTelescopicForAll] = useState(false);

  //   for creating telescopic pricing
  const [enableTelescopePricing, setEnableTelescopePricing] = useState(false);
  const initialTelescopePricing = {
    qty: 1,
    price: selectedProduct.price ? selectedProduct.price : null,
    discount: null,
  };
  const [telescopicPriceList, setTelescopicPriceList] = useState([
    initialTelescopePricing,
  ]);

  //   for updating teleescopic pricing
  const [enableUpdateTelescopePricing, setEnableUpdateTelescopePricing] =
    useState(false);
  const [updateMrpPrice, setUpdateMrpPrice] = useState(0);
  const [updateTelescopicPriceList, setUpdateTelescopicPriceList] = useState(
    []
  );
  const [updateRowIndex, setUpdateRowIndex] = useState(null);

  const [removeProductData, setRemoveProductData] = useState({});

  const handleSearch = (e) => {
    setSelectedProduct((prevState) => ({
      ...prevState,
      name: e.target.value,
    }));
    setTimeout(() => {
      setSearch(e.target.value);
    }, 500);
  };

  const handleOptionList = (option) => {
    setSelectedProduct(option);
    const newInputValues = [...telescopicPriceList];
    newInputValues[0]["price"] = roundToDecimalPlaces(option.price);
  };

  const handleEnableTelescopic = (checked) => {
    setEnableTelescopePricing(checked);
  };

  //   useEffect list for different effect
  useEffect(() => {
    if (search !== "") {
      dispatch(searchProductPricing(search));
    }
  }, [search]);

  useEffect(() => {
    dispatch(telescopicPricingList(record.id));
  }, [record.id]);

  useEffect(() => {
    if (state.teleScopicPricingList.data !== "") {
      if (state.teleScopicPricingList.data.data.error === false) {
        setTelescopicList(state.teleScopicPricingList.data.data.data);
      }
    }
    if (state.searchProduct.data !== "") {
      if (state.searchProduct.data.data.error === false) {
        const productData = state.searchProduct.data.data.data.map(
          (product) => ({
            name: product.name,
            id: product.id,
            code: product.code,
            price: product.price,
            mrp_price: product.mrp_price,
            unit: product.unit,
          })
        );
        setOptions(productData);
      }
    }
  }, [state]);

  //   to handle the teleScopicPricingList input
  const inputStyle = { width: 80, padding: 8, textAlign: "center" };
  const handleAddRow = (index) => {
    const updatedValues = [...telescopicPriceList];
    updatedValues.splice(index + 1, 0, initialTelescopePricing);
    setTelescopicPriceList(updatedValues);
  };

  const handleInputChange = (event, rowIndex, field) => {
    event.preventDefault();
    const newInputValues = [...telescopicPriceList];
    if (field === "discount") {
      if (regex.test(event.target.value)) {
        newInputValues[rowIndex][field] = event.target.value;
      }
    } else if (field === "price") {
      if (/^\d*(\.\d{0,4})?$/.test(event.target.value)) {
        newInputValues[rowIndex][field] = event.target.value;
      }
    } else {
      newInputValues[rowIndex][field] = event.target.value;
    }

    // for discount calculation
    if (field === "price") {
      let calculateDiscountValue =
        ((event.target.value - selectedProduct.price) / selectedProduct.price) *
        100;
      newInputValues[rowIndex]["discount"] = roundToDecimalPlaces(
        calculateDiscountValue
      );
    }

    // for price calculation
    if (field === "discount") {
      let calculatePriceValue =
        selectedProduct.price +
        (selectedProduct.price * event.target.value) / 100;

      newInputValues[rowIndex]["price"] = isNaN(calculatePriceValue)
        ? 0
        : parseFloat(calculatePriceValue);
    }
    setTelescopicPriceList(newInputValues);
  };

  const handleRemoveRow = (index) => {
    let newTelescopePricingList = telescopicPriceList.filter(
      (item, idx) => idx !== index
    );
    setTelescopicPriceList(newTelescopePricingList);
  };

  const handleCreateTelescopicPricing = () => {
    let newTelescopePriceList = telescopicPriceList
      .map(({ qty, price }) => {
        return { qty, price };
      })
      .flat();

    newTelescopePriceList.forEach((item) => {
      item.qty = roundToDecimalPlaces(item.qty);
      item.price = roundToDecimalPlaces(item.price);
    });

    const formData = {
      id: parseFloat(record.id),
      product_id: selectedProduct && selectedProduct.id,
      is_enable_telescope_pricing: enableTelescopePricing,
      target_mrp_price: roundToDecimalPlaces(selectedProduct.mrp_price),
      telescope_pricing: newTelescopePriceList,
    };
    dispatch(addProductPricingGroup(formData));
    setTimeout(() => {
      dispatch(telescopicPricingList(record.id));
      setEnableTelescopePricing(enableTelescopicForAll);
      setTelescopicPriceList([initialTelescopePricing]);
      setSelectedProduct({
        name: "",
        id: "",
        code: "",
        price: 0,
        mrp_price: 0,
        unit: "",
      });
    }, 500);
  };

  //   to handle the Edit teleScopicPricingList input
  const handleEditButton = (data, index) => {
    const newArray = data.telescope_pricing.map((obj) => ({
      ...obj,
      discount: roundToDecimalPlaces(calculateDiscount(obj.price, data.price)),
    }));
    setUpdateTelescopicPriceList(newArray);
    setUpdateRowIndex(index);
    setEnableUpdateTelescopePricing(data.is_enable_telescope_pricing);
    setUpdateMrpPrice(data.target_mrp_price);
  };

  const handleUpdateAddRow = (index, price) => {
    const updatedValues = [...updateTelescopicPriceList];
    const initialupdateTelescopicPricing = {
      qty: 1,
      price: price,
      discount: null,
    };
    updatedValues.splice(index + 1, 0, initialupdateTelescopicPricing);
    setUpdateTelescopicPriceList(updatedValues);
  };

  const handleUpdateInputChange = (event, rowIndex, field, price) => {
    event.preventDefault();
    const newInputValues = [...updateTelescopicPriceList];

    if (field === "discount") {
      if (regex.test(event.target.value)) {
        newInputValues[rowIndex][field] = event.target.value;
      }
    } else if (field === "price") {
      if (event.target.value?.length === 0 && !event.target.value) {
        newInputValues[rowIndex][field] = "";
      } else if (/^\d+(\.\d{0,4})?$/.test(event.target.value)) {
        newInputValues[rowIndex][field] = event.target.value;
      }
    } else {
      newInputValues[rowIndex][field] = event.target.value;
    }

    // for discount calculation
    if (field === "price") {
      const val = newInputValues[rowIndex]["price"];
      let calculateDiscountValue = ((val - price) / price) * 100;

      newInputValues[rowIndex]["discount"] = roundToDecimalPlaces(
        calculateDiscountValue
      );
    }
    // for price calculation
    if (field === "discount") {
      const val = newInputValues[rowIndex]["discount"];
      let calculatePriceValue = price + (price * val) / 100;
      newInputValues[rowIndex]["price"] =
        roundToDecimalPlaces(calculatePriceValue);
    }
    setUpdateTelescopicPriceList(newInputValues);
  };

  const handleUpdateRemoveRow = (index) => {
    let newTelescopePricingList = updateTelescopicPriceList.filter(
      (item, idx) => idx !== index
    );
    setUpdateTelescopicPriceList(newTelescopePricingList);
  };

  const handleUpdateTelescopicPricing = (item) => {
    let newValue;
    if (enableUpdateTelescopePricing) {
      newValue = updateTelescopicPriceList.map(({ qty, price }) => {
        return { qty, price };
      });
    } else {
      newValue = updateTelescopicPriceList
        .filter((data) => data.qty === 1)
        .map((data) => [{ qty: data.qty, price: data.price }])
        .flat();
    }

    newValue.forEach((item) => {
      item.qty = roundToDecimalPlaces(item.qty);
      item.price = roundToDecimalPlaces(item.price, 4);
    });

    const formData = {
      product_id: item.product,
      is_enable_telescope_pricing: enableUpdateTelescopePricing,
      target_mrp_price: roundToDecimalPlaces(updateMrpPrice),
      telescope_pricing: newValue,
    };
    dispatch(
      updateTelescopicPricingGroup(item.pricing_group, item.id, formData)
    );
    setTimeout(() => {
      dispatch(telescopicPricingList(record.id));
      setUpdateRowIndex(null);
    }, 1000);
  };

  const handleDeleteProduct = (action, data) => {
    if (action) {
      dispatch(deleteProductFromPricingGroup(record.id, data.id));
      setTimeout(() => {
        dispatch(telescopicPricingList(record.id));
        setUpdateRowIndex(null);
      }, 1000);
    }
  };

  return (
    <div className="table_list position-rel">
      <h2
        className="page_title"
        style={{ display: "flex", alignItems: "center", gap: ".5em" }}
      >
        {record?.name && (
          <img
            src={ArrowLeft}
            alt="Back"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(-1)}
          />
        )}{" "}
        Product Pricing List
      </h2>
      <Content
        style={{
          padding: "24px 0",
          margin: 0,
          minHeight: "82vh",
          background: "transparent",
        }}
      >
        <div className={styles.pricing_container}>
          <div className={styles.pricing_group_header}>
            <div className={styles.header_left}>
              <div className={styles.header_name}>
                <div>Name</div>
                <div>{record.name}</div>
              </div>
              {record.description && (
                <div className={styles.header_description}>
                  <div>Description </div>
                  <div>{record.description}</div>
                </div>
              )}
              <div className={styles.header_name}>
                <div>No. of Products </div>
                <div>{record["product-count"]}</div>
              </div>
            </div>
            <div className={styles.header_right}>
              <div>Enable Telescopic For All </div>
              <div
                className={`custom-toggle-container pricing_group_switch ${
                  enableTelescopicForAll ? "active" : ""
                }`}
                onClick={() => {
                  setEnableTelescopicForAll(!enableTelescopicForAll);
                  setEnableTelescopePricing(!enableTelescopicForAll);
                }}
              >
                <div
                  className={`custom-toggle-track ${
                    enableTelescopicForAll ? "active" : ""
                  }`}
                >
                  <div
                    className={`custom-toggle-thumb ${
                      enableTelescopicForAll ? "active" : ""
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.pricing_group_table}>
            <table
              style={{
                border: "none",
                width: "100%",
                minWidth: 1100,
                overflow: "auto",
              }}
            >
              <thead style={{ textAlign: "left" }}>
                <tr>
                  <th>Product Name</th>
                  <th>Code</th>
                  <th>Unit</th>
                  <th>Base Price</th>
                  <th>MRP</th>
                  <th>Telescopic</th>
                  <th
                    style={{
                      //   width: 500,
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                      textAlign: "left",
                    }}
                  >
                    <span>Min. Order Qty.</span>
                    <span>
                      Set Price{" "}
                      <Tooltip title="Price can be set by directly inputing the price in Set price or by % discount / markup Input">
                        <InfoCircleOutlined />
                      </Tooltip>
                    </span>
                    <span>
                      Set discount (-) /{" "}
                      <Tooltip title="Price can be set by directly inputing the price in Set price or by % discount / markup Input">
                        <InfoCircleOutlined />
                      </Tooltip>
                      <br />
                      markup (+) by %
                    </span>
                    <span></span>
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* for adding new product in list */}
                <tr>
                  <td
                    style={{
                      position: "relative",
                      width: 250,
                    }}
                  >
                    {" "}
                    <Tooltip title={selectedProduct.name}>
                      <input
                        type="text"
                        value={selectedProduct.name}
                        placeholder="Search Product..."
                        onChange={(e) => {
                          handleSearch(e);
                          setActiveRow(true);
                        }}
                        onBlur={() =>
                          setTimeout(() => {
                            setActiveRow(false);
                          }, 300)
                        }
                      />
                    </Tooltip>
                    {activeRow === true && options.length > 0 ? (
                      <ul className={styles.pricing_group_table_ul}>
                        {options.map((option, indx) => (
                          <li
                            className={styles.pricing_group_table_li}
                            onClick={() => handleOptionList(option)}
                            key={indx}
                            style={{ padding: "5px 20px" }}
                          >
                            {option.name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <></>
                    )}
                  </td>
                  <td>{selectedProduct.code}</td>
                  <td>{selectedProduct.unit}</td>
                  <td>{toIndianCurrency(selectedProduct.price, 4)}</td>
                  <td style={{ width: 100 }}>
                    <input
                      value={selectedProduct.mrp_price}
                      type="number"
                      onChange={(e) =>
                        setSelectedProduct((prevState) => ({
                          ...prevState,
                          mrp_price: e.target.value,
                        }))
                      }
                    />
                  </td>
                  <td
                    style={{ paddingLeft: "35px", position: "relative" }}
                    className={styles.padding_top_switch}
                  >
                    <div
                      style={{ top: 10 }}
                      className={`custom-toggle-container pricing_group_switch ${
                        enableTelescopePricing ? "active" : ""
                      }`}
                      // onChange={handleEnableTelescopic}
                      onClick={() => {
                        !enableTelescopicForAll &&
                          setEnableTelescopePricing(!enableTelescopePricing);
                      }}
                    >
                      <div
                        className={`custom-toggle-track ${
                          enableTelescopePricing ? "active" : ""
                        }`}
                      >
                        <div
                          className={`custom-toggle-thumb ${
                            enableTelescopePricing ? "active" : ""
                          }`}
                        />
                      </div>
                    </div>
                  </td>
                  {/* Input for telescope Pricing */}
                  <td>
                    <div style={{ position: "relative" }}>
                      {telescopicPriceList.map((item, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                            position: "relative",
                            margin: "5px 0",
                          }}
                        >
                          <input
                            type="number"
                            style={inputStyle}
                            value={item.qty}
                            onChange={(event) =>
                              handleInputChange(event, index, "qty")
                            }
                            disabled={index === 0}
                          />
                          <input
                            type="text"
                            style={inputStyle}
                            value={item?.price}
                            onChange={(event) =>
                              handleInputChange(event, index, "price")
                            }
                            placeholder="₹"
                          />
                          <input
                            type="text"
                            style={inputStyle}
                            value={item.discount}
                            onChange={(event) =>
                              handleInputChange(event, index, "discount")
                            }
                            placeholder="%"
                          />
                          <div
                            style={{
                              display: "flex",
                            }}
                          >
                            {index !== 0 && enableTelescopePricing ? (
                              <img
                                src={Mines}
                                alt="img"
                                width={24}
                                height={24}
                                onClick={() => handleRemoveRow(index)}
                              />
                            ) : (
                              <div style={{ width: 24, height: 24 }}></div>
                            )}
                            {enableTelescopePricing ? (
                              <img
                                src={PlusIcon}
                                alt="img"
                                width={24}
                                height={24}
                                onClick={() => handleAddRow(index)}
                              />
                            ) : (
                              <div style={{ width: 24, height: 24 }}></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>
                    <button
                      className="button_primary"
                      onClick={handleCreateTelescopicPricing}
                      style={{ width: 90, margin: "auto", paddingLeft: 25 }}
                    >
                      Save
                    </button>
                  </td>
                </tr>
                {/* for adding new product in list and update the telescopic list */}
                {telescopicList.map((data, index) => {
                  return (
                    <tr key={index}>
                      <td style={{ display: "flex", alignItems: "center" }}>
                        <img
                          width={"30px"}
                          style={{ marginRight: 10 }}
                          src={data.pics_urls[0] ? data.pics_urls[0] : NoPhoto}
                        />
                        <div>{data.name}</div>
                      </td>
                      <td style={{ justifyContent: "start" }}>{data.code}</td>
                      <td>{data.unit}</td>
                      <td>{toIndianCurrency(data.price, 4)}</td>
                      <td>
                        {updateRowIndex === index ? (
                          <input
                            type="text"
                            pattern="^(\d{1,3}(,\d{3})*|(\d+))(\.\d{2})?$"
                            value={updateMrpPrice}
                            onChange={(e) => setUpdateMrpPrice(e.target.value)}
                          />
                        ) : (
                          <input value={data.target_mrp_price} disabled />
                        )}
                      </td>
                      <td
                        style={{ paddingLeft: "35px", position: "relative" }}
                        className={styles.switch_button}
                      >
                        {updateRowIndex === index ? (
                          <div
                            style={{ top: 10 }}
                            className={`custom-toggle-container pricing_group_switch ${
                              enableUpdateTelescopePricing ? "active" : ""
                            }`}
                            onClick={() => {
                              setEnableUpdateTelescopePricing(
                                !enableUpdateTelescopePricing
                              );
                            }}
                          >
                            <div
                              className={`custom-toggle-track ${
                                enableUpdateTelescopePricing ? "active" : ""
                              }`}
                            >
                              <div
                                className={`custom-toggle-thumb ${
                                  enableUpdateTelescopePricing ? "active" : ""
                                }`}
                              />
                            </div>
                          </div>
                        ) : (
                          <div
                            style={{ top: 10 }}
                            className={`custom-toggle-container pricing_group_switch ${
                              data.is_enable_telescope_pricing ? "active" : ""
                            }`}
                            onChange={() =>
                              notification.warning({
                                message: "Plese Enable Edit First",
                              })
                            }
                          >
                            <div
                              className={`custom-toggle-track ${
                                data.is_enable_telescope_pricing ? "active" : ""
                              }`}
                            >
                              <div
                                className={`custom-toggle-thumb ${
                                  data.is_enable_telescope_pricing
                                    ? "active"
                                    : ""
                                }`}
                              />
                            </div>
                          </div>
                        )}
                      </td>
                      <td>
                        {updateRowIndex === index
                          ? updateTelescopicPriceList.map((item, ind) => {
                              return !enableUpdateTelescopePricing &&
                                ind !== 0 ? (
                                <></>
                              ) : (
                                <div
                                  key={ind}
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-around",
                                    alignItems: "center",
                                    position: "relative",
                                    margin: "5px ",
                                  }}
                                >
                                  <input
                                    type="number"
                                    style={inputStyle}
                                    value={item.qty}
                                    onChange={(event) =>
                                      handleUpdateInputChange(
                                        event,
                                        ind,
                                        "qty",
                                        data.price
                                      )
                                    }
                                    disabled={ind === 0}
                                  />
                                  <input
                                    type="text"
                                    style={inputStyle}
                                    value={item.price}
                                    onChange={(event) =>
                                      handleUpdateInputChange(
                                        event,
                                        ind,
                                        "price",
                                        data.price
                                      )
                                    }
                                  />
                                  <input
                                    type="text"
                                    style={inputStyle}
                                    value={item.discount}
                                    onChange={(event) =>
                                      handleUpdateInputChange(
                                        event,
                                        ind,
                                        "discount",
                                        data.price
                                      )
                                    }
                                    placeholder="%"
                                  />
                                  <div
                                    style={{
                                      display: "flex",
                                    }}
                                  >
                                    {ind !== 0 &&
                                    enableUpdateTelescopePricing ? (
                                      <img
                                        src={Mines}
                                        alt="img"
                                        width={24}
                                        height={24}
                                        onClick={() =>
                                          handleUpdateRemoveRow(ind)
                                        }
                                      />
                                    ) : (
                                      <div
                                        style={{ width: 24, height: 24 }}
                                      ></div>
                                    )}
                                    {enableUpdateTelescopePricing ? (
                                      <img
                                        src={PlusIcon}
                                        alt="img"
                                        width={24}
                                        height={24}
                                        onClick={() =>
                                          handleUpdateAddRow(ind, data.price)
                                        }
                                      />
                                    ) : (
                                      <div
                                        style={{ width: 24, height: 24 }}
                                      ></div>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          : data.telescope_pricing.map((item, ind) => {
                              return (
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-around",
                                    margin: "5px 0 5px 0",
                                  }}
                                >
                                  <div style={inputStyle}>{item.qty}</div>
                                  <div style={inputStyle}>
                                    {toIndianCurrency(item.price, 4)}
                                  </div>
                                  <div style={inputStyle}>
                                    {roundToDecimalPlaces(
                                      calculateDiscount(item.price, data.price),
                                      4
                                    )}
                                    %
                                  </div>
                                  <div style={{ width: 24, height: 24 }}></div>
                                </div>
                              );
                            })}
                      </td>
                      <td>
                        {updateRowIndex !== index ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-around",
                            }}
                          >
                            <button
                              className="button_secondary"
                              onClick={() => handleEditButton(data, index)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "5px 18px",
                              }}
                            >
                              <img
                                width={"20px"}
                                src={EditIcon}
                                style={{ paddingRight: 5 }}
                              />{" "}
                              <span>Edit</span>
                            </button>
                            <img
                              src={DeleteIcon}
                              alt="img"
                              className="clickable"
                              style={{ paddingLeft: 4 }}
                              onClick={() => {
                                setDeleteModalOpen(true);
                                setRemoveProductData(data);
                              }}
                            />
                          </div>
                        ) : (
                          <button
                            className="button_primary"
                            onClick={() => handleUpdateTelescopicPricing(data)}
                            style={{
                              width: 90,
                              margin: "auto",
                              paddingLeft: 25,
                            }}
                          >
                            Save
                          </button>
                        )}
                        <ConfirmDelete
                          title={"Product"}
                          confirmValue={(action) => {
                            handleDeleteProduct(action, removeProductData);
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Content>
    </div>
  );
};

export default AddPricingGroup;

const calculateDiscount = (amount, price) => {
  return ((amount - price) / price) * 100;
};

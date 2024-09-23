import { useState, useEffect, useContext } from "react";
import styles from "../../helpers/helper.module.css";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Row, Select, notification } from "antd";
import Context from "../../context/Context";
import { BASE_URL_V1, org_id } from "../../config";
import { roundToDecimalPlaces } from "../../helpers/roundToDecimal";
import SingleSelectSearch from "../../components/selectSearch/singleSelectSearch";
import { handleScroll } from "../../helpers/regex";
import { DeleteOutlineIcon } from "../../assets/globle";
import noImageFound from "../../assets/no-photo-available.gif";

const { Option } = Select;

const SelectProduct = ({ data }) => {
  const context = useContext(Context);
  const { setProductData } = context;
  const productAPI = `${BASE_URL_V1}/organization/${org_id}/product/es/?is_published=true`;

  const initialValue = {
    id: "",
    name: null,
    type: "COUNT",
    target_value: "",
    unit: "",
    price: "",
    display_pic_url: "",
  };
  const [inputValues, setInputValues] = useState([]);

  const handleAddInput = (e) => {
    e.preventDefault();

    if (inputValues.length > 0 && !inputValues[inputValues.length - 1].id)
      return notification.warning({
        message: "Select Product.",
      });
    if (
      inputValues.length > 0 &&
      (!inputValues[inputValues.length - 1].target_value ||
        isNaN(inputValues[inputValues.length - 1].target_value))
    ) {
      notification.warning({ message: "Quantity Can not be Zero" });
      return;
    }

    setInputValues([...inputValues, initialValue]);
  };

  const handleInputChange = (event, rowIndex, field) => {
    const newInputValues = [...inputValues];
    newInputValues[rowIndex][field] =
      field === "target_value" ? parseFloat(event) : event;
    setInputValues(newInputValues);
  };

  const handleOptionList = (option, rowIndex) => {
    const newInputValues = [...inputValues];
    const dublicatecount = newInputValues.filter(
      (ele) => ele?.id === option?.id
    );

    if (dublicatecount?.length === 1 && option)
      return notification.warning({ message: "Already Added to The List" });
    newInputValues[rowIndex]["name"] = option?.name;
    newInputValues[rowIndex]["id"] = option?.id;
    newInputValues[rowIndex]["unit"] = option?.unit ? option.unit : "";
    newInputValues[rowIndex]["price"] = option?.price;
    newInputValues[rowIndex]["display_pic_url"] = option?.display_pic_url;
    setInputValues(newInputValues);
  };

  const handleDeleteRow = (rowIndex) => {
    let newInputValues = inputValues.filter(
      (data, index) => index !== rowIndex
    );
    setInputValues(newInputValues);
  };

  useEffect(() => {
    const roundedData = inputValues
      .map((item) => ({
        ...item,
        target_value: Number(roundToDecimalPlaces(item.target_value)),
      }))
      .filter((ele) => ele.id !== "");

    if (roundedData) setProductData(roundedData);
  }, [inputValues]);

  useEffect(() => {
    if (data && data.length > 0) return setInputValues(data);
    setInputValues([initialValue]);
  }, [data]);

  return (
    <Col className={styles.add_input_container}>
      {inputValues &&
        inputValues.map((inputValue, index) => (
          <Row key={index} className={styles.add_input_group_1} gutter={20}>
            <Col>
              {inputValue?.name && (
                <img
                  src={inputValue?.display_pic_url || noImageFound}
                  alt={inputValue.name}
                  className={styles.product_image}
                />
              )}
              <SingleSelectSearch
                apiUrl={productAPI}
                onChange={(data) => handleOptionList(data, index)}
                value={inputValue?.name}
                params={{
                  placeholder: "Search Product",
                  style: { width: inputValue?.name ? "86%" : "100%" },
                }}
              />
            </Col>
            <Col className={`${styles.qty_container} create_target_select`}>
              <div>
                <Select
                  value={inputValue.type}
                  onChange={(event) => {
                    handleInputChange(event, index, "type");
                    handleInputChange("", index, "target_value");
                  }}
                >
                  <Option value={"COUNT"}>Qty</Option>
                  <Option value={"AMOUNT"}>&nbsp;&nbsp;₹</Option>
                </Select>
                <input
                  type="number"
                  placeholder="0"
                  onWheel={handleScroll}
                  value={inputValue.target_value}
                  onChange={(event) =>
                    handleInputChange(event.target.value, index, "target_value")
                  }
                />
                {inputValue.type === "COUNT" ? (
                  <span
                    style={{
                      width: 100,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      borderLeft: "1px solid #d9d9d9",
                      paddingLeft: 7,
                      height: "44px",
                      position: "relative",
                      marginTop: -10,
                      paddingTop: 13,
                    }}
                    title={inputValue.unit}
                  >
                    {inputValue.unit === "" || initialValue.unit === null
                      ? "-"
                      : inputValue.unit}
                  </span>
                ) : (
                  <></>
                )}
              </div>
              {index === 0 && inputValues[0].id && (
                <img
                  src={DeleteOutlineIcon}
                  alt="delete"
                  style={{ cursor: "pointer", paddingLeft: 20 }}
                  onClick={() => handleDeleteRow(index)}
                />
              )}
              {index > 0 && (
                <img
                  src={DeleteOutlineIcon}
                  alt="delete"
                  style={{ cursor: "pointer", paddingLeft: 20 }}
                  onClick={() => handleDeleteRow(index)}
                />
              )}
            </Col>
          </Row>
        ))}
      <div style={{ display: "flex", justifyContent: "end" }}>
        <Button
          onClick={handleAddInput}
          className="button_primary"
          style={{ width: 130 }}
        >
          <PlusOutlined />
          Add More
        </Button>
      </div>
    </Col>
  );
};

export default SelectProduct;

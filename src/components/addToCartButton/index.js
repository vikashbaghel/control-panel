import React from "react";
import { handleScroll } from "../../helpers/regex";
import { useEffect, useState } from "react";
import { roundToDecimalPlaces } from "../../helpers/roundToDecimal";
import { CaretDownOutlined } from "@ant-design/icons";

const AddToCartButton = ({ item, onUpdate, setVariantModal }) => {
  const [number, setNumber] = useState(item.qty || 0);
  const [packaging_unit, setPackaging_unit] = useState(
    item["packaging_unit"] || ""
  );

  const handleNumber = (e) => {
    const value = e.target.value;
    if (value === "") {
      setNumber("");
    } else if (value === "0") {
      setNumber(0);
      return;
    } else if (/^\d+(\.\d{0,2})?$/.test(value)) {
      const qty = parseFloat(value);
      onChange({ qty, ...getPackagingLevel() });
    }
  };

  const getPackagingLevel = () => {
    const currentPackagingLevel = item?.packaging_level?.find(
      (ele) => ele.unit === item?.packaging_unit
    );
    if (!currentPackagingLevel) {
      return {
        packaging_unit: item?.packaging_level?.[0]?.unit,
        packaging_size: roundToDecimalPlaces(item?.packaging_level?.[0]?.size),
      };
    } else {
      return {
        packaging_unit: currentPackagingLevel.unit,
        packaging_size: currentPackagingLevel.size,
      };
    }
  };

  const preventKeys = (e) => {
    const keysToPrevent = ["e", "E", "+", "-"];
    if (keysToPrevent.includes(e.key)) e.preventDefault();
  };

  const onChange = (data) => {
    let updatedProduct = { ...item, ...data };
    if (data.qty) {
      updatedProduct.qty = roundToDecimalPlaces(parseFloat(data.qty));
    }
    //update parent
    onUpdate && onUpdate(updatedProduct);
  };

  useEffect(() => {
    if (item["qty"]) {
      setNumber(item["qty"]);
      setPackaging_unit(item["packaging_unit"]);
    } else if (number) {
      setNumber(0);
    }
  }, [item]);

  if (item.primary_product && setVariantModal) {
    return (
      <button
        style={{
          width: "100%",
          minWidth: 250,
          height: 40,
          position: "relative",
        }}
        className="add_button clickable"
        onClick={() => setVariantModal({ open: true, variantDetails: item })}
      >
        {item.variant_count} Options{" "}
        <CaretDownOutlined
          style={{ position: "absolute", right: 20, marginTop: 5 }}
        />
      </button>
    );
  }
  if (item?.is_out_of_stock) {
    return <div style={styles.out_of_stock_btn}>Out of Stock</div>;
  }
  if (!number && !item.qty) {
    return (
      <button
        style={{
          width: "100%",
          minWidth: 250,
          height: 40,
        }}
        className="add_button clickable"
        onClick={() => {
          if (setVariantModal && item?.primary_product && !item.qty) {
            setVariantModal({
              open: true,
              variantDetails: item,
            });
          } else {
            onChange({ qty: 1, ...getPackagingLevel() });
          }
        }}
      >
        Add to Cart
      </button>
    );
  }
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minWidth: 250,
        gap: 10,
        height: 40,
      }}
    >
      <input
        style={{
          textAlign: "center",
          fontSize: 16,
          height: "100%",
          border: "none",
          borderRadius: 0,
          width: "50%",
          background: "none",
          borderBottom: "2px solid #312B81",
          padding: "5px",
          color: "#312B81",
          fontWeight: 600,
        }}
        type="number"
        value={number}
        onKeyPress={preventKeys}
        onChange={handleNumber}
        onWheel={handleScroll}
        onBlur={() => {
          if (!number) {
            setNumber(0);
            onChange({ qty: 0 });
          }
        }}
      />
      <select
        style={{ width: "45%", textAlign: "center", height: "100%" }}
        value={packaging_unit}
        onChange={(e) => {
          let selectedPackagingLevel = item.packaging_level?.filter(
            (item) => item.unit === e.target.value
          );
          onChange({
            packaging_unit: e.target.value,
            packaging_size: roundToDecimalPlaces(
              selectedPackagingLevel[0]?.size
            ),
          });
        }}
        disabled={!!item.initial_qty}
      >
        {item?.packaging_level?.map((ele, index) => {
          return (
            <option value={ele.unit} key={index}>
              {ele.unit}
            </option>
          );
        })}
      </select>
    </div>
  );
};

const styles = {
  out_of_stock_btn: {
    minWidth: 250,
    padding: "10px 0px",
    borderRadius: "5px",
    fontFamily: "Poppins",
    fontWeight: 500,
    textAlign: "center",
    cursor: "not-allowed",
    width: "100%",
    background: "#EEEEEE",
    border: "2px solid #fff",
    color: "#727176",
  },
  counter_control_btns: {
    border: "1px solid #EEE",
    background: "#F3F3F3",
    height: "100%",
    width: "25%",
  },
};

export default AddToCartButton;

import React, { useEffect, useRef, useState } from "react";
import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import styles from "./selectUnit.module.css";
import { useDispatch, useSelector } from "react-redux";
import { productUnitAction } from "../../redux/action/productUnitAction";
import AddProductUnitComponent from "../../views/settings/addProductUnit";

const SelectUnit = ({ value, onChange, error, removeOptions = [] }) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { productUnit } = state;

  const [productUnitList, setProductUnitList] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [showList, setShowList] = useState(false);
  const [unitsCollection, setUnitsCollection] = useState([]);

  const [newProductUnitOpen, setNewProductUnitOpen] = useState(false);

  useEffect(() => {
    if (productUnit.data !== "" && productUnit.data.data.error === false) {
      setProductUnitList(productUnit.data.data.data);
    }
  }, [state]);

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    if (!showList) {
      setSearchInput("");
    }
  }, [showList]);

  useEffect(() => {
    if (removeOptions.length > 0) {
      setUnitsCollection(removeOptions);
    }
  }, [removeOptions]);

  const node = useRef();
  const handleDomClick = (e) => {
    if (!node.current?.contains(e.target)) {
      setShowList(false);
    }
  };

  useEffect(() => {
    if (showList) document.addEventListener("click", handleDomClick);
    return () => {
      document.removeEventListener("click", handleDomClick);
    };
  }, [showList]);

  return (
    <div ref={node} className={styles.select_unit_container}>
      <div style={{ display: "flex" }}>
        <input
          className={styles.input}
          style={{
            ...(error && !value ? { border: "2px solid red" } : {}),
            width: "100%",
          }}
          placeholder="Select a unit"
          value={value}
          readOnly
          onClick={() => setShowList(!showList)}
          data-testid="select-mrp-unit"
        />
        <DownOutlined
          style={{ cursor: "pointer" }}
          onClick={() => setShowList(!showList)}
        />
      </div>
      {showList && (
        <ul>
          <div>
            <span
              onClick={() => {
                setShowList(!showList);
                setNewProductUnitOpen(true);
              }}
              className="clickable"
            >
              Add New Unit
            </span>
          </div>
          <div className={styles.list_group}>
            <SearchOutlined />
            <input
              onChange={handleSearchInput}
              style={{ width: "100%" }}
              data-testid="unit-search-add-product"
            />
          </div>
          {productUnitList.map((value, index) => {
            if (
              !unitsCollection?.includes(value.name.toLowerCase()) &&
              value.name.toLowerCase().includes(searchInput?.toLowerCase())
            ) {
              return (
                <li
                  onClick={() => {
                    onChange(value.name);
                    setTimeout(() => {
                      setShowList(false);
                    }, 500);
                  }}
                  key={index}
                >
                  {value.name}
                </li>
              );
            }
          })}
        </ul>
      )}
      <AddProductUnitComponent
        {...{ newProductUnitOpen, setNewProductUnitOpen }}
        callBack={(ele) => {
          ele?.name && onChange(ele.name);
          dispatch(productUnitAction());
        }}
      />
    </div>
  );
};

export default SelectUnit;

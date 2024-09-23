import { Col, Divider, Dropdown, Row, Space } from "antd";
import React, { useState } from "react";
import styles from "./product.module.css";
import { CaretDownOutlined, CloseCircleFilled } from "@ant-design/icons";
import { Filter } from "../../assets";
import { BASE_URL_V1, org_id } from "../../config";
import SingleSelectSearch from "../../components/selectSearch/singleSelectSearch";
import { CrossIcon } from "../../assets/globle";

const endpoints = {
  PRODUCT_CATEGORIES: `${BASE_URL_V1}/organization/${org_id}/category/?dd=true`,
  PRODUCT_BRANDS: `${BASE_URL_V1}/organization/${org_id}/product/brand/?dd=true`,
};

const productSortList = [
  {
    label: "Name : A-Z",
    params: {
      sort_by: "name",
      sort_order: "ASC",
    },
  },
  {
    label: "Name : Z-A",
    params: {
      sort_by: "name",
      sort_order: "DESC",
    },
  },
  {
    label: "Code : 1-Z",
    params: {
      sort_by: "",
      sort_order: "",
    },
  },
  {
    label: "Code : Z-1",
    params: {
      sort_by: "code",
      sort_order: "DESC",
    },
  },
  {
    label: "Brand : A-Z",
    params: {
      sort_by: "brand",
      sort_order: "ASC",
    },
  },
  {
    label: "Brand : Z-A",
    params: {
      sort_by: "brand",
      sort_order: "DESC",
    },
  },
];

const constants = {
  defaultSortIndex: 2,
};

const SortProducts = ({ value, onChange }) => {
  return (
    <Dropdown
      menu={{
        items: productSortList.map((obj, index) => ({
          key: `${index}`,
          label: (
            <a
              onClick={() => {
                onChange && onChange(index);
              }}
            >
              {obj["label"]}
            </a>
          ),
        })),
      }}
    >
      <div className="tertiary-button">
        <Row
          justify={"space-between"}
          align={"middle"}
          gutter={6}
          style={{ color: "#727176" }}
        >
          <Col>
            {`Product ${
              productSortList[
                value === -1 ? constants.defaultSortIndex : value
              ]["label"]
            }`}
          </Col>
          <Col>
            {value === -1 || value === constants.defaultSortIndex ? (
              <CaretDownOutlined />
            ) : (
              <CloseCircleFilled
                onClick={() => {
                  onChange(-1);
                }}
              />
            )}
          </Col>
        </Row>
      </div>
    </Dropdown>
  );
};

const CategoryFilter = ({ value, onChange }) => {
  return (
    <Col>
      <div>Categories</div>
      <SingleSelectSearch
        apiUrl={endpoints["PRODUCT_CATEGORIES"]}
        params={{ placeholder: "Search Product Category" }}
        onChange={(v) => {
          onChange({
            category: v?.name,
          });
        }}
        {...{ value }}
      />
    </Col>
  );
};

const BrandFilter = ({ value, onChange }) => {
  const handleRemove = (name) => {
    const filteredList = value.filter((v) => v !== name);
    onChange({
      brand: filteredList.join(","),
    });
  };
  return (
    <Col>
      <div>Brands</div>
      <SingleSelectSearch
        apiUrl={endpoints["PRODUCT_BRANDS"]}
        value={[]}
        optionFilter={(arr) => arr.filter((ele) => !value.includes(ele.name))}
        onChange={(data) => {
          let arr = [...value, data.name];
          onChange({
            brand: arr.join(","),
          });
        }}
        params={{ placeholder: "Search Brand" }}
      />
      {
        <div className={styles.selected_list}>
          {value.map((name, i) => (
            <div className={styles.selected_list} key={i}>
              {name}
              <img
                src={CrossIcon}
                alt="cancel"
                width={18}
                style={{ marginLeft: 7, cursor: "pointer" }}
                onClick={() => handleRemove(name)}
              />
            </div>
          ))}
        </div>
      }
    </Col>
  );
};

const ProductFilters = ({
  activeFilters = {},
  onChange,
  setProductDataId = "",
}) => {
  return (
    <Space size={"middle"}>
      <SortProducts
        value={productSortList.findIndex((obj) => {
          let match = true;
          Object.keys(obj.params).map((k) => {
            if (activeFilters[k] !== obj.params[k]) {
              match = false;
            }
          });
          return match;
        })}
        onChange={(i) => {
          if (i === -1) {
            onChange({
              sort_by: "",
              sort_order: "",
            });
          } else {
            onChange(productSortList[i]["params"]);
          }
        }}
      />
      <Dropdown
        dropdownRender={(v) => (
          <div className="ant-dropdown-menu">
            <Space
              direction="vertical"
              size="middle"
              style={{ width: 220, padding: 16 }}
            >
              <CategoryFilter
                value={
                  activeFilters.category
                    ? activeFilters.category.split(",")
                    : []
                }
                {...{ onChange }}
              />
              <Divider style={{ margin: 0 }} />
              <BrandFilter
                value={
                  activeFilters.brand ? activeFilters.brand.split(",") : []
                }
                {...{ onChange }}
              />
            </Space>
          </div>
        )}
      >
        <div className="tertiary-button">
          <Row
            justify={"space-between"}
            align={"middle"}
            gutter={6}
            style={{ color: "#727176" }}
          >
            <Col>
              <div style={{ height: 16 }}>
                <img
                  src={Filter}
                  alt="filter"
                  style={{
                    height: 16,
                    width: 16,
                    objectFit: "contain",
                  }}
                />
              </div>
            </Col>
            <Col>Filters</Col>
            <Col>
              {activeFilters.category || activeFilters.brand ? (
                <CloseCircleFilled
                  onClick={() => {
                    onChange({
                      category: "",
                      brand: "",
                    });
                  }}
                />
              ) : (
                <CaretDownOutlined />
              )}
            </Col>
          </Row>
        </div>
      </Dropdown>
    </Space>
  );
};

export default ProductFilters;

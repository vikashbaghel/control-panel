import React, { useState } from "react";
import styles from "./customer.module.css";
import customerIcon from "../../assets/distributor/customer-img.svg";
import { preference } from "../../services/preference-service";
import WrapText from "../../components/wrapText";

const FormPreview = ({ data }) => {
  const queryParameters = new URLSearchParams(window.location.search);
  const id = queryParameters.get("id");

  function matchKeysWithValues(sections, values) {
    const result = {};

    sections.forEach((section) => {
      const sectionName = section.name;
      result[sectionName] = {};

      section.form_items.forEach((item) => {
        const key = item.field_props.name;
        const label = item.field_props.label;

        if (values.hasOwnProperty(key)) {
          result[sectionName][label] = values[key];
        }
      });
    });

    return result;
  }

  const result = matchKeysWithValues(getCustomerSection(), data);

  const renderValue = (label, value) => {
    if (label === "Image") {
      return (
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            margin: "10px 0",
            alignItems: "center",
          }}
        >
          {value.map((item, index) => (
            <img
              key={index}
              src={item.thumbUrl || item.url}
              alt="icon"
              style={{ width: 80, height: 80, borderRadius: 5 }}
            />
          ))}
        </div>
      );
    } else if (label === "Customer Level") {
      return preference.get("customer_level_config")[value];
    } else if (label === "Assign Pricing Group") {
      return value?.name;
    } else if (label === "Parent Name") {
      return (
        <div>
          {value.allow_all
            ? `All ${label.split(" ")[1]} has been assigned`
            : (data[label] || []).map((list, index) => (
                <div
                  key={index}
                  style={{ display: "flex", gap: 10, alignItems: "center" }}
                >
                  {index + 1}.
                  <img
                    src={list.logo_image_url || customerIcon}
                    alt="icon"
                    width={20}
                    height={20}
                    style={{ borderRadius: 50 }}
                  />
                  <WrapText width={250}>{list.name}</WrapText>
                </div>
              ))}
        </div>
      );
    } else if (
      label === "Assign Staff" ||
      label === "Product Category Mapping" ||
      label === "Assign Beat"
    ) {
      return (
        !id &&
        (value.allow_all || value.add_set.length > 0) && (
          <div>
            {value.allow_all ? (
              `All ${label.split(" ")[1]} has been assigned`
            ) : (
              <>
                {(data[label] || []).map((list, index) => (
                  <div key={index}>
                    {index + 1}. {list.name}
                  </div>
                ))}
              </>
            )}
          </div>
        )
      );
    } else if (typeof value === "object") {
      return JSON.stringify(value).join(" ,");
    } else if (value) {
      return value;
    } else {
      return null;
    }
  };

  return (
    <div
      div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        marginTop: 20,
      }}
    >
      <div>
        {Object.keys(result).map((section) => {
          const filteredEntries = Object.entries(result[section]).filter(
            ([label, value]) => {
              if (!value) {
                return false;
              }
              if (label === "Image") {
                const hasImage = value.some(
                  (item) => item.url || item.thumbUrl
                );
                return hasImage;
              }
              if (
                label === "Assign Staff" ||
                label === "Product Category Mapping" ||
                label === "Assign Beat"
              ) {
                return (value.allow_all || value.add_set.length > 0) &&
                  !id?.length > 0
                  ? value
                  : false;
              } else if (label === "Assign Pricing Group") {
                return value.name ? value : false;
              }
              return true;
            }
          );
          if (filteredEntries.length === 0) {
            return null;
          }
          return (
            <div className={styles.form_section} key={section}>
              <h3>{section}</h3>
              <div className={styles.section_group}>
                {Object.entries(result[section]).map(([label, value]) => {
                  return (
                    value &&
                    renderValue(label, value) && (
                      <div key={label}>
                        <div className={styles.review_label}>{label} : </div>
                        <div className={styles.review_value}>
                          {renderValue(label, value)}
                        </div>
                      </div>
                    )
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FormPreview;

const getCustomerSection = () => {
  let config = JSON.parse(localStorage.getItem("customer_form_config"));
  let itemList = [];
  for (let i = 1; i <= Object.keys(config).length; i++) {
    itemList = itemList.concat(config[`form_${i}`]["sections"]);
  }
  return itemList;
};

import { Col, Space } from "antd";
import styles from "./styles.module.css";
import ListFilters from "../../../../components/filter";
import { useEffect, useState } from "react";
import { FilterLineIcon } from "../../../../assets";

export default function SelectVariants({
  variants = [],
  selection,
  setSelection,
}) {
  const [activeFilters, setActiveFilters] = useState({});
  const filterOptions = variants.map((list) => ({
    label: list.name,
    key: list.variant_id,
    search: false,
    source: "",
    data: (list.options || []).map((subList) => ({
      name: subList.name,
      id: subList.option_id,
    })),
    sourceExcludePics: true,
  }));

  const filterAction = async (allFilterStates = {}) => {
    let tempData = { ...allFilterStates };
    tempData = Object.keys(tempData).forEach((key) => {
      tempData[key] = `${tempData[key].selection}`;
      setActiveFilters(tempData);
    });
  };

  const handleVariantSelect = (variant, opt) => {
    const { variant_id } = variant;
    // console.log(variant, opt);
    const mainFilterIds = variants[0].options.map((value) => value.option_id);
    let values = [...selection];

    values = values
      .join("")
      .split("-")
      .filter((item) => !mainFilterIds.includes(item));
    values = [...values, opt.option_id];
    setSelection(values);
    setActiveFilters((prev) => ({ ...prev, [variant_id]: `${values}` }));
  };

  useEffect(() => {
    if (Object.keys(activeFilters).length) {
      let filteredObj = Object.fromEntries(
        Object.entries(activeFilters).filter(
          ([key, value]) => value.trim() !== ""
        )
      );
      filteredObj = replaceCommasWithDashes(filteredObj);
      let dataTemp = Object.values(filteredObj).flatMap((value) =>
        value.split(",")
      );

      if (dataTemp.length > 0) {
        setSelection([...new Set(dataTemp)]);
      } else {
        setActiveFilters({
          [variants[0].variant_id]: `${variants[0].options[0].option_id}`,
        });
      }
    }
  }, [activeFilters]);

  return (
    variants.length > 0 && (
      <div style={{ position: "relative" }}>
        <div style={{ paddingBottom: 20 }}>
          {(variants || []).map((variant, Vi) => {
            return (
              Vi === 0 && (
                <Col key={Vi}>
                  <div
                    className={styles.flex_col}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <p style={{ color: "#727176" }}>{variant.name}</p>
                    <ListFilters
                      key={`ListFilters-All-${JSON.stringify(selection)}`}
                      {...{ filterOptions, activeFilters, filterAction }}
                      height={25}
                      filterView={() => (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            fontFamily: "Poppins",
                          }}
                        >
                          <img src={FilterLineIcon} alt="icon" />{" "}
                          <span
                            style={{
                              textDecoration: "underline",
                              color: "#312b81",
                              fontWeight: 600,
                            }}
                          >
                            Filter ({" "}
                            {
                              selection.flatMap((item) => item.split("-"))
                                .length
                            }{" "}
                            )
                          </span>
                        </div>
                      )}
                    />
                  </div>
                  <div
                    className={styles.flex_wrap}
                    style={{ borderBottom: "2px solid #fff" }}
                  >
                    {variant.options.map((opt, Oi) =>
                      opt.name ? (
                        (opt.payload || {})["color"] ? (
                          <div
                            key={"opt" + Oi}
                            className={` 
                            ${
                              selection
                                .flatMap((item) => item.split("-"))
                                .includes(opt.option_id)
                                ? styles.selected_option
                                : ""
                            } 
                          clickable`}
                            onClick={() => handleVariantSelect(variant, opt)}
                          >
                            <Space direction="vertical" align="center" size={4}>
                              <div
                                data-testid={opt.option_id}
                                className={`${styles.color_tabs}`}
                                style={{ backgroundColor: opt.payload.color }}
                              />
                              <div>{opt.name}</div>
                            </Space>
                          </div>
                        ) : (
                          <div
                            data-testid={opt.option_id}
                            key={"opt" + Oi}
                            className={` ${
                              selection
                                .flatMap((item) => item.split("-"))
                                .includes(opt.option_id)
                                ? styles.selected_option
                                : ""
                            } clickable`}
                            style={{ textAlign: "center", color: "#727176" }}
                            onClick={() => handleVariantSelect(variant, opt)}
                          >
                            {opt.name}
                          </div>
                        )
                      ) : (
                        []
                      )
                    )}
                  </div>
                </Col>
              )
            );
          })}
        </div>
      </div>
    )
  );
}

const replaceCommasWithDashes = (obj) => {
  let newObj = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = obj[key].replace(/,/g, "-"); // Replace commas with dashes
    }
  }
  return newObj;
};

import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { Filter } from "../../../../assets";
import { Button, Col, Divider, Dropdown, Row } from "antd";
import { CaretDownOutlined, CloseOutlined } from "@ant-design/icons";

const sortOptions = {
  size: "Size",
  color: "Colour",
};

export default function VariantFilters({
  variants,
  setActiveFilters,
  activeFilters,
}) {
  return (
    <div className={styles.flex}>
      <SortFilters {...{ variants, activeFilters, setActiveFilters }} />
      <MoreFilters {...{ variants, activeFilters, setActiveFilters }} />
    </div>
  );
}

const SortFilters = ({ variants, activeFilters, setActiveFilters }) => {
  return (
    <Dropdown
      menu={{
        items: variants.map(({ variant_id }, index) => ({
          key: variant_id,
          label: (
            <div
              onClick={() => {
                setActiveFilters({ groupBy: variant_id });
              }}
            >
              {variants[index]["name"]}
            </div>
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
          <Col>{`Group by : ${
            variants.length && activeFilters["groupBy"]
              ? [
                  ...variants.filter(
                    ({ variant_id }) => variant_id === activeFilters["groupBy"]
                  ),
                  { name: "None" },
                ][0]["name"]
              : "None"
          }`}</Col>
          <Col>
            <CaretDownOutlined />
          </Col>
        </Row>
      </div>
    </Dropdown>
  );
};

const MoreFilters = ({ variants, activeFilters, setActiveFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState({});

  const filterStyles = {
    inActive: {
      border: "1px solid #727176",
      background: "#FFFFFF",
    },
    active: {
      border: "1px solid #322E80",
      background: "#322E80",
      color: "#FFFFFF",
    },
  };

  const toggleFilter = (open) => {
    if (open) {
      setValues({ ...activeFilters.filterBy });
    }
    setIsOpen(open);
  };

  const applyValues = (v) => {
    setActiveFilters({ filterBy: v });
    toggleFilter(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <div className="tertiary-button" onClick={() => toggleFilter(!isOpen)}>
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
          <Col>Filter</Col>
          <Col>
            <CaretDownOutlined />
          </Col>
        </Row>
      </div>
      {isOpen && (
        <div className={styles.filter_container}>
          <Row style={{ padding: "1em" }}>
            <Col flex={1} style={{ textAlign: "center", fontWeight: 500 }}>
              Filter
            </Col>
            <Col onClick={() => toggleFilter(false)} className="clickable">
              <CloseOutlined />
            </Col>
          </Row>
          <Divider style={{ margin: 0 }} />
          <div style={{ padding: "1.5em" }}>
            {variants.map((variant) => (
              <>
                <Row>
                  <Col>{variant.name}</Col>
                </Row>
                <Row
                  style={{ columnGap: ".5em", rowGap: ".5em", marginTop: 6 }}
                >
                  {variant.options.map(
                    (opt) =>
                      !!opt.name && (
                        <Col
                          align="middle"
                          style={{
                            ...((values[variant.variant_id] || []).includes(
                              opt.option_id
                            )
                              ? { ...filterStyles.active }
                              : { ...filterStyles.inActive }),
                            minWidth: 50,
                            padding: "2px 12px",
                            borderRadius: 20,
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            let arr = [...(values[variant.variant_id] || [])];
                            let index = arr.indexOf(opt.option_id);
                            if (index === -1) {
                              arr.push(opt.option_id);
                            } else {
                              arr.splice(index, 1);
                            }
                            setValues((prev) => ({
                              ...prev,
                              [variant.variant_id]: arr,
                            }));
                          }}
                        >
                          {opt.name}
                        </Col>
                      )
                  )}
                </Row>
                <br />
              </>
            ))}
          </div>
          <Divider style={{ margin: 0 }} />
          <Row justify={"end"} style={{ padding: "1em", gap: "1em" }}>
            <Col>
              <Button
                onClick={() => {
                  applyValues({});
                }}
              >
                Reset
              </Button>
            </Col>
            <Col>
              <Button
                className="button_primary"
                onClick={() => {
                  applyValues(values);
                }}
              >
                Apply
              </Button>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

import SelectUnit from "../selectUnit";
import { useEffect, useState } from "react";
import styles from "../../../product.module.css";
import VariantFilters from "../variantFilters";
import variantStyles from "../styles.module.css";
import { EditIcon } from "../../../../../assets/globle";
import {
  Button,
  Checkbox,
  Col,
  Dropdown,
  Input,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { decimalInputValidation } from "../../../../../helpers/regex";
import defaultImg from "../../../../../assets/distributor/customer-img.svg";
import EditVariant, { bulkEditMenuItems } from "../EditVariant";
import { EditFilled, MoreOutlined, WarningFilled } from "@ant-design/icons";
import { productRequiredFields } from "../../addProduct";
import {
  createDataSource,
  createVariantCombinations,
  VariantData,
} from "./createVariants";

const constants = {
  defaultGroupbyIndex: 0,
};

const states = {
  variantData: new VariantData(),
  variantMap: {},
  dataSourceFlags: {
    updateFilters: false,
  },
};

export default function ManageVariants({
  form,
  variants = [],
  defaultVariantData,
  setVariantData,
  variantDataError,
  setVariantsDataError,
}) {
  const queryParameters = new URLSearchParams(window.location.search);
  const primary_product = queryParameters.get("id");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [editVariant, setEditVariant] = useState({});
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [updatedAt, setUpdatedAt] = useState("");

  function update() {
    setUpdatedAt(`${+new Date()}`);
  }

  function getDefaultFilters(variants) {
    return {
      groupBy: variants[constants.defaultGroupbyIndex]["variant_id"],
      filterBy: {},
    };
  }
  const [activeFilters, setFilters] = useState(getDefaultFilters(variants));
  function setActiveFilters(v, updateRows = true) {
    states.dataSourceFlags.updateFilters = { updateRows };
    setFilters((prev) => ({ ...prev, ...v }));
  }
  function validateFilters(filters, variants) {
    let result = JSON.parse(JSON.stringify(filters));
    let { groupBy, filterBy } = { ...filters };
    let errors = { groupBy: true, filterBy: false };
    variants.map((v) => {
      //validate groupby
      if (groupBy === v.variant_id) {
        errors.groupBy = false;
      }
      //validate filterby
      if (filterBy[v.variant_id]) {
        let option_ids = v.options.map((opt) => opt.option_id);
        let included = filterBy[v.variant_id].filter((ele) =>
          option_ids.includes(ele)
        );
        if (filterBy[v.variant_id].length !== included.length) {
          errors.filterBy = true;
          result.filterBy[v.variant_id] = included;
        }
      }
    });
    //return updated filters
    if (errors.groupBy || errors.filterBy) {
      if (errors.groupBy) {
        result.groupBy = getDefaultFilters(variants)["groupBy"];
      }
      return result;
    }
    return false;
  }

  //update variant combination details
  function updateProductDetials(identifier, details = {}) {
    if (identifier) {
      states.variantData.update(identifier, { ...details });
      setTimeout(() => {
        if (variantDataError[identifier]) {
          document
            .querySelector(`tr[data-row-key=${identifier}]`)
            ?.setAttribute("error", "false");
          setVariantsDataError((errors) => {
            delete errors["initial"];
            delete errors[identifier];
            return JSON.parse(JSON.stringify(errors));
          });
        }
      }, 10);
    }
  }
  const ProxyColumn = () => {
    return (
      <Space>
        <Col
          style={{
            backgroundColor: "#DDD",
            borderRadius: 10,
            padding: "4px 16px",
          }}
        />
      </Space>
    );
  };

  const extractGroupValue = (identifiers, key) => {
    let value = "";
    if (identifiers.length) {
      value = states.variantData.get(identifiers[0])?.[key];
      identifiers.map((identifier) => {
        if (states.variantData.get(identifier)?.[key] !== value) {
          value = "";
        }
      });
    }
    return value;
  };

  const PriceInputColumn = (key, inputProps = {}) => {
    function updateField(identifiers, field, value, eventType = "input") {
      identifiers.map((identifier) => {
        let target = document.querySelector(`tr[data-row-key=${identifier}]`);
        if (target) {
          let col = target.childNodes[columnIndexMap[field]];
          let input = col.querySelector("input");
          let lastValue = input.value;
          input.value = value;
          let event = new Event(eventType, { bubbles: true });
          event.simulated = true;
          let tracker = input._valueTracker;
          if (tracker) {
            tracker.setValue(lastValue);
          }
          input.dispatchEvent(event);
        }
      });
    }

    return (item, record) => {
      let value = "";
      if (record.isGroupHead) {
        value = extractGroupValue(record.children_ids, key);
      } else {
        value = states.variantData.get(record.identifier)?.[key];
      }
      return (
        <Input
          size="small"
          variant="borderless"
          placeholder=""
          {...{ defaultValue: value }}
          onChange={(e) => {
            if (record.isGroupHead) {
              record.children_ids.map((identifier) => {
                updateProductDetials(identifier, { [key]: e.target.value });
              });
              if (!e.nativeEvent.simulated) {
                updateField(record.children_ids, key, e.target.value);
              }
            } else {
              updateProductDetials(record.identifier, {
                [key]: e.target.value,
              });
              if (!e.nativeEvent.simulated) {
                let groupValue = extractGroupValue(
                  dataSource[record.parent_index]["children_ids"],
                  key
                );
                updateField([`Group-${record.parent_id}`], key, groupValue);
              }
            }
          }}
          {...inputProps}
        />
      );
    };
  };

  const SelectUnitColumn = (key) => {
    function updateSelect(identifiers, field, value) {
      identifiers.map((identifier) => {
        let list = document.getElementById(`${identifier}-${field}_list`);
        if (list && value) {
          let ele = list.parentNode.querySelector(`div[title="${value}"]`);
          if (ele) {
            ele.click();
          }
        } else {
          let ele = document.getElementById(`${identifier}-${field}`);
          if (ele) {
            let [target] = ele.parentNode.parentNode.getElementsByClassName(
              "ant-select-selection-item"
            );
            target.title = value;
            target.innerText = value;
          }
        }
      });
    }
    return (item, record) => {
      let value = "";

      if (record.isGroupHead) {
        value = extractGroupValue(record.children_ids, key);
      } else {
        value = states.variantData.get(record.identifier)?.[key];
      }

      return (
        <SelectUnit
          params={{
            id: `${record.identifier}-${key}`,
            defaultValue: value,
          }}
          onChange={(v) => {
            if (record.isGroupHead) {
              record.children_ids.map((identifier) => {
                updateProductDetials(identifier, {
                  [key]: v,
                });
              });
              updateSelect(record.children_ids, key, v);
            } else {
              updateProductDetials(record.identifier, {
                [key]: v,
              });
              let groupValue = extractGroupValue(
                dataSource[record.parent_index]["children_ids"],
                key
              );
              updateSelect([`Group-${record.parent_id}`], key, groupValue);
            }
          }}
        />
      );
    };
  };

  const columns = [
    {
      key: "title",
      title: "Variants",
      render: (_, record) => {
        const item = states.variantData.get(record.identifier);

        return (
          <div
            className={variantStyles.align_center}
            style={!record?.isGroupHead ? { paddingLeft: 20 } : {}}
          >
            {record?.isGroupHead && (record["payload"] || {})["color"] ? (
              <div
                className={variantStyles.thumbnail}
                style={{ backgroundColor: record.payload.color }}
              />
            ) : (
              <img
                className={variantStyles.thumbnail}
                src={item?.pics?.default_img?.url || defaultImg}
                alt={record.name}
              />
            )}
            {record.name}
          </div>
        );
      },
    },
    {
      key: "code",
      title: "SKU",
      width: 150,
      render: (item, record) =>
        record.isGroupHead ? (
          <ProxyColumn />
        ) : (
          <Input
            size="small"
            variant="borderless"
            placeholder="Enter Code"
            defaultValue={states.variantData.get(record.identifier)?.["code"]}
            onChange={(e) => {
              updateProductDetials(record.identifier, { code: e.target.value });
            }}
          />
        ),
    },
    {
      key: "is_published",
      title: "Availability",
      width: 120,
      render: (item, record) => {
        let value = true;
        if (record.isGroupHead) {
          let disabledCount = 0;
          record?.children_ids?.map((identifier) => {
            if (!states.variantData.get(identifier)?.["is_published"]) {
              disabledCount += 1;
            }
          });
          value = record.children_ids.length !== disabledCount;
        } else {
          value = states.variantData.get(record.identifier)?.["is_published"];
        }
        return (
          <Select
            id={`${record.identifier}-is_published`}
            {...{ defaultValue: value }}
            onChange={(v) => {
              if (record.isGroupHead) {
                record?.children_ids?.map((identifier) => {
                  updateProductDetials(identifier, { is_published: v });
                });
              } else {
                updateProductDetials(record.identifier, { is_published: v });
              }
              update();
            }}
            variant="borderless"
            labelRender={(item) => {
              return (
                <Tag
                  color={item.value ? "success" : "default"}
                  style={{ padding: "4px 12px", border: 0, borderRadius: 20 }}
                >
                  {item.label}
                </Tag>
              );
            }}
            options={[
              {
                label: "Active",
                value: true,
              },
              {
                label: "Inactive",
                value: false,
              },
            ]}
          />
        );
      },
    },
    {
      key: "price",
      title: "Buyer Price",
      width: 120,
      render: PriceInputColumn("price", {
        onKeyPress: (e) => decimalInputValidation(e, { decimalPlaces: 4 }),
      }),
    },
    {
      title: "Unit of Buyer Price",
      key: "unit",
      width: 180,
      render: SelectUnitColumn("unit"),
    },
    {
      title: "MRP",
      key: "mrp_price",
      width: 120,
      render: PriceInputColumn("mrp_price", {
        onKeyPress: (e) => decimalInputValidation(e, { decimalPlaces: 4 }),
      }),
    },
    {
      title: "Unit of MRP",
      key: "mrp_unit",
      width: 180,
      render: SelectUnitColumn("mrp_unit"),
    },
    selectedRowKeys.length
      ? {
          key: "action",
          fixed: "right",
          title: (
            <Col align="right">
              <Dropdown
                menu={{
                  items: bulkEditMenuItems.map((item) => ({
                    onClick: () => {
                      let data = {};
                      item.keys.map((k) => {
                        selectedRowKeys.map((identifier) => {
                          if (
                            identifier.split("-").length === variants.length &&
                            identifier.split("-")?.[0] !== "Group"
                          ) {
                            let v = states.variantData.get(identifier)?.[k];

                            if (!Object.keys(data).includes(k)) {
                              data[k] = v;
                            }
                            //need validation for common value
                            if (
                              k === "packaging_level" ||
                              k === "specification"
                            ) {
                              const childKeys =
                                k === "packaging_level"
                                  ? ["size", "unit"]
                                  : ["name", "details"];

                              const defaultValue = [
                                { [childKeys[0]]: "", [childKeys[1]]: "" },
                              ];

                              if (data[k]?.length !== v.length)
                                return (data[k] = defaultValue);

                              const isSame = data[k]?.filter(
                                (ele, index) =>
                                  ele?.[childKeys[0]] !==
                                    v[index]?.[childKeys[0]] ||
                                  ele?.[childKeys[1]] !==
                                    v[index]?.[childKeys[1]]
                              );
                              if (isSame.length)
                                return (data[k] = defaultValue);
                            } else if (data[k] !== v) {
                              data[k] = "";
                            }
                          }
                        });
                      });
                      setEditVariant({
                        title: item.label,
                        formType: item.formType,
                        data,
                      });
                    },
                    ...item,
                  })),
                }}
              >
                <Button shape="circle" size="small" style={{ padding: 2 }}>
                  <MoreOutlined style={{ fontSize: 18, color: "#5C5C5C" }} />
                </Button>
              </Dropdown>
            </Col>
          ),
          width: 80,
          render: (_, record) =>
            !record.isGroupHead ? (
              <img src={EditIcon} alt="edit" style={{ opacity: 0.5 }} />
            ) : (
              []
            ),
        }
      : {
          key: "action",
          fixed: "right",
          title: <Col align="right">Edit</Col>,
          width: 80,
          render: (_, record) => {
            const onClick = () => {
              const variant_name = getVariantName(record.identifier);
              setEditVariant({
                formType: "VariantForm",
                data: {
                  ...states.variantData.get(record.identifier),
                  variant_name,
                  name: [form.getFieldValue("name"), variant_name]
                    .filter((ele) => ele)
                    .join(" "),
                },
              });
            };
            const editComponent = (
              <EditFilled
                style={{ fontSize: 18 }}
                className="edit-icon"
                {...{ onClick }}
              />
            );
            if (!record.isGroupHead)
              return (
                <Col align="right">
                  {!!variantDataError[record.identifier] ? (
                    <Tooltip
                      title={
                        variantDataError[record.identifier]["missing_fields"]
                          .join(", ")
                          .replace(/_/g, " ") + " are required"
                      }
                    >
                      {editComponent}
                    </Tooltip>
                  ) : (
                    editComponent
                  )}
                </Col>
              );
          },
        },
  ];

  const columnIndexMap = Object.fromEntries([
    ...columns.map((col, index) => [col.key, index + 1]),
  ]);

  function updateField(identifiers, field, value, eventType = "input") {
    identifiers.map((identifier) => {
      let target = document.querySelector(`tr[data-row-key=${identifier}]`);
      if (target) {
        let col = target.childNodes[columnIndexMap[field]];
        let input = col.querySelector("input");
        let lastValue = input.value;
        input.value = value;
        let event = new Event(eventType, { bubbles: true });
        event.simulated = true;
        let tracker = input._valueTracker;
        if (tracker) {
          tracker.setValue(lastValue);
        }
        input.dispatchEvent(event);
      }
    });
  }

  function getVariantName(identifier) {
    return identifier
      .split("-")
      .map((optId, i) => {
        let v = states.variantMap[variants[i].variant_id];
        if (v && v.options[optId]) {
          return v.options[optId]["name"];
        }
        return "";
      })
      .join(" ");
  }

  function getVariantGroup(identifier, variantMap, groupBy) {
    let options = Object.keys(variantMap[groupBy].options);
    let arr = identifier.split("-").filter((optId) => options.includes(optId));
    return arr.length ? `Group-${arr[0]}` : "";
  }

  function handleVariantObject(data) {
    let isPrimary = Object.keys(states.variantData).length === 0;
    return {
      ...(primary_product
        ? {
            ...(isPrimary ? { id: primary_product } : {}),
            primary_product,
          }
        : {}),
      ...data,
      variant_name: getVariantName(data.identifier),
    };
  }

  function handleExpandedRows(values) {
    setExpandedKeys(values);
    setTimeout(() => {
      Object.keys(variantDataError).map((identifier, i) => {
        document
          .querySelector(`tr[data-row-key=${identifier}]`)
          ?.setAttribute("error", "true");
      });
    }, 0);
  }

  useEffect(() => {
    if (variants.length) {
      if (states.dataSourceFlags.updateFilters) {
        if (states.dataSourceFlags.updateFilters.updateRows) {
          //apply filters on table data
          setDataSource(
            createDataSource(variants, states.variantMap, activeFilters)
          );
        }
        states.dataSourceFlags.updateFilters = false;
      } else {
        //create variant map
        states.variantMap = {};
        variants.map((item, index) => {
          let options = {};
          (item.options || []).map((option) => {
            options[option.option_id] = option;
          });
          states.variantMap[item.variant_id] = { ...item, options, index };
        });
        // create variant data
        states.variantData = new VariantData({
          variants,
          getHandler: handleVariantObject,
          default: defaultVariantData,
          parent: states.variantData.getAll(true),
        });
        setVariantData(states.variantData);
        // validate filters
        let updatedFilters = validateFilters(activeFilters, variants);
        setTimeout(() => {
          //create table data
          setDataSource(
            createDataSource(
              variants,
              states.variantMap,
              updatedFilters || activeFilters
            )
          );
          if (updatedFilters) {
            setActiveFilters(updatedFilters, false);
          }
        }, 0);
      }
    }
  }, [variants, activeFilters]);

  useEffect(() => {
    setSelectedRowKeys([]);
  }, [dataSource]);

  //updated errors on DOM
  useEffect(() => {
    if (activeFilters.groupBy && Object.keys(variantDataError)?.length) {
      let { options } = states.variantMap[activeFilters.groupBy];
      let arr = [];
      Object?.keys(options)?.map((option, i) => {
        if (i < Object.keys(options).length - 1) {
          arr.push(`Group-${option}`);
        }
      });
      setSelectedRowKeys([]);
      if (variantDataError["initial"]) {
        setTimeout(() => {
          let groupId = getVariantGroup(
            variantDataError["initial"],
            states.variantMap,
            activeFilters.groupBy
          );
          handleExpandedRows(groupId ? [groupId] : []);
          document
            .querySelector(`tr[data-row-key=${variantDataError["initial"]}]`)
            ?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
        }, 0);
      }
    }
  }, [variantDataError, activeFilters]);

  return (
    <div className={styles.form} style={{ padding: 0 }}>
      <div className={variantStyles.space_between} style={{ padding: 20 }}>
        <div>
          <div className={styles.form_header}>Manage Variants</div>
          <div style={{ fontSize: 12, color: "#727176" }}>
            Select Multiple to edit in bulk
          </div>
        </div>

        <VariantFilters {...{ variants, activeFilters, setActiveFilters }} />
      </div>
      <Table
        key={updatedAt}
        {...{ columns, dataSource }}
        expandable={{
          defaultExpandedRowKeys: [],
          indentSize: 0,
          expandedRowKeys: expandedKeys,
          onExpandedRowsChange: (values) => {
            handleExpandedRows(
              values.length ? [values[values.length - 1]] : []
            );
          },
        }}
        className="editable"
        size="small"
        bordered
        pagination={false}
        rowSelection={{
          selectedRowKeys,
          onChange: (allKeys) => setSelectedRowKeys(allKeys),
          renderCell: (checked, record) => {
            return (
              <Checkbox
                {...{ checked }}
                onChange={(e) => {
                  setSelectedRowKeys((prev) => {
                    let arr = [...prev];
                    let keys = [
                      record?.identifier,
                      ...(record?.isGroupHead ? record?.children_ids : []),
                    ];
                    if (e.target.checked) {
                      arr = [...arr, ...keys]?.filter(
                        (v, i, arr) => arr?.indexOf(v) === i
                      );
                    } else {
                      if (!record?.isGroupHead) {
                        keys?.push(record?.parent_id);
                      }
                      let i = 0;
                      while (i < arr?.length) {
                        if (keys?.includes(arr[i])) {
                          arr?.splice(i, 1);
                        } else {
                          i = i + 1;
                        }
                      }
                    }
                    return arr;
                  });
                }}
              />
            );
          },
        }}
        rowClassName={(record) =>
          record?.isGroupHead
            ? [variantStyles?.active_row, "group-head"]?.join(" ")
            : "group-item"
        }
        rowKey="identifier"
        scroll={{ x: "max-content", y: 500 }}
      />
      <EditVariant
        {...{ editVariant }}
        onCancel={() => setEditVariant({})}
        onSubmit={(v) => {
          if (selectedRowKeys?.length) {
            selectedRowKeys.map((identifier) => {
              if (identifier.split("-")?.[0] !== "Group")
                updateProductDetials(identifier, v);
            });
          } else updateProductDetials(v.identifier, v);
          setEditVariant({});
          update();
        }}
      />
    </div>
  );
}

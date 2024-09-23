//https://team-1624359381274.atlassian.net/wiki/spaces/RUPYZ/pages/189988866/Custom+Forms#Form-Item
import { Button, Col, Divider, Input, Row, Select, Space, Switch } from "antd";
import FormItemTypes from "./FormItemTypes";
import { useEffect, useState } from "react";
import {
  ContentCopyIcon,
  DeleteIcon,
  HolderIcon,
} from "../../assets/custom-forms";

export const customFormConstants = {
  defaultFormItemType: "SHORT_ANSWER",
  inputProps: {
    SHORT_ANSWER: {
      maxLength: 250,
    },
    LONG_ANSWER: {
      maxLength: 1250,
    },
    MULTIPLE_CHOICE: {
      options: [],
    },
    CHECKBOX: {
      options: [],
    },
    DROPDOWN: {
      options: [],
    },
    RATING: {
      count: 5,
    },
    NUMBERS: {
      maxLength: 250,
    },
    ALPHABETS: {
      maxLength: 250,
    },
  },
  preservedInputProps: ["options"],
};

export const createFormItem = (formItemType, params = {}) => {
  let type = Object.keys(FormItemTypes).includes(formItemType)
    ? formItemType
    : customFormConstants.defaultFormItemType;
  const { field_props, input_props } = { ...params };
  return {
    type,
    status: "visible",
    is_custom: true,
    field_props: {
      required: false,
      label: "",
      ...(field_props || {}),
      name: `${+new Date()}`,
    },
    input_props: {
      ...(customFormConstants.inputProps[type] || {}),
      ...(input_props || {}),
    },
  };
};

export const FormItemTypeSelect = (props) => {
  return (
    <Select
      style={{ minWidth: 180 }}
      options={[
        ...Object.keys(FormItemTypes)
          .filter((item) => !["FILE_UPLOAD", "DECIMAL"].includes(item))
          .map((name) => ({
            label: (
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={FormItemTypes[name]["icon"].default}
                  style={{
                    height: 16,
                    width: 16,
                    objectFit: "contain",
                  }}
                />
                <Col style={{ color: "#727176" }}>
                  {FormItemTypes[name]["label"]}
                </Col>
              </div>
            ),
            value: name,
          })),
      ]}
      {...props}
    />
  );
};

const FormItem = ({
  errorState,
  index,
  item,
  options,
  onUpdate,
  onHold,
  onTypeChange,
  onDelete,
}) => {
  const formItemOptions = options;

  return (
    <Col className="card-layout" style={styles.container}>
      <Space
        style={{ width: "100%", padding: 24 }}
        direction="vertical"
        size={24}
      >
        <Col style={styles.holder} align="center">
          <img
            src={HolderIcon}
            draggable="false"
            style={{
              position: "absolute",
              userSelect: "none",
              height: 12,
              cursor: "move",
            }}
            onMouseDown={(e) => {
              onHold && onHold(e);
            }}
          />
        </Col>
        <Row justify={"space-between"} gutter={24}>
          <Col flex={1}>
            <Input
              status={errorState[item.field_props.name] ? "error" : ""}
              defaultValue={item.field_props["label"]}
              placeholder={`Question ${index + 1}`}
              onChange={(e) => {
                let obj = { ...item };
                obj.field_props["label"] = e.target.value;
                onUpdate && onUpdate(obj);
              }}
              maxLength={30}
            />
            {!!(errorState[item.field_props.name] || {})["message"] && (
              <div style={{ marginTop: 4 }}>
                <span className="error">
                  {(errorState[item.field_props.name] || {})["message"]}
                </span>
              </div>
            )}
          </Col>
          <Col>
            <FormItemTypeSelect
              value={item.type}
              onChange={(v) => {
                onTypeChange &&
                  onTypeChange(() => {
                    let preservedProps = {};
                    Object.keys(customFormConstants.inputProps[v] || {}).map(
                      (k) => {
                        if (
                          customFormConstants.preservedInputProps.includes(k) &&
                          item.input_props[k]
                        ) {
                          preservedProps[k] = item.input_props[k];
                        }
                      }
                    );
                    let input_props = {
                      ...(customFormConstants.inputProps[v] || {}),
                      ...preservedProps,
                    };
                    onUpdate(
                      {
                        ...item,
                        type: v,
                        input_props,
                      },
                      true
                    );
                  });
              }}
            />
          </Col>
        </Row>
        {FormItemTypes[item.type]["placeholder"](item, onUpdate, errorState)}
      </Space>
      <Divider style={{ margin: 0 }} />
      <Row align={"middle"} justify={"space-between"} style={{ padding: 24 }}>
        <Col />
        <Col>
          <Space size={10}>
            <Col style={{ height: 18 }}>
              <img
                src={ContentCopyIcon}
                alt="duplicate"
                className="clickable"
                style={{
                  color: "#727176",
                  height: "100%",
                }}
                onClick={() => {
                  formItemOptions["DUPLICATE_QUESTION"] &&
                    formItemOptions["DUPLICATE_QUESTION"].action();
                }}
              />
            </Col>
            <Col>
              <div />
            </Col>
            <Col style={{ height: 18 }}>
              <img
                src={DeleteIcon}
                alt="delete"
                className="clickable"
                style={{
                  color: "#727176",
                  height: "100%",
                }}
                onClick={() => {
                  onDelete &&
                    onDelete(formItemOptions["DELETE_QUESTION"].action);
                }}
              />
            </Col>

            <Col>
              <div style={{ height: 28, border: "1px solid #EEEEEE" }} />
            </Col>
            <Col>Required</Col>
            <Col>
              <Switch
                value={item.field_props["required"]}
                onChange={(checked) => {
                  let obj = { ...item };
                  obj.field_props["required"] = checked;
                  onUpdate && onUpdate({ ...obj });
                }}
              />
            </Col>
          </Space>
        </Col>
      </Row>
    </Col>
  );
};

const styles = {
  container: {
    borderRadius: 10,
    border: "2px solid #FFFFFF",
  },
  holder: {
    width: "100%",
    position: "absolute",
    top: 8,
  },
};

export default FormItem;

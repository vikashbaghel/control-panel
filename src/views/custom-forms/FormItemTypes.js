import { DeleteOutlined, LinkOutlined } from "@ant-design/icons";
import { prefix } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Radio,
  Rate,
  Row,
  Select,
  Slider,
  Space,
  Tag,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import { customFormConstants } from "./FormItem";
import ImageUploader from "../../components/image-uploader/ImageUploader";
import FormInput from "../../components/form-elements/formInput";
import { DatePickerInput } from "../../components/form-elements/datePickerInput";
import { regex } from "../../components/form-elements/regex";

const itemTypeConstants = {
  maxOptions: {
    MULTIPLE_CHOICE: 50,
    CHECKBOX: 50,
    DROPDOWN: 50,
  },
};

const SetCharacterLimit = ({ maxLength, item, onUpdate }) => {
  return (
    <Space direction="vertical">
      <div>Maximum character</div>
      <FormInput
        type="num"
        formatter={(v) => {
          if (v && v > maxLength) {
            return maxLength;
          }
          return v;
        }}
        value={item.input_props["maxLength"]}
        onChange={(v, e) => {
          if (v !== "0") {
            let obj = { ...item };
            obj.input_props["maxLength"] = v;
            onUpdate(obj);
          }
        }}
        params={{
          placeholder: maxLength,
        }}
      />
    </Space>
  );
};

const FormItemOption = ({ prefix, item, onUpdate, errorState }) => {
  let field_name = (item.field_props || {})["name"];
  return (
    <Space style={{ width: "100%" }} direction="vertical" size={10}>
      {[
        ...(item.input_props["options"] || []),
        ...((item.input_props["options"] || []).length <
        itemTypeConstants.maxOptions[item.type]
          ? [
              {
                label: "",
                option_id: `${+new Date()}`,
                value: "",
              },
            ]
          : []),
      ].map((option, index) => {
        let createFlag = index === (item.input_props["options"] || []).length;
        let itemId = createFlag ? `option(${field_name})` : option.option_id;
        return (
          <Row
            id={`item-${itemId}`}
            key={option.option_id}
            align={"top"}
            gutter={10}
          >
            <Col style={{ padding: "8px 0px" }}>{prefix}</Col>
            <Col flex={1}>
              <Input
                status={errorState[itemId] ? "error" : ""}
                placeholder={`Option ${index + 1}`}
                value={option["label"]}
                onChange={(e) => {
                  let obj = { ...item };
                  if (createFlag) {
                    if (!obj.input_props["options"]) {
                      obj.input_props["options"] = [];
                    }
                    obj.input_props.options.push(option);
                  }
                  obj.input_props.options[index]["label"] = e.target.value;
                  obj.input_props.options[index]["value"] = e.target.value;
                  onUpdate(obj, createFlag);
                }}
              />
              {!!(errorState[itemId] || {})["message"] && (
                <div style={{ marginTop: 4 }}>
                  <span className="error">
                    {(errorState[itemId] || {})["message"]}
                  </span>
                </div>
              )}
            </Col>
            <Col>
              <Button
                size={"large"}
                style={
                  createFlag ? { pointerEvents: "none", opacity: 0.25 } : {}
                }
                onClick={() => {
                  let obj = { ...item };
                  obj.input_props.options.splice(index, 1);
                  onUpdate(obj, true);
                }}
              >
                <DeleteOutlined />
              </Button>
            </Col>
          </Row>
        );
      })}
    </Space>
  );
};

const SHORT_ANSWER = {
  label: "Short Text",
  icon: require("../../assets/custom-forms/form-item-types/short_text.svg"),
  placeholder: (item, onUpdate) => {
    const { maxLength } = customFormConstants.inputProps["SHORT_ANSWER"] || {};
    return (
      <>
        <Space
          style={{ width: "100%", color: "#727176" }}
          direction="vertical"
          size={10}
        >
          <div>Short Text</div>
          <div style={{ border: "1px dashed #838387" }} />
        </Space>
        <SetCharacterLimit {...{ maxLength, item, onUpdate }} />
      </>
    );
  },
  component: (item) => {
    return <Input {...item["input_props"]} />;
  },
};

const LONG_ANSWER = {
  label: "Description",
  icon: require("../../assets/custom-forms/form-item-types/long_text.svg"),
  placeholder: (item, onUpdate) => {
    const { maxLength } = customFormConstants.inputProps["LONG_ANSWER"] || {};
    return (
      <>
        <Space
          style={{ width: "100%", color: "#727176" }}
          direction="vertical"
          size={10}
        >
          <div>Description</div>
          <div style={{ border: "1px dashed #838387" }} />
          <div></div>
        </Space>
        <SetCharacterLimit {...{ maxLength, item, onUpdate }} />
      </>
    );
  },
  component: (item) => {
    return <Input.TextArea {...item["input_props"]} />;
  },
};

const MULTIPLE_CHOICE = {
  label: "Multiple choice",
  icon: require("../../assets/custom-forms/form-item-types/radio_button.svg"),
  placeholder: (item, onUpdate, errorState) => {
    return (
      <FormItemOption
        {...{ item, onUpdate, errorState }}
        prefix={
          <Col>
            <Radio checked={false} />
          </Col>
        }
      />
    );
  },
  component: (item) => {
    return <Radio.Group {...item["input_props"]} />;
  },
};

const CHECKBOX = {
  label: "Check Box",
  icon: require("../../assets/custom-forms/form-item-types/check_box.svg"),
  placeholder: (item, onUpdate, errorState) => {
    return (
      <FormItemOption
        {...{ item, onUpdate, errorState }}
        prefix={
          <Col>
            <Checkbox checked={false} />
          </Col>
        }
      />
    );
  },
  component: (item) => {
    return <Checkbox.Group {...item["input_props"]} />;
  },
};

const DROPDOWN = {
  label: "Dropdown",
  icon: require("../../assets/custom-forms/form-item-types/dropdown.svg"),
  placeholder: (item, onUpdate, errorState) => {
    return <FormItemOption {...{ item, onUpdate, errorState }} />;
  },
  component: (item) => {
    return <Select placeholder="Select" {...item["input_props"]} />;
  },
};

const FILE_UPLOAD = {
  label: "File upload",
  icon: require("../../assets/custom-forms/form-item-types/file_upload.svg"),
  placeholder: () => [],
  component: (item) => {
    return <ImageUploader value={[]} {...item.input_props} />;
  },
};

const MOBILE_NUMBER = {
  label: "Mobile Number",
  icon: require("../../assets/custom-forms/form-item-types/mobile_number.svg"),
  placeholder: (item, onUpdate) => {
    return (
      <Space
        style={{ width: "100%", color: "#727176" }}
        direction="vertical"
        size={10}
      >
        <div>Mobile Number</div>
        <div style={{ border: "1px dashed #838387" }} />
      </Space>
    );
  },
  component: (item) => {
    return (
      <FormInput
        type="num"
        params={{
          maxLength: 10,
          placeholder: "Mobile number",
        }}
      />
    );
  },
  validator: (item) => (_, value) => {
    if (item.field_props.required && value?.length === 10)
      return Promise.resolve();
    else if (!item.field_props.required && (!value || value.length === 10))
      return Promise.resolve();
    else return Promise.reject(new Error("Please enter a valid ${label}"));
  },
};

const EMAIL_ADDRESS = {
  label: "Email address",
  icon: require("../../assets/custom-forms/form-item-types/email_address.svg"),
  placeholder: (item, onUpdate) => {
    return (
      <Space
        style={{ width: "100%", color: "#727176" }}
        direction="vertical"
        size={10}
      >
        <div>Email address</div>
        <div style={{ border: "1px dashed #838387" }} />
      </Space>
    );
  },
  component: (item) => {
    return <Input params={{ placeholder: "Email address" }} />;
  },
  validator: (item) => (_, value) => {
    if (item.field_props.required && value?.match(regex["email"]))
      return Promise.resolve();
    else if (
      !item.field_props.required &&
      (!value || value.match(regex["email"]))
    )
      return Promise.resolve();
    return Promise.reject(new Error("Please enter a valid email"));
  },
};

const DATE_PICKER = {
  label: "Date picker",
  icon: require("../../assets/custom-forms/form-item-types/date_picker.svg"),
  placeholder: () => [],
  component: (item) => {
    return <DatePickerInput />;
  },
};

const DATE_TIME_PICKER = {
  label: "Date and time",
  icon: require("../../assets/custom-forms/form-item-types/date_time_picker.svg"),
  placeholder: () => [],
  component: (item) => {
    return (
      <DatePickerInput
        showTime={true}
        format={"DD-MM-YYYY hh:mm A"}
        params={{ placeholder: "Select date and time" }}
      />
    );
  },
};

const URL_INPUT = {
  label: "URL",
  icon: require("../../assets/custom-forms/form-item-types/url.svg"),
  placeholder: (item, onUpdate) => {
    return (
      <Space
        style={{ width: "100%", fontFamily: "calibri", color: "#727176" }}
        direction="vertical"
        size={10}
      >
        <Space size={6}>
          <LinkOutlined style={{ fontSize: 12 }} />
          <div>Web Link</div>
        </Space>
        <div style={{ border: "1px dashed #838387" }} />
      </Space>
    );
  },
  component: (item) => {
    return <Input params={{ placeholder: "Enter URL" }} />;
  },
  validator: (item) => (_, value) => {
    if (item.field_props.required && value?.match(regex["url"])) {
      return Promise.resolve();
    } else if (
      !item.field_props.required &&
      (!value || value.match(regex["url"]))
    ) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Please enter a valid ${label}"));
  },
};

const RATING = {
  label: "Rating",
  icon: require("../../assets/custom-forms/form-item-types/rating.svg"),
  placeholder: (item, onUpdate) => {
    return (
      <>
        <Rate count={item.input_props["count"]} disabled />
        <Col>
          <div>Rating Scale : {item.input_props["count"]}</div>
          <Slider
            min={1}
            max={10}
            value={item.input_props["count"]}
            onChange={(v) => {
              let obj = { ...item };
              obj.input_props["count"] = v;
              onUpdate(obj, true);
            }}
          />
        </Col>
      </>
    );
  },
  component: (item) => {
    return <Rate count={item.input_props["count"]} />;
  },
  validator: (item) => (_, value) => {
    if (!item.field_props.required) {
      return Promise.resolve();
    }
    if (value) return Promise.resolve();
    return Promise.reject(new Error("${label} is required."));
  },
};

const NUMBERS = {
  label: "Numbers",
  icon: require("../../assets/custom-forms/form-item-types/numbers.svg"),
  placeholder: (item, onUpdate) => {
    const { maxLength } = customFormConstants.inputProps["SHORT_ANSWER"] || {};
    return (
      <>
        <Space
          style={{ width: "100%", color: "#727176" }}
          direction="vertical"
          size={10}
        >
          <div>Short Text (Numbers)</div>
          <div style={{ border: "1px dashed #838387" }} />
        </Space>
        <SetCharacterLimit {...{ maxLength, item, onUpdate }} />
      </>
    );
  },
  component: (item) => {
    return <FormInput type="num" params={{ ...item.input_props }} />;
  },
};

const DECIMAL = {
  label: "Numbers",
  icon: require("../../assets/custom-forms/form-item-types/numbers.svg"),
  placeholder: (item, onUpdate) => {
    const { maxLength } = customFormConstants.inputProps["SHORT_ANSWER"] || {};
    return (
      <>
        <Space
          style={{ width: "100%", color: "#727176" }}
          direction="vertical"
          size={10}
        >
          <div>Short Text (Decimal)</div>
          <div style={{ border: "1px dashed #838387" }} />
        </Space>
        <SetCharacterLimit {...{ maxLength, item, onUpdate }} />
      </>
    );
  },
  component: (item) => {
    return <FormInput type="decimal" params={{ ...item.input_props }} />;
  },
};

const ALPHABETS = {
  label: "Alphabets",
  icon: require("../../assets/custom-forms/form-item-types/alphabets.svg"),
  placeholder: (item, onUpdate) => {
    const { maxLength } = customFormConstants.inputProps["SHORT_ANSWER"] || {};
    return (
      <>
        <Space
          style={{ width: "100%", color: "#727176" }}
          direction="vertical"
          size={10}
        >
          <div>Short Text (Alphabets)</div>
          <div style={{ border: "1px dashed #838387" }} />
        </Space>
        <SetCharacterLimit {...{ maxLength, item, onUpdate }} />
      </>
    );
  },
  component: (item) => {
    return <FormInput type="alpha" params={{ ...item.input_props }} />;
  },
};

const FormItemTypes = {
  SHORT_ANSWER,
  LONG_ANSWER,
  MULTIPLE_CHOICE,
  CHECKBOX,
  DROPDOWN,
  FILE_UPLOAD,
  MOBILE_NUMBER,
  EMAIL_ADDRESS,
  DATE_PICKER,
  DATE_TIME_PICKER,
  URL_INPUT,
  RATING,
  NUMBERS,
  DECIMAL,
  ALPHABETS,
};

export default FormItemTypes;

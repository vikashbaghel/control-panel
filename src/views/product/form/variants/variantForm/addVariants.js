import {
  Col,
  ColorPicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Space,
} from "antd";
import styles from "../../../product.module.css";
import { CloseOutlined } from "@ant-design/icons";
import {
  AddItemsButton,
  RemoveIcon,
} from "../../commonElements/CommonElements";
import "./addVariants.css";
import { useEffect } from "react";

const constants = {
  maxLength: {
    variants: 4,
    options: 10,
    masterVariantOptions: 30,
    variantName: 15,
    optionName: 100,
  },
  maxVariantCombinations: 500,
  defaultvariantOptions: [
    {
      value: "Colour",
      name: "colour",
    },
    {
      value: "Size",
      name: "size",
    },
    {
      value: "Material",
      name: "material",
    },
  ],
};

export function createVariantOption(optionId = "") {
  return {
    option_id: optionId || `O${+new Date()}`,
    name: "",
    payload: {},
  };
}

export function createVariant() {
  return {
    variant_id: `V${+new Date()}`,
    name: "",
    options: [
      createVariantOption(`O${+new Date() - 10}`),
      createVariantOption(),
    ],
  };
}

export default function AddVariants({
  form,
  variants,
  setVariants,
  defaultVariants,
}) {
  const optionPrefix = {
    Colour: ColorSelect,
  };

  function updateVariants(variants) {
    form.setFieldsValue({ variants });
    setVariants(variants);
  }

  const getVariantOptions = () => {
    const prevSelectedValues = form
      .getFieldValue("variants")
      ?.map((ele) => ele.name);
    return constants.defaultvariantOptions?.filter(
      (ele) => !prevSelectedValues.includes(ele.value)
    );
  };

  function isOptionAllowed(variants, Vi, Oi) {
    if (Vi > variants.length - 1 && Oi > 0) {
      return false;
    } else if (
      Oi === constants.maxLength[Vi === 0 ? "masterVariantOptions" : "options"]
    ) {
      return false;
    } else {
      let n = 1;
      variants.map((v, i) => {
        let isAdditional = i === Vi && Oi === v.options.length - 1;
        n = n * (v.options.length - 1 + (isAdditional ? 1 : 0));
      });
      return n <= constants.maxVariantCombinations;
    }
  }

  function isMaxVariantsReached(variants) {
    let isAllowed = false;
    if (variants.length > 2) {
      variants.map((v, i) => {
        let canAddOption = isOptionAllowed(
          variants,
          i,
          variants[i].options.length - 1
        );
        isAllowed = isAllowed || canAddOption;
      });
      return !isAllowed;
    }
    return false;
  }

  return (
    <div className={styles.form} style={{ padding: 20 }}>
      <div className={styles.form_header} style={{ paddingBottom: 10 }}>
        Variants
      </div>
      <Form.List name="variants">
        {(fields, { remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => {
              return (
                <>
                  <div key={index} style={inlineStyles.flex}>
                    <Form.Item
                      {...restField}
                      name={[name, "name"]}
                      label={`${index + 1} - Option name`}
                      rules={[{ required: true, message: "Name is required" }]}
                    >
                      <Select
                        showSearch
                        data-testid="Varient-Option-name"
                        onInputKeyDown={(e) => {
                          let input = e.currentTarget;
                          setTimeout(() => {
                            let arr = JSON.parse(
                              JSON.stringify(form.getFieldValue("variants"))
                            );
                            arr[index]["name"] = input.value || "";
                            updateVariants(arr);
                          }, 0);
                          if (input.maxLength === -1) {
                            input.maxLength =
                              constants.maxLength["variantName"];
                          }
                        }}
                        placeholder="eg. size, colour"
                        options={getVariantOptions()}
                        style={{ width: 200 }}
                      />
                    </Form.Item>
                    {(!defaultVariants?.length ||
                      defaultVariants?.length - 1 < index) && (
                      <RemoveIcon
                        style={inlineStyles.deleteIcon}
                        onClick={() => remove(name)}
                      />
                    )}
                    <div style={inlineStyles.col}>
                      <div style={{ paddingLeft: "1em" }}>Option Values</div>
                      <Form.List name={[name, "options"]}>
                        {(valueFields, operations) => (
                          <div
                            style={inlineStyles.wrap}
                            className={"addVariantOptions"}
                          >
                            {valueFields.map((valueField, valueIndex) => {
                              return (
                                <Form.Item
                                  style={
                                    isOptionAllowed(variants, index, valueIndex)
                                      ? {}
                                      : { display: "none" }
                                  }
                                  key={valueIndex}
                                  name={valueField.name}
                                  rules={[
                                    {
                                      validator: (_, v) => {
                                        if (
                                          !v.name &&
                                          valueIndex < valueFields.length - 1
                                        ) {
                                          return Promise.reject(new Error(""));
                                        } else return Promise.resolve();
                                      },
                                    },
                                  ]}
                                >
                                  <AddVariantOption
                                    Prefix={
                                      optionPrefix[
                                        form.getFieldValue("variants")[index][
                                          "name"
                                        ]
                                      ]
                                    }
                                    onChange={(v) => {
                                      if (
                                        v.name &&
                                        valueIndex === valueFields.length - 1 &&
                                        valueFields.length <=
                                          constants.maxLength[
                                            index === 0
                                              ? "masterVariantOptions"
                                              : "options"
                                          ]
                                      ) {
                                        operations.add(createVariantOption());
                                      }
                                    }}
                                    {...(!defaultVariants?.length ||
                                    defaultVariants?.length - 1 < index ||
                                    defaultVariants?.[index]?.options?.length -
                                      1 <
                                      valueIndex
                                      ? {
                                          onPop: () => {
                                            operations.remove(valueIndex);
                                            form.validateFields(["variants"], {
                                              recursive: true,
                                            });
                                          },
                                        }
                                      : {})}
                                  />
                                </Form.Item>
                              );
                            })}
                          </div>
                        )}
                      </Form.List>
                    </div>
                  </div>
                  {index === fields.length - 1 &&
                    isMaxVariantsReached(variants) && (
                      <Col>
                        <span className="error">
                          Maximum {constants.maxVariantCombinations} product
                          variants are allowed
                        </span>
                      </Col>
                    )}
                  <br />
                </>
              );
            })}
            {(form.getFieldValue("variants") || []).length <
              constants.maxLength["variants"] && (
              <AddItemsButton
                onClick={() => {
                  const prevValues = form.getFieldValue("variants") || [];
                  form.setFieldsValue({
                    variants: [...prevValues, createVariant()],
                  });
                }}
              >
                Add options like size or colour
              </AddItemsButton>
            )}
          </>
        )}
      </Form.List>
    </div>
  );
}

const AddVariantOption = ({ Prefix, value, onChange, onPush, onPop }) => {
  return (
    <>
      <Input
        prefix={Prefix && <Prefix {...{ value, onChange }} />}
        value={value["name"]}
        onChange={(e) => {
          if (e.target.value?.[0] === " ") return;
          onChange({
            ...value,
            name: e.target.value,
          });
        }}
        {...(onPop && {
          suffix: <CloseOutlined onClick={onPop} />,
        })}
        style={{
          width: "160px",
          padding: 0,
          paddingRight: 8,
        }}
        maxLength={constants.maxLength["optionName"]}
      />
    </>
  );
};

const ColorSelect = ({ value, onChange }) => {
  return (
    <Space style={{ position: "relative", right: -16 }}>
      <Col />
      <ColorPicker
        value={(value.payload || {}).color || ""}
        defaultFormat="hex"
        format="hex"
        disabledAlpha
        allowClear
        onFormatChange={null}
        onChangeComplete={(obj) => {
          onChange({
            ...value,
            payload: {
              color: obj?.cleared ? "" : obj?.toHexString() || "",
            },
          });
        }}
      >
        <Row align="middle" justify={"space-between"} style={{ width: 32 }}>
          {!(value.payload || {}).color ? (
            <img
              src={
                require("../../../../../assets/productVariants/colorSelect.svg")
                  .default
              }
              height={24}
              width={24}
              className="clickable"
            />
          ) : (
            <>
              <div
                style={{
                  height: 20,
                  width: 20,
                  backgroundColor: (value.payload || {}).color,
                  borderRadius: 5,
                }}
                className="clickable"
              />
              <div style={inlineStyles.seperator}>/</div>
            </>
          )}
        </Row>
      </ColorPicker>
    </Space>
  );
};

const inlineStyles = {
  flex: { display: "flex", gap: "1em" },
  deleteIcon: { alignSelf: "flex-start", marginTop: "2.1em" },
  col: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5em",
  },
  wrap: {
    display: "flex",
    flexWrap: "wrap",
    columnGap: "1em",
    borderLeft: "2px solid #EEEEEE",
    paddingLeft: "1em",
  },
  seperator: {
    fontSize: 16,
    color: "#E4E4E4",
    position: "relative",
    top: -2,
  },
};

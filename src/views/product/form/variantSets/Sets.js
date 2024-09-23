import { useState } from "react";
import { Form, Input, Select } from "antd";
import styles from "../../product.module.css";
import { AddItemsButton, RemoveIcon } from "../commonElements/CommonElements";

export default function Sets({ form }) {
  const [setBy, setSetBy] = useState();

  const variantOptions = [
    {
      value: "size",
      label: "Size",
    },
    {
      value: "colour",
      label: "Colour",
    },
    {
      value: "material",
      label: "Material",
    },
  ];

  const setOptions = {
    size: [
      {
        value: "s",
        label: "small",
      },
      {
        value: "m",
        label: "medium",
      },
    ],
    colour: [
      {
        value: "red",
        label: "Red",
      },
      {
        value: "blue",
        label: "Blue",
      },
    ],
    material: [
      {
        value: "cotton",
        label: "Cotton",
      },
      {
        value: "wool",
        label: "Wool",
      },
    ],
  };

  return (
    <div className={styles.form} style={{ padding: 20 }}>
      <div className={styles.form_header} style={{ paddingBottom: 10 }}>
        Sell in Sets
      </div>
      <Form.List name="sets">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => (
              <>
                <div key={index}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      {...restField}
                      label="Create Sets by"
                      name={[name, "variant_set_by"]}
                      rules={[
                        {
                          required: true,
                          message: "This field is manadatory.",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Choose variant"
                        options={variantOptions}
                        onChange={(v) => {
                          setSetBy(v);
                          const pervValues = form.getFieldValue("sets") || [];
                          form.setFieldsValue({
                            sets: [
                              {
                                variant_set_by: pervValues[0]?.variant_set_by,
                                details: [
                                  {
                                    name: null,
                                    set_by_value: null,
                                    products: [],
                                  },
                                ],
                              },
                            ],
                          });
                        }}
                        style={{ width: 250 }}
                      />
                    </Form.Item>

                    <RemoveIcon onClick={() => remove(name)} />
                  </div>
                </div>
                {setBy && (
                  <Form.List name={[name, "details"]}>
                    {(
                      setValueFields,
                      { add: addValues, remove: removeValues }
                    ) => (
                      <>
                        {setValueFields.map((valueField, valueIndex) => (
                          <>
                            <div key={valueIndex} style={{ display: "flex" }}>
                              <Form.Item
                                label={`${valueIndex + 1} - Set name`}
                                name={[valueField.name, "name"]}
                              >
                                <Input placeholder="Enter set name" />
                              </Form.Item>
                              <Form.Item
                                name={[valueField.name, "set_by_value"]}
                                label={`Select ${setBy}`}
                                rules={[
                                  {
                                    required: "true",
                                    message: "This field is manadatory.",
                                  },
                                ]}
                              >
                                <Select
                                  placeholder={`choose ${setBy}`}
                                  options={setOptions[setBy]}
                                />
                              </Form.Item>
                              <RemoveIcon
                                onClick={() => removeValues(valueField.name)}
                              />
                            </div>
                          </>
                        ))}
                        {!!setValueFields.length && (
                          <AddItemsButton
                            onClick={() =>
                              addValues({
                                name: null,
                                set_by_value: null,
                                products: [],
                              })
                            }
                          >
                            Add More Sets
                          </AddItemsButton>
                        )}
                      </>
                    )}
                  </Form.List>
                )}
              </>
            ))}
            {!fields.length && (
              <AddItemsButton onClick={add}>Create New Set</AddItemsButton>
            )}
          </>
        )}
      </Form.List>
    </div>
  );
}

const productsData = [
  {
    id: 1,
    name: "Amul Butter",
    unit: "Piece",
  },
  {
    id: 2,
    name: "Ice Cream",
    unit: "Piece",
  },
  {
    id: 3,
    name: "milk",
    unit: "Packet",
  },
];

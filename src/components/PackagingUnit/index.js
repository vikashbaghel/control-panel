import { Form, Input } from "antd";
import styles from "./packagingUnit.module.css";
import SelectUnit from "../selectUnit/selectUnit";
import React, { useEffect, useState } from "react";
import DeleteIcon from "../../assets/new-delete-icon.svg";
import { decimalInputValidation } from "../../helpers/regex";
import { RemoveIcon } from "../../views/product/form/commonElements/CommonElements";

const PackagingUnitFunction = ({ value, buyerUnit }) => {
  const [packageData, setPackageData] = useState([]);
  const [errorIndex, setErrorIndex] = useState([]);

  useEffect(() => {
    setPackageData(
      value
        ?.filter((value) => value.unit)
        ?.map((value) => value.unit.toLowerCase())
    );
  }, [value]);

  return (
    <div className={styles.packaging_level_container}>
      <Form.List name="packaging_level">
        {(fields, { add, remove }) => (
          <div>
            {fields.map(({ key, name, size, ...restField }, index) => (
              <div
                key={index}
                style={{
                  width: "100%",
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <Form.Item
                  {...restField}
                  name={[name, "unit"]}
                  label={
                    index === 0 ? (
                      <>
                        Packaging Unit
                        <span style={{ fontSize: 11, color: "#727176" }}>
                          (e.g. kg, meter, piece)
                        </span>
                      </>
                    ) : (
                      ""
                    )
                  }
                  rules={[
                    { required: true, message: "Packaging Unit is required" },
                    {
                      validator: (_, v) => {
                        if (!v) {
                          setErrorIndex((prev) => [prev, index].flat());
                          return Promise.reject();
                        }

                        setErrorIndex(
                          errorIndex.filter((item) => item !== index)
                        );
                        return Promise.resolve();
                      },
                    },
                  ]}
                  style={{ width: "50%" }}
                  // style={{ width: index === 0 ? "50%" : "45%" }}
                >
                  <SelectUnit
                    error={errorIndex.includes(index)}
                    removeOptions={packageData}
                  />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, "size"]}
                  label={index === 0 ? "Packaging Size" : ""}
                  rules={[
                    {
                      required: true,
                      message: "Packaging Size is required",
                    },
                  ]}
                  style={{ width: "50%" }}
                  // style={{ width: index === 0 ? "50%" : "45%" }}
                >
                  <Input
                    placeholder="Enter the Qty"
                    data-testid="packaging-size-Qty"
                    addonAfter={buyerUnit}
                    onKeyPress={decimalInputValidation}
                  />
                </Form.Item>
                {index !== 0 && (
                  <RemoveIcon
                    style={{ alignSelf: "flex-start" }}
                    onClick={() => remove(name)}
                  />
                )}
              </div>
            ))}
            {(value || [])?.length < 4 && (
              <div className={styles.add_button}>
                <span
                  onClick={(e) => {
                    add({
                      unit: "",
                      size: "",
                    });
                    setErrorIndex(
                      errorIndex.filter((item) => item !== value?.length)
                    );
                  }}
                >
                  Add Packaging Unit
                </span>
              </div>
            )}
          </div>
        )}
      </Form.List>
    </div>
  );
};

export default function PackagingUnit({ buyerUnit }) {
  return (
    <Form.Item label="" name="packaging_level">
      <PackagingUnitFunction {...{ buyerUnit }} />
    </Form.Item>
  );
}

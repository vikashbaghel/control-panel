import { Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import styles from "./specificationForm.module.css";
import { AddItemsButton, RemoveIcon } from "./CommonElements";

export function formatSpecificationData(data) {
  return Object.keys(data)?.map((ele) => ({
    name: ele,
    details: data[ele],
  }));
}

export function createSpecificationData(data = []) {
  let specification = {};
  if (data.length) {
    data.map(
      (ele) => (specification = { ...specification, [ele.name]: ele.details })
    );
  }
  return specification;
}

const SpecificationForm = () => {
  return (
    <div>
      <div style={{ fontSize: 16, fontWeight: 600, paddingBottom: "1em" }}>
        Specification
      </div>
      <Form.List name="specification">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => (
              <div key={index} style={{ width: "100%" }}>
                <div className={styles.space_between}>
                  <Form.Item
                    {...restField}
                    name={[name, "name"]}
                    label={`${index + 1} - Name`}
                    rules={[
                      {
                        required: true,
                        message: "Name is required.",
                      },
                    ]}
                    style={{ width: "100%" }}
                  >
                    <Input
                      placeholder="Enter the Name"
                      data-testid="Name-specification"
                    />
                  </Form.Item>
                  <RemoveIcon onClick={() => remove(name)} />
                </div>

                <Form.Item
                  {...restField}
                  name={[name, "details"]}
                  label="Details"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <TextArea
                    rows={2}
                    placeholder="Enter the Details"
                    data-testid="Details-specification"
                  />
                </Form.Item>
              </div>
            ))}
            <AddItemsButton onClick={() => add({ name: "", details: "" })}>
              Add Specification
            </AddItemsButton>
          </>
        )}
      </Form.List>
    </div>
  );
};

export default SpecificationForm;

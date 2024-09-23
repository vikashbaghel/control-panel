import { Form } from "antd";
import React from "react";
import AssignModule from "../../../components/assignModule";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const SelectStaff = ({ formInput, setFormInput, field_props }) => {
  const queryParameters = new URLSearchParams(window.location.search);
  const id = queryParameters.get("id") || 0;
  const assignStaffEnable = cookies.get("rupyzStaffEnable") === "true";

  return (
    <>
      {assignStaffEnable && (
        <Form.Item
          {...field_props}
          {...(field_props.required && {
            rules: [
              {
                validator: (_, v) => {
                  if (
                    v?.add_set.length ||
                    (id &&
                      ((formInput.total_staff_count && !v?.remove_set.length) ||
                        formInput.total_staff_count - v?.remove_set.length > 0))
                  )
                    return Promise.resolve();
                  return Promise.reject(new Error("${label} is required"));
                },
              },
            ],
          })}
        >
          <AssignModule
            title={"Select Staff"}
            api={`/customer/${id}/mapping/`}
            sortBy="selection"
            assignAllOption={false}
            returnItemDetails={(list) =>
              setFormInput((prev) => ({ ...prev, "Assign Staff": list }))
            }
          />
        </Form.Item>
      )}
    </>
  );
};

export const SelectProductCategory = ({
  formInput,
  setFormInput,
  field_props,
}) => {
  const queryParameters = new URLSearchParams(window.location.search);
  const id = queryParameters.get("id") || 0;
  const categoryMappingEnable =
    cookies.get("rupyzCustomrCategoryMappingEnabled") === "true";
  return (
    <>
      {categoryMappingEnable && (
        <Form.Item
          {...field_props}
          {...(field_props.required && {
            rules: [
              {
                validator: (_, v) => {
                  if (v?.disallow_all && !v?.add_set?.length)
                    return Promise.reject(new Error("${label} is required"));
                  else if (
                    v?.allow_all ||
                    v?.add_set.length ||
                    (id &&
                      ((formInput.total_product_category_count &&
                        !v?.remove_set.length) ||
                        formInput.total_product_category_count -
                          v?.remove_set.length >
                          0))
                  )
                    return Promise.resolve();
                  else return Promise.reject(new Error("${label} is required"));
                },
              },
            ],
          })}
        >
          <AssignModule
            title={"Select Categories"}
            api={`/customer/${id}/mapping/pc/`}
            sortBy="selection"
            returnItemDetails={(list) =>
              setFormInput((prev) => ({
                ...prev,
                "Product Category Mapping": list,
              }))
            }
          />
        </Form.Item>
      )}
    </>
  );
};

export const SelectBeat = ({ formInput, setFormInput, field_props }) => {
  const queryParameters = new URLSearchParams(window.location.search);
  const id = queryParameters.get("id") || 0;

  return (
    <>
      <Form.Item
        {...field_props}
        {...(field_props.required && {
          rules: [
            {
              validator: (_, v) => {
                if (v?.disallow_all && !v?.add_set?.length)
                  return Promise.reject(new Error("${label} is required"));
                else if (
                  v?.allow_all ||
                  v?.add_set.length ||
                  (id &&
                    ((formInput.total_beat_count && !v?.remove_set.length) ||
                      formInput.total_beat_count - v?.remove_set.length > 0))
                )
                  return Promise.resolve();
                else return Promise.reject(new Error("${label} is required"));
              },
            },
          ],
        })}
      >
        <AssignModule
          title={"Select Beat"}
          api={`/customer/${id}/mapping/beats/`}
          sortBy="selection"
          returnItemDetails={(list) =>
            setFormInput((prev) => ({ ...prev, "Assign Beat": list }))
          }
        />
      </Form.Item>
    </>
  );
};

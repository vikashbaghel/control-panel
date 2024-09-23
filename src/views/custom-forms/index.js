import { Col, Form } from "antd";
import moment from "moment";
import FormItemTypes from "./FormItemTypes";
import { timeZoneConversion } from "../../helpers/globalFunction";
import { uploadImage } from "../../components/image-uploader/ImageUploader";

const CustomForm = ({
  FormItemMap = {},
  form_items = [],
  sections,
  Wrapper = Col,
}) => {
  return (
    <FormElements
      {...{ Wrapper, FormItemMap }}
      sections={sections || [{ form_items }]}
    />
  );
};

export default CustomForm;

const FormElements = ({ sections, Wrapper, FormItemMap }) => {
  return (
    <>
      {sections.map((section, Si) => {
        return (
          section.form_items.length > 0 && (
            <Wrapper {...{ section }} key={Si}>
              {(section.form_items || []).map((item, index) => {
                const { field_props, status } = item;
                const fieldProps = {
                  ...(field_props || {}),
                  label: (field_props || {}).label || `Question ${index + 1}`,
                };
                if (status === "visible") {
                  if (
                    Object.keys(FormItemMap).includes(item.field_props["name"])
                  ) {
                    return (
                      <Col
                        key={item.field_props["name"]}
                        data-testid={item.field_props["name"]}
                      >
                        {FormItemMap[item.field_props["name"]](field_props)}
                      </Col>
                    );
                  } else
                    return (
                      <Form.Item
                        id={item.field_props["name"]}
                        key={item.field_props["name"]}
                        data-testid={item.field_props["name"]}
                        {...fieldProps}
                        {...createFormRules(item)}
                      >
                        {FormItemTypes[item.type]["component"](item)}
                      </Form.Item>
                    );
                }
                return null;
              })}
            </Wrapper>
          )
        );
      })}
    </>
  );
};

const createFormRules = (item) => {
  let rules = [];
  const validators = ["EMAIL_ADDRESS", "RATING", "URL_INPUT", "MOBILE_NUMBER"];

  if (item.field_props.required) {
    rules = [
      ...(!validators.includes(item.type) ? [{ required: true }] : []),
      ...(FormItemTypes[item.type]?.["validator"]
        ? [
            {
              validator: FormItemTypes[item.type]?.["validator"](item),
            },
          ]
        : []),
    ];
  } else if (validators.includes(item.type)) {
    rules = [
      {
        validator: FormItemTypes[item.type]?.["validator"](item),
      },
    ];
  }

  return rules.length ? { rules } : {};
};

export const createPostFormData = async (postData, formItems, parsers = {}) => {
  const formData = [];

  await Promise.all(
    formItems.map(async (ele) => {
      if (ele?.status === "visible") {
        let dataObj = {
          label: ele.field_props.label,
          name: ele.field_props.name,
          type: ele.type,
          is_custom: ele.is_custom,
        };
        if (ele.type === "FILE_UPLOAD") {
          if (!postData?.[ele.field_props.name]?.length) {
            return "";
          }
          let oldImageList = postData[ele.field_props.name]
            .filter((item) => item.id)
            .map((obj) => `${obj.id}`);
          let newImageList = postData[ele.field_props.name].filter(
            (item) => !item.id
          );
          const img_links =
            newImageList.length > 0 ? await uploadImage(newImageList) : [];
          dataObj = {
            ...dataObj,
            value: [...oldImageList, ...img_links]
              .filter((item) => item !== "")
              .join(","),
          };
        } else if (
          ele.type === "DATE_TIME_PICKER" &&
          postData?.[ele.field_props.name]
        ) {
          dataObj = {
            ...dataObj,
            value: timeZoneConversion(postData[ele.field_props.name], "UTC"),
          };
        } else if (ele.type === "RATING") {
          dataObj = {
            ...dataObj,
            value: `${postData[ele.field_props.name] || 0}/${
              ele.input_props.count
            }`,
          };
        } else {
          dataObj = {
            ...dataObj,
            value: parsers[ele.field_props.name]
              ? parsers[ele.field_props.name](postData[ele.field_props.name])
              : Array.isArray(postData[ele.field_props.name])
              ? postData[ele.field_props.name]?.join(",")
              : typeof postData[ele.field_props.name] === "object" &&
                postData[ele.field_props.name]
              ? JSON.stringify(postData[ele.field_props.name])
              : postData[ele.field_props.name]
              ? `${postData[ele.field_props.name]}`
              : "",
          };
        }
        formData.push(dataObj);
      }
    })
  );
  return formData;
};

export const getCustomFieldValues = (formItems) => {
  let formValues = {};
  const valueInArray = ["CHECKBOX"];

  formItems.map((ele) => {
    if (valueInArray.includes(ele.type)) {
      formValues = { ...formValues, [ele.name]: ele?.value?.split(",") };
    } else {
      formValues = {
        ...formValues,
        ...(formTypes?.[ele.type]?.(ele) || { [ele.name]: ele.value }),
      };
    }
  });
  return formValues;
};

const formTypes = {
  FILE_UPLOAD: (item) => {
    const idsArr = item?.value?.split(",");
    const imgs = item?.img_urls?.map((ele, i) => {
      return { id: idsArr[i], url: ele };
    });
    return { [item.name]: imgs || [] };
  },
  DATE_TIME_PICKER: (item) => {
    return {
      [item.name]: item.value
        ? moment(item.value).format("DD-MM-YYYY hh:mm A")
        : "",
    };
  },
  RATING: (item) => {
    return { [item.name]: Number(item.value.split("/")[0]) };
  },
};

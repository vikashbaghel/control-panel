import {
  CopyOutlined,
  DeleteOutlined,
  DragOutlined,
  MergeCellsOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Space } from "antd";
import { createFormItem } from "./FormItem";

const FormItemOptions = (formItemIndex, formConfig, setFormConfig) => {
  let index = formItemIndex;
  return {
    ADD_QUESTION: {
      label: (
        <a>
          <Space>
            <PlusCircleOutlined /> Add Question
          </Space>
        </a>
      ),
      action: () => {
        let obj = { ...formConfig };
        obj["form_items"].splice(index + 1, 0, createFormItem());
        setFormConfig(obj);
      },
    },
    DUPLICATE_QUESTION: {
      label: (
        <a>
          <Space>
            <CopyOutlined /> Duplicate Section
          </Space>
        </a>
      ),
      action: () => {
        let obj = { ...formConfig };
        let item = obj["form_items"][index];
        obj["form_items"].splice(index + 1, 0, createFormItem(item.type, item));
        setFormConfig(obj);
      },
    },
    DELETE_QUESTION: {
      label: (
        <a>
          <Space>
            <DeleteOutlined /> Delete Section
          </Space>
        </a>
      ),
      action: () => {
        let obj = { ...formConfig };
        obj["form_items"].splice(index, 1);
        setFormConfig(obj);
      },
    },
  };
};

export default FormItemOptions;

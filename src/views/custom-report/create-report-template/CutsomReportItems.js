import { useState } from "react";
import { Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import styles from "./createReport.module.css";
import { PlusOutlined } from "@ant-design/icons";
import ImageUploader, {
  uploadImage,
} from "../../../components/image-uploader/ImageUploader";
import DeleteIcon from "../../../assets/new-delete-icon.svg";

export const Terms = (props) => {
  const [form] = Form.useForm();
  return (
    <Form
      form={form}
      onFieldsChange={(item, values) => {
        if (props.onChange) {
          props.onChange(form.getFieldValue("list") || []);
        }
      }}
      initialValues={{
        list: props.value || [],
      }}
      disabled={props.disabled}
    >
      <Form.List name="list">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => (
              <div key={index} style={{ width: "100%" }}>
                <div
                  className={styles.flex}
                  style={{ alignItems: "flex-start" }}
                >
                  <Form.Item
                    {...restField}
                    name={[name, "name"]}
                    style={{ width: "100%" }}
                  >
                    <Input placeholder={`Name ${index + 1}`} />
                  </Form.Item>

                  <img
                    src={DeleteIcon}
                    alt="img"
                    className={styles.delete_img}
                    onClick={() => remove(name)}
                  />
                </div>

                <Form.Item {...restField} name={[name, "desc"]}>
                  <TextArea rows={2} placeholder={`Description ${index + 1}`} />
                </Form.Item>
              </div>
            ))}

            <div
              onClick={() => {
                if (props.disabled) return;
                add({ name: "", desc: "" });
              }}
              className={`${styles.add_list_btn} ${
                props.disabled && styles.hidden
              }`}
              disabled={props.disabled}
            >
              <div className={styles.add_list_btn_icon}>
                <PlusOutlined />
              </div>
              Add {props.title}
            </div>
          </>
        )}
      </Form.List>
    </Form>
  );
};

const Upload = (props) => {
  const [fileList, setFileList] = useState(
    props.value ? [{ id: 1, url: props.value }] : []
  );

  const handleUpload = async (files) => {
    setFileList(files);

    if (!files.length) {
      return;
    }
    const res = await uploadImage(files, "url");
    if (res.length) {
      props.onUpload && props.onUpload(res[0]);
    }
  };

  return (
    <ImageUploader
      onChange={(v) => handleUpload(v)}
      value={fileList}
      disabled={props.disabled}
    />
  );
};
const FormItem = {
  Terms,
  Upload,
};
export default FormItem;

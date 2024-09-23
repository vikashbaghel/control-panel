import { Form, Modal } from "antd";
import React, { useContext, useEffect } from "react";
import Context from "../../context/Context";
import { useDispatch, useSelector } from "react-redux";
import Styles from "./settings.module.css";
import { productUnitAddService } from "../../redux/action/productUnitAction";
import FormInput from "../../components/form-elements/formInput";

const AddProductUnitComponent = ({
  newProductUnitOpen,
  setNewProductUnitOpen,
  data = {},
  callBack,
}) => {
  const [form] = Form.useForm();

  const state = useSelector((state) => state);
  const { productUnitAdd } = state;
  const dispatch = useDispatch();
  // const context = useContext(Context);
  // const { newProductUnitOpen, setNewProductUnitOpen } = context;

  const onClose = () => {
    setNewProductUnitOpen(false);
    form.resetFields();
  };

  const onSubmit = (values) => {
    dispatch(productUnitAddService(values, data.id));
  };

  useEffect(() => {
    if (
      productUnitAdd.data &&
      !productUnitAdd.data.data.error &&
      productUnitAdd.data.status === 200
    ) {
      callBack(form.getFieldsValue());
      onClose();
    }
  }, [state]);

  useEffect(() => {
    if (Object.keys(data).length && newProductUnitOpen) {
      form.setFieldValue("name", data.name);
    }
  }, [newProductUnitOpen]);

  return (
    <>
      <Modal
        centered
        open={newProductUnitOpen}
        onCancel={onClose}
        className={Styles.product_category_main}
        style={{ padding: "0px !important" }}
        width={600}
        title={
          <div
            style={{
              padding: 15,
              textAlign: "center",
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {Object.keys(data).length ? "Update" : "Create"} Product Unit
          </div>
        }
        footer={[]}
      >
        <Form
          form={form}
          layout="vertical"
          validateMessages={{
            required: "${label} is required.",
          }}
          scrollToFirstError={true}
          requiredMark={(label, info) => (
            <div>
              {label} {info.required && <span style={{ color: "red" }}>*</span>}
            </div>
          )}
          onFinish={onSubmit}
        >
          <div style={{ padding: " 5px 20px" }}>
            <Form.Item label="Name" name="name" rules={[{ required: true }]}>
              <FormInput
                type="unitName"
                params={{ placeholder: "Enter Name" }}
              />
            </Form.Item>
          </div>
        </Form>
        <div className={Styles.product_category_footer}>
          <button className="button_secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="button_primary" onClick={form.submit}>
            {Object.keys(data).length ? "Update" : "Create"}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default AddProductUnitComponent;

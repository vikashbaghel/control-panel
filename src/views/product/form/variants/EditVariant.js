import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { Button, Col, Form, Modal, Row } from "antd";
import SpecificationForm from "../commonElements/specificationForm";
import OutOfStock from "../commonElements/OutOfStock";
import PackagingUnit from "../../../../components/PackagingUnit";
import { HsnCode, ProductCode } from "../commonElements/uniqueCodes";
import { BuyerPrice, MrpUnit } from "../commonElements/PriceAndUnits";
import ProductImageUpload, {
  handleImages,
} from "../commonElements/ProductImageUpload";
import { Description } from "../../../../components/textAreaWithFeature/textAreaWithFeature";
import VideoUrlInput from "../VideoUrlInput";

export default function EditVariant({ editVariant, onCancel, onSubmit }) {
  let { title, formType, data } = editVariant;
  let FormComponent = variantFormTypes[formType] || Col;

  const [form] = Form.useForm();
  const [buyerUnit, setBuyerUnit] = useState("");
  const [loading, setLoading] = useState(false);

  const updateFormStates = (values) => {
    if (values.unit) setBuyerUnit(values.unit);
  };

  const handleSubmit = async (formValues) => {
    setLoading(true);

    const imageData = await handleImages(formValues?.pics || {});

    formValues = {
      ...data,
      ...formValues,
      ...(formValues?.mrp_price && { mrp_price: Number(formValues.mrp_price) }),
      ...(formValues?.price && { price: Number(formValues.price) }),
      ...((formType === "OutOfStock" || formType === "VariantForm") &&
        (formValues?.is_out_of_stock ?? { is_out_of_stock: false })),
      ...((formType === "VariantForm" || formType === "ProductImageUpload") && {
        pics: {
          imgs: imageData?.pics_map,
          default_img: imageData?.display_pic_map,
        },
      }),
    };

    form.resetFields();
    setLoading(false);
    onSubmit(formValues);
  };

  const resetFormStates = () => {
    setBuyerUnit("");
    form.resetFields();
  };

  useEffect(() => {
    let { data } = editVariant || {};
    if (data) {
      setTimeout(() => {
        form.resetFields();
        form.setFieldsValue({
          code: data?.code,
          hsn_code: data?.hsn_code,
          description: data?.description,
          mrp_price: data?.mrp_price,
          mrp_unit: data?.mrp_unit,
          price: data?.price,
          unit: data?.unit,
          gst: data?.gst,
          gst_exclusive: data?.gst_exclusive,
          packaging_level: ((data || {}).packaging_level || []).length
            ? data.packaging_level
            : [{ unit: "", size: "" }],
          specification: data?.specification,
          is_out_of_stock: data?.is_out_of_stock,
          pics: data?.pics,
          video_link: data?.video_link,
        });
        setBuyerUnit(data?.unit);
      }, 0);
    }
  }, [editVariant]);

  return (
    <Modal
      centered
      open={!!Object?.keys(data || {})?.length}
      onCancel={() => {
        resetFormStates();
        onCancel();
      }}
      title={
        <div style={{ paddingBlock: "1em", textAlign: "center" }}>
          {title || "Edit Variant"}
        </div>
      }
      footer={null}
      width={600}
    >
      <Form
        {...{ form }}
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
        onValuesChange={updateFormStates}
        onFinish={handleSubmit}
      >
        <div
          style={{
            padding: "1em 1.5em",
            maxHeight: "450px",
            overflow: "auto",
          }}
        >
          <FormComponent product={{ ...data, unit: buyerUnit }} />
        </div>
        <div className={`${styles.flex} ${styles.edit_footer}`}>
          <Button
            type="button"
            className="button_secondary"
            style={{ paddingBlock: 0 }}
            onClick={() => {
              resetFormStates();
              onCancel();
            }}
          >
            Cancel
          </Button>
          <Button
            htmlType="submit"
            className="button_primary"
            loading={loading}
          >
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

const VariantForm = ({ product }) => {
  return (
    <>
      <div
        className={styles.space_between}
        style={{ fontSize: 18, fontWeight: 500 }}
      >
        <div>{product?.name?.replace(product?.variant_name, "")}</div>
        <div style={{ color: "#727176" }}>
          {product?.variant_name?.split(" ")?.join("/")}
        </div>
      </div>
      <div style={{ fontSize: 12, color: "#727176" }}>{product?.category}</div>
      <br />
      <Row gutter={12}>
        <Col span={12}>
          <ProductCode />
        </Col>
        <Col span={12}>
          <HsnCode />
        </Col>
      </Row>
      <ProductImageUpload />
      <VideoUrlInput />
      <Description />
      <MrpUnit />
      <BuyerPrice />
      <PackagingUnit buyerUnit={product.unit} />
      <OutOfStock />
      <SpecificationForm />
    </>
  );
};

export const bulkEditMenuItems = [
  {
    key: "hsn_code",
    label: "Edit HSN Code",
    formType: "HsnCode",
    keys: ["hsn_code"],
  },
  {
    key: "pics",
    label: "Edit Images",
    formType: "ProductImageUpload",
    keys: ["pics"],
  },
  {
    key: "mrp_price",
    label: "Edit MRP",
    formType: "MrpUnit",
    keys: ["mrp_price", "mrp_unit"],
  },
  {
    key: "buyer_price",
    label: "Edit Buyer Price & Packaging Unit",
    formType: "BuyerPrice",
    keys: ["price", "unit", "gst", "gst_exclusive", "packaging_level"],
  },
  {
    key: "description",
    label: "Edit Description",
    formType: "Description",
    keys: ["description"],
  },
  {
    key: "specification",
    label: "Edit Specification",
    formType: "SpecificationForm",
    keys: ["specification"],
  },
  {
    key: "out_of_stock",
    label: "Availability",
    formType: "OutOfStock",
    keys: ["out_of_stock"],
  },
];

const variantFormTypes = {
  VariantForm,
  ProductCode,
  ProductImageUpload,
  HsnCode,
  Description,
  SpecificationForm,
  BuyerPrice: ({ product }) => (
    <>
      <BuyerPrice />
      <PackagingUnit buyerUnit={product.unit} />
    </>
  ),
  MrpUnit,
  OutOfStock,
};

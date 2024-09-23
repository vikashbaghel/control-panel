// https://team-1624359381274.atlassian.net/wiki/spaces/RUPYZ/pages/180748290/Form+Specifications#PRODUCT-Form-(Add%2FEdit)

import React, { useState, useEffect, useContext } from "react";
import { ArrowLeft } from "../../../assets/globle";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "../product.module.css";
import Context from "../../../context/Context";
import AddProductCategory from "../.././settings/productCategory/addProductCategory";
import { Button, Col, Form, Input, Radio, Row, Spin } from "antd";
import PackagingUnit from "../../../components/PackagingUnit";
import SpecificationForm, {
  createSpecificationData,
  formatSpecificationData,
} from "./commonElements/specificationForm";
import { BASE_URL_V1, org_id } from "../../../config";
import {
  addProduct as addProductApi,
  productView as productViewAPI,
} from "../../../redux/action/productAction";
import BackConfirmationModal from "../../../components/back-confirmation/BackConfirmationModal";
import { Description } from "../../../components/textAreaWithFeature/textAreaWithFeature";
import SingleSelectSearch from "../../../components/selectSearch/singleSelectSearch";
import { productUnitAction } from "../../../redux/action/productUnitAction";
import AddVariants, {
  createVariantOption,
} from "./variants/variantForm/addVariants";
import ManageVariants from "./variants/variantForm/manageVariants";
import Sets from "./variantSets/Sets";
import { BuyerPrice, MrpUnit } from "./commonElements/PriceAndUnits";
import { HsnCode, ProductCode } from "./commonElements/uniqueCodes";
import ProductImageUpload, {
  handleImages,
} from "./commonElements/ProductImageUpload";
import VideoUrlInput from "./VideoUrlInput";
import { VariantData } from "./variants/variantForm/createVariants";

export const productRequiredFields = [
  "code",
  "hsn_code",
  "pics",
  "mrp_price",
  "mrp_unit",
  "price",
  "unit",
  "gst",
  "packaging_level",
];

const states = {
  defaultVariantData: {},
  defaultVariants: [],
};

const AddProduct = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search);
  const id = queryParameters.get("id");
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { addProduct, editProductCategory, productView } = state;

  const context = useContext(Context);
  const { setDiscardModalAction } = context;
  const [isValueChange, setIsValueChange] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [singleSelectSearch, setSingleSelectSearch] = useState({});
  const [buyerUnit, setBuyerUnit] = useState("");
  const [variants, setVariants] = useState([]);
  const [variantDataError, setVariantsDataError] = useState({});
  const [variantData, setVariantData] = useState(new VariantData());

  // submit form
  const handleSubmit = async (formValue) => {
    setIsLoading(true);
    setTimeout(async () => {
      let variants = [];
      let variants_data = [];
      if ((formValue.variants || []).length) {
        //validate variants and remove empty options
        formValue.variants.map((vr) => {
          let options = JSON.parse(JSON.stringify(vr.options));
          options.splice(vr.options.length - 1, 1);
          if (options.length) {
            variants.push({
              ...vr,
              options,
            });
          }
        });
        //validate and create variants data
        let errors = variantData.validate(productRequiredFields);
        setVariantsDataError(errors);
        if (errors?.initial && Object.keys(errors).length) {
          setTimeout(() => {
            setIsLoading(false);
          }, 0);
          return;
        }
        const rootFields = ["category", "brand"];
        let arr = variantData.getAll() || [];
        if (arr.length) {
          for (let i = 0; i < arr.length; i++) {
            let obj = arr[i];
            variants_data.push({
              identifier: obj.identifier,
              product_id: obj.id || null,
              product_data: {
                ...obj,
                name: [form.getFieldValue("name"), obj["variant_name"]].join(
                  " "
                ),
                ...form.getFieldsValue(rootFields),
                specification: createSpecificationData(obj.specification || []),
                ...(await handleImages(obj.pics)),
              },
            });
          }
        }
      }
      //create form payload
      formValue = {
        ...(variants_data.length
          ? {
              ...formValue,
              ...variants_data[0].product_data,
              variants,
              variants_data,
              id: variants_data[0].primary_product,
            }
          : {
              ...formValue,
              mrp_price: Number(formValue?.mrp_price),
              price: Number(formValue.price),
              is_published: formValue.availability?.split("-")[0],
              is_out_of_stock: formValue.availability?.split("-")[1],
              specification: createSpecificationData(formValue?.specification),
              id,
            }),
        ...(await handleImages(formValue?.pics || {})),
      };
      dispatch(addProductApi(formValue, id));
      //handle api failure
      setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    }, 0);
  };

  const updateFormStates = (values) => {
    if (values.unit) {
      setBuyerUnit(values.unit);
    }
    if (values.variants) {
      if (values.variants_data) {
        states.defaultVariants = values.variants;
        states.defaultVariantData = {};
        values.variants_data.map((ele) => {
          states.defaultVariantData = {
            ...states.defaultVariantData,
            [ele.identifier]: {
              ...ele.product_data,
              pics: {
                imgs: ele.product_data?.pics_map,
                default_img: ele.product_data?.display_pic_map,
              },
              specification: formatSpecificationData(
                ele.product_data.specification || {}
              ),
            },
          };
        });
      }
      setTimeout(() => {
        setVariants(form.getFieldValue("variants"));
      }, 0);
    }
  };

  const handleValuesChange = (values) => {
    setIsValueChange(true);
    updateFormStates(values);
  };

  useEffect(() => {
    dispatch(productUnitAction());
    states.defaultVariantData = {};
    states.defaultVariants = [];
  }, []);

  // Calling details API for edit
  useEffect(() => {
    if (id) {
      dispatch(productViewAPI(id));
    } else {
      form.setFieldsValue({
        description: "<p></p>",
      });
    }
  }, [id]);

  //   calling the store reducer when ever the store gets updated
  useEffect(() => {
    if (addProduct.data && !addProduct.data.data.error) {
      setIsLoading(false);
      navigate(-1);
    }
    if (productView?.data && !productView?.data?.data?.error) {
      let tempData = productView.data.data.data;

      form.setFieldsValue({
        name: (tempData.name || "").replace(
          (tempData.variants || []).length ? " " + tempData.variant_name : "",
          ""
        ),
        category: tempData.category,
        brand: tempData.brand,
        code: tempData.code,
        hsn_code: tempData.hsn_code,
        description: tempData.description || "",
        mrp_price: tempData.mrp_price,
        mrp_unit: tempData.mrp_unit,
        price: tempData.price,
        unit: tempData.unit,
        gst: tempData.gst,
        gst_exclusive: tempData.gst_exclusive,
        packaging_level: tempData.packaging_level,
        specification: formatSpecificationData(tempData.specification),
        is_out_of_stock: tempData.is_out_of_stock,
        is_published: tempData?.is_published,
        availability: `${tempData?.is_published}-${tempData?.is_out_of_stock}`,
        pics: {
          imgs: tempData.pics_map,
          default_img: tempData.display_pic_map,
        },
        variants: (tempData.variants || []).map((vr, vi) => {
          return {
            ...vr,
            options: vr.options.concat(
              createVariantOption(`O${+new Date() - vi * 10}`)
            ),
          };
        }),
        video_link: tempData?.video_link,
      });
      updateFormStates(tempData);
    }
    if (editProductCategory.data && !editProductCategory.data.data.error) {
      singleSelectSearch.reset();
    }
  }, [state]);

  return (
    <div className={styles.add_product_container}>
      <h2>
        <img
          src={ArrowLeft}
          alt="arrow"
          onClick={() =>
            setDiscardModalAction({
              open: true,
              handleAction: () => navigate(-1),
            })
          }
          style={{ cursor: "pointer" }}
        />
        &nbsp; {id ? "Update" : "Add"} Product
      </h2>
      <Spin spinning={isLoading} indicator={<div />}>
        <Form
          form={form}
          layout="vertical"
          validateMessages={{
            required: "${label} is required.",
          }}
          scrollToFirstError={true}
          initialValues={{
            gst_exclusive: false,
            packaging_level: [{ unit: "", size: "" }],
            pics: { imgs: [], default_img: {} },
            availability: "true-false",
          }}
          requiredMark={(label, info) => (
            <div>
              {label} {info.required && <span style={{ color: "red" }}>*</span>}
            </div>
          )}
          onFinish={handleSubmit}
          onValuesChange={handleValuesChange}
        >
          <div className={styles.form}>
            <Form.Item
              label="Product Name"
              name="name"
              rules={[{ required: true }]}
            >
              <Input
                placeholder="Enter Product Name"
                data-testid="product-name"
              />
            </Form.Item>
            <Form.Item
              label="Product Category"
              name="category"
              rules={[{ required: true }]}
            >
              <ProductCategory setInterface={setSingleSelectSearch} />
            </Form.Item>
            <Row gutter={12}>
              <Col flex={1}>
                <Form.Item label="Brand" name="brand">
                  <Input
                    placeholder="Enter Brand Name"
                    data-testid="brand-name"
                  />
                </Form.Item>
              </Col>
              {!(variants || []).length && (
                <Col flex={1}>
                  <HsnCode />
                </Col>
              )}
            </Row>
            {!(variants || []).length && <Description />}
          </div>
          {!(variants || []).length && (
            <div className={styles.form} style={{ padding: 20 }}>
              <SpecificationForm />
            </div>
          )}
          <AddVariants
            {...{
              form,
              variants,
              setVariants,
              defaultVariants: states.defaultVariants,
            }}
          />
          {!!variants.length && (
            <ManageVariants
              {...{
                form,
                variants,
                defaultVariantData: states.defaultVariantData,
                setVariantData,
                variantDataError,
                setVariantsDataError,
              }}
            />
          )}
          {!variants.length && (
            <>
              <div className={styles.form}>
                <ProductCode />
                <ProductImageUpload />
                <VideoUrlInput />
              </div>

              <div className={styles.form}>
                <MrpUnit />
                <BuyerPrice />
                <PackagingUnit {...{ buyerUnit }} />
                <Form.Item
                  label="Product Availability"
                  name="availability"
                  data-testid="product-availability"
                >
                  <Radio.Group
                    data-testid="radio-groupids"
                    options={[
                      {
                        label: "Active",
                        value: "true-false",
                      },
                      {
                        label: "Inactive",
                        value: `false-false`,
                      },
                      {
                        label: "Out of stock",
                        value: `true-true`,
                      },
                    ]}
                  />
                </Form.Item>
              </div>
            </>
          )}

          {/* <Sets {...{ form }} /> */}
          <div className={styles.form_button}>
            <Button
              loading={isLoading}
              className={`button_primary`}
              htmlType="submit"
              data-testid="submit-button"
            >
              Submit
            </Button>
            <Button
              className={`button_secondary`}
              onClick={() =>
                setDiscardModalAction({
                  open: true,
                  handleAction: () => navigate("/web/product"),
                })
              }
              style={{ padding: "0px 20px", borderRadius: 8 }}
              data-testid="cancel-button"
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Spin>

      <AddProductCategory refetch={false} />
      <BackConfirmationModal {...{ isValueChange }} />
    </div>
  );
};

export default AddProduct;

const ProductCategory = ({ onChange, value, setInterface }) => {
  let productCategoryAPI = `${BASE_URL_V1}/organization/${org_id}/category/?is_with_id=true`;
  const context = useContext(Context);
  const { setAddProductCategoryOpen } = context;

  return (
    <Row align={"middle"} gutter={24}>
      <Col flex={1}>
        <SingleSelectSearch
          apiUrl={productCategoryAPI}
          onChange={(data) => onChange && onChange(data?.name || null)}
          value={value}
          setInterface={setInterface}
          params={{ placeholder: "Search Product Category" }}
          data-testid="Product-category-search"
        />
      </Col>
      <Col>
        <Button
          size="large"
          className={`button_secondary`}
          style={{ padding: "0px 20px", borderColor: "#fff", borderRadius: 8 }}
          onClick={() => {
            setAddProductCategoryOpen(true);
          }}
        >
          <span
            style={{ fontSize: 14, color: "#727176" }}
            data-testid="new-category-button"
          >
            New Category
          </span>
        </Button>
      </Col>
    </Row>
  );
};

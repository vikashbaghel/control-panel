import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./product.module.css";
import { Carousel } from "antd";
import {
  DeleteCrossIcon,
  DeleteOutlineIcon,
  EditIcon,
} from "../../assets/globle";
import ConfirmDelete from "../../components/confirmModals/confirmDelete";
import {
  deleteProduct as deleteProductAPI,
  productService,
} from "../../redux/action/productAction";
import Context from "../../context/Context";
import { capitalizeFirst } from "../dashboard";
import { useNavigate } from "react-router-dom";
import Permissions from "../../helpers/permissions";
import { toIndianCurrency } from "../../helpers/convertCurrency";
import { NoPhoto } from "../../assets";
import { RenderHTMLString } from "../../components/textAreaWithFeature/textAreaWithFeature";
import { OutOfStockWrapper } from ".";
import filterService from "../../services/filter-service";
import { GeneralModal } from "../../components/modals";
import SelectVariants from "./form/variants/SelectVariants";
import WrapText from "../../components/wrapText";
import SelectSingleVariants from "./form/variants/SelectSingleVariant";

const ProductDetail = ({ pageNumber, setProductDetail }) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  const context = useContext(Context);
  const { setDeleteModalOpen } = context;
  const navigate = useNavigate();

  const [productData, setProductData] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState();
  const [selectedVariant, setSelectedVariant] = useState([]);

  let editProductPermission = Permissions("EDIT_PRODUCT");
  let deleteProductPermission = Permissions("DELETE_PRODUCT");

  function fetchProductField(name) {
    if ((productData.variants || []).length) {
      if (name === "name") {
        return productData.variants_data?.[selectedVariant.join("-")]?.[
          name
        ].replace(
          productData.variants_data?.[selectedVariant.join("-")]?.variant_name,
          ""
        );
      }
      return productData.variants_data?.[selectedVariant.join("-")]?.[name];
    } else {
      return productData[name];
    }
  }

  useEffect(() => {
    if (state.productView.data && !state.productView.data.data.error) {
      const prod_data = state.productView.data.data.data;
      let obj = {};
      if (prod_data?.variants?.length) {
        prod_data?.variants_data?.map((ele) => {
          obj = { ...obj, [ele.identifier]: ele.product_data };
          if (ele.product_data?.id === prod_data.id) {
            setSelectedVariant(ele.identifier.split("-"));
          }
        });
      }
      setProductData({
        ...prod_data,
        variants_data: obj,
      });
    }
  }, [state]);

  const handleDeleteProduct = async (data = {}) => {
    const res = await deleteProductAPI({ id: productData.id, ...data });
    if (res && res.status === 200) {
      if (res.data.data.is_used) return setDeleteConfirmation(res.data.message);
      setProductData("");
      setProductDetail("");
      setDeleteConfirmation();
      setTimeout(() => {
        dispatch(productService(pageNumber, filterService.getFilters()));
      }, 400);
    }
  };

  return (
    productData && (
      <div className={styles.product_details_container}>
        {(!(productData.variants || []).length || selectedVariant.length) && (
          <>
            <img
              src={DeleteCrossIcon}
              alt="delete"
              className={styles.cancelIcon}
              onClick={() => setProductDetail("")}
            />
            <div className={styles.product_details_header}>
              <div style={{ width: 150 }}>
                {fetchProductField("pics_urls")?.length === 0 ? (
                  <OutOfStockWrapper
                    show={fetchProductField("is_out_of_stock")}
                    inActiveLabel={fetchProductField("is_published")}
                  >
                    <img src={NoPhoto} alt="img" className={styles.image} />
                  </OutOfStockWrapper>
                ) : (
                  <Carousel autoplay effect="fade" focusOnSelect="false">
                    {fetchProductField("pics_urls")?.map((item) => (
                      <OutOfStockWrapper
                        show={fetchProductField("is_out_of_stock")}
                        inActiveLabel={fetchProductField("is_published")}
                      >
                        <img src={item} className={styles.image} />
                      </OutOfStockWrapper>
                    ))}
                  </Carousel>
                )}
              </div>
              <div className={styles.product_name_section}>
                <WrapText len={30}>{fetchProductField("name") || ""}</WrapText>

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  {editProductPermission && (
                    <button
                      className="button_secondary"
                      onClick={() =>
                        navigate(
                          `/web/product/add-product?id=${
                            productData?.primary_product || productData.id
                          }`
                        )
                      }
                      style={{ marginTop: 10 }}
                    >
                      <img src={EditIcon} alt="edit" />
                      Edit
                    </button>
                  )}
                  {deleteProductPermission && (
                    <img
                      src={DeleteOutlineIcon}
                      alt="delete"
                      className={styles.delete}
                      onClick={() => setDeleteModalOpen(true)}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className={styles.details_group} style={{ paddingTop: "2em" }}>
              <div>Pkg. Size</div>
              <div>
                {fetchProductField("packaging_level")?.map((ele, ind) => {
                  return (
                    <div key={ind} className={styles.packaging_level}>
                      {ele.size} &nbsp;x&nbsp;{" "}
                      {capitalizeFirst(fetchProductField("unit"))} ={" "}
                      {capitalizeFirst(ele.unit)}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={styles.details_group1_container}>
              <div className={styles.details_group}>
                <div>Category</div>
                <div>{productData.category}</div>
              </div>
              <div className={styles.details_group}>
                <div>Brand</div>
                <div>{fetchProductField("brand")}</div>
              </div>
              <div className={styles.details_group}>
                <div>Product Code</div>
                <div>{fetchProductField("code")}</div>
              </div>
              <div className={styles.details_group}>
                <div>HSN Code</div>
                <div>{fetchProductField("hsn_code")}</div>
              </div>
            </div>
            <div className={styles.details_group2_container}>
              <div className={styles.details_group}>
                <div>MRP</div>
                <div>
                  {toIndianCurrency(fetchProductField("mrp_price"), 4)} /{" "}
                  {fetchProductField("mrp_unit")}
                </div>
              </div>
              <div className={styles.details_group}>
                <div>Buyer Price</div>
                <div>
                  {toIndianCurrency(fetchProductField("price"), 4)} /{" "}
                  {fetchProductField("unit")}
                </div>
              </div>
              <div
                className={`${styles.details_group} ${styles.details_group_gst}`}
              >
                <div>GST Taxes :</div>
                <div>
                  {fetchProductField("gst")}% (
                  {fetchProductField("gst_exclusive")
                    ? "Exclusive"
                    : "Inclusive"}
                  )
                </div>
              </div>
            </div>
            <br />
          </>
        )}
        {!!productData?.variants?.length && (
          <>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Variants</div>
            <SelectSingleVariants
              variants={productData?.variants}
              variantData={productData?.variants_data}
              selection={selectedVariant}
              setSelection={setSelectedVariant}
            />
          </>
        )}

        {fetchProductField("description") ? (
          <div className={styles.details_group_description}>
            <div>Description</div>
            <RenderHTMLString htmlString={fetchProductField("description")} />
          </div>
        ) : (
          <></>
        )}
        {!!Object.keys(fetchProductField("specification"))?.length && (
          <div className={styles.details_group_specification}>
            <div>Specification</div>
            {Object.keys(fetchProductField("specification")).map(
              (item, index) => (
                <div className={styles.specification_list} key={index}>
                  <span>{capitalizeFirst(item)}</span>
                  <span>{fetchProductField("specification")[item]}</span>
                </div>
              )
            )}
          </div>
        )}
        <ConfirmDelete
          title={"Product"}
          confirmValue={(data) => {
            data && handleDeleteProduct();
          }}
        />
        <GeneralModal
          open={deleteConfirmation}
          info={deleteConfirmation}
          okText="Delete"
          cancelText="Cancel"
          onCancel={() => setDeleteConfirmation()}
          onOk={() => handleDeleteProduct({ is_forced: true })}
        />
      </div>
    )
  );
};

export default ProductDetail;

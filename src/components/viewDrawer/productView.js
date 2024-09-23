import React, { useContext, useEffect, useState } from "react";
import { Carousel, Drawer, List } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import Context from "../../context/Context";
import { useSelector } from "react-redux";
import styles from "./styles/productView.module.css";
import { capitalizeFirst } from "../../views/dashboard";
import { toIndianCurrency } from "../../helpers/convertCurrency";

const ProductView = () => {
  const context = useContext(Context);
  const { productViewOpen, setProductViewOpen } = context;
  const state = useSelector((state) => state);
  const [productData, setProductData] = useState("");
  const [specification, setSpecification] = useState([]);

  const onClose = () => {
    setProductViewOpen(false);
  };
  useEffect(() => {
    if (state.productView.data !== "") {
      if (state.productView.data.data.error === false) {
        setProductData(state.productView.data.data.data);
        setSpecification(
          Object.entries(state.productView.data.data.data.specification)
        );
      }
    }
  }, [state]);

  return (
    productData && (
      <Drawer
        title={
          <>
            <CloseOutlined onClick={onClose} />
            &nbsp;&nbsp;&nbsp; Product View
          </>
        }
        width={520}
        closable={false}
        onClose={onClose}
        open={productViewOpen}
        style={{ overflowY: "auto" }}
      >
        <div style={{ lineHeight: "15px" }}>
          <Carousel dotClassName="dot-color" autoplay>
            {productData &&
              productData.pics_urls.map((item, index) => (
                <div key={index}>
                  <img style={contentStyle} src={item} />
                </div>
              ))}
          </Carousel>
          <div className={styles.header}>
            {capitalizeFirst(productData.name)}
          </div>
          <div>
            <div className={styles.details_group_pkg}>
              <div>Pkg. Size</div>
              <div>
                {productData.packaging_level.map((ele, ind) => {
                  return (
                    <div key={ind} className={styles.packaging_level}>
                      {ele.size} &nbsp;x&nbsp;{" "}
                      {capitalizeFirst(productData.unit)} ={" "}
                      {capitalizeFirst(ele.unit)}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={styles.details_group_brand}>
              <div>Brand</div>
              <div>{productData.brand}</div>
            </div>
            <div className={styles.details_group_code}>
              <div>Product Code</div>
              <div>{productData.code}</div>
            </div>
            <div className={styles.details_group_hsn}>
              <div>HSN Code</div>
              <div>{productData.hsn_code}</div>
            </div>
            <div className={styles.details_group_mrp}>
              <div>MRP</div>
              <div>
                {toIndianCurrency(productData.mrp_price / productData.mrp_unit)}
              </div>
            </div>
            <div className={styles.details_group_price}>
              <div>Buyer Price</div>
              <div>
                {toIndianCurrency(productData.price / productData.unit)}
              </div>
            </div>
            <div className={styles.details_group_gst}>
              <div>GST Taxes :</div>
              <div>
                {productData.gst}% (
                {productData.gst_exclusive ? "Exclusive" : "Inclusive"})
              </div>
            </div>
          </div>
          <div className={styles.details_group_description}>
            <div>Description</div>
            <p>
              {productData.description
                ? productData.description
                : "-- No Description Provided --"}
            </p>
          </div>
          <div className={styles.details_group_specification}>
            <div>Specification</div>
            <div>
              {specification.length > 0 ? (
                specification.map((item, index) => (
                  <div className={styles.specification_list} key={index}>
                    <span>{capitalizeFirst(item[0])}</span>
                    <span>{item[1]}</span>
                  </div>
                ))
              ) : (
                <div
                  style={{ color: "#727176", fontSize: 16, margin: "20px 0" }}
                >
                  <span>-- No Specification Provided --</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Drawer>
    )
  );
};

export default ProductView;

const contentStyle = {
  margin: "auto ",
  height: "300px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
  alignItems: "center",
};

import React, { useContext, useEffect, useState } from "react";
import { Modal, notification } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Context from "../../context/Context";
import { BASE_URL_V1, org_id } from "../../config";
import { toIndianCurrency } from "../../helpers/convertCurrency";
import Cookies from "universal-cookie";
import noImageFound from "../../assets/no-photo-available.gif";
import cartService, {
  buyerPriceWithTelescope,
} from "../../services/cart-service";
import InfiniteScrollWrapper from "../infinite-scroll-wrapper/infiniteScrollWrapper";
import AddToCartWithVariants from "../../views/product/AddToCartWithVariants";
import WrapText from "../wrapText";
import AddToCartButton from "../addToCartButton";
import { variantAddedCount } from "../../views/product/productCardView";

const constants = {
  defaultVariantModal: {
    open: false,
    variantDetails: {},
  },
};

const ProductListView = ({
  cartData,
  onUpdate,
  cartDetails,
  updateDetails,
}) => {
  const cookies = new Cookies();

  const context = useContext(Context);
  const { productListViewOpen, setProductListViewOpen } = context;

  const [searchValue, setSearchValue] = useState("");
  const [variantModal, setVariantModal] = useState(
    constants.defaultVariantModal
  );

  const { distributor } = cartDetails;

  const onClose = () => {
    setProductListViewOpen(false);
  };

  const onSearch = (e) => {
    setTimeout(() => {
      setSearchValue(e.target.value);
    }, 500);
  };

  return (
    <>
      <Modal
        key={productListViewOpen}
        title={
          <div
            style={{
              padding: 15,
              textAlign: "center",
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            Product List
          </div>
        }
        width={700}
        onCancel={onClose}
        open={productListViewOpen}
        footer={[]}
        centered
      >
        <div style={{ height: 500 }}>
          <div
            style={{
              display: "flex",
              padding: " 0 20px 5px 20px",
            }}
          >
            <div className="search_input" style={{ width: "100%" }}>
              <input
                placeholder="Search for Product"
                onChange={(e) => onSearch(e)}
                style={{ height: 15, width: "calc(100% - 24px)" }}
              />
              <SearchOutlined />
            </div>
          </div>
          <br />
          <InfiniteScrollWrapper
            apiUrl={`${BASE_URL_V1}/organization/${org_id}/product/es/?name=${searchValue}&customer_id=${distributor.id}`}
            height={400}
          >
            {(productData) => {
              let { initial_qty, qty, packaging_unit } =
                cartService.fetchCartItem(productData.id) || {};
              let item = {
                ...productData,
                initial_qty,
                qty,
                packaging_unit,
              };

              return (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingInline: "1em",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        position: "relative",
                      }}
                    >
                      {item.is_out_of_stock && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            position: "absolute",
                            textAlign: "center",
                            width: "60px",
                            background: "rgb(255, 255, 255,0.7)",
                            padding: "5px ",
                            color: "red",
                            marginLeft: "5px",
                            fontSize: "10px",
                          }}
                        >
                          Out of Stock
                        </div>
                      )}
                      <img
                        width={70}
                        height={70}
                        src={
                          item.display_pic_url
                            ? item.display_pic_url
                            : noImageFound
                        }
                        style={{
                          padding: 5,
                          background: "#fff",
                          borderRadius: 5,
                        }}
                        alt="product"
                      />
                    </div>
                    <div
                      style={{
                        paddingLeft: 10,
                      }}
                    >
                      <WrapText width={150}>{item.name}</WrapText>
                      <div style={{ color: "#727176", fontSize: 12 }}>
                        Buyer Price :{" "}
                        <span style={{ color: "#000" }}>
                          {toIndianCurrency(buyerPriceWithTelescope(item), 4)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      width: "300px",
                      flexDirection: "column",
                      gap: 3,
                    }}
                  >
                    <AddToCartButton
                      key={item?.id}
                      {...{ item, setVariantModal }}
                      {...{ onUpdate }}
                    />
                    {!!variantAddedCount(item) && (
                      <div
                        style={{
                          color: "#727176",
                          fontSize: 10,
                          fontWeight: 500,
                          textAlign: "center",
                        }}
                      >
                        {variantAddedCount(item)} variants added
                      </div>
                    )}
                  </div>
                </div>
              );
            }}
          </InfiniteScrollWrapper>
        </div>
      </Modal>
      <AddToCartWithVariants
        {...variantModal}
        {...{ onUpdate }}
        onClose={() => {
          setVariantModal(constants.defaultVariantModal);
        }}
      />
    </>
  );
};
export default ProductListView;

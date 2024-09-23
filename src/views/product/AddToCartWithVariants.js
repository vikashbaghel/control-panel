import { Dropdown, Modal, Space } from "antd";
import { productView as productViewAPI } from "../../redux/action/productAction";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SelectVariants from "./form/variants/SelectVariants";
import defaultImage from "../../assets/no-photo-available.gif";
import { toIndianCurrency } from "../../helpers/convertCurrency";
import cartService, {
  buyerPriceWithTelescope,
} from "../../services/cart-service";
import { OutOfStockWrapper } from ".";
import AddToCartButton from "../../components/addToCartButton";
import WrapText from "../../components/wrapText";
import InfiniteScrollWrapper from "../../components/infinite-scroll-wrapper/infiniteScrollWrapper";
import { BASE_URL_V1, org_id } from "../../config";
import { capitalizeFirstLetter } from "../roles-permission/staffRolesPermision";
import Context from "../../context/Context";
import { InfoCircleOutlined } from "@ant-design/icons";

export default function AddToCartWithVariants({
  open,
  variantDetails,
  onUpdate,
  onClose,
}) {
  const queryParameters = new URLSearchParams(window.location.search);
  const customerId = queryParameters.get("id");
  const dispatch = useDispatch();
  const { productView } = useSelector((state) => state);
  const { setCartNumber } = useContext(Context);

  const [selectedVariant, setSelectedVariant] = useState([]);
  const [variantStates, setVariantStates] = useState({ variants: [] });

  useEffect(() => {
    open && dispatch(productViewAPI(variantDetails.primary_product));
  }, [open]);

  useEffect(() => {
    if (productView?.data && !productView?.data?.data?.error) {
      setVariantStates({ variants: productView?.data?.data?.data?.variants });
      setSelectedVariant([
        productView?.data?.data?.data?.variants[0]?.options[0]?.option_id,
      ]);
    }
  }, [productView]);

  useEffect(() => {
    cartService.setEventListner((cartItems) => {
      setCartNumber((cartItems || []).length);
    });
  }, []);

  const onHandleCancel = () => {
    onClose();
    setSelectedVariant([]);
    setVariantStates({
      variants: [],
      variantData: {},
      telescopingPricing: {},
    });
  };

  return (
    <>
      {!!Object.keys(variantDetails).length && (
        <Modal
          {...{ open }}
          onCancel={onHandleCancel}
          title={<div style={styles.title}>Variant</div>}
          footer={
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                background: "#fff",
                padding: "15px 20px",
                borderRadius: "0 0 10px 10px",
              }}
            >
              <button onClick={onHandleCancel} className="button_primary">
                Done
              </button>
            </div>
          }
          style={{ fontFamily: "Poppins" }}
          width={600}
        >
          <div
            style={{ padding: "2em", paddingBottom: 0, fontFamily: "poppins" }}
          >
            <VariantProductViewCard {...{ variantDetails, onUpdate }} />
            <br />
            <SelectVariants
              {...variantStates}
              selection={selectedVariant}
              setSelection={setSelectedVariant}
            />
            {!!selectedVariant.length && (
              <InfiniteScrollWrapper
                apiUrl={`${BASE_URL_V1}/organization/${org_id}/product/es/?primary_product_id=${variantDetails.primary_product}&customer_id=${customerId}&identifiers=${selectedVariant}`}
                height={300}
              >
                {(obj) => {
                  let isVariantShow = obj.id === variantDetails.id;
                  return (
                    !isVariantShow && (
                      <VariantProductViewCard
                        variantDetails={obj}
                        size="small"
                        onUpdate={(obj) => onUpdate(obj, () => {})}
                      />
                    )
                  );
                }}
              </InfiniteScrollWrapper>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}

const VariantProductViewCard = ({
  variantDetails,
  onUpdate,
  size = "normal",
}) => {
  const smallSize = size === "small";

  let { qty, packaging_unit } =
    cartService.fetchCartItem(variantDetails.id) || {};
  let item = {
    ...variantDetails,
    qty,
    packaging_unit,
  };

  const items = variantDetails.packaging_level?.map((ele, ind) => ({
    key: ind,
    label: (
      <div
        style={{
          ...styles.flex,
          ...styles.color_black,
          fontSize: 12,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>
          {ele.size} x {item.unit} :
        </span>
        <span style={{ marginLeft: 20 }}>{ele.unit}</span>
      </div>
    ),
  }));

  return item.is_published ? (
    <div style={styles.prod_detail_container}>
      <div style={styles.flex}>
        <OutOfStockWrapper
          show={item.is_out_of_stock}
          inActiveLabel={item.is_published}
        >
          <img
            src={item.display_pic_url || defaultImage}
            alt={item?.name}
            style={{
              ...styles.prod_img,
              ...(smallSize ? { width: 70, height: 70 } : {}),
            }}
          />
        </OutOfStockWrapper>
        <div>
          <div
            style={{
              ...styles.color_purple,
              fontSize: smallSize ? 16 : 18,
              fontWeight: 600,
            }}
          >
            <WrapText width={350}>
              {smallSize
                ? item["variant_name"]
                : item["name"].replace(item["variant_name"], "")}
            </WrapText>
          </div>
          <div>
            <span
              style={{ ...styles.color_purple, fontSize: 16, fontWeight: 500 }}
            >
              {toIndianCurrency(
                buyerPriceWithTelescope(
                  item,
                  item.productDiscount ? true : false
                ),
                4
              )}
              /
            </span>
            <span style={{ ...styles.color_grey, fontSize: 12 }}>
              {item.unit}
            </span>
          </div>
          {!smallSize && (
            <>
              <div
                style={{ ...styles.color_grey, fontWeight: 500, fontSize: 12 }}
              >
                {item.brand} | {item.category}
              </div>
              <div
                style={{ ...styles.color_grey, fontWeight: 500, fontSize: 12 }}
              >
                {capitalizeFirstLetter(item.variant_name)}
              </div>
            </>
          )}
        </div>
      </div>
      <div
        style={{
          ...styles.flex,
          ...styles.color_black,
          fontSize: 12,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {variantDetails.packaging_level.length > 1 ? (
          <Dropdown
            menu={{
              items,
            }}
          >
            <Space style={{ fontSize: 12, fontFamily: "Poppins" }}>
              Pkg Level
              <InfoCircleOutlined />
            </Space>
          </Dropdown>
        ) : (
          <div>
            <span>
              Pkg Size : {variantDetails.packaging_level[0].size} x {item.unit}
            </span>
            <span style={{ marginLeft: 10 }}>
              {variantDetails.packaging_level[0].unit}
            </span>
          </div>
        )}
        <div>
          <AddToCartButton key={`${item.id}`} item={item} {...{ onUpdate }} />
        </div>
      </div>
    </div>
  ) : (
    <div style={{ ...styles.align_center, height: 105 }}>
      This variant combination is currently unavailable.
    </div>
  );
};

const styles = {
  title: {
    paddingBlock: "1em",
    textAlign: "center",
    fontSize: 18,
    fontWeight: 600,
  },
  color_black: {
    color: "#000000",
    fontWeight: "600",
  },
  color_purple: { color: "#312B81" },
  color_grey: { color: "#727176" },
  color_red: {
    color: "#E10000",
    fontWeight: 500,
    fontSize: 12,
  },
  prod_detail_container: {
    background:
      "linear-gradient(107.41deg, rgba(255, 255, 255, 0.7) 44.17%, rgba(255, 255, 255, 0.4) 100%)",
    border: "2px solid #FFFFFF",
    boxShadow: "2px 6px 12px 4px #00000005",
    borderRadius: 10,
    padding: 20,
  },
  prod_img: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  flex: {
    display: "flex",
    gap: "1em",
  },
  flex_col: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  align_center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

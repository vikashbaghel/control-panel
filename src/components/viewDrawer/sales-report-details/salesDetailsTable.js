import { useState } from "react";
import Cookies from "universal-cookie";
import styles from "./styles.module.css";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import beatIcon from "../../../assets/beat/beat-icon.svg";
import newCustomerIcon from "../../../assets/beat/customer.svg";
import orderValueIcon from "../../../assets/navbarImages/payment.svg";
import distributorIcon from "../../../assets/staffImages/MeetingIcon.svg";
import pcIcon from "../../../assets/activity-details-header/productice-call.svg";
import totalCallIcon from "../../../assets/activity-details-header/total-call.svg";
import categoryIcon from "../../../assets/activity-details-header/category-summary.svg";
import productSummaryIcon from "../../../assets/activity-details-header/product-summary.svg";
import WrapText from "../../wrapText";
import { useNavigate } from "react-router-dom";

export default function SalesDetailsTable({
  reportDetails,
  customStyles = {},
}) {
  const cookies = new Cookies();
  const navigate = useNavigate();

  const customerLevelList = cookies.get("rupyzCustomerLevelConfig");

  const [toggleLists, setToggleLists] = useState({
    newCustomers: false,
    productSummary: false,
    categorySummary: false,
  });

  const newCustomerCount = (customer) => {
    return (
      customer["LEVEL-1"]["count"] +
      customer["LEVEL-2"]["count"] +
      customer["LEVEL-3"]["count"]
    );
  };
  return (
    <div
      className={styles.report_table}
      style={{ ...customStyles?.table_container }}
    >
      <div className={`${styles.space_between} ${styles.border_bottom}`}>
        <p className={styles.flex_5}>
          <img src={beatIcon} alt="beat" width={24} height={24} />
          Beat
        </p>
        <p className={`${styles.flex_5} ${styles.bold_blue}`}>
          {reportDetails?.beat_name}
        </p>
      </div>

      <div className={`${styles.space_between} ${styles.border_bottom}`}>
        <p className={styles.flex_5}>
          <img src={distributorIcon} alt="distributor" width={24} height={24} />
          Distributor
        </p>
        {reportDetails?.distributor_name}
      </div>

      <div className={`${styles.flex_col_1} ${styles.border_bottom}`}>
        <div className={styles.space_between}>
          <p className={styles.flex_5}>
            <img
              src={newCustomerIcon}
              alt="new-customer"
              width={24}
              height={24}
            />
            New Customer
          </p>
          <p
            className={`${styles.flex_5} ${styles.bold_blue}`}
            style={{ cursor: "pointer" }}
            onClick={() => {
              if (newCustomerCount(reportDetails?.new_customer_data)) {
                setToggleLists({
                  ...toggleLists,
                  newCustomers: !toggleLists.newCustomers,
                });
              }
            }}
          >
            {reportDetails?.new_customer_data && (
              <>
                {newCustomerCount(reportDetails?.new_customer_data)}
                {newCustomerCount(reportDetails?.new_customer_data) ? (
                  <DownOutlined />
                ) : (
                  ""
                )}
              </>
            )}
          </p>
        </div>
        {toggleLists.newCustomers && (
          <div className={styles.flex_col_1}>
            {Object.keys(reportDetails?.new_customer_data).map((ele) => (
              <div
                key={ele}
                className={styles.space_between}
                style={{ paddingLeft: "2.3em" }}
              >
                <p>{customerLevelList[ele]}</p>
                <p className={`${styles.bold_blue} ${styles.flex_5}`}>
                  {reportDetails?.new_customer_data[ele]["count"]}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={`${styles.space_between} ${styles.border_bottom}`}>
        <p className={styles.flex_5}>
          <img
            src={newCustomerIcon}
            alt="new-customer"
            width={24}
            height={24}
          />
          New Lead
        </p>
        <p className={`${styles.flex_5} ${styles.bold_blue}`}>
          {reportDetails?.new_lead_ids?.length}
        </p>
      </div>

      <div className={`${styles.flex_col_1} ${styles.border_bottom}`}>
        <div className={styles.space_between}>
          <p className={styles.flex_5}>
            <img src={totalCallIcon} alt="total-call" width={24} height={24} />
            Total Call (TC)
          </p>
          <p
            className={`${styles.flex_5} ${styles.bold_blue}`}
            style={{ cursor: "pointer" }}
            onClick={() => {
              if (reportDetails?.total_activity_count) {
                navigate(
                  `/web/team-activity/details/tc?user_id=${reportDetails.user}&user_name=${reportDetails.user_name}&date=${reportDetails.params.date}&pic_url=${reportDetails.profile_pic_url}`
                );
              }
            }}
          >
            {reportDetails?.total_activity_count}
            {reportDetails?.total_activity_count ? <RightOutlined /> : ""}
          </p>
        </div>
      </div>

      <div className={`${styles.flex_col_1} ${styles.border_bottom}`}>
        <div className={styles.space_between}>
          <p className={styles.flex_5}>
            <img src={pcIcon} alt="pc" width={24} height={24} />
            Productive Call (PC)
          </p>
          <p
            className={`${styles.flex_5} ${styles.bold_blue}`}
            style={{ cursor: "pointer" }}
            onClick={() => {
              if (reportDetails?.total_pc_count) {
                navigate(
                  `/web/team-activity/details/pc?user_id=${reportDetails.user}&user_name=${reportDetails.user_name}&date=${reportDetails.params.date}&pic_url=${reportDetails.profile_pic_url}`
                );
              }
            }}
          >
            {reportDetails?.total_pc_count}{" "}
            {reportDetails?.total_pc_count ? <RightOutlined /> : ""}
          </p>
        </div>
      </div>
      <div className={`${styles.flex_col_1} ${styles.border_bottom}`}>
        <div className={styles.space_between}>
          <p className={styles.flex_5}>
            <img
              src={productSummaryIcon}
              alt="product"
              width={24}
              height={24}
            />
            Product Summary
          </p>
          <p
            className={styles.bold_blue}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setToggleLists({
                ...toggleLists,
                productSummary: !toggleLists.productSummary,
              });
            }}
          >
            <DownOutlined />
          </p>
        </div>
        {toggleLists.productSummary &&
          (reportDetails?.product_metrics?.length > 0 ? (
            <div className={styles.grid_cols_3}>
              <p className={styles.bold_black} style={{ fontSize: 12 }}>
                Product
              </p>
              <p
                className={styles.bold_black}
                style={{ textAlign: "center", fontSize: 12 }}
              >
                Quantity
              </p>
              <p
                className={styles.bold_black}
                style={{
                  textAlign: "right",
                  paddingRight: ".5em",
                  fontSize: 12,
                }}
              >
                Amount
              </p>
              {reportDetails?.product_metrics?.map((ele) => (
                <>
                  <p>
                    <WrapText width={150}>{ele?.name}</WrapText>
                  </p>
                  <p style={{ textAlign: "center" }}>
                    {ele.qty}
                    {ele.unit && " " + ele.unit}
                  </p>
                  <p
                    style={{
                      textAlign: "right",
                      paddingRight: ".5em",
                      fontFamily: "Roboto",
                    }}
                  >
                    ₹ {ele.amount}
                  </p>
                </>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: "center", color: "#656565" }}>
              No Summary Available
            </p>
          ))}
      </div>
      <div className={styles.flex_col_1} style={{ padding: "1em" }}>
        <div className={styles.space_between}>
          <p className={styles.flex_5}>
            <img src={categoryIcon} alt="category" width={24} height={24} />
            Category Summary
          </p>
          <p
            className={styles.bold_blue}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setToggleLists({
                ...toggleLists,
                categorySummary: !toggleLists.categorySummary,
              });
            }}
          >
            <DownOutlined />
          </p>
        </div>
        {toggleLists.categorySummary && (
          <div>
            {reportDetails?.category_metrics?.length > 0 ? (
              <>
                <div
                  className={`${styles.space_between} ${styles.bold_black}`}
                  style={{ fontSize: 12 }}
                >
                  <p>Product Category</p>
                  <p style={{ paddingRight: "1em" }}>Amount</p>
                </div>
                <div style={{ maxHeight: "300px", overflow: "scroll" }}>
                  {reportDetails?.category_metrics?.map((ele) => (
                    <div
                      className={styles.space_between}
                      style={{ color: "#656565" }}
                    >
                      <p style={{ textTransform: "capitalize" }}>
                        <WrapText width={200}>{ele?.name}</WrapText>
                      </p>
                      <p style={{ fontFamily: "Roboto", paddingRight: ".5em" }}>
                        ₹ {ele?.amount}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p style={{ textAlign: "center", color: "#656565" }}>
                No Summary Available
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

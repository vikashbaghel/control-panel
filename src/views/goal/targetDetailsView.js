import React from "react";
import styles from "./individualTarget.module.css";
import {
  CollectionIcon,
  CustomerIcon,
  LeadIcon,
  ProductIcon,
  SalesIcon,
  VisitIcon,
} from "../../assets/staffImages";
import { roundToDecimalPlaces } from "../../helpers/roundToDecimal";
import { useNavigate } from "react-router-dom";
import ProgressCircle from "../../helpers/progressCircle";

const TargetDetailsView = ({ data }) => {
  const navigate = useNavigate();

  const productPercentage = () => {
    let totalCount = 0;
    data?.product_metrics?.map((ele) => {
      if (ele.current_value >= ele.target_value) {
        totalCount++;
      }
    });
    return totalCount;
  };

  const targetList = data && [
    {
      title: "Sales",
      target: data.target_sales_amount,
      achieved: data.current_sales_amount,
      image: SalesIcon,
    },
    {
      title: "Collection",
      target: data.target_payment_collection,
      achieved: data.current_payment_collection,
      image: CollectionIcon,
    },
    {
      title: "Leads",
      target: data.target_new_leads,
      achieved: data.current_new_leads,
      image: LeadIcon,
    },
    {
      title: "Customers",
      target: data.target_new_customers,
      achieved: data.current_new_customers,
      image: CustomerIcon,
    },
    {
      title: "Visits",
      target: data.target_customer_visits,
      achieved: data.current_customer_visits,
      image: VisitIcon,
    },
    {
      title: "Product",
      target: data.product_metrics?.length,
      achieved: productPercentage(),
      image: ProductIcon,
    },
  ];

  return (
    <div className={styles.target_detail_container}>
      {targetList.map((item, index) => {
        return (
          item.title &&
          item.target > 0 && (
            <div
              key={index}
              className={styles.target_sales_details_main}
              style={item.title === "Product" ? { height: 145 } : {}}
            >
              <h3>{item.title}</h3>
              <img
                src={item.image}
                alt="sales"
                style={{
                  position: "absolute",
                  top: -30,
                  left: "43%",
                }}
              />
              <div>
                <div className={styles.target_title}>
                  <div style={{ fontSize: 12, color: "#309F35" }}>Target</div>
                  <div style={{ fontSize: 16 }}>
                    {item.title === "Sales" || item.title === "Collection"
                      ? "₹ "
                      : ""}
                    {roundToDecimalPlaces(item.target)}
                  </div>
                </div>
                {item.achieved === null ? (
                  <></>
                ) : (
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#309F35",
                      }}
                    >
                      Achieved
                    </div>
                    <div style={{ fontSize: 16 }}>
                      {" "}
                      {item.title === "Sales" || item.title === "Collection"
                        ? "₹ "
                        : ""}
                      {roundToDecimalPlaces(item.achieved)}
                    </div>
                  </div>
                )}
                <div>
                  <div className={styles.progress_bar}>
                    <ProgressCircle
                      target={item.target}
                      current={item.achieved}
                    />
                  </div>
                </div>
              </div>
              {item.title === "Product" && (
                <>
                  <div
                    style={{
                      float: "right",
                      marginTop: 20,
                      fontSize: 12,
                      color: "#1f1d57",
                      position: "relative",
                      zIndex: 999,
                      fontWeight: 600,
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/web/target?targetid=${data.id}`)}
                  >
                    View Product Details
                  </div>
                </>
              )}
            </div>
          )
        );
      })}
    </div>
  );
};

export default TargetDetailsView;

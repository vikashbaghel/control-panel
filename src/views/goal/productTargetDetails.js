import { useEffect } from "react";
import { Progress, Table } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./targetDetails.module.css";
import { Staff } from "../../assets/navbarImages";
import { useDispatch, useSelector } from "react-redux";
import leftArrow from "../../assets/globle/arrow-left.svg";
import noImageFound from "../../assets/no-photo-available.gif";
import { getTargetDetailsById } from "../../redux/action/goals";
import { toIndianCurrency } from "../../helpers/convertCurrency";
import { roundToDecimalPlaces } from "../../helpers/roundToDecimal";
import ProgressCircle from "../../helpers/progressCircle";

export default function ProductTargetDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { getTargetDetailsById: targetData } = useSelector((state) => state);

  const queryParameters = new URLSearchParams(window.location.search);
  const targetId = queryParameters.get("targetid");

  useEffect(() => {
    dispatch(getTargetDetailsById(targetId));
  }, []);

  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
      width: "300px",
      render: (text, record) => (
        <div className={styles.product_name}>
          <img
            src={record.display_pic_url || noImageFound}
            alt={text}
            className={styles.product_image}
          />
          {text}
        </div>
      ),
    },
    {
      title: "Target Quantity",
      dataIndex: "target_value",
      render: (text, record) => (
        <div>
          {record.type === "COUNT" ? (
            text
          ) : (
            <div style={{ color: "#d6d6d6" }}>N/A</div>
          )}
        </div>
      ),
    },
    {
      title: "Target Amount",
      dataIndex: "target_value",
      render: (text, record) => (
        <div>
          {record.type === "COUNT"
            ? toIndianCurrency(text * record.price)
            : toIndianCurrency(text)}
        </div>
      ),
    },
    {
      title: "Achieved Quantity",
      dataIndex: "current_value",
      render: (text, record) => (
        <div>
          {record.type === "COUNT" ? (
            text
          ) : (
            <div style={{ color: "#d6d6d6" }}>N/A</div>
          )}
        </div>
      ),
    },
    {
      title: "Achieved Amount",
      dataIndex: "current_value",
      render: (text, record) => (
        <div>
          {record.type === "COUNT"
            ? toIndianCurrency(text * record.price)
            : toIndianCurrency(text)}
        </div>
      ),
    },
    {
      title: "Percentage",
      render: (text, record) => (
        <ProgressCircle
          target={record.target_value}
          current={record.current_value}
        />
      ),
    },
  ];

  return (
    <div className={styles.target_details_page}>
      <div>
        <div className={styles.back_btn}>
          <img src={leftArrow} alt="Back" onClick={() => navigate(-1)} />
          <h2 className="page_title">Product Target</h2>
        </div>
        <div className={styles.user_details}>
          <img
            src={targetData?.data?.data?.data?.profile_pic_url || Staff}
            alt="load.."
          />
          <p>{targetData?.data?.data?.data?.user_name}</p>
        </div>
      </div>
      <Table
        key={"in"}
        columns={columns}
        dataSource={targetData?.data?.data?.data?.product_metrics}
        pagination={false}
      />
    </div>
  );
}

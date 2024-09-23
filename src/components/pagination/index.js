import Context from "../../context/Context";
import { useContext } from "react";
import styles from "./pagination.module.css";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";

const Paginator = ({ limiter = false, value = 1, onChange }) => {
  value = parseInt(`${value}`);
  const context = useContext(Context);
  const { setLoading } = context;

  const handlePrevPage = () => {
    setLoading(true);
    onChange(value - 1);
  };

  const handleNextPage = () => {
    if (limiter) return;
    setLoading(true);
    onChange(value + 1);
  };

  return (
    <div className={styles.pagination_container}>
      <button onClick={handlePrevPage} disabled={value === 1}>
        <CaretLeftOutlined />
      </button>
      Page {value}
      <button onClick={handleNextPage} disabled={limiter}>
        <CaretRightOutlined />
      </button>
    </div>
  );
};

export default Paginator;

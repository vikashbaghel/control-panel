import styles from "./styles.module.css";
import { PlusOutlined } from "@ant-design/icons";
import deleteIcon from "../../../../assets/new-delete-icon.svg";

export function AddItemsButton({ children, onClick }) {
  return (
    <div className={styles.add_item_btn} onClick={onClick}>
      <div className={styles.add_item_btn_icon}>
        <PlusOutlined />
      </div>
      {children}
    </div>
  );
}

export function RemoveIcon({ onClick, style = {} }) {
  return (
    <img
      src={deleteIcon}
      alt="delete"
      onClick={onClick}
      className={styles.remove_icon}
      style={style}
    />
  );
}

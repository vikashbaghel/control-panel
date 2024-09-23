import { useContext } from "react";
import styles from "./loader.module.css";
import Context from "../../context/Context";

export default function Loader() {
  const context = useContext(Context);
  const { loading } = context;
  return (
    <>
      {loading && (
        <div className={styles.loader_modal}>
          <div className={styles.loader}></div>
        </div>
      )}
    </>
  );
}

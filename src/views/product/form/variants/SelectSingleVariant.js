import { Col, Space } from "antd";
import styles from "./styles.module.css";

export default function SelectSingleVariants({
  variants = [],
  variantData = [],
  selection,
  setSelection,
}) {
  return (
    <div style={{ paddingBottom: 20 }}>
      {(variants || []).map((variant, Vi) => (
        <Col key={Vi}>
          <p style={{ color: "#727176" }}>{variant.name}</p>
          <div className={styles.flex_wrap}>
            {variant.options.map((opt, Oi) =>
              opt.name ? (
                (opt.payload || {})["color"] ? (
                  <div key={"opt" + Oi}>
                    <Space direction="vertical" align="center" size={4}>
                      <div
                        data-testid={opt.option_id}
                        className={`${styles.color_tabs} ${
                          selection[Vi] === opt.option_id
                            ? styles.selected_option
                            : ""
                        } clickable`}
                        style={{ backgroundColor: opt.payload.color }}
                        onClick={() => {
                          let values = [...selection];
                          values[Vi] = opt.option_id;
                          setSelection(values);
                        }}
                      />
                      <div style={{ color: "#727176" }}>{opt.name}</div>
                    </Space>
                  </div>
                ) : (
                  <div
                    data-testid={opt.option_id}
                    key={"opt" + Oi}
                    className={`${styles.size_tabs} ${
                      selection[Vi] === opt.option_id
                        ? styles.selected_option
                        : ""
                    } clickable`}
                    style={{ textAlign: "center", color: "#727176" }}
                    onClick={() => {
                      let values = [...selection];
                      values[Vi] = opt.option_id;
                      setSelection(values);
                    }}
                  >
                    {opt.name}
                  </div>
                )
              ) : (
                []
              )
            )}
          </div>
        </Col>
      ))}
    </div>
  );
}

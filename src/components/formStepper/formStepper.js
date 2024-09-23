import React from "react";
import styles from "./formStepper.module.css";

const FormStepper = ({
  totalCount,
  activeCount,
  size = "middle",
  description = {},
  error = false,
}) => {
  const iconSize = {
    small: { width: 30, height: 30, fontSize: 14 },
    middle: { width: 40, height: 40, fontSize: 16 },
    large: { width: 50, height: 50, fontSize: 18 },
  };

  const descriptionStyle = {
    small: { top: 30, width: 100, textAlign: "center" },
    middle: { top: 40, width: 100, textAlign: "center" },
    large: { top: 50, width: 100, textAlign: "center" },
  };

  return (
    <div className={styles.stepper_container_main}>
      {[...Array(totalCount).keys()].map((item, index) => {
        const ele = index + 1;
        const isFirst = index === 0;
        return (
          <div
            key={index}
            className={`${activeCount >= ele || error ? styles.active : ""}`}
            style={
              !isFirst ? { flex: 1, display: "flex", alignItems: "center" } : {}
            }
          >
            {!isFirst && (
              <div
                className={styles.stepper_divider}
                style={{ flex: 1, borderColor: error && !isFirst ? "red" : "" }}
              />
            )}
            <div
              className={styles.stepper_container}
              style={{
                ...iconSize[size],
                background: error && !isFirst ? "red" : "",
              }}
            >
              {ele}
              <div
                className={styles.description}
                style={descriptionStyle[size]}
              >
                {description[ele]}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FormStepper;

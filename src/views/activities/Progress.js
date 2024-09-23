import React from "react";
import styles from "./activity.module.css"; // Create a CSS file (ProgressBar.css) to style the progress bar

const ProgressBarComponent = ({ lead, customer, meeting }) => {
  const leadPercentage =
    parseFloat(lead) === 0 ? 0 : (parseFloat(lead) / parseFloat(meeting)) * 100;
  const customerPercentage =
    parseFloat(customer) === 0
      ? 0
      : (parseFloat(customer) / parseFloat(meeting)) * 100;
  return (
    <div className={styles.progress_bar}>
      <div
        className={styles.customer_progress}
        style={{ width: `${customerPercentage}%` }}
      ></div>
      <div
        className={styles.staff_progress}
        style={{ width: `${leadPercentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBarComponent;

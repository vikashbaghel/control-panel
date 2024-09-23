import { Progress } from "antd";
import React from "react";

const ProgressCircle = ({ target, current }) => {
  function customRound(value) {
    const decimalPart = value % 1;
    const roundedValue =
      decimalPart > 0.5 ? Math.ceil(value) : Math.floor(value);
    return roundedValue;
  }

  return (
    <div className="target-progress">
      <Progress
        type="circle"
        percent={target === 0 ? 0 : customRound((current / target) * 100)}
        status="normal"
        format={() =>
          target === 0 ? "0" : `${customRound((current / target) * 100)}%`
        }
      />
    </div>
  );
};

export default ProgressCircle;

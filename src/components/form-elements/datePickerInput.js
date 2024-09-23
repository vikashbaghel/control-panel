import { DatePicker } from "antd";
import dayjs from "dayjs";

export const DatePickerInput = ({
  showTime = false,
  onChange,
  value,
  params,
  format = "DD-MM-YYYY",
}) => {
  return (
    <DatePicker
      format={format}
      value={value ? dayjs(value, format) : ""}
      showTime={showTime}
      onChange={(date, dateString) => onChange && onChange(dateString, date)}
      style={{ width: "100%", padding: "8px 11px" }}
      {...params}
    />
  );
};

import moment from "moment";
import styles from "./report.module.css";
import { DatePicker, Form, Input, Select } from "antd";

const { RangePicker } = DatePicker;

export default function ReportHead({ reqFields = {}, onFieldChange }) {
  const finalReqFields = {
    date: true,
    reportType: true,
    ...reqFields,
  };
  // Disable future dates
  const disabledDate = (current) => {
    return current && current > moment().endOf("day");
  };

  return (
    <div className={styles.card_view}>
      <div style={{ display: "flex", gap: "2em" }}>
        <Form.Item
          label="Report Name"
          name="report_name"
          style={{ width: "100%" }}
        >
          <Input placeholder="Enter Report Name" maxLength={50} />
        </Form.Item>
        <Form.Item
          label="Report Type"
          name="report_type"
          required={finalReqFields.reportType}
          style={{ width: "100%" }}
        >
          <Select options={report_type_options} defaultValue="EXCEL" />
        </Form.Item>
      </div>
      <Form.Item
        label="Date"
        name="date"
        rules={[{ required: finalReqFields.date }]}
      >
        <RangePicker
          style={{
            padding: "8px 20px",
            width: "100%",
            border: "2px solid #eee",
          }}
          disabledDate={disabledDate}
          onChange={(date, dateString) => {
            if (onFieldChange) {
              onFieldChange({
                start_date: dateString[0],
                end_date: dateString[1],
              });
            }
          }}
        />
      </Form.Item>
    </div>
  );
}

const report_type_options = [
  {
    value: "EXCEL",
    label: "Excel",
  },
  {
    value: "PDF",
    label: "PDF",
  },
  {
    value: "CSV",
    label: "CSV",
  },
];

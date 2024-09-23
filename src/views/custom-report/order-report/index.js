import { useState } from "react";
import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";
import CreateReport from "../create-report-template/CreateReport";

export default function OrderPdf({
  reportConfig,
  updateConfig,
  saveReportConfig,
}) {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(0);

  const onOptionChange = (id) => {
    setSelectedOption(id);
  };

  if (!reportConfig.length) {
    return [];
  }
  return (
    <>
      <div className={styles.flex_2}>
        <div className={styles.sidebar}>
          {sectionOptions.map((opt) => (
            <div
              key={opt.id}
              className={`${styles.sidebar_options} ${
                selectedOption === opt.id && styles.selected_option
              }`}
              onClick={() => onOptionChange(opt.id)}
            >
              {opt.name}
            </div>
          ))}
        </div>
        <div style={{ width: "100%" }}>
          <CreateReport
            key={reportConfig?.[selectedOption]?.name}
            reportItem={reportConfig?.[selectedOption]}
            onUpdate={(v) => updateConfig(selectedOption, v)}
          />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "1em" }}>
        <div className="button_secondary" onClick={() => navigate(-1)}>
          Cancel
        </div>
        <div className="button_primary" onClick={saveReportConfig}>
          Save
        </div>
      </div>
    </>
  );
}

const sectionOptions = [
  {
    id: 0,
    name: "Organization Details",
  },
  {
    id: 1,
    name: "Order details",
  },
  {
    id: 2,
    name: "Payments & Bank Details",
  },
  {
    id: 3,
    name: "T&C and Notes",
  },
];

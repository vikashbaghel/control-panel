import { Divider } from "antd";
import styles from "./createReport.module.css";
import FieldAction from "./FieldAction";
import CustomReportItem from "./CutsomReportItems";

export default function CreateReport({ key, reportItem, onUpdate }) {
  const updateData = (newValues, sec_index, field_index) => {
    let updatedSections = (reportItem || {}).sections || [];

    if (field_index === -1) {
      updatedSections[sec_index] = {
        ...updatedSections[sec_index],
        ...newValues,
      };
    } else {
      let updatedSection = {
        ...updatedSections[sec_index],
        fields: {
          ...updatedSections[sec_index].fields,
          [field_index]: {
            ...updatedSections[sec_index].fields[field_index],
            ...newValues,
          },
        },
      };

      updatedSections[sec_index] = updatedSection;
    }
    onUpdate({ ...reportItem, sections: updatedSections });
  };

  return (
    <div className={styles.flex_col_2}>
      {((reportItem || {}).sections || []).map((section, sec_index) => (
        <div key={section.key} className={styles.container}>
          {section.title && (
            <>
              {section.status === "required" ? (
                <div
                  style={{ fontWeight: 500, fontSize: 18, color: "#727176" }}
                >
                  {section.title}
                </div>
              ) : (
                <FieldAction
                  data={{ field: section, field_index: -1, sec_index }}
                  onSave={(data, sec_index, field_index) =>
                    updateData(data, sec_index, field_index)
                  }
                />
              )}
              {!!Object.keys(section.fields).length && (
                <Divider
                  dashed
                  style={{ marginBlock: 10, borderColor: "#DDDDDD" }}
                />
              )}
            </>
          )}
          {
            (section.key === "terms_section")? 
              <CustomReportItem.Terms
                {...{ title: section.title }}
                onChange={(v) => {
                  updateData(
                    {
                      metadata: v,
                    },
                    sec_index,
                    "terms"
                  );
                }}
                value={section.fields.terms.metadata}
                disabled={section.status === "hidden"}
              />
              :
              Object.keys(section.fields).map((key) => (
                <FieldAction
                  key={key}
                  data={{
                    field: section.fields[key],
                    field_index: key,
                    sec_index,
                  }}
                  onSave={(data, sec_index, field_index) =>
                    updateData(data, sec_index, field_index)
                  }
                  disabled={section.status === "hidden"}
                />
              ))
          }
        </div>
      ))}
    </div>
  );
}

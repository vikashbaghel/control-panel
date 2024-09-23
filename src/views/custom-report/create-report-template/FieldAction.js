import CustomReportItem from "./CutsomReportItems";
import { useState } from "react";
import styles from "./createReport.module.css";
import { EditIcon } from "../../../assets/globle";
import { NoVisible, Visible } from "../../../assets/globle";

const fetchFieldValue = (field) => {
  return field.label ? field.value : field?.name || field?.title || "";
};

export default function FieldAction({ data, onSave, disabled }) {
  let { field, sec_index, field_index } = data;

  if (field_index === "bank_qr_code") field = { ...field, label: "" };

  const [actions, setActions] = useState({
    visibility: field?.status === "visible" ? true : false,
    value: fetchFieldValue(field),
    editMode: false,
    error: false,
  });
  const statusLabel = {
    true: field_index === -1 ? "Hide Section" : "Hide",
    false: field_index === -1 ? "Show Section" : "Show",
  };

  return (
    <>
      {field.label && <div>{field.name}</div>}
      <div className={styles.flex}>
        <input
          className={`${styles.field_input} ${
            (disabled || !actions.visibility) && styles.hidden
          }`}
          style={{
            background: actions.editMode || field.label ? "#ffffff" : "#F4F4F4",
            border: actions.error ? "2px solid red" : "",
          }}
          placeholder={field.label ? `Enter ${field.name}` : ""}
          value={actions.value}
          readOnly={(!actions.editMode && !field.label) || !actions.visibility}
          onChange={(e) => {
            if (field.label) {
              onSave(
                {
                  value: e.target.value,
                },
                sec_index,
                field_index
              );
            }
            setActions({ ...actions, value: e.target.value, error: false });
          }}
        />

        <div className={styles.flex}>
          {actions.editMode ? (
            <>
              <div
                className="button_primary"
                style={{ width: 94 }}
                onClick={() => {
                  if (!actions.value) {
                    return setActions({ ...actions, error: true });
                  }
                  onSave(
                    {
                      ...(field_index === -1
                        ? { title: actions.value }
                        : { name: actions.value }),
                    },
                    sec_index,
                    field_index
                  );
                  setActions({ ...actions, editMode: !actions.editMode });
                }}
              >
                Save
              </div>
              <div
                className="button_secondary"
                style={{
                  paddingBlock: 9,
                }}
                onClick={() => {
                  setActions({
                    ...actions,
                    editMode: !actions.editMode,
                    value: field.name,
                    error: false,
                  });
                }}
              >
                Cancel
              </div>
            </>
          ) : (
            <>
              {field.editable && !field.label && (
                <div
                  className={`${styles.action_btns} ${
                    (disabled || !actions.visibility) && styles.hidden
                  }`}
                  onClick={() => {
                    if (actions.visibility && !disabled)
                      setActions({ ...actions, editMode: !actions.editMode });
                  }}
                >
                  <img src={EditIcon} alt="edit" />
                  Edit
                </div>
              )}
              <div
                className={`${styles.action_btns} ${disabled && styles.hidden}`}
                style={{
                  ...(field_index === -1 ? { width: 140 } : {}),
                }}
                onClick={() => {
                  if (disabled) return;
                  const updateStatus = !actions.visibility;
                  setActions({ ...actions, visibility: updateStatus });
                  onSave(
                    {
                      status: updateStatus ? "visible" : "hidden",
                    },
                    sec_index,
                    field_index
                  );
                }}
              >
                <img
                  src={actions.visibility ? NoVisible : Visible}
                  alt="visibility"
                />
                {statusLabel[actions.visibility]}
              </div>
            </>
          )}
        </div>
      </div>
      {/* {field_index === "bank_qr_code" && (
        <div className={!actions.visibility && styles.hidden}>
          <CustomReportItem.Upload
            {...{ disabled: !actions.visibility, value: field.value }}
            onUpload={(url) => {
              onSave({ value: url }, sec_index, field_index);
            }}
          />
        </div>
      )} */}
    </>
  );
}

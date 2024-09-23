import React, { useState, useEffect, useContext } from "react";
import styles from "../report.module.css";
import { useSelector, useDispatch } from "react-redux";
import { Modal } from "antd";
import {
  createTemplate as createTemplateAPI,
  getReportTemplate as getReportTemplateAPI,
} from "../../../redux/action/reportTemplate";
import Context from "../../../context/Context";

// Create the Report Template
const CreateTemplate = ({ isOpen, setIsopen, list, moduleName }) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { createTemplate, getReportTemplate } = state;

  const context = useContext(Context);
  const { reportTemplateId, setReportTemplateId } = context;

  const initialFormValue = {
    name: "",
    custom_fields_list: [],
    description: "",
  };
  const [formInput, setFormInput] = useState(initialFormValue);

  const initialError = {
    name: false,
    custom_fields_list: false,
  };
  const [error, setError] = useState(initialError);

  const handleSelectList = (name) => {
    // Check if the name is already in the selectedNames array
    if (!formInput.custom_fields_list.includes(name)) {
      // Add the name to the selectedNames array
      setFormInput((prev) => {
        return {
          ...prev,
          custom_fields_list: [...formInput.custom_fields_list, name],
        };
      });
      return;
    }
  };

  const handleRemoveSelectList = (name) => {
    let tempList = formInput.custom_fields_list.filter((ele) => ele !== name);
    setFormInput((prev) => {
      return { ...prev, custom_fields_list: tempList };
    });
  };

  const handleSelectAll = (selectAll) => {
    if (selectAll) {
      setFormInput((prev) => {
        return {
          ...prev,
          custom_fields_list: list.map((ele) => ele.name),
        };
      });
      return;
    }
    setFormInput((prev) => {
      return {
        ...prev,
        custom_fields_list: [],
      };
    });
  };

  const onCancel = () => {
    setIsopen(false);
    setReportTemplateId("");
    setFormInput(initialFormValue);
  };

  const handleSubmit = () => {
    if (!formInput.name) {
      setError((prev) => {
        return { ...prev, name: true };
      });
    }
    if (formInput.custom_fields_list.length === 0) {
      setError((prev) => {
        return { ...prev, custom_fields_list: true };
      });
    }
    if (formInput.custom_fields_list.length > 0 && formInput.name) {
      Object.assign(formInput, { module: moduleName });
      dispatch(createTemplateAPI(formInput, reportTemplateId));
    }
    reSetError();
  };

  const reSetError = () => {
    setTimeout(() => {
      setError(initialError);
    }, 2000);
  };

  useEffect(() => {
    if (createTemplate?.data && createTemplate.data.data.error === false) {
      onCancel();
    }
    if (
      getReportTemplate?.data &&
      getReportTemplate.data.data.error === false
    ) {
      setFormInput((prev) => {
        return {
          ...prev,
          name: getReportTemplate.data.data.data.name,
          module: getReportTemplate.data.data.data.module,
          description: getReportTemplate.data.data.data.description,
          custom_fields_list:
            getReportTemplate.data.data.data.custom_fields_list,
        };
      });
    }
  }, [state]);

  useEffect(() => {
    if (reportTemplateId) {
      dispatch(getReportTemplateAPI(reportTemplateId));
    }
  }, [reportTemplateId]);

  return (
    <Modal
      open={isOpen}
      onCancel={onCancel}
      width={650}
      centered
      title={
        <div
          style={{
            padding: 15,
            textAlign: "center",
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          {reportTemplateId ? "Update" : "Create"} Template
        </div>
      }
      footer={[
        <div
          style={{
            display: "flex",
            background: "#fff",
            paddingBottom: "12px",
            flexDirection: "row-reverse",
            borderRadius: "0 0 10px 10px",
            paddingTop: "15px",
          }}
        >
          <button
            className="button_primary"
            style={{ marginRight: 20, borderRadius: 5 }}
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            className="button_secondary"
            style={{ marginRight: 20 }}
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>,
      ]}
    >
      <div className={styles.manage_modal_container}>
        <form>
          <label>
            Name <span>*</span>
          </label>
          <input
            placeholder="Enter Name"
            maxLength={50}
            onChange={(event) =>
              event.target.value.length < 50 &&
              setFormInput((prev) => {
                return { ...prev, name: event.target.value };
              })
            }
            name="name"
            value={formInput.name}
            className={`${error.name ? styles.error : ""}`}
          />
          <label>Description</label>
          <textarea
            placeholder="Enter Description"
            onChange={(event) =>
              setFormInput((prev) => {
                return { ...prev, description: event.target.value };
              })
            }
            name="description"
            value={formInput.description}
          />
          <label>
            Field <span>*</span>&nbsp;&nbsp;
            {error.custom_fields_list && (
              <span style={{ fontSize: 12 }}>
                Please Select Minimum One Column
              </span>
            )}
          </label>
          <div className={styles.select_all}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              Select the columns that you want to include in the report.
            </div>
            {formInput.custom_fields_list.length === list.length ? (
              <span
                onClick={() => handleSelectAll(false)}
                style={{ color: "red" }}
              >
                Remove All
              </span>
            ) : (
              <span onClick={() => handleSelectAll(true)}>Select All</span>
            )}
          </div>
          <div
            className={`${styles.option_list} ${
              error.custom_fields_list ? styles.error : ""
            }`}
            style={{ maxHeight: 250 }}
          >
            {list?.map((item, index) => {
              let checked = formInput.custom_fields_list?.filter(
                (ele) => ele === item.name
              );
              return (
                <div key={index}>
                  <span className={styles.field_name}>{item.name}</span>
                  {checked.length > 0 ? (
                    <span
                      style={{
                        cursor: "pointer",
                        marginRight: 14,
                        color: "red",
                        fontSize: 12,
                      }}
                      onClick={() => handleRemoveSelectList(item.name)}
                    >
                      Remove
                    </span>
                  ) : (
                    <button onClick={() => handleSelectList(item.name)}>
                      Select
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateTemplate;

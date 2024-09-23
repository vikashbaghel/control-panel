import React, { useState, useEffect } from "react";
import styles from "../report.module.css";
import { useSelector } from "react-redux";
import { Tooltip } from "antd";
import { BASE_URL_V2, org_id } from "../../../config";
import { InfoCircleOutlined } from "@ant-design/icons";
import ManageTemplate from "./manageTemplate";
import CreateTemplate from "./createTemplate";
import SingleSelectSearch from "../../../components/selectSearch/singleSelectSearch";

const ReportTemplate = ({
  title = "Columns",
  list,
  value,
  onChange,
  moduleName,
}) => {
  let currentModule = moduleName;
  const state = useSelector((state) => state);
  const { deleteTemplate } = state;

  const [searchColumns, setSearchColumns] = useState([]);
  const [selectedtemplate, setSelectedTemplate] = useState(null);

  // State to call the Search details again when module is changed
  const [singleSelectSearch, setSingleSelectSearch] = useState(false);

  // handle Manage Modal open and close
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  // handle Create Template Modal open and close
  const [isCreateTemplateModalOpen, setIsCreateTemplateModalOpen] =
    useState(false);

  const handleCreateTemplateModalOpen = (isOpen) => {
    setIsCreateTemplateModalOpen(isOpen);
    singleSelectSearch.reset();
  };

  const handleSelectList = (name) => {
    // Check if the name is already in the selectedNames array
    if (!value?.includes(name)) {
      // Add the name to the selectedNames array
      if (!value) {
        onChange([name]);
        return;
      }
      onChange([...value, name]);
      return;
    }
  };

  const handleRemoveSelectList = (name) => {
    let tempList = value.filter((ele) => ele !== name);
    onChange(tempList);
  };

  const handleSelectAll = (selectAll) => {
    if (selectAll) {
      onChange(list.map((ele) => ele.name));
      return;
    }
    onChange([]);
  };

  useEffect(() => {
    if (deleteTemplate?.data && !deleteTemplate.data.data.error) {
      singleSelectSearch.reset();
    }
  }, [state]);

  useEffect(() => {
    if (value?.length === 0) {
      setSelectedTemplate(null);
    }
  }, [value]);

  useEffect(() => {
    if (moduleName !== currentModule) {
      singleSelectSearch.reset();
      currentModule = moduleName;
    }
  }, [moduleName]);

  useEffect(() => {
    onChange([]);
  }, [list]);

  const reportTemplateApi = `${BASE_URL_V2}/organization/${org_id}/report/template/?module=${moduleName}`;

  return (
    <div className={styles.select_option_container}>
      <div className={styles.option_header}>
        <span>Select {title}</span>
        <span onClick={() => setIsManageModalOpen(true)}>Manage Template</span>
      </div>
      <div className={styles.search_group}>
        <input
          placeholder={`Search ${title}`}
          onChange={(e) => setSearchColumns(e.target.value.toLowerCase())}
        />
        <div>
          <SingleSelectSearch
            apiUrl={reportTemplateApi}
            onChange={(data) => {
              setSelectedTemplate(data?.name || null);
              onChange(data?.custom_fields_list || []);
            }}
            value={selectedtemplate}
            setInterface={setSingleSelectSearch}
            params={{ placeholder: "Search Template" }}
          />
        </div>
      </div>
      <div className={styles.select_all}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          Select the columns that you want to include in the report.
          <p style={{ margin: 0, color: "red", fontSize: 12 }}>
            By default all columns are selected.
          </p>
        </div>
        {value?.length === list.length ? (
          <span onClick={() => handleSelectAll(false)}>Remove All</span>
        ) : (
          <span onClick={() => handleSelectAll(true)}>Select All</span>
        )}
      </div>
      <div className={styles.option_list}>
        {list?.map((item, index) => {
          let checked = value?.filter((ele) => ele === item.name);
          if (item.name.toLowerCase().includes(searchColumns))
            return (
              <div key={index}>
                <span className={styles.field_name}>
                  {item.name}{" "}
                  <Tooltip placement="topLeft" title={item.description}>
                    <InfoCircleOutlined
                      style={{ color: "#878787", marginLeft: 10 }}
                    />
                  </Tooltip>
                </span>
                {checked?.length > 0 ? (
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
      <ManageTemplate
        isOpen={isManageModalOpen}
        setIsopen={(isOpen) => {
          setIsManageModalOpen(isOpen);
        }}
        openCreateTemplate={handleCreateTemplateModalOpen}
        updateTemplate={handleCreateTemplateModalOpen}
        moduleName={moduleName}
      />
      <CreateTemplate
        isOpen={isCreateTemplateModalOpen}
        setIsopen={handleCreateTemplateModalOpen}
        list={list}
        moduleName={moduleName}
      />
    </div>
  );
};

export default ReportTemplate;

import { Col, Row, Space } from "antd";
import React from "react";
import FormNavigateBar from "./navigateBar";
import DefaultFormLayout from "../DefaultFormLayout";
import FormLayout from "../FormLayout";

export const mandatoryFields = [
  "Customer Level",
  "Parent Name",
  "Whatsapp Number",
  "Business Name",
  "Name",
  "City",
  "State",
];

const CustomerForm = ({
  formConfig,
  setFormConfig,
  defaultFormConfig,
  setDefaultFormConfig,
  errorState,
  setErrorState,
  updateFormConfig,
  onClose,
  loader,
  setLoader,
  form_name,
  setForm_name,
}) => {
  return (
    <Row wrap={true} gutter={15}>
      <Col style={{ width: 250 }}>
        <FormNavigateBar
          {...{
            form_name,
            setForm_name,
            loader,
            setLoader,
          }}
        />
      </Col>
      <Col
        style={{
          opacity: loader ? 0 : 1,
          width: "calc(100% - 270px)",
          minWidth: 300,
        }}
      >
        {!!(formConfig.form_items && defaultFormConfig.sections) && (
          <Space
            style={{ width: "100%", marginTop: 12 }}
            direction="vertical"
            size={12}
          >
            <Col>
              <DefaultFormLayout
                {...{
                  defaultFormConfig,
                  setDefaultFormConfig,
                  mandatoryFields,
                }}
              />
              <br />
              {`${form_name}` === "2" && (
                <FormLayout
                  {...{
                    formConfig,
                    setFormConfig,
                    errorState,
                    setErrorState,
                  }}
                />
              )}
            </Col>
            <Col align="end">
              <Space size={"middle"}>
                <button className="button_secondary" onClick={onClose}>
                  Cancel
                </button>
                <button
                  className="button_primary"
                  onClick={() => {
                    updateFormConfig();
                  }}
                >
                  Save
                </button>
              </Space>
            </Col>
          </Space>
        )}
      </Col>
    </Row>
  );
};

export default CustomerForm;

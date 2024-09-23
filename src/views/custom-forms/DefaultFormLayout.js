import React from "react";
import { NoVisible, Visible } from "../../assets/globle";
import { Col, Row, Switch, notification } from "antd";

const DefaultFormLayout = ({
  defaultFormConfig,
  setDefaultFormConfig,
  mandatoryFields = [],
}) => {
  const handleOnChange = (ind, index, status) => {
    let config = JSON.parse(JSON.stringify(defaultFormConfig));
    config.sections[ind].form_items[index]["status"] = status;
    setDefaultFormConfig(config);
  };

  const handleOnChangeIsrequired = (ind, index, required) => {
    let config = JSON.parse(JSON.stringify(defaultFormConfig));
    config.sections[ind].form_items[index].field_props["required"] = required;
    setDefaultFormConfig(config);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {defaultFormConfig.sections.map((ele, ind) => {
        if ((ele.form_items || []).length)
          return (
            <div key={ind} style={style.container}>
              <div
                style={{
                  color: "#727176",
                  fontSize: 16,
                  fontWeight: 500,
                  marginBottom: 15,
                }}
              >
                {ele.name}
              </div>
              {ele?.form_items.map((item, index) => {
                let hideOption = item.status === "visible";
                const isRequiredOption = !mandatoryFields.includes(
                  item.field_props.label
                );
                return (
                  !item.is_custom && (
                    <Row
                      key={`status-update${item.status}-${index}`}
                      style={{ margin: "10px 0" }}
                      justify={"space-between"}
                    >
                      <Col
                        style={{
                          width: isRequiredOption
                            ? "calc(100% - 280px)"
                            : item.field_props?.required
                            ? "100%"
                            : "calc(100% - 140px)",
                          borderRadius: 10,
                          border: "2px solid #EEE",
                          background: "#F4F4F4",
                          padding: "10px 15px",
                          opacity: hideOption ? 1 : 0.4,
                        }}
                      >
                        {item.field_props?.label}
                        {item.field_props?.required && (
                          <span style={{ color: "red" }}> *</span>
                        )}
                      </Col>
                      {isRequiredOption && (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 15,
                            alignItems: "center",
                            paddingLeft: 20,
                            opacity: item.status !== "hidden" ? 1 : 0.4,
                          }}
                        >
                          Required
                          <Switch
                            size="large"
                            value={item.field_props["required"]}
                            onChange={(e) => {
                              if (item.status !== "hidden") {
                                handleOnChangeIsrequired(ind, index, e);
                              }
                            }}
                          />
                        </div>
                      )}
                      {isRequiredOption && (
                        <Col
                          style={{
                            width: 120,
                            marginLeft: 20,
                            display: "flex",
                            alignItems: "center",
                            gap: 15,
                            borderRadius: 4,
                            border: "1px solid #DDD",
                            background: "#F4F4F4",
                            justifyContent: "center",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleOnChange(
                              ind,
                              index,
                              hideOption ? "hidden" : "visible"
                            )
                          }
                        >
                          <img
                            src={hideOption ? NoVisible : Visible}
                            alt="eye"
                          />
                          <span>{hideOption ? "Hide" : "Show"}</span>
                        </Col>
                      )}
                    </Row>
                  )
                );
              })}
            </div>
          );
      })}
    </div>
  );
};

export default DefaultFormLayout;

const style = {
  container: {
    marginLeft: 12,
    padding: "10px 20px",
    borderRadius: 10,
    border: "4px solid #FFF",
    background:
      "linear-gradient(90deg, rgba(255, 255, 255, 0.70) 1.65%, rgba(255, 255, 255, 0.40) 98.92%)",
    boxShadow: "2px 6px 12px 4px rgba(0, 0, 0, 0.02)",
  },
};

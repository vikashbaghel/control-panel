//https://team-1624359381274.atlassian.net/wiki/spaces/RUPYZ/pages/189988866/Custom+Forms#Form-Config
import { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Drawer,
  Form,
  Row,
  Space,
  Spin,
  notification,
} from "antd";
import CustomForm from ".";
import { ArrowLeft, VisibleFilled } from "../../assets/globle";
import { useNavigate, useParams } from "react-router-dom";
import customFormAction from "../../redux/action/customFormAction";
import Context from "../../context/Context";
import BackConfirmationModal from "../../components/back-confirmation/BackConfirmationModal";
import createForms from "./createForms";

const constants = {
  initialFormConfig: {
    form_name: "",
    included: [],
    sections: [
      {
        name: "",
        form_items: [],
      },
    ],
  },
  defaultPage: 0,
  formPreviewSize: {
    height: 600,
    width: 300,
  },
  customFormErrors: {
    questionMissing: {
      message: "Question cannot be empty",
    },
    questionDuplicate: {
      message: "Question cannot be duplicate",
    },
    optionMissing: {
      message: "Options cannot be empty",
    },
    optionDuplicate: {
      message: "Options cannot be duplicate",
    },
  },
};

const states = {
  lastModified: "",
};

const CustomFormCreate = (props) => {
  const { identifier } = useParams();
  const CreateForm = createForms[identifier];
  const navigate = useNavigate();
  const { setDiscardModalAction } = useContext(Context);
  const onClose = () => {
    if (formConfig.modified !== states.lastModified) {
      setDiscardModalAction({
        open: true,
        handleAction: () => {
          navigate(-1);
        },
      });
    } else {
      navigate(-1);
    }
  };
  const [loader, setLoader] = useState(true);
  const [errorState, setErrorState] = useState({});
  const [schema_json, set_schema_json] = useState({});
  const [defaultFormConfig, setDefaultFormConfig] = useState({});
  const [formConfig, setConfig] = useState({});
  const [previewOpen, setPreviewOpen] = useState(false);

  const [form_name, setForm_name] = useState("");

  const setFormConfig = (obj, layout_updated = true) => {
    setConfig({
      ...JSON.parse(JSON.stringify(obj)),
      ...(layout_updated ? { layout_updated: `${+new Date()}` } : {}),
      modified: `${+new Date()}`,
    });
  };

  const initFormConfig = (schema_json) => {
    let sections = [];
    let customItems = [];
    schema_json["sections"].map((section, Si) => {
      sections.push({
        ...section,
        form_items: [],
      });
      let { form_items } = section;
      JSON.parse(JSON.stringify(form_items)).map((item, i) => {
        if (item.is_custom) {
          customItems.push(item);
        } else {
          sections[Si].form_items.push(item);
        }
      });
    });
    setDefaultFormConfig({ sections });
    setConfig({ form_items: customItems });
  };

  const createFormConfig = (defaultFormConfig, formConfig) => {
    let obj = JSON.parse(JSON.stringify(defaultFormConfig));
    let lastIndex = obj.sections.length - 1;
    obj.sections[lastIndex]["form_items"] = [
      ...obj.sections[lastIndex]["form_items"],
      ...formConfig.form_items,
    ];
    return obj;
  };

  async function updateFormConfig() {
    //validate config
    let errors = {};
    let labels = {};
    formConfig["form_items"].map((obj, index) => {
      let { name, label } = obj.field_props || {};
      //validate question text
      if (!label) {
        errors[name] = constants.customFormErrors["questionMissing"];
      } else {
        [...Object.keys(labels)].map((k) => {
          if (label === labels[k]) {
            errors[name] = constants.customFormErrors["questionDuplicate"];
          }
        });
        labels[name] = label;
      }
      //validate question options
      if (["MULTIPLE_CHOICE", "CHECKBOX", "DROPDOWN"].includes(obj.type)) {
        const { options } = obj.input_props || {};
        if ((options || []).length) {
          let optionLabels = [];
          options.map(({ label, option_id }, k) => {
            if (!label) {
              errors[option_id] = constants.customFormErrors["optionMissing"];
            } else {
              if (optionLabels.includes(label)) {
                errors[option_id] =
                  constants.customFormErrors["optionDuplicate"];
              }
              optionLabels.push(label);
            }
          });
        } else {
          errors[`option(${name})`] =
            constants.customFormErrors["optionMissing"];
        }
      }
    });
    setErrorState(errors);
    let error_items = [...Object.keys(errors)];
    if (!error_items.length) {
      let form_config = createFormConfig(defaultFormConfig, formConfig);
      const data =
        (await customFormAction.create(identifier, form_name, form_config)) ||
        {};
      if (data.message) {
        notification[!data.error ? "success" : "error"]({
          message: data.message,
        });
      }
    } else {
      let ele = document.getElementById(`item-${error_items[0]}`);
      ele.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }

  async function fetchFormConfig(identifier, form_name) {
    setDefaultFormConfig({});
    setFormConfig({});
    const { data } =
      (await customFormAction.fetch(identifier, form_name)) || {};
    if (data) {
      if ((data.sections || []).length) {
        states.lastModified = data["modified"];
        set_schema_json(data);
      } else {
        let obj = CreateForm.fetchDefaultConfig(form_name);
        set_schema_json({ ...obj, form_name });
      }
    }
    setTimeout(() => {
      setLoader(false);
    }, 600);
  }

  useEffect(() => {
    if (form_name) {
      fetchFormConfig(identifier, form_name);
    }
  }, [identifier, form_name]);

  useEffect(() => {
    if (schema_json.sections) {
      initFormConfig(schema_json);
    }
  }, [schema_json]);

  return (
    <>
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: ".5em" }}>
            <img
              src={ArrowLeft}
              alt="arrow"
              onClick={onClose}
              className="clickable"
            />
            <h3 style={{ fontSize: 18, textTransform: "capitalize" }}>
              {CreateForm.title}
              <div
                style={{
                  color: "#727176",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                Form Customization
              </div>
            </h3>
          </div>
          {formConfig.form_items && (
            <Button
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                height: 40,
                marginRight: 25,
              }}
              onClick={() => setPreviewOpen(!previewOpen)}
            >
              <img src={VisibleFilled} alt="show" />
              Show Preview
            </Button>
          )}
        </div>
        <CreateForm.component
          {...{
            formConfig,
            setFormConfig,
            defaultFormConfig,
            setDefaultFormConfig,
            errorState,
            setErrorState,
            onClose,
            updateFormConfig,
            loader,
            setLoader,
            form_name,
            setForm_name,
          }}
        />
        {loader && (
          <Row
            align="middle"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: "calc( 100vh - 150px )",
              padding: 24,
            }}
          >
            <Col flex={1} align="middle">
              <Spin />
            </Col>
          </Row>
        )}
      </div>
      {!!(formConfig.form_items && defaultFormConfig.sections) && (
        <FormPreview
          sections={
            previewOpen
              ? createFormConfig(defaultFormConfig, formConfig)["sections"]
              : []
          }
          {...{
            previewOpen,
            setPreviewOpen,
            CreateForm,
          }}
        />
      )}

      <BackConfirmationModal />
    </>
  );
};

const FormPreview = ({ CreateForm, sections, previewOpen, setPreviewOpen }) => {
  return (
    <Drawer
      title={<Col align="middle">{CreateForm.title} Preview </Col>}
      open={previewOpen}
      onClose={() => setPreviewOpen(false)}
    >
      <div
        style={{
          position: "fixed",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          userSelect: "none",
          marginTop: 10,
          marginLeft: 40,
        }}
      >
        <Col
          style={{
            transform: "scale(0.95)",
          }}
        >
          <Col
            style={{
              ...constants.formPreviewSize,
              padding: 12,
            }}
          >
            <Col
              className="frame-layout"
              style={{
                height: "100%",
                width: "100%",
                borderRadius: 30,
              }}
            ></Col>
          </Col>
          <img
            src={require("../../assets/custom-forms/device-frame.png")}
            style={{
              ...constants.formPreviewSize,
              objectFit: "contain",
              position: "absolute",
              top: 0,
            }}
          />
          <Col
            style={{
              ...constants.formPreviewSize,
              position: "absolute",
              top: 0,
              bottom: 0,
              overflowY: "auto",
              transform: "scale(0.85)",
              padding: 12,
              wordBreak: "break-all",
            }}
          >
            <div>
              <div style={{ pointerEvents: "none" }}>
                <Form
                  layout="vertical"
                  className="custom-form"
                  requiredMark={(label, info) => (
                    <div>
                      {label}{" "}
                      {info.required && <span style={{ color: "red" }}>*</span>}
                    </div>
                  )}
                >
                  <CustomForm {...{ sections }} />
                </Form>
              </div>
            </div>
          </Col>
        </Col>
      </div>
    </Drawer>
  );
};

export default CustomFormCreate;

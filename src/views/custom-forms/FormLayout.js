import { useEffect, useRef, useState } from "react";
import FormItem, { createFormItem } from "./FormItem";
import { createRef } from "react";
import { Button, Col, Row, Space, Spin } from "antd";
import FormItemOptions from "./FormItemOptions";
import { GeneralModal } from "../../components/modals";

import { PlusOutlined } from "@ant-design/icons";
import { AddQuestionIcon } from "../../assets/custom-forms";
import FormActions from "./FormActions";
import { AddButton } from "../../assets/globle";

const constants = {
  fieldSpaceSize: 12,
  fieldSwapMargin: 180,
  initialHolder: {
    position: -1,
    current_position: -1,
    positionMap: [],
    current_top: 0,
    events: [],
  },
  initialFormItemAction: {
    type: "",
    action: () => {},
  },
};

const states = {
  holder: { ...constants["initialHolder"] },
  form_config: {},
  initial_form_items: [],
};

const FormLayout = ({
  form_name,
  formConfig,
  setFormConfig,
  errorState,
  setErrorState,
}) => {
  const [formItemAction, setFormItemAction] = useState({
    ...constants.initialFormItemAction,
  });
  const containerRef = useRef();
  const formItemRefs = useRef([]);

  function swap(arr, i, j) {
    let res = [...arr];
    if (j > i) {
      for (let x = i; x < j; x++) res[x] = arr[x + 1];
    } else if (i > j) {
      for (let x = i; x > j; x--) res[x] = arr[x - 1];
    }
    res[j] = arr[i];
    return [...res];
  }

  function arrangeFields(exclude) {
    setTimeout(() => {
      try {
        let positionMap = states.holder["positionMap"].length
          ? states.holder["positionMap"]
          : [...Array(states.form_config["form_items"].length).keys()];
        let level = 0;
        positionMap.map((index, i) => {
          if (index !== (exclude || states.holder["position"])) {
            formItemRefs.current[index].style.top = `${level}px`;
          }
          level +=
            formItemRefs.current[index].clientHeight + constants.fieldSpaceSize;
        });
        document.getElementById("custom-form-footer").style.top = `${level}px`;
        containerRef.current.style.height = `${level + 50}px`;
      } catch (e) {
        console.log(e);
      }
    }, 0);
  }
  function handleLayoutChange(index, level) {
    let current_top = parseInt(states.holder["current_top"].replace("px", ""));
    let upper_bound =
      current_top > 0 ? current_top - constants.fieldSwapMargin : 0;
    let lower_bound = current_top + constants.fieldSwapMargin;
    let swap_index = -1;
    if (level > lower_bound) {
      if (
        states.holder["current_position"] <
        states.form_config["form_items"].length - 1
      ) {
        swap_index =
          states.holder["positionMap"][states.holder["current_position"] + 1];
        states.holder["current_position"] += 1;
      }
    } else if (level < upper_bound) {
      if (states.holder["current_position"] > 0) {
        swap_index =
          states.holder["positionMap"][states.holder["current_position"] - 1];
        states.holder["current_position"] -= 1;
      }
    }
    if (swap_index !== -1) {
      states.holder["current_top"] = formItemRefs.current[swap_index].style.top;
      states.holder["positionMap"] = swap(
        [...Array(states.form_config["form_items"].length).keys()],
        states.holder["position"],
        states.holder["current_position"]
      );
      arrangeFields();
    }
  }

  const handleHolderMove = (event) => {
    if (
      containerRef.current &&
      states.holder["position"] !== -1 &&
      formItemRefs.current[states.holder["position"]]
    ) {
      let baseline = containerRef.current.getBoundingClientRect()["top"];
      let top = event.y - (baseline + 16);
      if (top > -10) {
        formItemRefs.current[states.holder["position"]].style.top = `${top}px`;
        handleLayoutChange(states.holder["position"], top);
      }
    }
  };

  const handleHolderRelease = (event) => {
    if (states.holder["position"] !== -1) {
      let positionMap = [...states.holder["positionMap"]];
      states.holder = { ...constants["initialHolder"] };
      setFormConfig({
        ...states.form_config,
        form_items: [
          ...positionMap.map((index) => {
            return states.form_config["form_items"][index];
          }),
        ],
      });
    }
    document.body.style.cursor = "default";
  };

  function resetHolderEvents() {
    states.holder.events.map((event, index) => {
      window.removeEventListener(
        event.name,
        states.holder.events[index]["handler"]
      );
    });
    states.holder.events = [];
  }

  function attachHolderEvents(holderEvents = []) {
    resetHolderEvents();
    holderEvents.map((event, index) => {
      states.holder.events.push(event);
      window.addEventListener(
        event.name,
        states.holder.events[index]["handler"]
      );
    });
  }

  useEffect(() => {
    states.initial_form_items = [
      ...formConfig.form_items.map((obj) => obj.field_props["name"]),
    ];
  }, []);

  useEffect(() => {
    states.form_config = { ...formConfig };
  }, [formConfig]);

  useEffect(() => {
    arrangeFields();
  }, [formConfig["layout_updated"], errorState]);

  useEffect(() => {
    attachHolderEvents([
      {
        name: "mousemove",
        handler: handleHolderMove,
      },
      {
        name: "mouseup",
        handler: handleHolderRelease,
      },
    ]);
    window.addEventListener("resize", arrangeFields);
  }, []);

  return (
    <div style={style.container}>
      <Col ref={containerRef}>
        <Col key={`${formConfig.layout_updated}`} flex={1}>
          {(formConfig["form_items"] || []).length
            ? formConfig["form_items"].map((item, index) => {
                let name = item.field_props["name"];
                return (
                  <div
                    id={`item-${name}`}
                    key={name}
                    style={{
                      position: "absolute",
                      width: "100%",
                      userSelect: "none",
                    }}
                    ref={(el) => (formItemRefs.current[index] = el)}
                  >
                    <FormItem
                      {...{ index, item, errorState }}
                      options={FormItemOptions(
                        index,
                        formConfig,
                        setFormConfig
                      )}
                      onUpdate={(obj, modified = false) => {
                        let conf = { ...formConfig };
                        conf["form_items"][index] = obj;
                        setFormConfig(conf, false);
                        //remove existing errors
                        let error = { ...errorState };
                        if (error[name] || error[`option(${name})`]) {
                          delete error[name];
                          delete error[`option(${name})`];
                          setErrorState({ ...error });
                        }
                        //check if re-rendering is required
                        if (modified) {
                          arrangeFields(index);
                        }
                      }}
                      onHold={() => {
                        states.holder["position"] = index;
                        states.holder["current_position"] = index;
                        states.holder["current_top"] =
                          formItemRefs.current[index].style.top;
                        states.holder["positionMap"] = [
                          ...Array(formConfig["form_items"].length).keys(),
                        ];
                        document.body.style.cursor = "move";
                      }}
                      onTypeChange={(action) => {
                        if (
                          states.initial_form_items.includes(
                            item.field_props["name"]
                          )
                        ) {
                          setFormItemAction({
                            type: "CHANGE_TYPE",
                            action,
                          });
                        } else if (action) {
                          action();
                        }
                      }}
                      onDelete={(action) => {
                        if (
                          states.initial_form_items.includes(
                            item.field_props["name"]
                          )
                        ) {
                          setFormItemAction({
                            type: "DELETE_QUESTION",
                            action,
                          });
                        } else if (action) {
                          action();
                        }
                      }}
                    />
                  </div>
                );
              })
            : []}
          <div
            id="custom-form-footer"
            style={{ width: "100%", position: "absolute" }}
          >
            {formConfig["form_items"]?.length < 10 && (
              <AddQuestionBtn {...{ formConfig, setFormConfig }} />
            )}
          </div>
        </Col>
      </Col>
      <FormActions
        {...{ formItemAction }}
        onFinish={() => {
          setFormItemAction({ ...constants.initialFormItemAction });
        }}
      />
    </div>
  );
};

const AddQuestionBtn = ({ formConfig, setFormConfig }) => {
  return (
    <Button
      size="large"
      block
      style={{
        border: "2px solid #FFFFFF",
        backgroundColor: "#F4F4F4",
        boxShadow: "none",
      }}
      onClick={() => {
        let obj = { ...formConfig };
        obj.form_items.push(createFormItem());
        setFormConfig(obj);
      }}
    >
      <div
        className="series"
        style={{
          width: "100%",
          justifyContent: "center",
          gap: 14,
          fontSize: 12,
          fontWeight: "500",
          color: "#727176",
        }}
      >
        <img src={AddButton} alt="add" width={20} />
        {!formConfig.form_items.length
          ? "Add Other Question"
          : "Add More Question"}
      </div>
    </Button>
  );
};

export default FormLayout;

const style = {
  container: {
    marginLeft: 12,
    padding: "15px 20px 5px 0px",
    borderRadius: 10,
    border: "4px solid #FFF",
    background:
      "linear-gradient(90deg, rgba(255, 255, 255, 0.70) 1.65%, rgba(255, 255, 255, 0.40) 98.92%)",
    boxShadow: "2px 6px 12px 4px rgba(0, 0, 0, 0.02)",
  },
};

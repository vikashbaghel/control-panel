import { Space } from "antd";
import { GeneralModal } from "../../components/modals";

const FormActions = ({ formItemAction, onFinish }) => {
  return (
    <>
      <GeneralModal
        open={formItemAction.type === "CHANGE_TYPE"}
        title={
          <Space size={12}>
            <img
              src={
                require("../../assets/custom-forms/confirm-change-type.svg")
                  .default
              }
            />
            Change Question Type
          </Space>
        }
        info={
          "Are you sure you want to change the type of this question? This action will delete any previously collected data associated with this question?"
        }
        okText="Cancel"
        onOk={onFinish}
        cancelText="Proceed"
        onCancel={() => {
          formItemAction.action && formItemAction.action();
          onFinish && onFinish();
        }}
      />
      <GeneralModal
        open={formItemAction.type === "DELETE_QUESTION"}
        title={
          <Space size={12}>
            <img
              src={
                require("../../assets/custom-forms/confirm-delete.svg").default
              }
            />
            <div>Delete Question</div>
          </Space>
        }
        info={
          "Are you sure you want to delete this question? Deleting this question will permanently remove any associated collected data."
        }
        okText="Cancel"
        onOk={onFinish}
        cancelText="Delete"
        onCancel={() => {
          formItemAction.action && formItemAction.action();
          onFinish && onFinish();
        }}
      />
    </>
  );
};

export default FormActions;

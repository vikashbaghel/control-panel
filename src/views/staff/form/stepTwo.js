import { Form } from "antd";
import styles from "../staff.module.css";
import FormInput from "../../../components/form-elements/formInput";

export default function StepTwo() {
  return (
    <div className={styles.form}>
      <div className={styles.form_header}>Bank Account Details</div>
      <Form.Item label="Bank Name" name="bank">
        <FormInput
          type="bankName"
          params={{ placeholder: "Enter Bank Name" }}
        />
      </Form.Item>
      <Form.Item label="Account No" name="account_number">
        <FormInput
          type="num"
          params={{ placeholder: "Enter Account Number", maxLength: 20 }}
        />
      </Form.Item>
      <Form.Item label="Branch" name="branch">
        <FormInput
          type="alnum"
          params={{ placeholder: "Enter Bank Branch", maxLength: 200 }}
        />
      </Form.Item>
      <Form.Item label="IFSC Code" name="ifsc_code">
        <FormInput
          type="alnum"
          params={{ placeholder: "Enter IFSC Code", maxLength: 11 }}
        />
      </Form.Item>
    </div>
  );
}

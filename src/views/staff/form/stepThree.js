import { Form } from "antd";
import styles from "../staff.module.css";
import { ToggleButton } from "./customSelects";
import AssignModule from "../../../components/assignModule";

export default function StepThree() {
  const queryParameters = new URLSearchParams(window.location.search);
  const id = queryParameters.get("id") || 0;

  return (
    <>
      <div className={styles.form}>
        <Form.Item name="select_beat" label="Assign beat">
          <AssignModule
            title={"Select Beat"}
            api={`/staff/${id}/mapping/beats/`}
          />
        </Form.Item>
        <Form.Item name="select_customer" label="Assign Customer">
          <AssignModule
            title={"Select Customer"}
            api={`/staff/${id}/mapping/`}
          />
        </Form.Item>
      </div>
      <div className={styles.form}>
        <Form.Item name="auto_assign_new_customers">
          <ToggleButton />
        </Form.Item>
      </div>
    </>
  );
}

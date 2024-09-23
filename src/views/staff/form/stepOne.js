import moment from "moment";
import Cookies from "universal-cookie";
import styles from "../staff.module.css";
import { DatePicker, Form, Input } from "antd";
import Permissions from "../../../helpers/permissions";
import { regex } from "../../../components/form-elements/regex";
import FormInput from "../../../components/form-elements/formInput";
import { SelectReportingManager, SelectStaffRole } from "./customSelects";

export default function StepOne() {
  const cookies = new Cookies();

  const assignManagerPermission =
    Permissions("ASSIGN_MANAGER") &&
    cookies.get("rupyzHierarchyEnable") === "true";

  // Disable dates after the current date
  const disabledDate = (current) => {
    return current && current > moment().endOf("day");
  };

  return (
    <div className={styles.form}>
      <div className={styles.form_header}>Personal Details</div>
      <Form.Item label="Name" name="name" required rules={[{ required: true }]}>
        <FormInput
          type="alpha"
          params={{ placeholder: "Enter Name", maxLength: 50 }}
        />
      </Form.Item>
      <Form.Item label="PAN No." name="pan_id">
        <FormInput
          type="alnum"
          params={{ maxLength: 15, placeholder: "Enter PAN No." }}
          formatter={(v) => {
            return v.toUpperCase();
          }}
        />
      </Form.Item>
      <Form.Item
        label="Employee ID"
        name="employee_id"
        required
        rules={[{ required: true }]}
      >
        <FormInput
          type="alnum"
          params={{ placeholder: "Enter Employee ID", maxLength: 20 }}
        />
      </Form.Item>
      <Form.Item
        label="Mobile Number"
        name={"mobile"}
        required
        rules={[
          { required: true },
          {
            validator: (_, value) => {
              if (value?.length === 10) {
                return Promise.resolve();
              }
              return Promise.reject();
            },
          },
        ]}
      >
        <FormInput
          type="num"
          params={{ maxLength: 10, placeholder: "Enter Mobile Number" }}
        />
      </Form.Item>
      <Form.Item
        label="Email ID"
        name="email"
        rules={[
          {
            validator: (_, value) => {
              if (!value || value.match(regex["email"]))
                return Promise.resolve();
              else
                return Promise.reject(new Error("Please enter a valid email"));
            },
          },
        ]}
      >
        <Input placeholder="Enter Email" />
      </Form.Item>
      <Form.Item label="Address" name="address_line_1">
        <Input placeholder="Enter Address" />
      </Form.Item>
      <Form.Item label="Date Of Joining" name="joining_date">
        <DatePicker
          format="YYYY-MM-DD"
          className={styles.date_picker}
          disabledDate={disabledDate}
          style={{ width: "100%" }}
        />
      </Form.Item>
      <Form.Item
        label="Staff Role"
        name="roles"
        required
        rules={[
          {
            required: true,
            validator: (_, v) => {
              if (v.length === 0)
                return Promise.reject(new Error("Staff Role is required"));
              return Promise.resolve();
            },
          },
        ]}
      >
        <SelectStaffRole />
      </Form.Item>
      {assignManagerPermission && (
        <Form.Item label="Reporting Manager" name="manager_staff_id">
          <SelectReportingManager />
        </Form.Item>
      )}
    </div>
  );
}

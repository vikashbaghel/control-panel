import React from "react";
import styles from "./staff.module.css";
import moment from "moment";

const FormPreview = ({ formData }) => {
  const {
    name,
    pan_id,
    address_line_1,
    email,
    employee_id,
    joining_date,
    manager_staff_id,
    mobile,
    roles,
  } = formData;

  let date = moment(formData.joining_date).format("YYYY-MM-DD");

  const { bank, account_number, branch, ifsc_code } = formData.bank_details;

  return (
    <>
      <div>
        <div className={styles.form}>
          <div className={styles.form_header}>Review Personal Details</div>
          <div className={styles.form_details}>
            <div className={styles.form_details_box}>
              <label>Name</label>
              <b>{name}</b>
            </div>
            <div className={styles.form_details_box}>
              <label>PAN No.</label>
              <b>{pan_id}</b>
            </div>
          </div>

          <div className={styles.form_details}>
            <div className={styles.form_details_box}>
              <label>Employee ID</label>
              <b>{employee_id}</b>
            </div>
            <div className={styles.form_details_box}>
              <label>Mobile Number</label>
              <b>{mobile}</b>
            </div>
          </div>

          <div className={styles.form_details}>
            <div className={styles.form_details_box}>
              <label>Email</label>
              <b>{email}</b>
            </div>
            <div className={styles.form_details_box}>
              <label>Address</label>
              <b>{address_line_1}</b>
            </div>
          </div>

          <div className={styles.form_details}>
            <div className={styles.form_details_box}>
              <label>Date Of Joining</label>
              <b>{date}</b>
            </div>
            <div className={styles.form_details_box}>
              <label>Assign Role</label>
              <b>{roles}</b>
            </div>
          </div>

          <div className={styles.form_details}>
            <div className={styles.form_details_box}>
              <label>Reporting Manager</label>
              <b>{manager_staff_id}</b>
            </div>
          </div>
        </div>

        <div className={styles.form}>
          <div className={styles.form_header}>Review Bank Account Details</div>
          <div className={styles.form_details}>
            <div className={styles.form_details_box}>
              <label>Bank Name</label>
              <b>{bank}</b>
            </div>
            <div className={styles.form_details_box}>
              <label>Account No.</label>
              <b>{account_number}</b>
            </div>
          </div>

          <div className={styles.form_details}>
            <div className={styles.form_details_box}>
              <label>Branch</label>
              <b>{branch}</b>
            </div>
            <div className={styles.form_details_box}>
              <label>IFSC Code</label>
              <b>{ifsc_code}</b>
            </div>
          </div>
        </div>

        <div className={styles.assign_list_form_preview}>
          <div className={styles.assign_list_form_header}>
            Review Assigned Customers
          </div>
          <div className="">
            <div className={styles.assign_list_box}>
              <div>
                <div>AARTI COMPUTERS AND SERVICES</div>
                <p>9876543210</p>
              </div>
              <div>
                <div className="button_secondary">Assign</div>
                {/* <p>Remove</p> */}
              </div>
            </div>
            <div className={styles.assign_list_box}>
              <div>
                <div>AARTI COMPUTERS AND SERVICES</div>
                <p>9876543210</p>
              </div>
              <div>
                <div className="button_secondary">Assign</div>
                {/* <p>Remove</p> */}
              </div>
            </div>
            <div className={styles.assign_list_box}>
              <div>
                <div>AARTI COMPUTERS AND SERVICES</div>
                <p>9876543210</p>
              </div>
              <div>
                <div className="button_secondary">Assign</div>
                {/* <p>Remove</p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormPreview;

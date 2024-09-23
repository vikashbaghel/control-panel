import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./staff.module.css";
import { useState } from "react";
import {
  ExpensIcon,
  BlankExpenceIcon,
} from "../../assets/staffImages/index.js";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { reibursementService } from "../../redux/action/reimbursementAction";
import { Tooltip } from "antd";

const ExpensesView = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const queryParameters = new URLSearchParams(window.location.search);
  const userid = queryParameters.get("userid");
  const staffId = queryParameters.get("id");

  const navigate = useNavigate();
  const [reibursementTrackerList, setReibursementTrackerList] = useState("");
  // useEffect(() => {
  //   id && dispatch(staffDetailsById(id));
  // }, []);

  useEffect(() => {
    dispatch(reibursementService("", "", userid));
  }, []);

  useEffect(() => {
    if (state.reibursementTracker.data !== "") {
      if (state.reibursementTracker.data.data.error === false)
        state.reibursementTracker.data.data.data.map((ele) => {
          ele.start_date_time = moment(ele.start_date_time).format(
            "DD-MMM-YYYY"
          );
        });

      {
        setReibursementTrackerList(state.reibursementTracker.data.data.data);
      }
    }
  }, [state]);

  const getObjectLength = (obj) => {
    if (obj === undefined || obj === null) {
      return 0;
    }
    return Object.keys(obj).length;
  };

  return (
    <>
      <div className={styles.expenses_main}>
        <div className={styles.expenses_details_header}>
          <p>Expenses</p>
        </div>
        {reibursementTrackerList?.length > 0 ? (
          <div className={styles.expense_list}>
            {reibursementTrackerList?.map((expense, index) => (
              <>
                {index < 3 && (
                  <div className={styles.expenses_details_main}>
                    <div className={styles.expenses_details_header}>
                      <div className={styles.expenses_details_header_name}>
                        <img src={ExpensIcon} alt="ExpensIcon" />
                        <div className={styles.expense_head_name}>
                          <Tooltip title={expense?.name} placement="topLeft">
                            <span className={styles.expense_name}>
                              {expense?.name}
                            </span>
                          </Tooltip>
                          <span className={styles.expense_dates}>
                            {moment(expense.start_date_time).format("DD MMM")}-
                            {moment(expense.end_date_time).format("DD MMM")}
                          </span>
                        </div>
                      </div>
                      <div className={styles.expenses_details_status}>
                        {expense?.status}
                      </div>
                    </div>

                    <div
                      style={{
                        paddingLeft: 25,
                        paddingRight: 20,
                        lineBreak: "anywhere",
                      }}
                    >
                      {expense?.description}
                    </div>
                    <div
                      className={styles.expenses_details_item}
                      style={{ marginTop: 5 }}
                    >
                      <div>
                        <div>Items Added</div>
                        <div className={styles.expenses_details_item_value}>
                          {expense?.total_items}
                        </div>
                      </div>
                      <div>
                        <div>Expense Captured</div>
                        <div className={styles.expenses_details_item_value}>
                          ₹ {expense?.total_amount}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {index === 3 && (
                  <p
                    className={styles.view_all}
                    onClick={() => {
                      navigate(
                        `/web/expense-tracker/?staff_id=${staffId}&userid=${userid}`
                      );
                    }}
                  >
                    View All
                  </p>
                )}
              </>
            ))}
          </div>
        ) : (
          <div className={styles.expenses_details_main}>
            <div
              style={{
                display: "flex",
                padding: "10px 20px",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img src={BlankExpenceIcon} alt="Activity" />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "30px",
                }}
              >
                doesn’t have any Expenses
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ExpensesView;

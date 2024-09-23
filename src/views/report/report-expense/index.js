// https://team-1624359381274.atlassian.net/wiki/spaces/RUPYZ/pages/edit-v2/180748290#EXPENSE-REPORT

import { Row, Col, Select, Tooltip, Form, Button } from "antd";
import Styles from "../report.module.css";
import ReportHead from "../reportsHead.js";
import { useEffect, useState } from "react";
import ReportListing from "../reportListing/index.js";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL_V2, org_id } from "../../../config.js";
import ReportTemplate from "../reportTemplate/reportTemplate.js";
import { ListItemDesign } from "../../../components/listItemDesign/index.js";
import MultiSelectSearch from "../../../components/selectSearch/multiSelectSearch.js";
import { createReportExpenseAction } from "../../../redux/action/reportExpenseAction.js";
import { supportReportField as supportReportFieldAPI } from "../../../redux/action/reportOrderAction";
import Permissions from "../../../helpers/permissions.js";

const ExpenseReport = () => {
  const state = useSelector((state) => state);
  const { supportReportField } = state;
  const dispatch = useDispatch();

  const [reportListing, setReportListing] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [supportReportList, setSupportReportList] = useState([]);
  const [reportLevel, setReportLevel] = useState("EXPENSES_ALL_USER");

  let createExpenseDetail = Permissions("CREATE_EXPENSE_DETAILED_REPORT");
  let createExpenseSummary = Permissions("CREATE_EXPENSE_SUMMARY_REPORT");

  const [form] = Form.useForm();
  const dateFormat = "YYYY-MM-DD";

  const statusList = [
    { name: "Active", id: "Active" },
    { name: "Approved", id: "Approved" },
    { name: "Paid", id: "Paid" },
    { name: "Rejected", id: "Rejected" },
    { name: "Submitted", id: "Submitted" },
  ];

  const report_level = [
    ...(createExpenseSummary
      ? [{ value: "EXPENSES_ALL_USER", label: "Summary" }]
      : []),
    ...(createExpenseDetail
      ? [{ value: "EXPENSES_DETAIL_USER", label: "Detailed" }]
      : []),
  ];

  const onFinish = async (formData) => {
    setIsLoading(true);
    formData = {
      ...formData,
      start_date: formData.date[0].format(dateFormat),
      end_date: formData.date[1].format(dateFormat),
    };
    delete formData.date;

    const response = await createReportExpenseAction(formData);
    if (response && response.status === 200) {
      if (reportListing) {
        reportListing.reset();
      }
      setReportLevel("EXPENSES_ALL_USER");
      setIsLoading(false);
      form.resetFields();
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (supportReportField.data && !supportReportField.data.data.error) {
      setSupportReportList(supportReportField.data.data.data);
    }
  }, [state]);

  useEffect(() => {
    dispatch(supportReportFieldAPI(reportLevel));
  }, [reportLevel]);

  return (
    <div style={{ display: "flex", width: "100%", gap: 24 }}>
      <div style={{ flex: 1 }}>
        <div className={Styles.header}>Generate Expense Report</div>
        <Form
          form={form}
          colon={false}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            report_module: report_level[0]["value"],
            report_type: "EXCEL",
            status: [],
            user_ids: [],
            custom_fields_list: [],
          }}
          requiredMark={(label, info) => (
            <div>
              {label} {info.required && <span style={{ color: "red" }}>*</span>}
            </div>
          )}
          validateMessages={{
            required: "${label} is required.",
          }}
          scrollToFirstError={true}
        >
          <ReportHead />
          <br />
          <div className={Styles.card_view} style={{ overflowY: "visible" }}>
            <Form.Item
              label={
                <>
                  Report Level
                  <Tooltip title="This Will Effect the Manage Template">
                    <InfoCircleOutlined />
                  </Tooltip>
                </>
              }
              name="report_module"
            >
              <Select
                options={report_level}
                onChange={(v) => {
                  setReportLevel(v);
                  form.setFieldValue("custom_fields_list", []);
                }}
              />
            </Form.Item>

            {reportLevel === "EXPENSES_DETAIL_USER" && (
              <Form.Item label="Select Staff" name="user_ids" required>
                <MultiSelectSearch
                  apiUrl={`${BASE_URL_V2}/organization/${org_id}/staff/?dd=true`}
                  defaultOption={{ label: "All", value: -1 }}
                  listItem={(ele) => <ListItemDesign list={ele} />}
                  images={true}
                  optionParams={{ value: "user_id" }}
                />
              </Form.Item>
            )}

            <Form.Item label="Status" name="status">
              <MultiSelectSearch
                optionList={statusList}
                defaultOption={{ label: "All", value: -1 }}
              />
            </Form.Item>
          </div>
          <br />
          <div
            className={Styles.card_view}
            style={{
              overflowY: "auto",
            }}
          >
            <Form.Item name="custom_fields_list">
              <ReportTemplate
                list={supportReportList}
                moduleName={reportLevel}
              />
            </Form.Item>
          </div>
          <br />
          <Row justify={"space-between"}>
            <Col></Col>
            <Col>
              <Button
                className="button_primary"
                htmlType="submit"
                loading={isLoading}
              >
                Create
              </Button>
            </Col>
          </Row>
          <br />
        </Form>
      </div>
      <ReportListing moduleName={reportLevel} setInterface={setReportListing} />
    </div>
  );
};

export default ExpenseReport;

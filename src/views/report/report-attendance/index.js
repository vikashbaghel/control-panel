// https://team-1624359381274.atlassian.net/wiki/spaces/RUPYZ/pages/edit-v2/180748290#ATTENDANCE-REPORT

import ReportHead from "../reportsHead";
import Styles from "../report.module.css";
import { useState, useEffect } from "react";
import ReportListing from "../reportListing";
import { BASE_URL_V2, org_id } from "../../../config";
import { Row, Col, Form, Select, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import ReportTemplate from "../reportTemplate/reportTemplate";
import { ListItemDesign } from "../../../components/listItemDesign";
import MultiSelectSearch from "../../../components/selectSearch/multiSelectSearch";
import { createReportAttendanceAction } from "../../../redux/action/reportAttendanceAction";
import { supportReportField as supportReportFieldAPI } from "../../../redux/action/reportOrderAction";
import Permissions from "../../../helpers/permissions";

const AttendanceReport = () => {
  const state = useSelector((state) => state);
  const { supportReportField } = state;
  const dispatch = useDispatch();

  const [activeFormType, setActiveFormType] = useState("ATTENDANCE_AGGREGATED");
  const [supportReportList, setSupportReportList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reportListing, setReportListing] = useState();

  let createAttendanceDetail = Permissions("CREATE_ATTENDANCE_DETAILED_REPORT");
  let createAttendanceSummary = Permissions("CREATE_ATTENDANCE_SUMMARY_REPORT");

  const dateFormat = "YYYY-MM-DD";
  const [form] = Form.useForm();

  const report_level_options = [
    ...(createAttendanceSummary
      ? [{ value: "ATTENDANCE_AGGREGATED", label: "Summary" }]
      : []),
    ...(createAttendanceDetail
      ? [{ value: "ATTENDANCE_LISTING_USER", label: "Detailed" }]
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

    const response = await createReportAttendanceAction(formData);
    if (response && response.status === 200) {
      if (reportListing) {
        reportListing.reset();
      }
      setActiveFormType("ATTENDANCE_AGGREGATED");

      form.resetFields();
      setIsLoading(false);
    } else setIsLoading(false);
  };

  useEffect(() => {
    if (supportReportField.data && !supportReportField.data.data.error) {
      setSupportReportList(supportReportField.data.data.data);
    }
  }, [state]);

  useEffect(() => {
    dispatch(supportReportFieldAPI(activeFormType));
  }, [activeFormType]);

  return (
    <div style={{ display: "flex", width: "100%", gap: 24 }}>
      <div style={{ flex: 1 }}>
        <div className={Styles.header}>Generate Attendance Report</div>
        <Form
          form={form}
          colon={false}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            report_module: report_level_options[0]["value"],
            report_type: "EXCEL",
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
            <Form.Item label="Report Level" name="report_module">
              <Select
                options={report_level_options}
                onChange={(v) => {
                  setActiveFormType(v);
                  form.setFieldValue("custom_fields_list", []);
                }}
              />
            </Form.Item>

            {activeFormType === "ATTENDANCE_LISTING_USER" && (
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
                moduleName={activeFormType}
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
        </Form>
      </div>
      <ReportListing
        moduleName={activeFormType}
        setInterface={setReportListing}
      />
    </div>
  );
};

export default AttendanceReport;

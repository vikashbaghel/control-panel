// https://team-1624359381274.atlassian.net/wiki/spaces/RUPYZ/pages/edit-v2/180748290#LEAD-REPORT

import ReportHead from "../reportsHead";
import { useEffect, useState } from "react";
import { Button, Form, Select, Tooltip } from "antd";
import styles from "./leadReport.module.css";
import ReportListing from "../reportListing";
import { Content } from "antd/es/layout/layout";
import { BASE_URL_V2, org_id } from "../../../config";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import ReportTemplate from "../reportTemplate/reportTemplate";
import { ListItemDesign } from "../../../components/listItemDesign";
import MultiSelectSearch from "../../../components/selectSearch/multiSelectSearch";
import { leadReport as leadReportAPI } from "../../../redux/action/leadManagementAction";
import { supportReportField as supportReportFieldAPI } from "../../../redux/action/reportOrderAction";
import Permissions from "../../../helpers/permissions";

const dateFormat = "YYYY-MM-DD";

const LeadReport = () => {
  const dispatch = useDispatch();

  const state = useSelector((state) => state);
  const { supportReportField } = state;

  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [supportReportList, setSupportReportList] = useState([]);
  const [reportListing, setReportListing] = useState();

  const [reportModule, setReportModule] = useState("LEAD_RANGE");

  let createLeadDetail = Permissions("CREATE_LEAD_DETAILED_REPORT");
  let createLeadSummary = Permissions("CREATE_LEAD_SUMMARY_REPORT");

  const report_level = [
    ...(createLeadSummary ? [{ value: "LEAD_RANGE", label: "Summary" }] : []),
    ...(createLeadDetail
      ? [{ value: "LEAD_LISTING_USER", label: "Detailed" }]
      : []),
  ];

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    formData = {
      ...formData,
      start_date: formData.date[0].format(dateFormat),
      end_date: formData.date[1].format(dateFormat),
    };
    delete formData.date;

    const response = await leadReportAPI(formData);
    if (response && response.status === 200) {
      if (reportListing) {
        reportListing.reset();
      }
      setIsLoading(false);
      form.resetFields();
      setReportModule("LEAD_RANGE");
    } else setIsLoading(false);
  };

  useEffect(() => {
    dispatch(supportReportFieldAPI("LEAD_RANGE"));
  }, []);

  useEffect(() => {
    if (supportReportField.data && !supportReportField.data.data.error) {
      setSupportReportList(supportReportField.data.data.data);
    }
  }, [state]);

  return (
    <div className="table_list position-rel" style={{ width: "100%" }}>
      <Content
        style={{
          margin: 0,
          height: "82vh",
          background: "transparent",
          display: "flex",
        }}
      >
        <Form
          form={form}
          colon={false}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            custom_fields_list: [],
            report_type: "EXCEL",
            user_ids: [],
            report_module: report_level[0]["value"],
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
          className={styles.report_container_section1}
        >
          <div className={styles.section_header}>Generate Lead Report</div>
          <div style={{ margin: "20px 24px 0 0" }}>
            <ReportHead />
          </div>
          <div className={styles.report_container}>
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
                  setReportModule(v);
                  form.setFieldsValue({ custom_fields_list: [], user_ids: [] });
                }}
              />
            </Form.Item>
            <Form.Item
              label={
                <>
                  Select Staff{" "}
                  <Tooltip title="This Will Effect the Manage Template">
                    <InfoCircleOutlined />
                  </Tooltip>
                </>
              }
              name="user_ids"
              required
            >
              <MultiSelectSearch
                apiUrl={`${BASE_URL_V2}/organization/${org_id}/staff/?dd=true`}
                defaultOption={{ label: "All", value: -1 }}
                listItem={(ele) => <ListItemDesign list={ele} />}
                images={true}
                optionParams={{ value: "user_id" }}
                params={{
                  disabled:
                    form.getFieldValue("report_module") === "LEAD_RANGE" &&
                    true,
                }}
              />
            </Form.Item>
          </div>

          <div
            className={styles.column_container}
            style={{
              overflowY: "auto",
            }}
          >
            <Form.Item name="custom_fields_list">
              <ReportTemplate
                key={`key-${reportModule}`}
                list={supportReportList}
                moduleName={reportModule}
              />
            </Form.Item>
          </div>
          <div
            style={{
              paddingBlock: "1em",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              className="button_primary"
              htmlType="submit"
              loading={isLoading}
            >
              Create
            </Button>
          </div>
        </Form>
        <ReportListing
          moduleName={reportModule}
          setInterface={setReportListing}
        />
      </Content>
    </div>
  );
};

export default LeadReport;

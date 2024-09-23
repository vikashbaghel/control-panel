// https://team-1624359381274.atlassian.net/wiki/spaces/RUPYZ/pages/edit-v2/180748290#ACTIVITY-REPORT

import axios from "axios";
import Cookies from "universal-cookie";
import ReportHead from "../reportsHead";
import { useEffect, useState } from "react";
import ReportListing from "../reportListing";
import { BASE_URL_V2, org_id } from "../../../config";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Select, notification } from "antd";
import styles from "./../report-customer/styles.module.css";
import ReportTemplate from "../reportTemplate/reportTemplate";
import { ListItemDesign } from "../../../components/listItemDesign";
import MultiSelectSearch from "../../../components/selectSearch/multiSelectSearch";
import { supportReportField as supportReportFieldAPI } from "../../../redux/action/reportOrderAction";
import Permissions from "../../../helpers/permissions";

export default function ActivityReport() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { supportReportField } = state;
  const cookies = new Cookies();

  let createActivityDetail = Permissions("CREATE_ACTIVITY_DETAILED_REPORT");
  let createActivitySummary = Permissions("CREATE_ACTIVITY_SUMMARY_REPORT");

  const report_level = [
    ...(createActivitySummary
      ? [{ value: "STAFF_SUMMARY_ACTIVITY", label: "Summary" }]
      : []),
    ...(createActivityDetail
      ? [{ value: "STAFF_DETAILED_ACTIVITY", label: "Detailed" }]
      : []),
  ];

  const initialFormValues = {
    end_date: "",
    start_date: "",
    report_module: report_level[0]["value"],
  };

  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [reportListing, setReportListing] = useState();

  const [supportReportList, setSupportReportList] = useState([]);
  const [filteredSupportReportList, setFilteredSupportReportList] = useState(
    []
  );
  const [form] = Form.useForm();

  useEffect(() => {
    if (supportReportField.data && !supportReportField.data.data.error) {
      setSupportReportList(supportReportField.data.data.data);
      setFilteredSupportReportList(supportReportField.data.data.data);
    }
  }, [state]);

  const handleSubmit = (formData) => {
    setIsLoading(true);
    formData = {
      ...formData,
      start_date: formData.date[0].format("YYYY-MM-DD"),
      end_date: formData.date[1].format("YYYY-MM-DD"),
    };
    delete formData.date;

    // send data to api
    const url = `${BASE_URL_V2}/organization/${org_id}/activity/reports/`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    axios
      .post(url, formData, { headers })
      .then((res) => {
        if (res.status === 200) {
          if (reportListing) {
            reportListing.reset();
          }
          notification.success({ message: res?.data?.message });
          setFormValues(initialFormValues);
          setIsLoading(false);
          form.resetFields();
        }
      })
      .catch((err) => {
        setIsLoading(false);
        notification.warning({ message: err?.response?.data?.message });
      });
  };

  useEffect(() => {
    dispatch(supportReportFieldAPI(formValues.report_module));
  }, [formValues.report_module]);

  useEffect(() => {
    if (
      formValues.start_date &&
      formValues.end_date &&
      formValues.start_date !== formValues.end_date &&
      formValues.report_module === "STAFF_SUMMARY_ACTIVITY"
    ) {
      const fieldsToBeRemoved = [
        "Beat/Location",
        "Start Day Time",
        "End Day Time",
        "No. of Hours Worked.",
        "MTD TC",
        "MTD PC",
        "MTD Sale",
        "Party Name(Distributor)",
      ];
      const filteredList = supportReportList?.filter(
        (ele) => !fieldsToBeRemoved.includes(ele.name)
      );

      setFilteredSupportReportList(filteredList);
    } else {
      setFilteredSupportReportList(supportReportList);
    }
  }, [formValues.start_date, formValues.end_date]);

  return (
    <div className={styles.report_page}>
      <Form
        form={form}
        colon={false}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          user_ids: [],
          report_type: "EXCEL",
          custom_fields_list: [],
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
        className={styles.report_container}
      >
        <h2 className={styles.heading}>Generate Activity Report</h2>
        <ReportHead
          onFieldChange={(v) => setFormValues({ ...formValues, ...v })}
        />
        <br />
        <div className={styles.report_form}>
          <Form.Item label="Report Level" name="report_module" required>
            <Select
              options={report_level}
              onChange={(v) => {
                setFormValues({ ...formValues, report_module: v });
                form.setFieldValue("custom_fields_list", []);
              }}
              defaultValue="ATTENDANCE_AGGREGATED"
            />
          </Form.Item>

          <Form.Item label="Select Staff" name="user_ids" required>
            <MultiSelectSearch
              apiUrl={`${BASE_URL_V2}/organization/${org_id}/staff/?dd=true`}
              defaultOption={{ label: "All", value: -1 }}
              listItem={(ele) => <ListItemDesign list={ele} />}
              images={true}
              optionParams={{ value: "user_id" }}
            />
          </Form.Item>
        </div>
        <br />
        <div
          className={styles.report_form}
          style={{
            overflowY: "auto",
          }}
        >
          <Form.Item name="custom_fields_list">
            <ReportTemplate
              list={filteredSupportReportList}
              moduleName={formValues.report_module}
            />
          </Form.Item>
        </div>

        <Button
          className={`button_primary ${styles.create_btn}`}
          htmlType="submit"
          loading={isLoading}
        >
          Create
        </Button>
      </Form>
      <ReportListing
        moduleName={formValues.report_module}
        setInterface={setReportListing}
      />
    </div>
  );
}

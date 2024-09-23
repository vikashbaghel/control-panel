// https://team-1624359381274.atlassian.net/wiki/spaces/RUPYZ/pages/edit-v2/180748290#PAYMENT-REPORT

import Styles from "../report.module.css";
import { useEffect, useState } from "react";
import ReportListing from "../reportListing/index.js";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form } from "antd";
import ReportTemplate from "../reportTemplate/reportTemplate.js";
import { createReportPaymentAction } from "../../../redux/action/reportPaymentAction.js";
import { supportReportField as supportReportFieldAPI } from "../../../redux/action/reportOrderAction";
import ReportHead from "../reportsHead.js";

const PaymentReport = () => {
  const dispatch = useDispatch();

  const [supportReportList, setSupportReportList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReportSent, setIsReportSent] = useState(false);
  const [reportListing, setReportListing] = useState();

  const state = useSelector((state) => state);
  const { supportReportField } = state;

  const [form] = Form.useForm();

  const onFinish = async (formData) => {
    setIsLoading(true);

    formData = {
      ...formData,
      report_module: "PAYMENTS",
      start_date: formData.date[0].format("YYYY-MM-DD"),
      end_date: formData.date[1].format("YYYY-MM-DD"),
    };
    delete formData.date;

    const response = await createReportPaymentAction(formData);
    if (response && response.status === 200) {
      if (reportListing) {
        reportListing.reset();
      }
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
    dispatch(supportReportFieldAPI("PAYMENTS"));
  }, []);

  return (
    <div style={{ display: "flex", width: "100%", gap: 24 }}>
      <Form
        form={form}
        colon={false}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ report_type: "EXCEL" }}
        style={{ flex: 1 }}
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
        <div className={Styles.header}>Generate Payment Report</div>
        <ReportHead />
        <br />
        <div
          className={Styles.card_view}
          style={{
            overflowY: "auto",
          }}
        >
          {" "}
          <Form.Item name="custom_fields_list">
            <ReportTemplate list={supportReportList} moduleName={"PAYMENTS"} />
          </Form.Item>
        </div>
        <br />
        <div style={{ float: "right" }}>
          <Button
            className="button_primary"
            htmlType="submit"
            loading={isLoading}
          >
            Create
          </Button>
          <br />
        </div>
      </Form>
      <ReportListing moduleName={"PAYMENTS"} setInterface={setReportListing} />
    </div>
  );
};

export default PaymentReport;

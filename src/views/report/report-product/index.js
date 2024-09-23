// https://team-1624359381274.atlassian.net/wiki/spaces/RUPYZ/pages/edit-v2/180748290#PRODUCT-REPORT

import Styles from "../report.module.css";
import { useEffect, useState } from "react";
import ReportListing from "../reportListing";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button } from "antd";
import CategorySelect from "../reportTemplate/categorySelect";
import ReportTemplate from "../reportTemplate/reportTemplate";
import { createReportProductAction } from "../../../redux/action/reportProductAction";
import { supportReportField as supportReportFieldAPI } from "../../../redux/action/reportOrderAction";
import ReportHead from "../reportsHead";

const ProductReport = () => {
  const dispatch = useDispatch();

  const state = useSelector((state) => state);
  const { supportReportField } = state;

  const [supportReportList, setSupportReportList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reportListing, setReportListing] = useState();

  const [form] = Form.useForm();

  const onFinish = async (formData) => {
    setIsLoading(true);
    formData = {
      ...formData,
      report_module: "PRODUCTS",
      start_date: formData.date ? formData.date[0].format("YYYY-MM-DD") : "",
      end_date: formData.date ? formData.date[1].format("YYYY-MM-DD") : "",
    };
    delete formData.date;

    const response = await createReportProductAction(formData);
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
    dispatch(supportReportFieldAPI("PRODUCTS"));
  }, []);

  return (
    <div style={{ display: "flex", width: "100%", gap: 24 }}>
      <Form
        form={form}
        colon={false}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ report_type: "EXCEL", category_list: [] }}
        requiredMark={(label, info) => (
          <div>
            {label} {info.required && <span style={{ color: "red" }}>*</span>}
          </div>
        )}
        style={{ flex: 1 }}
      >
        <div className={Styles.header}>Generate Product Report</div>
        <ReportHead reqFields={{ date: false }} />
        <br />
        <div
          className={Styles.card_view}
          style={{
            overflowY: "auto",
          }}
        >
          <Form.Item name="category_list">
            <CategorySelect />
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
            <ReportTemplate list={supportReportList} moduleName={"PRODUCTS"} />
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
      <ReportListing moduleName={"PRODUCTS"} setInterface={setReportListing} />
    </div>
  );
};

export default ProductReport;

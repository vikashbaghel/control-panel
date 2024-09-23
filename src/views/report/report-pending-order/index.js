// https://team-1624359381274.atlassian.net/wiki/spaces/RUPYZ/pages/edit-v2/180748290#PRODUCT-WISE-PENDING-ORDER-REPORT

import axios from "axios";
import Cookies from "universal-cookie";
import ReportHead from "../reportsHead";
import { useEffect, useState } from "react";
import ReportListing from "../reportListing";
import { orderStatusList } from "../report-order";
import { Button, Form, notification } from "antd";
import { BASE_URL_V2, org_id } from "../../../config";
import { useDispatch, useSelector } from "react-redux";
import styles from "./../report-customer/styles.module.css";
import ReportTemplate from "../reportTemplate/reportTemplate";
import MultiSelectSearch from "../../../components/selectSearch/multiSelectSearch";
import { supportReportField as supportReportFieldAPI } from "../../../redux/action/reportOrderAction";

export default function PendingOrderReport() {
  const cookies = new Cookies();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { supportReportField } = state;

  const [form] = Form.useForm();

  const report_module = "PRODUCT_WISE_ORDER";

  const [isLoading, setIsLoading] = useState(false);
  const [reportListing, setReportListing] = useState();

  const [supportReportList, setSupportReportList] = useState([]);

  const order_status_list = orderStatusList?.filter(
    (opt) => !["Shipped", "Delivered", "Rejected", "Closed"].includes(opt?.id)
  );

  useEffect(() => {
    dispatch(supportReportFieldAPI("PRODUCT_WISE_ORDER"));
  }, []);

  useEffect(() => {
    if (supportReportField.data && !supportReportField.data.data.error) {
      setSupportReportList(supportReportField.data.data.data);
    }
  }, [state]);

  const handleSubmit = (formData) => {
    setIsLoading(true);

    formData = {
      ...formData,
      start_date: formData.date[0].format("YYYY-MM-DD"),
      end_date: formData.date[1].format("YYYY-MM-DD"),
      report_module,
    };
    delete formData.date;

    //sending data to api
    const url = `${BASE_URL_V2}/organization/${org_id}/order/reports/`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    axios
      .post(url, formData, { headers })
      .then((res) => {
        if (res.status === 200) {
          if (reportListing) {
            reportListing.reset();
          }
          notification.success({ message: res.data.message });
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        notification.warning({ message: err?.response?.data?.message });
      });
  };

  return (
    <div className={styles.report_page}>
      <Form
        form={form}
        colon={false}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          report_type: "EXCEL",
          status: [],
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
        className={styles.report_container}
      >
        <h2 className={styles.heading}>Product Wise Pending Order Report</h2>
        <ReportHead />
        <br />
        <div className={styles.report_form}>
          <Form.Item
            label="Order Status"
            name="status"
            required
            rules={[{ required: true }]}
          >
            <MultiSelectSearch
              optionList={order_status_list}
              params={{
                placeholder: "Select Order Status",
                showSearch: false,
              }}
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
              list={supportReportList}
              moduleName={report_module}
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
        moduleName={report_module}
        setInterface={setReportListing}
      />
    </div>
  );
}

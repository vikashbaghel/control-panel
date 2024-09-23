// https://team-1624359381274.atlassian.net/wiki/spaces/RUPYZ/pages/edit-v2/180748290#CUSTOMER-WISE-PENDING-ORDER-REPORT

import axios from "axios";
import Cookies from "universal-cookie";
import ReportHead from "../reportsHead";
import { useEffect, useState } from "react";
import ReportListing from "../reportListing";
import { Button, Form, notification } from "antd";
import { orderStatusList } from "../report-order";
import { BASE_URL_V2, org_id } from "../../../config";
import { useDispatch, useSelector } from "react-redux";
import styles from "./../report-customer/styles.module.css";
import ReportTemplate from "../reportTemplate/reportTemplate";
import { CustomerListItem } from "../../../components/listItemDesign";
import MultiSelectSearch from "../../../components/selectSearch/multiSelectSearch";
import { supportReportField as supportReportFieldAPI } from "../../../redux/action/reportOrderAction";

export default function CustomerWisePendingOrderReportBlock() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { supportReportField } = state;
  const cookies = new Cookies();

  const [reportListing, setReportListing] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [supportReportList, setSupportReportList] = useState([]);
  const [form] = Form.useForm();

  const report_module = "CUSTOMER_WISE_PENDING_ORDER";

  const handleSubmit = (formData) => {
    setIsLoading(true);
    formData = {
      ...formData,
      start_date: formData.date[0].format("YYYY-MM-DD"),
      end_date: formData.date[1].format("YYYY-MM-DD"),
      report_module,
    };
    delete formData.date;

    // send data to api
    const url = `${BASE_URL_V2}/organization/${org_id}/order/reports/`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    axios
      .post(url, formData, { headers })
      .then((res) => {
        if (res.status === 200) {
          if (reportListing) {
            reportListing.reset();
          }
          notification.success({ message: res?.data?.message });
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
    dispatch(supportReportFieldAPI("CUSTOMER_WISE_PENDING_ORDER"));
  }, []);

  useEffect(() => {
    if (supportReportField.data && !supportReportField.data.data.error) {
      setSupportReportList(supportReportField.data.data.data);
    }
  }, [state]);

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
          customer_ids: [],
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
        <h2 className={styles.heading}>Customer Wise Pending Order</h2>
        <ReportHead />
        <br />
        <div className={styles.report_form}>
          <Form.Item label="Select Customer" name="customer_ids" required>
            <MultiSelectSearch
              apiUrl={`${BASE_URL_V2}/organization/${org_id}/customer/?dd=true`}
              defaultOption={{ label: "All", value: -1 }}
              listItem={(ele) => <CustomerListItem list={ele} />}
              images={true}
            />
          </Form.Item>
          <Form.Item
            label="Order Status"
            name="status"
            required
            rules={[{ required: true }]}
          >
            <MultiSelectSearch
              optionList={orderStatusList}
              params={{
                placeholder: "Select Order Status",
              }}
            />
          </Form.Item>
        </div>
        <br />
        <div className={styles.report_form}>
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

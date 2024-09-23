// https://team-1624359381274.atlassian.net/wiki/spaces/RUPYZ/pages/edit-v2/180748290#CUSTOMER-REPORT

import axios from "axios";
import Cookies from "universal-cookie";
import ReportHead from "../reportsHead";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import ReportListing from "../reportListing";
import { Button, Form, notification } from "antd";
import { BASE_URL_V2, org_id } from "../../../config";
import { useDispatch, useSelector } from "react-redux";
import ReportTemplate from "../reportTemplate/reportTemplate";
import { CustomerListItem } from "../../../components/listItemDesign";
import MultiSelectSearch from "../../../components/selectSearch/multiSelectSearch";
import { supportReportField as supportReportFieldAPI } from "../../../redux/action/reportOrderAction";
import StateSelectSearch from "../../../components/selectSearch/stateSelectSearch";

export default function CustomerReport() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { supportReportField } = state;
  const cookies = new Cookies();

  const [isLoading, setIsLoading] = useState(false);
  const [reportListing, setReportListing] = useState();

  const [supportReportList, setSupportReportList] = useState([]);

  const [form] = Form.useForm();

  const report_module = "CUSTOMER_ALL_USER";
  let customerLevelList = cookies.get("rupyzCustomerLevelConfig");
  const convertedCustomerLevelList = Object.entries(customerLevelList).map(
    ([id, name]) => ({
      id: id,
      name: name,
    })
  );

  useEffect(() => {
    dispatch(supportReportFieldAPI("CUSTOMER_ALL_USER"));
  }, []);

  const handleSubmit = (formData) => {
    setIsLoading(true);
    formData = {
      ...formData,
      start_date: formData.date ? formData.date[0].format("YYYY-MM-DD") : "",
      end_date: formData.date ? formData.date[1].format("YYYY-MM-DD") : "",
      report_module,
    };
    delete formData.date;

    //sending the data to api
    const url = `${BASE_URL_V2}/organization/${org_id}/customer/reports/`;
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
          state: "",
          beat_ids: [],
          report_name: "",
          customer_ids: [],
          customer_type: [],
          customer_level: [],
          report_type: "EXCEL",
          custom_fields_list: [],
        }}
        requiredMark={(label, info) => (
          <div>
            {label} {info.required && <span style={{ color: "red" }}>*</span>}
          </div>
        )}
        scrollToFirstError={true}
        className={styles.report_container}
      >
        <h2 className={styles.heading}>Generate Customer Report</h2>
        <ReportHead reqFields={{ date: false }} />
        <br />
        <div className={styles.report_form}>
          <Form.Item
            label="Customer Level"
            name="customer_level"
            style={{ width: "100%" }}
          >
            <MultiSelectSearch
              optionList={convertedCustomerLevelList}
              defaultOption={{ label: "All", value: -1 }}
              params={{ showSearch: false }}
            />
          </Form.Item>
          <Form.Item
            label="Customer Type"
            name="customer_type"
            style={{ width: "100%" }}
          >
            <MultiSelectSearch
              apiUrl={`${BASE_URL_V2}/organization/${org_id}/customer/type/`}
              defaultOption={{ label: "All", value: -1 }}
            />
          </Form.Item>

          <Form.Item label="Beat" name="beat_ids" style={{ width: "100%" }}>
            <MultiSelectSearch
              apiUrl={`${BASE_URL_V2}/organization/${org_id}/beat/`}
              defaultOption={{ label: "All", value: -1 }}
            />
          </Form.Item>

          <Form.Item label="State" name="state" style={{ width: "100%" }}>
            <StateSelectSearch />
          </Form.Item>

          <Form.Item label="Select Customer" name="customer_ids" required>
            <MultiSelectSearch
              apiUrl={`${BASE_URL_V2}/organization/${org_id}/customer/?dd=true`}
              defaultOption={{ label: "All", value: -1 }}
              listItem={(ele) => <CustomerListItem list={ele} />}
              images={true}
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
        moduleName={"CUSTOMER_ALL_USER"}
        setInterface={setReportListing}
      />
    </div>
  );
}

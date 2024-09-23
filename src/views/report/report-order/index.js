// https://team-1624359381274.atlassian.net/wiki/spaces/RUPYZ/pages/edit-v2/180748290#ORDER-REPORT

import Cookies from "universal-cookie";
import Styles from "../report.module.css";
import ReportHead from "../reportsHead.js";
import { useEffect, useState } from "react";
import {
  ListItemDesign,
  CustomerListItem,
} from "../../../components/listItemDesign/index.js";
import {
  createReportOrderAction,
  supportReportField as supportReportFieldAPI,
} from "../../../redux/action/reportOrderAction.js";
import ReportListing from "../reportListing/index.js";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL_V2, org_id } from "../../../config.js";
import ReportTemplate from "../reportTemplate/reportTemplate.js";
import { Button, Form, Select, Tooltip } from "antd";
import Permissions from "../../../helpers/permissions.js";
import MultiSelectSearch from "../../../components/selectSearch/multiSelectSearch.js";

const { Option } = Select;

const CreateReportOrderCSV = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  const { supportReportField } = state;

  const [filterList, setFilterList] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reportListing, setReportListing] = useState();
  const [reportLevel, setReportLevel] = useState("ORDERS");
  const [customer_level, setCustomer_level] = useState("");
  const [supportReportList, setSupportReportList] = useState([]);

  const [form] = Form.useForm();

  let createOrderDetail = Permissions("CREATE_ORDER_DETAILED_REPORT");
  let createOrderSummary = Permissions("CREATE_ORDER_SUMMARY_REPORT");
  let createOrderDump = Permissions("CREATE_ORDER_DUMP_REPORT");

  const report_level_options = [
    ...(createOrderSummary ? [{ value: "ORDERS", label: "Summary" }] : []),
    ...(createOrderDetail
      ? [{ value: "ORDER_DETAILS", label: "Detailed" }]
      : []),
    ...(createOrderDump ? [{ value: "ORDER_DUMP", label: "Dump" }] : []),
  ];

  const dateFormat = "YYYY-MM-DD";

  const onFinish = async (formData) => {
    setIsLoading(true);

    formData = {
      ...formData,
      start_date: formData.date[0].format(dateFormat),
      end_date: formData.date[1].format(dateFormat),
    };
    delete formData.date;

    const response = await createReportOrderAction(formData);
    if (response && response.status === 200) {
      if (reportListing) {
        reportListing.reset();
      }
      setReportLevel("ORDERS");
      setFilterList("");
      setCustomer_level("");
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
    dispatch(supportReportFieldAPI(reportLevel));
  }, [reportLevel]);

  const cookies = new Cookies();
  const customerLevelList = cookies.get("rupyzCustomerLevelConfig");
  const fetchCustomerListApi = `${BASE_URL_V2}/organization/${org_id}/customer/?dd=true&customer_level=${customer_level}`;

  const filterByTab = {
    staff: (
      <Form.Item label="Select Staff" name="user_ids" required>
        <MultiSelectSearch
          apiUrl={`${BASE_URL_V2}/organization/${org_id}/staff/?dd=true`}
          images={true}
          defaultOption={{ label: "All", value: -1 }}
          listItem={(ele) => <ListItemDesign list={ele} />}
          optionParams={{ value: "user_id" }}
        />
      </Form.Item>
    ),
    customer: (
      <Form.Item
        key={customer_level}
        label="Select Customer"
        name="customer_ids"
        required
      >
        <MultiSelectSearch
          apiUrl={fetchCustomerListApi}
          defaultOption={{ label: "All", value: -1 }}
          images={true}
          listItem={(ele) => <CustomerListItem list={ele} />}
        />
      </Form.Item>
    ),
  };

  return (
    <div style={{ display: "flex", width: "100%", gap: 24 }}>
      <div style={{ flex: 1 }}>
        <div className={Styles.header}>Generate Order Report</div>
        <Form
          form={form}
          colon={false}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            customer_level: "",
            report_module: report_level_options[0]?.value,
            report_type: "EXCEL",
            status: [],
            customer_ids: [],
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
          <div className={Styles.card_view}>
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
              required
              rules={[{ required: true }]}
            >
              <Select
                options={report_level_options}
                onChange={(v) => {
                  setReportLevel(v);
                  form.setFieldValue("custom_fields_list", []);
                }}
              />
            </Form.Item>
            {reportLevel !== "ORDER_DUMP" && (
              <>
                <Form.Item label="Customer Level" name="customer_level">
                  <Select
                    onChange={(v) => setCustomer_level(v)}
                    defaultValue=""
                  >
                    <Option value="">Select Customer Level</Option>
                    {Object.keys(customerLevelList).map((ele) => {
                      return (
                        <Option value={ele} key={ele}>
                          {customerLevelList[ele]}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>

                <div style={{ paddingBottom: "1em" }}>
                  <label>Filter By</label>
                  <select
                    style={{ width: "100%" }}
                    value={filterList}
                    onChange={(e) => {
                      setFilterList(e.target.value);
                    }}
                  >
                    <option value="">None</option>
                    <option value="customer">Customer wise</option>
                    <option value="staff">Staff wise</option>
                  </select>
                </div>

                {filterByTab[filterList]}

                <Form.Item label="Order Status" name="status">
                  <MultiSelectSearch
                    optionList={orderStatusList}
                    defaultOption={{ label: "All", value: -1 }}
                  />
                </Form.Item>
              </>
            )}
          </div>
          {reportLevel !== "ORDER_DUMP" && (
            <>
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
            </>
          )}

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
      </div>
      <ReportListing moduleName={reportLevel} setInterface={setReportListing} />
    </div>
  );
};

export default CreateReportOrderCSV;

export const orderStatusList = [
  { name: "Received", id: "Received" },
  { name: "Approved", id: "Approved" },
  { name: "Processing", id: "Processing" },
  { name: "Ready To Dispatch", id: "Ready To Dispatch" },
  { name: "Partial Shipped", id: "Partial Shipped" },
  { name: "Dispatch", id: "Shipped" },
  { name: "Delivered", id: "Delivered" },
  { name: "Rejected", id: "Rejected" },
  { name: "Closed", id: "Closed" },
];

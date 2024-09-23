import { useState, useEffect } from "react";
import OrderPdf from "./order-report";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, VisibleFilled } from "../../assets/globle";
import customFormAction, {
  postHtmlTemplate,
} from "../../redux/action/customFormAction";
import { notification } from "antd";
import ReportPreview from "./ReportPreview";
import domTemplates from "./domTemplates";
import reportElements from "./report-components";
import { orderPdfConfig } from "./order-report/order-pdf.config";
import stylesheet from "./custom-report.css.js";
import { dispatchPdfConfig } from "./dispatch-order-report/pdf.config.js";

const reports = {
  "order-pdf": {
    name: "Order PDF",
    form_name: 1,
    form_type: "ORDER_PDF",
    exclude_elements: ["dispatch_details"],
    config: orderPdfConfig,
    component: OrderPdf,
  },
  "dispatch-pdf": {
    name: "Dispatch PDF",
    form_name: 2,
    form_type: "DISPATCH_PDF",
    exclude_elements: [],
    config: dispatchPdfConfig,
    component: OrderPdf,
  },
};

const states = {
  reportConfig: [],
};

const CustomReport = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [_reportConfig, _setReportConfig] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const [CreateForm, setCreateForm] = useState(reports[id] || {});
  const [template, setTemplate] = useState([]);
  const [loading, setLoading] = useState(true);

  const updateConfig = (index, data) => {
    states.reportConfig[index] = data;
    _setReportConfig(JSON.parse(JSON.stringify(states.reportConfig)));
  };

  let html_template = new domTemplates.HtmlTemplate();

  const saveReportConfig = async () => {
    const data =
      (await customFormAction.create("modular_pdf", reports[id].form_name, {
        name: reports[id].name,
        config: states.reportConfig,
      })) || {};

    if (data.message) {
      notification[!data.error ? "success" : "error"]({
        message: data.message,
      });

      if (!data.error) {
        await postHtmlTemplate({
          type: reports[id].form_type,
          html_template: html_template.render(template, {
            labels: getFieldsLabelName(_reportConfig),
            styles: stylesheet,
          }),
        });
      }
    }
  };

  const fetchReportConfig = async (id) => {
    setLoading(true);

    states.reportConfig = [];
    const { data } =
      (await customFormAction.fetch("modular_pdf", reports[id].form_name)) ||
      {};
    if (data) {
      if ((data.config || []).length) {
        states.reportConfig = data.config;
      } else {
        states.reportConfig = reports[id].config;
      }
    }
    _setReportConfig(states.reportConfig);
    setCreateForm(reports[id] || {});
    setTemplate([
      ...Object.keys(reportElements)
        .filter((ele) => !reports[id].exclude_elements.includes(ele))
        .map((ele) => reportElements[ele]),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchReportConfig(id);
  }, [id]);

  if (loading) return <div />;
  return (
    <>
      <div
        style={{
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: "2em",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "0.5em",
              alignItems: "center",
            }}
          >
            <img
              src={ArrowLeft}
              alt="back"
              className="clickable"
              onClick={() => navigate(-1)}
            />
            <div>
              <h2 style={{ margin: 0 }}>{reports[id].name}</h2>
              <div>Customization</div>
            </div>
          </div>
          <div
            style={{
              background: "#F4F4F4",
              border: "1px solid #DDDDDD",
              padding: "10px 20px",
              cursor: "pointer",
              borderRadius: 4,
              display: "flex",
              gap: 6,
            }}
            onClick={() => setIsPreview(true)}
          >
            <img src={VisibleFilled} alt="show" />
            Show Preview
          </div>
        </div>
        {CreateForm.component ? (
          <CreateForm.component
            {...{
              reportConfig: states.reportConfig,
              updateConfig,
              saveReportConfig,
            }}
          />
        ) : (
          []
        )}
      </div>
      <ReportPreview
        {...{
          isPreview,
          setIsPreview,
          data: _reportConfig,
          template,
        }}
      />
    </>
  );
};

export default CustomReport;

export const getFieldsLabelName = (data) => {
  let fieldsObj = {};

  data?.map((ele) => {
    ele?.sections?.map((section) => {
      fieldsObj = {
        ...fieldsObj,
        [section.key]: { status: section.status, name: section.title },
        ...section?.fields,
      };
    });
  });
  return fieldsObj;
};

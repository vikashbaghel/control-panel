import { models } from "powerbi-client";
import styles from "./dashboard.module.css";
import { useEffect, useState } from "react";
import { PowerBIEmbed } from "powerbi-client-react";
import { analyticsReportParams } from "../../redux/action/dashboardAction";

export default function Analytics() {
  const [reportParams, setreportParams] = useState({});

  const fetchReportParams = async () => {
    const params = await analyticsReportParams();
    if (params && params?.status === 200) {
      setreportParams(params.data.data?.[0]);
    }
  };

  useEffect(() => {
    fetchReportParams();
  }, []);

  return (
    <div className={styles.analytics_report}>
      {!!Object.keys(reportParams)?.length && (
        <PowerBIEmbed
          embedConfig={{
            type: "report",
            id: reportParams?.report_id,
            embedUrl: `${reportParams?.embed_url}&filter=organizations/organization_id eq '${reportParams?.org_uuid}'`,
            accessToken: reportParams?.embed_token,
            tokenType: models.TokenType.Embed,
            settings: {
              panes: {
                filters: {
                  expanded: false,
                  visible: false,
                },
              },
              layoutType: models.LayoutType.Custom,
              customLayout: {
                displayOption: models.DisplayOption.FitToWidth,
              },
            },
          }}
        />
      )}
    </div>
  );
}

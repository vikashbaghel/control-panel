import Cookies from "universal-cookie";
import { useEffect, useState } from "react";
import styles from "../activity.module.css";
import { Content } from "antd/es/layout/layout";
import AggregatedCounts from "./AggregatedCounts";
import filterService from "../../../services/filter-service";
import StaffActivityDetailsTable from "./StaffActivityDetailsTable";

const TeamActivities = () => {
  const cookies = new Cookies();
  const staffHierarchy = cookies.get("rupyzLoginData")?.hierarchy;
  const admin = cookies.get("rupyzAccessType") === "WEB_SARE360";

  const [searchParams, setSearchParams] = useState({
    ...filterService.getFilters(),
  });

  useEffect(() => {
    filterService.setEventListener(setSearchParams);
  }, []);

  return (
    <>
      <div className="table_list">
        <h2 className="page_title" style={{ fontSize: 18, fontWeight: 600 }}>
          Team Activity
        </h2>
        <div className={styles.product_table_container}>
          <Content
            style={{
              padding: "14px 24px 0 24px",
              margin: 0,
              minHeight: "82vh",
              background: "transparent",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <>
              {(admin || staffHierarchy) && (
                <>
                  <AggregatedCounts {...{ searchParams }} />
                  <br />
                </>
              )}
              <StaffActivityDetailsTable
                {...{ searchParams, isTableOnly: !(admin || staffHierarchy) }}
              />
            </>
          </Content>
        </div>
      </div>
    </>
  );
};

export default TeamActivities;

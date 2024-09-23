import { Col, Drawer, Row } from "antd";
import ReportListing from "../../report/reportListing";
import { useEffect, useState } from "react";

const TeamActivityReports = ({ open, onClose }) => {
  const [reportListing, setReportListing] = useState();
  useEffect(() => {
    if (open && reportListing) {
      reportListing.reset();
    }
  }, [open]);
  return (
    <Drawer
      {...{ open, onClose }}
      title={
        <h3 style={{ margin: 0 }} align="center">
          Reports
        </h3>
      }
      width={"480px"}
    >
      <Col style={{ padding: 24 }}>
        <ReportListing
          moduleName={"STAFF_DASHBOARD"}
          setInterface={setReportListing}
        />
      </Col>
    </Drawer>
  );
};

export default TeamActivityReports;

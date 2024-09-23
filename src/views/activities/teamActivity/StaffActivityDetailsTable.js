import moment from "moment";
import { Col, Dropdown, Modal, Row, Space, Table } from "antd";
import Cookies from "universal-cookie";
import styles from "./styles.module.css";
import Context from "../../../context/Context";
import { useNavigate } from "react-router-dom";
import { Download } from "../../../assets/globle";
import WrapText from "../../../components/wrapText";
import Paginator from "../../../components/pagination";
import { useContext, useEffect, useState } from "react";
import filterService from "../../../services/filter-service";
import { DateFilter, FiltersBy, TableSortFilter } from "./Filters";
import { Staff as staffIcon } from "../../../assets/dashboardIcon";
import { toIndianCurrency } from "../../../helpers/convertCurrency";
import SearchInput from "../../../components/search-bar/searchInput";
import { TimeInHrsAndMinsFormat } from "../../../helpers/globalFunction";
import {
  createStaffDashboardReport,
  getStaffDashboardDetails,
} from "../../../redux/action/recordFollowUpAction";
import noActivityIcon from "../../../assets/activities/teamActivity/no-map-activity.svg";
import pagePreviousIcon from "../../../assets/page-previous.svg";
import "./filterstyles.css";
import { DownloadOutlined, EllipsisOutlined } from "@ant-design/icons";
import TeamActivityReports from "./TeamActivityReports";

const constants = {
  defaultReportDrawer: {
    open: false,
  },
};

export default function StaffActivityDetailsTable({
  searchParams,
  isTableOnly,
}) {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const context = useContext(Context);
  const { setLoading } = context;
  const [reportDrawer, setReportDrawer] = useState({
    ...constants.defaultReportDrawer,
  });

  const hierarchyDisable =
    cookies.get("rupyzAccessType") !== "WEB_SARE360" &&
    !cookies.get("rupyzLoginData")?.hierarchy;

  const [staffDetailsList, setStaffDetailsList] = useState({ records: [] });
  const [toggleLocationPopup, setToggleLocationPopup] = useState(false);

  const {
    roles,
    by_date_range,
    start_date,
    end_date,
    page,
    query,
    sort_by,
    sort_order,
    reporting_manager,
  } = searchParams;

  const tableColumns = [
    {
      title: () => (
        <div className={styles.space_between}>
          Name
          <TableSortFilter
            value={
              searchParams?.sort_by === "name" ? searchParams?.sort_order : ""
            }
            onChange={(v) => {
              filterService.setFilters({
                sort_by: "name",
                sort_order: v,
              });
            }}
          />
        </div>
      ),
      width: 300,
      fixed: true,
      render: (text, record) => {
        return {
          props: {
            style: {
              background: "#FFFFFF",
            },
          },
          children: (
            <div
              className={styles.flex}
              style={{ color: "#000000", fontWeight: 600, cursor: "pointer" }}
              onClick={() =>
                navigate(
                  `/web/team-activity/details/staff?user_id=${
                    record.user_id
                  }&date=${
                    searchParams?.end_date || moment().format("DD-MM-YYYY")
                  }&user_name=${record.name}&pic_url=${record.profile_pic_url}`
                )
              }
            >
              <img
                src={record.profile_pic_url || staffIcon}
                alt={record.name}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "100%",
                }}
              />
              <div>
                <div className={styles.flex}>
                  <WrapText width={150}>{record.name}</WrapText>
                  {(record.user_id === Number(cookies.get("rupyzAdminId")) ||
                    record.user_id ===
                      Number(cookies.get("rupyzLoginData")?.user_id)) && (
                    <span style={{ color: "#727176" }}>(You)</span>
                  )}
                </div>
                {/* {record?.is_fake_location_detected && (
                  <span
                    className={styles.fake_location_text}
                    onClick={(e) => {
                      e.stopPropagation();
                      setToggleLocationPopup(true);
                    }}
                  >
                    Fake location detected
                  </span>
                )} */}
              </div>
            </div>
          ),
        };
      },
    },
    {
      title: () => (
        <div className={styles.space_between}>
          TC
          <TableSortFilter
            value={
              searchParams?.sort_by === "tc_count"
                ? searchParams?.sort_order
                : ""
            }
            onChange={(v) => {
              filterService.setFilters({
                sort_by: "tc_count",
                sort_order: v,
              });
            }}
          />
        </div>
      ),
      dataIndex: "tc_count",
      width: 70,
      render: (text, record) => (
        <div
          className={text && styles.link_tag}
          onClick={() => {
            if (text)
              navigate(
                `/web/team-activity/details/tc?user_id=${
                  record.user_id
                }&user_name=${record.name}&date=${
                  searchParams?.end_date || moment().format("DD-MM-YYYY")
                }&pic_url=${record.profile_pic_url}`
              );
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: () => (
        <div className={styles.space_between}>
          PC{" "}
          <TableSortFilter
            value={
              searchParams?.sort_by === "pc_count"
                ? searchParams?.sort_order
                : ""
            }
            onChange={(v) => {
              filterService.setFilters({
                sort_by: "pc_count",
                sort_order: v,
              });
            }}
          />
        </div>
      ),
      width: 70,
      dataIndex: "pc_count",
      render: (text, record) => (
        <div
          className={text && styles.link_tag}
          onClick={() =>
            text &&
            navigate(
              `/web/team-activity/details/pc?user_id=${
                record.user_id
              }&user_name=${record.name}&date=${
                searchParams?.end_date || moment().format("DD-MM-YYYY")
              }&pic_url=${record.profile_pic_url}`
            )
          }
        >
          {text}
        </div>
      ),
    },
    {
      title: () => (
        <div className={styles.space_between}>
          Order Value
          <TableSortFilter
            value={
              searchParams?.sort_by === "order_value"
                ? searchParams?.sort_order
                : ""
            }
            onChange={(v) => {
              filterService.setFilters({
                sort_by: "order_value",
                sort_order: v,
              });
            }}
          />
        </div>
      ),
      dataIndex: "order_value",
      width: 200,
      render: (text) => (
        <div className={styles.bold_black}>{toIndianCurrency(text)}</div>
      ),
    },
    {
      title: "Distance",
      dataIndex: "distance_travelled",
      width: 150,
      render: (text) =>
        hierarchyDisable ? (
          ""
        ) : (
          <div className={styles.bold_black}>{text} Km</div>
        ),
    },
    ...(by_date_range === "TODAY" ||
    (start_date && start_date === end_date) ||
    !by_date_range
      ? [
          {
            title: "Start Day",
            dataIndex: "start_day",
            width: 120,
            render: (text) => (
              <div>{text ? moment(text).format("hh:mm A") : ""}</div>
            ),
          },
          {
            title: "Last Activity",
            dataIndex: "last_activity",
            width: 120,
            render: (text) => (
              <div>{text ? moment(text).format("hh:mm A") : ""}</div>
            ),
          },
          {
            title: "End Day",
            dataIndex: "end_day",
            width: 120,
            render: (text) => (
              <div>{text ? moment(text).format("hh:mm A") : ""}</div>
            ),
          },
          {
            title: "Duration",
            dataIndex: "duration",
            width: 120,
            render: (text) => <div>{TimeInHrsAndMinsFormat(text)}</div>,
          },
        ]
      : []),
  ];

  const fetchStaffDashboardDetails = async () => {
    const params = {
      page_no: page || 1,
      name: query,
      roles,
      sort_by,
      sort_order,
      by_date_range,
      reporting_manager,
      ...(by_date_range === "CUSTOM" && {
        start_date: moment(start_date, "DD-MM-YYYY").format("YYYY-MM-DD"),
        end_date: moment(end_date, "DD-MM-YYYY").format("YYYY-MM-DD"),
      }),
    };

    setStaffDetailsList(
      (await getStaffDashboardDetails(params)) || { records: [] }
    );
    setLoading(false);
  };

  const renderTableFooter = () => {
    return (
      <Table.Summary fixed>
        <Table.Summary.Row
          style={{
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          <Table.Summary.Cell index={0}>&nbsp;&nbsp;Total</Table.Summary.Cell>
          <Table.Summary.Cell index={1}>
            {staffDetailsList?.tc_meeting_count}
          </Table.Summary.Cell>
          <Table.Summary.Cell index={2}>
            {staffDetailsList?.pc_order_count}
          </Table.Summary.Cell>
          <Table.Summary.Cell index={3}>
            {toIndianCurrency(staffDetailsList?.total_order_amount)}
          </Table.Summary.Cell>
        </Table.Summary.Row>
      </Table.Summary>
    );
  };

  useEffect(() => {
    fetchStaffDashboardDetails();
  }, [
    roles,
    by_date_range,
    start_date,
    end_date,
    page,
    query,
    sort_by,
    sort_order,
    reporting_manager,
  ]);

  return (
    <div
      className={styles.staff_table_container}
      {...(isTableOnly && { style: { background: "transparent", padding: 0 } })}
    >
      <div className={styles.space_between}>
        <SearchInput
          placeholder="Search for Staff"
          searchValue={(v) => filterService.setFilters({ query: v })}
        />
        <div className={styles.flex} style={{ gap: "1em" }}>
          <div
            className={`${styles.filter_button}`}
            onClick={async () => {
              await createStaffDashboardReport({
                roles,
                sort_by,
                sort_order,
                by_date_range,
                reporting_manager,
                ...(by_date_range === "CUSTOM" && {
                  start_date: moment(start_date, "DD-MM-YYYY").format(
                    "YYYY-MM-DD"
                  ),
                  end_date: moment(end_date, "DD-MM-YYYY").format("YYYY-MM-DD"),
                }),
              });
            }}
          >
            Download CSV
            <DownloadOutlined style={{ fontSize: 18 }} />
          </div>
          <div>
            <DateFilter
              value={{
                by_date_range: searchParams?.by_date_range,
                start_date: searchParams?.start_date,
                end_date: searchParams?.end_date,
              }}
              onChange={(v) => {
                filterService.setFilters(v);
              }}
            />
          </div>
          <FiltersBy
            value={searchParams}
            onChange={(v) => {
              filterService.setFilters(v);
            }}
          />
          <Dropdown
            menu={{
              items: [
                {
                  key: "1",
                  label: (
                    <Space
                      align="center"
                      onClick={() => {
                        setReportDrawer({ open: true });
                      }}
                    >
                      <Col style={{ height: 20 }}>
                        <img
                          src={pagePreviousIcon}
                          style={{ height: "100%" }}
                        />
                      </Col>
                      <div>Reports</div>
                    </Space>
                  ),
                },
              ],
            }}
          >
            <div className={`${styles.filter_button}`} onClick={() => {}}>
              <EllipsisOutlined
                style={{ transform: "rotate(-90deg)", fontSize: 20 }}
              />
            </div>
          </Dropdown>
        </div>
      </div>
      <br />
      <Table
        className={
          isTableOnly
            ? "table-height-fixed"
            : staffDetailsList?.records?.length
            ? "activity-list-table"
            : "empty-activity-table"
        }
        columns={tableColumns}
        dataSource={staffDetailsList.records}
        pagination={false}
        {...(staffDetailsList.records.length && {
          summary: renderTableFooter,
        })}
        scroll={{ y: "100%" }}
        locale={{
          emptyText: (
            <div>
              <img src={noActivityIcon} alt="no-activity" />
              <div style={{ fontWeight: 600, color: "#727176" }}>
                No Data found
              </div>
            </div>
          ),
        }}
      />
      <br />
      <Paginator
        limiter={(staffDetailsList.records || []).length < 30}
        value={page}
        onChange={(i) => {
          filterService.setFilters({ page: i });
        }}
      />
      <FakeLocationInfoPopup
        {...{ toggleLocationPopup, setToggleLocationPopup }}
      />
      <TeamActivityReports
        open={reportDrawer.open}
        onClose={() => {
          setReportDrawer({ ...constants.defaultReportDrawer });
        }}
      />
    </div>
  );
}

export function FakeLocationInfoPopup({
  toggleLocationPopup,
  setToggleLocationPopup,
}) {
  return (
    <Modal
      open={toggleLocationPopup}
      onCancel={() => setToggleLocationPopup(false)}
      footer={null}
      title={
        <div style={{ padding: "1em" }}>
          <div style={{ fontSize: 22 }}>Fake location detected</div>
          <div className={styles.color_grey} style={{ paddingTop: ".5em" }}>
            We detected a use of location-altering apps or settings.
          </div>
        </div>
      }
    />
  );
}

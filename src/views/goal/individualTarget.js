import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserTarget,
  getSelfTargetDetails as getSelfTargetDetailsAPI,
} from "../../redux/action/goals";
import styles from "./individualTarget.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BASE_URL_V2, org_id } from "../../config";
import Cookies from "universal-cookie";
import axios from "axios";
import { capitalizeFirst } from "../distributor";
import TargetDetailsView from "./targetDetailsView";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  CaretDownOutlined,
  CaretUpOutlined,
  MoreOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { ArrowLeft, DeleteIcon } from "../../assets/globle";
import { BlankTargetIcon } from "../../assets/staffImages";
import ProductTargetDetails from "./productTargetDetails";
import { Dropdown } from "antd";
import { EditIcon } from "../../assets/globle";
import { staffDetailsById } from "../../redux/action/staffAction";
import { Staff as staffIcon } from "../../assets/dashboardIcon";
import recurringIcon from "../../assets/recurring.svg";
import ConfirmDelete from "../../components/confirmModals/confirmDelete";
import Context from "../../context/Context";
import SearchInput from "../../components/search-bar/searchInput";
import handleParams from "../../helpers/handleParams";

const IndividualTarget = () => {
  const dispatch = useDispatch();

  const state = useSelector((state) => state);
  const context = useContext(Context);
  const { setDeleteModalOpen } = context;

  const [searchParams, setSearchParams] = useSearchParams();
  const target = searchParams.get("target")
    ? searchParams.get("target")
    : "Active";

  const targetId = searchParams.get("targetid");
  const id = searchParams.get("id") ? searchParams.get("id") : 0;
  const name = searchParams.get("name");
  const staffId = searchParams.get("staff_id");
  const searchKey = searchParams.get("query") || "";

  const navigate = useNavigate();
  const cookies = new Cookies();

  const [profileInfo, setProfileInfo] = useState();

  const [activeLink, setActiveLink] = useState(target);
  // state to manage the Active target List
  const [activeData, setActiveData] = useState({});
  // state to manage the Upcoming target List
  const [upcomingProductIsOpen, setUpcomingProductIsOpen] =
    useState(initialValue);
  const [upcomingPageNo, setUpcomingPageNo] = useState(1);
  const [upcomingHasMore, setUpcomingHasMore] = useState(true);
  const [upcomingData, setUpcomingData] = useState([]);
  // state to manage the Closed target List
  const [closedProductIsOpen, setClosedProductIsOpen] = useState(initialValue);
  const [closedPageNo, setClosedPageNo] = useState(1);
  const [closedHasMore, setClosedHasMore] = useState(true);
  const [closedData, setClosedData] = useState([]);

  const [editId, setEditId] = useState("");
  const [deleteData, setDeleteData] = useState();
  const [isActionsOpen, setIsActionOpen] = useState(false);

  const handleDelete = (data) => {
    if (data) dispatch(deleteUserTarget(deleteData.id, deleteData));
  };

  const appendActiveData = () => {
    let url;
    if (id === 0) {
      url = `${BASE_URL_V2}/organization/${org_id}/target/?get_currently_active=true`;
    } else {
      url = `${BASE_URL_V2}/organization/${org_id}/target/set/?user_id=${id}&get_currently_active=true&name=${searchKey}`;
    }
    const headers = { Authorization: cookies.get("rupyzToken") };
    axios.get(url, { headers }).then((response) => {
      setActiveData(response.data.data);
    });
  };

  const appendUpcomingData = () => {
    let url;

    if (id === 0) {
      url = `${BASE_URL_V2}/organization/${org_id}/target/?page_no=${upcomingPageNo}&upcoming=true&name=${searchKey}`;
    } else {
      url = `${BASE_URL_V2}/organization/${org_id}/target/set/?user_id=${id}&page_no=${1}&upcoming=true&name=${searchKey}`;
    }
    const headers = { Authorization: cookies.get("rupyzToken") };
    axios.get(url, { headers }).then((response) => {
      setUpcomingData(upcomingData.concat(response.data.data));
      setUpcomingPageNo(upcomingPageNo + 1);
      if (response.data.data.length !== 30) {
        setUpcomingHasMore(false);
      }
    });
  };

  const appendClosedData = () => {
    let url;
    if (id === 0) {
      url = `${BASE_URL_V2}/organization/${org_id}/target/?page_no=${upcomingPageNo}&closed=true`;
    } else {
      url = `${BASE_URL_V2}/organization/${org_id}/target/set/?user_id=${id}&page_no=${upcomingPageNo}&closed=true&name=${searchKey}`;
    }
    const headers = { Authorization: cookies.get("rupyzToken") };
    axios.get(url, { headers }).then((response) => {
      setClosedData(closedData.concat(response.data.data));
      setClosedPageNo(closedPageNo + 1);
      if (response.data.data.length !== 30) {
        setClosedHasMore(false);
      }
    });
  };

  const targetData = () => {
    setActiveLink(target);
    switch (target) {
      case "Upcoming":
        appendUpcomingData();
        break;
      case "Closed":
        appendClosedData();
        break;
      default:
        appendActiveData();
        break;
    }
    setActiveData({});

    setUpcomingData([]);
    setUpcomingPageNo(1);
    setUpcomingHasMore(true);
    setUpcomingProductIsOpen(initialValue);

    setClosedData([]);
    setClosedPageNo(1);
    setClosedHasMore(true);
    setClosedProductIsOpen(initialValue);
  };

  useEffect(() => {
    if (staffId) {
      dispatch(staffDetailsById(staffId));
    }
  }, [staffId]);

  useEffect(() => {
    if (
      staffId &&
      state.staff.data !== "" &&
      state.staff.data.data.error === false
    )
      setProfileInfo({
        name: state.staff.data.data.data.name,
        imgUrl: state.staff.data.data.data.profile_pic_url,
      });

    if (
      state.deletedTargetDetails.data !== "" &&
      !state.deletedTargetDetails.data.data.error
    ) {
      setUpcomingData([]);
      setUpcomingPageNo(1);
      targetData();
    }
  }, [state]);

  useEffect(() => {
    targetData();
  }, [target, searchKey]);

  const handleUpcomingTargetOpen = (id) => {
    if (isActionsOpen) return;
    if (upcomingProductIsOpen.id === id) {
      setUpcomingProductIsOpen((prev) => ({
        ...prev,
        isOpen: !upcomingProductIsOpen.isOpen,
        id: id,
      }));
      return;
    }
    setUpcomingProductIsOpen((prev) => ({
      ...prev,
      isOpen: true,
      id: id,
    }));
  };

  const handleClosedTargetOpen = (id) => {
    if (closedProductIsOpen.id === id) {
      setClosedProductIsOpen((prev) => ({
        ...prev,
        isOpen: !closedProductIsOpen.isOpen,
        id: id,
      }));
      return;
    }
    setClosedProductIsOpen((prev) => ({
      ...prev,
      isOpen: true,
      id: id,
    }));
  };

  const items = [
    {
      key: "1",
      label: (
        <div
          onClick={() => {
            navigate(
              `/web/assign-target?staff_id=${staffId}&target_id=${editId}&type=${target}`
            );
          }}
          className="action-dropdown-list"
        >
          <img src={EditIcon} alt="edit" /> Edit
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div>
          <div
            onClick={() => setDeleteModalOpen(true)}
            className="action-dropdown-list"
          >
            <img src={DeleteIcon} alt="delete" /> <span>Delete</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      {targetId ? (
        <ProductTargetDetails />
      ) : (
        <div className="table_list position-rel">
          <h2
            className="page_title"
            style={{ display: "flex", alignItems: "center", gap: "0.5em" }}
          >
            {staffId && (
              <img
                src={ArrowLeft}
                alt="arrow"
                onClick={() => navigate(-1)}
                className="clickable"
              />
            )}
            Target
          </h2>
          {staffId && (
            <p className={styles.staff_img}>
              <img
                src={profileInfo?.imgUrl || staffIcon}
                alt={profileInfo?.name}
              />
              {profileInfo?.name}
            </p>
          )}
          <div className={styles.target_container}>
            <div className={styles.header}>
              <div className={styles.header_options}>
                {["Active", "Upcoming", "Closed"].map((item, ind) => {
                  return (
                    <div
                      key={ind}
                      className={`${item === activeLink && styles.active} ${
                        styles.target_names
                      }`}
                      onClick={() => {
                        setActiveLink(item);
                        if (id === 0) {
                          navigate(`/web/target?target=${item}`);
                          return;
                        }
                        navigate(
                          `/web/target?target=${item}&id=${id}&name=${name}&staff_id=${staffId}`
                        );
                      }}
                    >
                      {item}
                    </div>
                  );
                })}
              </div>
              <div className={styles.search_button}>
                {activeLink !== "Active" && (
                  <SearchInput
                    placeholder="Search by target or staff name"
                    searchValue={(data) => {
                      setUpcomingData([]);
                      setUpcomingPageNo(1);
                      setClosedData([]);
                      setClosedPageNo(1);
                      handleParams(searchParams, setSearchParams, {
                        query: data,
                      });
                    }}
                  />
                )}
                {name && (
                  <button
                    className="button_primary"
                    onClick={() =>
                      navigate(`/web/assign-target?id=${id}&name=${name}`)
                    }
                  >
                    Assign Target
                  </button>
                )}
              </div>
            </div>
            {target === "Active" && Object.keys(activeData).length > 0 && (
              <div className={styles.active_list_container}>
                <div className={styles.header_edit_options}>
                  <div className={styles.active_header}>
                    {capitalizeFirst(activeData.name)}
                    {activeData.recurring && (
                      <p className={styles.recurring_icon}>
                        <img src={recurringIcon} alt="recurring" />
                        Recurring
                      </p>
                    )}
                  </div>
                  <div
                    onMouseOver={() => {
                      setEditId(activeData.id);
                      setDeleteData(activeData);
                    }}
                  >
                    <Dropdown
                      menu={{
                        items,
                      }}
                      className="action-dropdown"
                    >
                      <div className="clickable">
                        <MoreOutlined className="action-icon" />
                      </div>
                    </Dropdown>
                  </div>
                </div>

                <div className={styles.active_header_bottom}>
                  <div>
                    Assigned By - {capitalizeFirst(activeData.created_by_name)}
                  </div>
                  <div>
                    {moment(activeData.start_date).format("DD MMM YYYY")} -{" "}
                    {moment(activeData.end_date).format("DD MMM YYYY")}
                  </div>
                </div>
                <TargetDetailsView data={activeData} />
              </div>
            )}
            {(Object.keys(activeData).length === 0 && target === "Active") ||
            (target === "Upcoming" && upcomingData.length === 0) ||
            (target === "Closed" && closedData.length === 0) ? (
              <div style={{ textAlign: "center", marginTop: 40 }}>
                <img src={BlankTargetIcon} alt="Activity" width={250} />
                <div style={{ marginTop: 20 }}>
                  {name
                    ? `${name} doesn't have any ${target} Target `
                    : `You don’t have any ${target} Target`}
                </div>
              </div>
            ) : (
              <></>
            )}
            {target === "Upcoming" && (
              <InfiniteScroll
                dataLength={upcomingData.length}
                next={appendUpcomingData}
                hasMore={upcomingHasMore}
                height={"75vh"}
                loader={
                  <h4 style={{ textAlign: "center", color: "blue" }}>
                    Loading...
                  </h4>
                }
                scrollableTarget="scrollableDiv"
              >
                {upcomingData.map((data) => (
                  <div
                    key={data.id}
                    id="scrollableDiv"
                    className={styles.loop_card}
                    onClick={() => handleUpcomingTargetOpen(data.id)}
                  >
                    <div className={styles.loop_header}>
                      <div style={{ display: "flex", gap: "0.5em" }}>
                        {capitalizeFirst(data.name)}
                        {data.recurring && (
                          <img src={recurringIcon} alt="recurr" />
                        )}
                      </div>
                      <div className={styles.header_edit_options}>
                        {moment(data.start_date).format("DD MMM YYYY")} -{" "}
                        {moment(data.end_date).format("DD MMM YYYY")}
                        <div
                          onMouseOver={() => {
                            setIsActionOpen(true);
                            setEditId(data.id);
                            setDeleteData(data);
                          }}
                          onMouseLeave={() => setIsActionOpen(false)}
                        >
                          <Dropdown
                            menu={{
                              items,
                            }}
                            className="action-dropdown"
                          >
                            <div className="clickable">
                              <MoreOutlined className="action-icon" />
                            </div>
                          </Dropdown>
                        </div>
                      </div>
                    </div>
                    <div className={styles.loop_header_bottom}>
                      <div>
                        Assigned By - {capitalizeFirst(data.created_by_name)}
                      </div>
                      {upcomingProductIsOpen.isOpen &&
                      upcomingProductIsOpen.id === data.id ? (
                        <CaretUpOutlined style={{ marginBottom: 20 }} />
                      ) : (
                        <CaretDownOutlined />
                      )}
                    </div>
                    {upcomingProductIsOpen.isOpen &&
                      upcomingProductIsOpen.id === data.id && (
                        <>
                          <TargetDetailsView data={data} />
                        </>
                      )}
                  </div>
                ))}
              </InfiniteScroll>
            )}
            {target === "Closed" && (
              <InfiniteScroll
                dataLength={closedData.length}
                next={appendUpcomingData}
                hasMore={closedHasMore}
                height={"75vh"}
                loader={
                  <h4 style={{ textAlign: "center", color: "blue" }}>
                    Loading...
                  </h4>
                }
                scrollableTarget="scrollableDiv"
              >
                {closedData.map((data) => (
                  <div
                    key={data.id}
                    id="scrollableDiv"
                    className={styles.loop_card}
                    onClick={() => handleClosedTargetOpen(data.id)}
                  >
                    <div className={styles.loop_header}>
                      <div>{capitalizeFirst(data.name)}</div>
                      <div>
                        {moment(data.start_date).format("DD MMM YYYY")} -{" "}
                        {moment(data.end_date).format("DD MMM YYYY")}
                      </div>
                    </div>
                    <div className={styles.loop_header_bottom}>
                      <div>
                        Assigned By - {capitalizeFirst(data.created_by_name)}
                      </div>
                      {closedProductIsOpen.isOpen ? (
                        <CaretUpOutlined style={{ marginBottom: 20 }} />
                      ) : (
                        <CaretDownOutlined />
                      )}
                    </div>
                    {closedProductIsOpen.isOpen &&
                      closedProductIsOpen.id === data.id && (
                        <>
                          <TargetDetailsView data={data} />
                        </>
                      )}
                  </div>
                ))}
              </InfiniteScroll>
            )}
          </div>
        </div>
      )}
      <ConfirmDelete
        title={"Target"}
        confirmValue={(data) => handleDelete(data)}
      />
    </>
  );
};

export default IndividualTarget;

const initialValue = { isOpen: false, id: null };

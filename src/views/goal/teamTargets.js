import {
  CaretDownOutlined,
  CaretUpOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { Dropdown } from "antd";
import { useNavigate } from "react-router";
import Context from "../../context/Context";
import styles from "./teamTarget.module.css";
import { capitalizeFirst } from "../distributor";
import { useSearchParams } from "react-router-dom";
import TargetDetailsView from "./targetDetailsView";
import handleParams from "../../helpers/handleParams";
import { useDispatch, useSelector } from "react-redux";
import recurringIcon from "../../assets/recurring.svg";
import { useContext, useEffect, useState } from "react";
import ConfirmDelete from "../../components/confirmModals/confirmDelete";
import { DeleteIcon, EditIcon } from "../../assets/globle";
import { BlankTargetIcon } from "../../assets/staffImages";
import { Staff as staffIcon } from "../../assets/navbarImages";
import Pagination from "../../components/pagination/pagination";
import SearchInput from "../../components/search-bar/searchInput";
import { deleteUserTarget, getTeamTargetsList } from "../../redux/action/goals";

export default function TeamTargets() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  // query params
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTarget = searchParams.get("target")
    ? searchParams.get("target")
    : "active";
  const pageCount = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("query");
  const searchPage = Number(searchParams.get("search_page")) || 1;

  const context = useContext(Context);
  const { setDeleteModalOpen, setLoading } = context;
  const [isOpen, setIsOpen] = useState({ open: false, id: "" });
  const [actionData, setActionData] = useState();
  const [targetData, setTargetData] = useState([]);
  const [isActionsOpen, setIsActionOpen] = useState(false);

  const items = [
    {
      key: "1",
      label: (
        <div
          onClick={() => {
            navigate(
              `/web/assign-target?target=team&target_id=${actionData.id}&type=${activeTarget}`
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
        <div
          onClick={() => setDeleteModalOpen(true)}
          className="action-dropdown-list"
        >
          <img src={DeleteIcon} alt="delete" /> <span>Delete</span>
        </div>
      ),
    },
  ];

  const handleTargetOpen = (id) => {
    if (isActionsOpen) return;

    if (isOpen.id === id) {
      setIsOpen((prev) => ({
        ...prev,
        open: !isOpen.open,
        id: id,
      }));
      return;
    }
    setIsOpen((prev) => ({
      ...prev,
      open: true,
      id: id,
    }));
  };

  useEffect(() => {
    dispatch(
      getTeamTargetsList(search ? searchPage : pageCount, activeTarget, search)
    );
    setActionData("");
  }, [activeTarget, pageCount, search, searchPage]);

  useEffect(() => {
    if (
      state.teamTargetList.data !== "" &&
      !state.teamTargetList.data.data.error
    )
      setTargetData(state.teamTargetList.data.data.data);
    setLoading(false);

    if (
      state.deletedTargetDetails.data !== "" &&
      !state.deletedTargetDetails.data.data.error
    ) {
      dispatch(getTeamTargetsList(pageCount, activeTarget));
      setActionData("");
    }
  }, [state]);

  return (
    <div className={styles.team_targets_page}>
      <h2>Team Targets</h2>
      <div className={styles.header}>
        <div className={styles.header_options}>
          {["active", "upcoming", "closed"].map((ele, ind) => {
            return (
              <p
                key={ind}
                className={`${ele === activeTarget && styles.active} ${
                  styles.target_names
                }`}
                onClick={() => setSearchParams({ target: ele })}
              >
                {ele}
              </p>
            );
          })}
        </div>
        <SearchInput
          placeholder="Search by target or staff name"
          searchValue={(data) =>
            handleParams(searchParams, setSearchParams, { query: data })
          }
        />
      </div>
      {targetData?.length > 0 ? (
        targetData?.map((data) => (
          <div
            key={data.id}
            id="scrollableDiv"
            className={styles.target_card}
            onClick={() => handleTargetOpen(data.id)}
          >
            <div className={styles.staff_name_heading}>
              <p>
                <img
                  src={data?.profile_pic_url || staffIcon}
                  alt={data.user_name}
                />
                {data.user_name}
              </p>
              {activeTarget !== "closed" && (
                <div
                  onMouseOver={() => {
                    setIsActionOpen(true);
                    setActionData(data);
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
              )}
            </div>
            <div className={styles.target_name_heading}>
              <div className={styles.target_name}>
                {capitalizeFirst(data.name)}
                {data.recurring && (
                  <span>
                    {" "}
                    <img src={recurringIcon} alt="recurr" /> Recurring
                  </span>
                )}
              </div>
              <div className={styles.header_edit_options}>
                {moment(data.start_date).format("DD MMM YYYY")} -{" "}
                {moment(data.end_date).format("DD MMM YYYY")}
              </div>
            </div>
            <div className={styles.loop_header_bottom}>
              <div style={{ fontWeight: 500 }}>
                Assigned By - {capitalizeFirst(data.created_by_name)}
              </div>
              {isOpen.open && isOpen.id === data.id ? (
                <CaretUpOutlined />
              ) : (
                <CaretDownOutlined />
              )}
            </div>
            {isOpen.open && isOpen.id === data.id && (
              <TargetDetailsView data={data} />
            )}
          </div>
        ))
      ) : (
        <div className={styles.empty_target_list}>
          <img src={BlankTargetIcon} alt="Activity" width={250} />
          <p>Your team doesn't have any {activeTarget} Target</p>
        </div>
      )}
      <div className={styles.pagination}>
        <Pagination list={targetData} search={search} />
      </div>
      <ConfirmDelete
        title={"Target"}
        confirmValue={(data) =>
          data && dispatch(deleteUserTarget(actionData.id, actionData))
        }
      />
    </div>
  );
}

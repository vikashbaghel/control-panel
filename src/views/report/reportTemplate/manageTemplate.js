import React, { useState, useEffect, useContext } from "react";
import styles from "../report.module.css";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown, Modal } from "antd";
import { deleteTemplate as deleteTemplateAPI } from "../../../redux/action/reportTemplate";
import { BASE_URL_V2, org_id } from "../../../config";
import axios from "axios";
import Cookies from "universal-cookie";
import InfiniteScroll from "react-infinite-scroll-component";
import { DeleteIcon, EditIcon } from "../../../assets/globle";
import Context from "../../../context/Context";
import { MoreOutlined } from "@ant-design/icons";
import ConfirmDelete from "../../../components/confirmModals/confirmDelete";

const ManageTemplate = ({
  isOpen,
  setIsopen,
  openCreateTemplate,
  updateTemplate,
  moduleName,
}) => {
  const cookies = new Cookies();
  const context = useContext(Context);
  const { setDeleteModalOpen, setReportTemplateId } = context;
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { deleteTemplate, createTemplate } = state;
  const [selectedOption, setSelectedOption] = useState("");

  // loop for Lead Report data
  //   state to manage inifnity loop
  const [data, setData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [searchValue, setSearchValue] = useState("");

  const featchReportTemplateAPI = `${BASE_URL_V2}/organization/${org_id}/report/template/`;

  const fetchData = async (page, search) => {
    const url = featchReportTemplateAPI;
    const headers = { Authorization: cookies.get("rupyzToken") };
    const params = {
      page_no: page,
      name: search,
      module: moduleName,
    };
    const newDataTemp = await axios.get(url, { headers, params });
    if (newDataTemp.data.data.length < 30) {
      setHasMore(false);
    }
    return newDataTemp.data.data;
  };

  //   initial call for API and whenever page count changes
  useEffect(() => {
    if (isOpen) {
      fetchData(pageNo, searchValue).then((newData) =>
        setData(data.concat(newData))
      );
    }
  }, [pageNo, searchValue, isOpen]);

  //   usefor calling more data when the page is scrolled down
  const handleLoadMore = () => {
    setPageNo((prevPage) => prevPage + 1);
  };

  const onCancel = () => {
    setIsopen(false);
    setData([]);
    setHasMore(true);
    setPageNo(1);
  };

  const handleCreateTemplate = () => {
    openCreateTemplate(true);
  };

  const items = [
    {
      key: "3",
      label: (
        <div
          onClick={() => {
            updateTemplate(true);
            setReportTemplateId(selectedOption);
          }}
          className="action-dropdown-list"
        >
          <img src={EditIcon} alt="edit" /> Edit
        </div>
      ),
    },
    {
      key: "4",
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

  const handleDeleteCustomer = (data) => {
    if (data) {
      dispatch(deleteTemplateAPI(selectedOption));
    }
  };

  useEffect(() => {
    if (deleteTemplate?.data && deleteTemplate.data.data.error === false) {
      setTimeout(() => {
        setPageNo(1);
        fetchData(1, searchValue).then((newData) => setData(newData));
      }, 400);
    }
    if (createTemplate?.data && createTemplate.data.data.error === false) {
      setData([]);
      setHasMore(true);
      setPageNo(1);
      fetchData(1, "").then((newData) => setData(newData));
    }
  }, [state]);

  return (
    <Modal
      open={isOpen}
      onCancel={onCancel}
      width={650}
      centered
      title={
        <div
          style={{
            padding: 15,
            textAlign: "center",
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          Manage Template
        </div>
      }
      footer={[<></>]}
    >
      <div className={styles.manage_modal_container}>
        <div className={styles.search_section}>
          <input
            style={{ width: "65%" }}
            placeholder="Search Name"
            onChange={(event) => {
              setData([]);
              setHasMore(true);
              setPageNo(1);
              setSearchValue(event.target.value);
            }}
          />
          <button
            className="button_primary"
            style={{ height: 43 }}
            onClick={handleCreateTemplate}
          >
            Create Template
          </button>
        </div>
        <div className={styles.list_section}>
          <InfiniteScroll
            dataLength={data.length}
            next={handleLoadMore}
            hasMore={hasMore}
            height={"45vh"}
            loader={
              hasMore === true ? (
                <h4 style={{ textAlign: "center" }}>Loading...</h4>
              ) : (
                <></>
              )
            }
            scrollableTarget="scrollableDiv"
            className={styles.dropdown_container}
          >
            {data?.length > 0 ? (
              <div className={styles.report_template_card}>
                {data?.map((item, index) => {
                  return (
                    <div key={index} id="scrollableDiv">
                      <span>{item.name}</span>
                      <Dropdown
                        menu={{
                          items,
                        }}
                        className="action-dropdown"
                        placement="bottomRight"
                      >
                        <div
                          className="clickable"
                          onMouseOver={() => setSelectedOption(item.id)}
                        >
                          <MoreOutlined className="action-icon" />
                        </div>
                      </Dropdown>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                style={{
                  height: "80%",
                  display: "flex",
                  gap: "0.5em",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                You don't have any templates. Add new using
                <b>Create Template</b>
              </div>
            )}
          </InfiniteScroll>
        </div>
      </div>
      <ConfirmDelete
        title={"Report Template"}
        confirmValue={(data) => {
          handleDeleteCustomer(data);
        }}
      />
    </Modal>
  );
};

export default ManageTemplate;

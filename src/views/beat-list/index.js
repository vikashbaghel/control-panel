import { Dropdown, Table } from "antd";
import styles from "./beat.module.css";
import BeatFilters from "./beatFilters";
import Context from "../../context/Context";
import { ViewDetails } from "../../assets";
import AddEditBeatForm from "./addEditBeatForm";
import { MoreOutlined } from "@ant-design/icons";
import addIcon from "../../assets/add-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import ConfirmDelete from "../../components/confirmModals/confirmDelete";
import { DeleteIcon, EditIcon } from "../../assets/globle";
import { deleteCustomer } from "../../redux/action/customerAction";
import RecordPayment from "../../components/viewDrawer/recordPayment";
import customerIcon from "../../assets/distributor/customer-img.svg";
import { beatDeleteService, beatService } from "../../redux/action/beatAction";
import BeatDetailsDrawer from "../../components/viewDrawer/beat-list/beatDetailsDrawer";
import WrapText from "../../components/wrapText";
import filterService from "../../services/filter-service";
import Paginator from "../../components/pagination";
import AdminLayout from "../../components/AdminLayout";

export default function BeatList() {
  const dispatch = useDispatch();

  const context = useContext(Context);
  const {
    setLoading,
    setAddBeatOpen,
    addBeatOpen,
    setDeleteModalOpen,
    deleteModalOpen,
    deleteModalTitle,
    setDeleteModalTitle,
    distributorDetails,
  } = context;

  const state = useSelector((state) => state);
  const { getBeat, addBeat, editBeat } = state;
  const [beatList, setBeatList] = useState([]);
  const [beatDetails, setBeatDetails] = useState({});
  const [activeFilters, setActiveFilters] = useState({
    page: 1,
    ...filterService.getFilters(),
  });

  const beatTable = [
    {
      title: "Beat Name",
      dataIndex: "name",
      render: (text, record) => (
        <p
          className={styles.bold_black}
          style={{ cursor: "pointer" }}
          onClick={() => {
            filterService.setFilters({ id: record?.id });

            setBeatDetails(record);
          }}
        >
          {text}
        </p>
      ),
    },
    {
      title: "Town/City",
      dataIndex: "locality",
    },
    {
      title: "No. of Customer",
      dataIndex: "customer_count",
    },
    {
      title: "Parent",
      render: (text, record) =>
        record.parent_customer_name && (
          <div className={`${styles.flex_center} ${styles.bold_black}`}>
            <img
              src={record?.customer_parent_logo_url || customerIcon}
              alt="customer"
              className={styles.customer_image}
            />
            <WrapText width={250}>{record.parent_customer_name}</WrapText>
          </div>
        ),
    },
    {
      title: " ",
      key: "operation",
      width: 50,
      render: (text, record) => (
        <div
          onMouseOver={() => {
            setBeatDetails(record);
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
      ),
    },
  ];

  const items = [
    {
      key: "1",
      label: (
        <div
          className="action-dropdown-list"
          onClick={() => {
            filterService.setFilters({
              id: beatDetails?.id,
            });
          }}
        >
          <img src={ViewDetails} alt="details" /> View Details
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div
          className="action-dropdown-list"
          onClick={() => {
            filterService.setFilters({
              edit_id: beatDetails?.id,
            });
            setAddBeatOpen(true);
          }}
        >
          <img src={EditIcon} alt="edit" /> Edit
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <div
          className="action-dropdown-list"
          onClick={() => setDeleteModalOpen(true)}
        >
          <img src={DeleteIcon} alt="delete" />
          Delete
        </div>
      ),
    },
  ];

  const handleDeleteCustomer = (data) => {
    if (data && deleteModalTitle === "Customer") {
      dispatch(deleteCustomer(distributorDetails?.id, false));
      setDeleteModalTitle("");
      return;
    }
    if (data) {
      dispatch(beatDeleteService(beatDetails, false));
      setTimeout(() => {
        dispatch(beatService("", activeFilters?.page));
      }, 400);
    }
  };

  useEffect(() => {
    const {
      customer_id,
      sort_by,
      sort_order,
      staff_id,
      beats_staff_id,
      query,
      page,
    } = activeFilters;

    if (!addBeatOpen && !activeFilters.id)
      dispatch(
        beatService(
          page,
          query,
          "",
          customer_id,
          staff_id || beats_staff_id,
          sort_by,
          sort_order
        )
      );
  }, [activeFilters]);

  useEffect(() => {
    if (getBeat.data && !getBeat.data.data.error)
      setBeatList(getBeat.data.data.data);
    if (
      (addBeat.data && !addBeat.data.data.error) ||
      (editBeat.data && !editBeat.data.data.error && !activeFilters.id)
    ) {
      setAddBeatOpen(false);
    }

    setLoading(false);
  }, [state]);

  useEffect(() => {
    if (!addBeatOpen) filterService.setFilters({ edit_id: "" });
  }, [addBeatOpen]);

  useEffect(() => {
    filterService.setEventListener(setActiveFilters);
  }, []);

  useEffect(() => {
    if (!window.location.search) {
      filterService.setFilters({ page: 1 });
    }
  }, [window.location.search]);

  return (
    <AdminLayout
      title="Beat List"
      search={{
        placeholder: "Search by beat name or city",
        searchValue: (data) => filterService.setFilters({ query: data }),
      }}
      panel={[
        <BeatFilters
          selectedValue={(data) => {
            filterService.setFilters({
              ...data,
              customer_id: data.customer_id?.id || "",
              customer_name: data.customer_id?.name || "",
              staff_id: data.staff_id?.id || "",
              staff_name: data.staff_id?.name || "",
            });
          }}
          value={activeFilters}
        />,
        <div
          className="button_primary"
          onClick={() => {
            setAddBeatOpen(true);
          }}
        >
          <img
            src={addIcon}
            alt="add"
            style={{ background: "#fff", borderRadius: "100%" }}
          />
          &nbsp; Beat
        </div>,
      ]}
    >
      <Table
        pagination={false}
        columns={beatTable}
        dataSource={beatList}
        scroll={{ y: 500 }}
      />
      <br />
      <br />
      <Paginator
        limiter={(beatList || []).length < 30}
        value={activeFilters["page"]}
        onChange={(i) => {
          filterService.setFilters({ page: i });
        }}
      />
      <AddEditBeatForm key={`edit-${addBeatOpen}`} />
      <BeatDetailsDrawer id={activeFilters.id} />
      {!activeFilters.id && (
        <ConfirmDelete
          title={"Beat"}
          open={deleteModalOpen}
          confirmValue={(data) => {
            handleDeleteCustomer(data);
          }}
        />
      )}
    </AdminLayout>
  );
}

import React, { useContext, useEffect, useState } from "react";
import { Dropdown, Table } from "antd";
import { Content } from "antd/es/layout/layout";
import { MoreOutlined } from "@ant-design/icons";
import { DeleteIcon, EditIcon } from "../../../assets/globle";
import AddCurrency from "./AddCurrency";
import SearchInput from "../../../components/search-bar/searchInput";
import Pagination from "../../../components/pagination/pagination";
import { Currency } from "../../../redux/action/currencyAction";
import ConfirmDelete from "../../../components/confirmModals/confirmDelete";
import Context from "../../../context/Context";

const CurrenciesComponent = () => {
  const [currenciesList, setCurrenciesList] = useState([]);
  const [rowData, setRowData] = useState({});
  const [search, setSearch] = useState("");

  const { setDeleteModalOpen } = useContext(Context);

  const [createModal, setCreateModal] = useState({
    open: false,
    data: null,
    isUpdate: false,
  });

  const columns = [
    {
      title: "Currency Name",
      key: "name",
      dataIndex: "name",
      render: (text, record) => (
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            color: "black",
            fontWeight: 600,
          }}
        >
          {text} ({record.currency_code})
        </div>
      ),
    },
    {
      title: "Symbol",
      key: "symbol",
      dataIndex: "symbol",
      render: (text, record) => (
        <div style={{ fontWeight: 600, color: "#000" }}>{text}</div>
      ),
    },
    {
      title: "Conversion Rate",
      key: "symbolcurrency_rate",
      dataIndex: "conversion_rate",
    },
    {
      title: " ",
      dataIndex: "operation",
      key: "operation",
      width: 50,
      render: (text, record) => (
        <div
          onMouseOver={() => {
            setRowData(record);
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
          onClick={() => {
            setCreateModal({ open: true, data: rowData, isUpdate: false });
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

  const callingListAPI = (search = "") => {
    Currency.fetchList(search)
      .then((res) => setCurrenciesList(res.data.data))
      .catch((err) => console.log(err));
  };

  const handleDeleteOrder = () => {
    Currency.deleteCurrency(rowData.id)
      .then((res) => callingListAPI())
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    callingListAPI(search);
  }, [createModal.isUpdate, search]);

  return (
    <div className="table_list position-rel">
      <Content
        style={{
          padding: "0px 24px",
          margin: 0,
          height: "82vh",
          background: "transparent",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 20,
            marginBottom: 20,
          }}
        >
          <SearchInput
            placeholder="Search Currency Name"
            searchValue={(data) =>
              setTimeout(() => {
                setSearch(data);
              }, 300)
            }
          />
          <button
            className="button_primary"
            onClick={() =>
              setCreateModal({ open: true, data: null, isUpdate: false })
            }
          >
            Add New Currency
          </button>
        </div>
        <div
          style={{
            width: "1050px",
            display: "flex",
            flexDirection: "column",
            minHeight: "70vh",
          }}
        >
          <Table
            pagination={false}
            columns={columns}
            dataSource={currenciesList}
            scroll={{ y: 500 }}
          />
          <br />
          <Pagination list={currenciesList} search={search} />
        </div>
      </Content>
      <AddCurrency {...{ createModal, setCreateModal }} />
      <ConfirmDelete
        title={"Currency"}
        confirmValue={(data) => {
          data && handleDeleteOrder();
        }}
      />
    </div>
  );
};

export default CurrenciesComponent;

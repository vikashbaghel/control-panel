import React, { useContext, useEffect, useState } from "react";
import { Content } from "antd/es/layout/layout";
import { theme, Button, Table, Input, Popconfirm, Space, Dropdown } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Context from "../../context/Context";
import {
  DeleteOutlined,
  CloseCircleTwoTone,
  EditOutlined,
} from "@ant-design/icons";
import CreateBeat from "../../components/viewDrawer/createBeat";
import { beatDeleteService, beatService } from "../../redux/action/beatAction";
import moment from "moment";
import EditBeat from "../../components/viewDrawer/editBeat";
import { DeleteIcon } from "../../assets/globle";

const BeatList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const context = useContext(Context);
  const state = useSelector((state) => state);
  const [apiData, setApiData] = useState([]);
  const [id, setId] = useState("");
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(false);

  const { setAddBeatOpen, setEditBeatData, setEditBeatOpen, editBeatData } =
    context;

  useEffect(() => {
    if (state.getBeat.data !== "") {
      if (state.getBeat.data.data.error === false)
        setApiData(state.getBeat.data.data.data);
    }
  }, [state]);

  const items = [
    {
      key: "2",
      label: (
        <div
          onClick={() => {
            setEditBeatOpen(true);
          }}
        >
          <EditOutlined style={style.icon_edit} /> Edit
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <Popconfirm
          title="Are You Sure, You want to Delete Staff ?"
          okText="Yes"
          placement="leftTop"
          style={{ width: "80px" }}
          onConfirm={() => {
            const deleteRequest = {
              id: id,
              is_forced: true,
            };
            dispatch(beatDeleteService(deleteRequest));
            dispatch(beatService());
          }}
        >
          <img src={DeleteIcon} alt={"delete"} style={style.icon_delete} />
          Delete
        </Popconfirm>
      ),
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Created By",
      dataIndex: "created_by_name",
      key: "name",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      render: (text) => {
        return <div>{moment(text).format("DD-MMM-YYYY, hh:mm a")}</div>;
      },
    },
    {
      title: "Action",
      dataIndex: "operation",
      key: "operation",
      align: "center",
      render: (text, record) => (
        <Space
          size="middle"
          direction="horizontal"
          style={{ width: "100%", justifyContent: "center" }}
          onClick={() => {
            setEditBeatData(record);
            setId(record.id);
          }}
        >
          <Dropdown
            menu={{
              items,
            }}
          >
            <a style={{ color: "black" }}>...</a>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    dispatch(beatService(pageCount));
  }, [pageCount]);

  //pagination handle page count plus
  const handleAdd = () => {
    setPageCount(pageCount + 1);
  };

  //pagination handle page count plus
  const handleRemove = () => {
    if (pageCount === 1) {
      return;
    }
    setPageCount(pageCount - 1);
  };

  return (
    <>
      <div>
        <h2 className="page_title">
          Beat List
          <div className="breadcrumb">
            <span onClick={() => navigator("/web")}>Home </span>
            <span onClick={() => navigate("/web/beat")}> / beat-list</span>
          </div>
        </h2>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: "82vh",
            background: colorBgContainer,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <div>
              {/* <div style={{ height: "50px" }}>
                  <Search
                    placeholder="Search Product Unit"
                    size="large"
                    onSearch={onSearch}
                    allowclear={{
                      clearIcon: <CloseCircleTwoTone twoToneColor="red" />,
                    }}
                  />
                </div> */}
            </div>
            <Button type="primary" onClick={() => setAddBeatOpen(true)}>
              Create Beat
            </Button>
          </div>

          <Table
            dataSource={apiData !== "" ? apiData : ""}
            columns={columns}
            pagination={false}
          />
          <CreateBeat />
          <EditBeat id={id} />
        </Content>
        <br />
        <div style={{ display: "flex", justifyContent: "end" }}>
          <Button
            disabled={pageCount === 1 ? true : false}
            type="primary"
            onClick={() => {
              handleRemove();
              setLoading(true);
            }}
          >
            {"<"}
          </Button>
          <Button style={{ marginLeft: "5px", marginRight: "5px" }}>
            {pageCount}
          </Button>
          <Button
            type="primary"
            disabled={apiData.length < 30 ? true : false}
            onClick={() => {
              handleAdd();
              setLoading(true);
            }}
          >
            {">"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default BeatList;

const style = {
  icon_edit: {
    color: "green",
    cursor: "pointer",
    fontSize: 15,
  },
  icon_delete: {
    color: "red",
    cursor: "pointer",
    fontSize: 15,
  },
};

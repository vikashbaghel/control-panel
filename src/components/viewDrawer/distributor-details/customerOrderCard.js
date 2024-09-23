import React, { useContext, useState } from "react";
import { EllipsisOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Card, Col, Descriptions, Dropdown, Row, Space } from "antd";
import UpdateStatus from "../../statusUpdate/updateStatus";
import moment from "moment";
import { ViewDetails } from "../../../assets";
import { DeleteIcon, EditIcon } from "../../../assets/globle";
import { useNavigate } from "react-router-dom";
import Context from "../../../context/Context";
import { handleEditOder } from "../../../helpers/globalFunction";
import Permissions from "../../../helpers/permissions";
import ConfirmDelete from "../../confirmModals/confirmDelete";
import { deleteOrder } from "../../../redux/action/orderAction";
import { useDispatch } from "react-redux";

const CustomerOrderCard = ({ data, callBack }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const context = useContext(Context);
  const { setDeleteModalOpen, setLoading, setAttendanceModalAction } = context;

  let viewOrderPermission = Permissions("VIEW_ORDER");
  let createOrderPermission = Permissions("CREATE_ORDER");
  let orderStatusUpdatePermission = Permissions("ORDER_STATUS_UPDATE");
  let editOrderPermission = Permissions("EDIT_ORDER");
  let dispatchOrderPermission = Permissions("DISPATCH_ORDER");
  let deleteOrderPermission = Permissions("DELETE_ORDER");

  const getStaffName = (data) => {
    const staff = data.created_by || {};
    if (staff) {
      return `${staff.first_name || ""} ${staff.last_name || ""}`;
    } else return "";
  };

  const items = [
    {
      key: "1",
      label: (
        <div
          onClick={() => navigate(`/web/order/order-details?id=${data.id}`)}
          className="action-dropdown-list"
        >
          <img src={ViewDetails} alt="view" />
          View Details
        </div>
      ),
    },
    data.delivery_status === "Approved" ||
    data.delivery_status === "Received" ||
    data.delivery_status === "Processing"
      ? editOrderPermission && {
          key: "3",
          label: (
            <div
              onClick={() => {
                setAttendanceModalAction({
                  open: true,
                  handleAction: () => {
                    handleEditOder(data, () =>
                      navigate(
                        `/web/order/update-order/?getOrder=${data.id}${
                          data.customer
                            ? `&name=${data.customer.name}&id=${data.customer.id}`
                            : ""
                        }`
                      )
                    );
                  },
                });
              }}
              className="action-dropdown-list"
            >
              <img src={EditIcon} alt="edit" /> Edit
            </div>
          ),
        }
      : null,
    deleteOrderPermission && {
      key: "4",
      label: (
        <div>
          <div
            onClick={() => setDeleteModal(true)}
            className="action-dropdown-list"
          >
            <img src={DeleteIcon} alt="delete" /> <span>Delete</span>
          </div>
        </div>
      ),
    },
  ];

  const handleDeleteCustomer = () => {
    if (data) {
      let apiData = { is_archived: true };
      dispatch(deleteOrder(apiData, data.id));
      setTimeout(() => {
        callBack();
      }, 500);
    }
  };

  const [deleteModal, setDeleteModal] = useState(false);

  return (
    <Card className="app-card-layout fadeIn" size="small">
      <Col style={{ margin: 4 }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Row justify="space-between">
            <Col>
              <Space size={"middle"}>
                <Avatar shape="circle" size={44} src={data.user_image_url}>
                  <UserOutlined />
                </Avatar>
                <Col>
                  <h3 style={styles.heading}>{data.order_id}</h3>
                  <div style={styles.subheading}>{getStaffName(data)}</div>
                </Col>
              </Space>
            </Col>
            <Col>
              <Dropdown
                menu={{
                  items,
                }}
                className="action-dropdown"
              >
                <div className="clickable">
                  <EllipsisOutlined style={{ fontSize: 22 }} />
                </div>
              </Dropdown>
            </Col>
          </Row>
          <div />
          <h4 style={{ margin: 0 }}>₹{data.total_amount}</h4>
          <Descriptions
            size="small"
            column={1}
            contentStyle={{ display: "flex", justifyContent: "flex-end" }}
            colon={false}
          >
            <Descriptions.Item label="Created Date">
              {!!data.created_at &&
                moment(data.created_at).format("DD MMM YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Expected Delivery Date">
              {data.expected_delivery_date
                ? moment(data.expected_delivery_date).format("DD MMM YYYY")
                : "N/A"}
            </Descriptions.Item>
          </Descriptions>
          <UpdateStatus
            record={data}
            filters={{ customer_id: data.id }}
            block
          />
        </Space>
      </Col>
      <ConfirmDelete
        {...{ deleteModal, setDeleteModal }}
        title={"Order"}
        confirmValue={(data) => {
          handleDeleteCustomer(data);
        }}
      />
    </Card>
  );
};

const styles = {
  heading: {
    margin: 0,
  },
  subheading: {
    margin: 0,
    color: "#727176",
    fontSize: 12,
    fontWeight: "500",
  },
};

export default CustomerOrderCard;

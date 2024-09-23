import { useNavigate } from "react-router";
import OrderRoutes from "../../routes/orderRoutes";
import { ArrowLeftOutlined } from "@ant-design/icons";

const Order = () => {
  const navigate = useNavigate();
  let pathName = window.location.pathname;

  return (
    <div>
      {pathName === "/web/order/shipped-order" && (
        <>
          <h4
            className="page_title"
            style={{ width: "67%", margin: "20px auto", scale: "0.8" }}
          >
            <ArrowLeftOutlined
              className="clickable"
              onClick={() => navigate("/web/order/order-list")}
            />
            &nbsp;&nbsp;&nbsp; Shipped Order List
          </h4>
        </>
      )}

      <OrderRoutes />
    </div>
  );
};

export default Order;

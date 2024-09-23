import React from "react";
import { Route, Routes } from "react-router-dom";
import ShippedOrder from "../components/shippedOrder";
import OrderView from "../components/viewDrawer/orderView";
import Order from "../views/order/order";

const OrderRoutes = () => {
  return (
    <Routes>
      <Route path="/order-list" element={<Order />} />
      <Route path="/order-view" element={<OrderView />} />
      <Route path="/shipped-order" element={<ShippedOrder />} />
    </Routes>
  );
};

export default OrderRoutes;

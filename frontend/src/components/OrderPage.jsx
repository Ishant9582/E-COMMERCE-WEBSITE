import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../redux/orderSlice";
const OrderPage = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.items);
  console.log(orders);
  console.log("orders", orders);
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Order History</h1>
      {orders.map((order) => (
        <div
          key={order._id}
          className={`bg-white shadow-md rounded-md p-4 mb-2 border-l-4 ${
            order.status === "Payment Successful"
              ? "border-green-500"
              : "border-red-500"
          }`}
        >
          <h2>Order ID: {order._id}</h2>
          <p>Total Amount: ${order.totalAmount}</p>
          <p>
            Status:{" "}
            <span
              className={
                order.status === "Payment Successful"
                  ? "text-green-600 font-semibold"
                  : "text-red-600 font-semibold"
              }
            >
              {order.status}
            </span>
          </p>
          <p>ordered at : {order.createdAt}</p>
        </div>
      ))}
    </div>
  );
};

export default OrderPage;

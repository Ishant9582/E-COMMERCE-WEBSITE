import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../redux/orderSlice";

export default function Product({ totalPrice, receiptId, cart, user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const paymenthandler = async (e) => {
    e.preventDefault();

    const amount = totalPrice * 100;
    const currency = "INR";

    const response = await fetch("http://localhost:3000/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency,
        receipt: receiptId,
        payment_capture: 1,
      }),
    });

    const order = await response.json();

    const options = {
      key: "rzp_test_Wv0PgCtFcNlxHI",
      amount,
      currency,
      name: "Acme Corp",
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: order.id,
      handler: async function (response) {
        try {
          const validateRes = await fetch("http://localhost:3000/order/validate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(response),
          });

          const jsonRes = await validateRes.json();
          const message = "Payment Successful";
          dispatch(placeOrder({
            items: cart.map(item => ({
              menuItem: item._id,
              quantity: item.quantity,
            })),
            status: message,
          }));

          navigate("/orders");
        } catch (err) {
          alert("Something went wrong while validating payment.");
          dispatch(placeOrder({
            items: cart.map(item => ({
              menuItem: item._id,
              quantity: item.quantity,
            })),
            status: "Payment validation error",
          }));
          navigate("/orders");
        }
      },
      prefill: {
        name: "Oi",
        email: "gaurav.kumar@example.com",
        contact: "9315745437",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp1 = new window.Razorpay(options);

    rzp1.on("payment.failed", function (response) {
      const message = "Payment Failed";
      dispatch(placeOrder({
        items: cart.map(item => ({
          menuItem: item._id,
          quantity: item.quantity,
        })),
        status: message,
      }));

      navigate("/orders");
    });

    rzp1.open();
  };

return (
    <div className="flex justify-center mt-8">
        <button
            onClick={paymenthandler}
            type="button"
            className="px-8 py-3 text-lg rounded-full bg-gradient-to-r from-[#3399cc] to-[#66ccff] border-none shadow-lg text-white font-bold transition-all duration-300 hover:from-[#66ccff] hover:to-[#3399cc] focus:outline-none"
        >
            Pay Now
        </button>
    </div>
);
}

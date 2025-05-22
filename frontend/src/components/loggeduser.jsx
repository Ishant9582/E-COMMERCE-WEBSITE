import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

const User = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // useEffect(() => {
  //   dispatch(fetchMenu());
  // }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Details</h1>
      {user && (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Logged-in User</h2>
          <p><strong>Name:</strong> {user.username}</p>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2">
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default User;

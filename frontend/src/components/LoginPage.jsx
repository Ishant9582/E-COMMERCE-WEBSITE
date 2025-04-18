import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data));
    if (result.payload) navigate("/menu");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 bg-white shadow-md rounded-md w-80"
      >
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input
          {...register("username")}
          className="w-full mb-2 p-2 border rounded"
          placeholder="Username"
        />
        <input
          {...register("password")}
          type="password"
          className="w-full mb-2 p-2 border rounded"
          placeholder="Password"
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;

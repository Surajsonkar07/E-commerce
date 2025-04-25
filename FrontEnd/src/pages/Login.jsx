import React, { useState } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Login = () => {
  const [formData,setFormData]=useState({
    email: "",
    password: "",
  });
 const handleChange=(e)=>{
  setFormData({...formData,[e.target.name]:e.target.value})
 }

 const submitHandler=(e)=>{
   e.preventDefault()
   console.log(formData)
 }


  return (
    <div className=" flex flex-col px-10 shadow-2xl mb-5 rounded-2xl bg-yellow-50 md:flex-row gap-10 justify-around items-center  ">
      <div className="my-5">
        <img src={assets.login_image} alt=""  className="    rounded-2xl"/>
      </div>
      <div className="w-full flex flex-col items-center   h-[25rem] max-sm:mt-2  mt-16">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
          <p className="text-base text-gray-600 mt-2 ml-2">
            Enter your details below
          </p>
        </div>
        <form onSubmit={submitHandler} className="my-8 flex flex-col gap-5">
         
          <div className="flex flex-col  ">
            <label className="ml-4">Email</label>
            <input
              type="email"
              className="px-6 py-2 rounded-3xl w-[20rem] outline-none border border-black"
              placeholder="Your email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col  ">
            <label className="ml-4">Password</label>
            <input
              type="password"
              className="px-6 py-2 rounded-3xl w-[20rem] outline-none border border-black"
              placeholder="Your password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button className="bg-red-500 text-white px-6 py-2 rounded-3xl w-[20rem]">
            Login
          </button>
          <Link to="/signup">
            Don't have an account?
            <span className="text-blue-500"> Signup Here</span>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;

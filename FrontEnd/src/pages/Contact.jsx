import React from "react";
import { assets } from "../assets/assets";

const Contact = () => {
  return (
    <div className="flex mb-5  max-sm:flex-col items-center justify-between gap-5 mx-5">
      <div className="w-full shadow-2xl py-13 md:w-1/2 flex flex-col items-center justify-center gap-4">
        <div
          className="flex
         gap-3 itencenter justify-center"
        >
          <img src={assets.call} alt="" />
          <h2 className="text-3xl font-semibold text-gray-800">Call To Use</h2>
        </div>
        <p className="text-lg font-medium">
          We Are available 24/7, 7days a week
        </p>
        <p className="text-lg font-medium">Phone: +8801828983863979</p>
        <hr className="h-2 w-[90%]" />

        <div
          className="flex
         gap-3 itencenter justify-center"
        >
          <img src={assets.message} alt="" />
          <h2 className="text-3xl font-semibold text-gray-800">Call To Use</h2>
        </div>
        <p className="text-lg font-medium">
          We Are available 24/7, 7days a week
        </p>
        <p className="text-lg font-medium">Phone: +8801828983863979</p>
      </div>
      <div className="w-full shadow-xl rounded-lg my-3 md:w-1/2 flex flex-col items-center justify-center gap-4 bg-pink-200 h-[400px]">
        <h1 className="text-3xl font-semibold">Enter Deatils</h1>
        <form
          action=""
          className="max-w-md mx-auto w-full flex flex-col gap-3 px-2"
        >
          <div className="flex flex-col">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="outline-none  rounded-3xl bg-white bborder border-gray-200 px-8 py-2"
            />
          </div>{" "}
          <div className="flex flex-col">
            <label>Email</label>
            <input
              type="text"
              placeholder="Enter your email"
              className="outline-none rounded-3xl bg-white bborder border-gray-200 px-8 py-2"
            />
          </div>{" "}
          <div className="flex flex-col">
            <label>Phone</label>
            <input
              type="text"
              placeholder="Enter your phone number"
              className="outline-none  rounded-3xl bg-white bborder border-gray-200 px-8 py-2"
            />
          </div>
          <div>
          <label>Ask your Question</label>
            <textarea name="" placeholder="write here" className="outline-none  rounded-3xl bg-white bborder w-full border-gray-200 px-8 py-2"
           id=""></textarea>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;

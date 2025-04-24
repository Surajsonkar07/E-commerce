import React from "react";
import { assets, newArrivalData } from "../assets/assets";

const NewArrival = () => {
  return (
    <div className=" my-12 w-full">
      <p className="text-red-500 text-center ml-5 font font-semibold text-5xl">
        Featured
      </p>
      <h2
        className=" text-center text-xl font-semibold md:text-start md:text-3xl
md:font-bold text-gray-800 mt-3"
      >
        New Arrival
      </h2>
      <div className="flex flex-col gap-5 md:flex-row px-2 items-center justify-around my-8">
        <div className="">
          <img
            src={assets.new_arrival_left}
            className="w-full h-[400px] "
            alt=""
          />
        </div>
        <div className="">
          <h2 className="text-3xl fontbold text-gray-800 mb-8">
            Our New Collection Arrived
          </h2>
          <img src={assets.new_arrival_right} alt="" />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-5 justify-center items-center w-full h-auto p-5">
        {newArrivalData.map((item) => (
          <div key={item.id} className="flex flex-col gap-2 items-center justify-center">
            <img src={item.image} alt="" />
            <h4 className="text-xl font-normal text-gray-800">{item.text}</h4>
            <p className=" text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewArrival;

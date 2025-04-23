import React from "react";
import { categories } from "../assets/assets";

const Categories = () => {
  return (
    <div className=" my-12 w-full">
      <p className="text-red-500 ml-5 text-center font-semibold text-5xl">Categories</p>
      <h2
        className=" text-center text-xl font-semibold md:text-start md:text-3xl
md:font-bold text-gray-800 mt-3"
      >Browse By Categories</h2>
      <div className="my-6 flex flex-wrap justify-center items-center gap-10">{categories.map((item)=>{
        return (
          <div key={item.id} className=" border-2 border-gray-100 p-6  rounded-md cursor-pointer hover:bg-pink-200 duration-300">
            <img src={item.image} className=" mx-auto" alt={item.name} />
            <p className="text-center text-sm font-semibold text-gray-600">{item.name}</p>
          </div>
        )
      })}</div>
    </div>
  );
};

export default Categories;

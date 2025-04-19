import React from "react";
import { assets } from "../assets/assets";

const Hero = () => {
  return (
    <div className="bg-black w-full mt-2 mx-auto flex flex-col md:flex-row  justify-between items-center h-[35rem] ">
      <div className="text-white items-center justify-center flex flex-col gap-4 p-10 w-[50%]">
        <div className="flex flex-col gap-4 items-center justify-center">
          <h1 className=" text-5xl font-bold">
            UP to 10%
            <br />
            off Voucher
          </h1>
        </div>
        <div className="flex gap-3">
          <button className="text-xl">Buy Now</button>{" "}
          <img src={assets.right_arrow} alt="" />
        </div>
      </div>
      <div className="w-[50%]">
        <img src={assets.hero} alt="" />
      </div>
    </div>
  );
};

export default Hero;

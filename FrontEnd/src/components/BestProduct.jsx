import React from "react";
import { assets, BestProducts } from "../assets/assets";
import SingalProduct from "./SingalProduct";

const BestProduct = () => {
  return (
    <div className=" my-12 w-full">
      <p className="text-red-500 text-center font-semibold text-5xl">
        This month
      </p>
      <h2
        className=" text-center text-xl font-semibold md:text-start md:text-3xl
        md:font-bold text-gray-800 mt-3">Best Selling Product</h2>
         <div className=" flex gap-2 flex-wrap justify-center items-center w-full h-auto p-5">
        {BestProducts.map((product) => {
          return (
            <SingalProduct
              key={product.id}
              image={product.image}
              name={product.name}
              oldPrice={product.oldPrice}
              newPrice={product.newPrice}
              rating={product.rating}
              number={product.number}
              discount={product.discount}
              descriptaion={product.description}
            />
          );
        })}
      </div>
      <div className="my-12 flex items-center justify-center">
        <img src={assets.category} alt="" />
      </div>
   
   
   
    </div>
  );
};

export default BestProduct;

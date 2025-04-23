import React from "react";
import { latestProducts } from "../assets/assets";
import SingalProduct from "./SingalProduct";

const LatestProduct = () => {
  return (
    <div className=" my-12 w-full mx-auto">
      <p className=" text-red-500 font-semibold text-5xl text-center">Today's </p>
      <h2 className="text-center ml-5 text-xl font-semibold md:text-start md:text-3xl">
        Flash Sales
      </h2>
      <div className=" flex gap-2 flex-wrap justify-center items-center w-full h-auto p-5">
        {latestProducts.map((product) => {
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
    </div>
  );
};

export default LatestProduct;

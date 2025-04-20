import React from "react";
import { latestProducts } from "../assets/assets";
import SingalProduct from "./SingalProduct";

const LatestProduct = () => {
  return (
    <div>
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
  );
};

export default LatestProduct;

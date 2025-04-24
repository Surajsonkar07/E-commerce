import React from 'react'
import Hero from '../components/Hero'
import LatestProduct from '../components/latestProduct'
import Categories from '../components/Categories'
import BestProduct from '../components/BestProduct'
import Product from '../components/Product'
import NewArrival from '../components/NewArrival'

const Home = () => {
  return (
    <div>
      <Hero/>
      <LatestProduct/>
      <Categories/>
      <BestProduct/>
      <Product/>
      <NewArrival/>


    </div>
  )
}

export default Home

"use client"

// import Image from "next/image";
import React, { useState } from 'react';
import Landing from './landing'
import Startup from './startup'

const Home: React.FC = () => {
  const [animationFinished, setAnimationFinished] = useState(false);

const animationTimeout = setTimeout(() => {
  setAnimationFinished(true);
}, 4400);

  return (
    <>
    {animationFinished ? <Landing/> : <Startup/>}
    </>
  );
};





export default Home
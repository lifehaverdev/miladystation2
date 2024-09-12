'use client'

import React, { useState } from 'react';
import Image from 'next/image'

interface WorkspaceProps {
    publicKey: string | null;
}

const Workspace = ({publicKey}:WorkspaceProps) => {
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);

  return (
    <>
    {/* <Header/> */}
    <div className="container mx-auto px-4 sm:px-6 lg:px-5">
    <div className="flex h-20">
        <h1 className="text-white text-center text-7xl">Stationthisbot online</h1>
    </div>
    <div className="flex flex-col md:flex-row h-screen bg-black">
      {/* Left Sidebar (Image Gallery) */}
      <div className={`md:w-1/6 w-full h-1/4 md:h-full bg-gray-800 p-4 flex flex-col items-center space-y-4 
                       ${showLeftPanel ? 'block' : 'hidden'} md:block`}>
        {/* Example Image Thumbnails */}
        <h1 className={'text-white text-center'}>History</h1>
        <div className="w-16 h-16 bg-gray-600 rounded-lg"></div>
        <div className="w-16 h-16 bg-gray-600 rounded-lg"></div>
        <div className="w-16 h-16 bg-gray-600 rounded-lg"></div>
      </div>

      {/* Center Panel (Main Workspace) */}
      <div className="md:w-4/6 w-full h-1/2 md:h-full bg-gray-900 p-4 relative">
        {/* Placeholder for Main Content (Image) */}
        <div className="w-full h-4/5 bg-blue-500 rounded-lg"></div>

        {/* Text Input and Button (Bottom Section) */}
        <div className="mt-4 flex items-center">
          <input
            className="w-3/4 bg-gray-700 text-white p-2 rounded-lg"
            placeholder="Enter text here"
          />
          <button className="ml-4 bg-blue-500 text-white p-2 rounded-lg">Submit</button>
        </div>

        {/* Star Icon */}
        <div className="absolute top-4 right-4">
            <Image
                src="/images/botstar.png"
                height={200}
                width={200}
                alt="special star"
            />
        </div>
      </div>

      {/* Right Sidebar (Control Panel) */}
      <div className={`md:w-1/6 w-full h-1/4 md:h-full bg-gray-800 p-4 flex flex-col space-y-4 
                       ${showRightPanel ? 'block' : 'hidden'} md:block`}>
        {/* Example Sliders */}
        <h1 className={'text-white text-center'}>Settings</h1>
        <div className="flex items-center">
          <span className="text-white">CFG</span>
          <input type="range" className="ml-2 w-full bg-blue-500" />
        </div>
        <div className="flex items-center">
          <span className="text-white">Strength</span>
          <input type="range" className="ml-2 w-full bg-blue-500" />
        </div>
        <div className="flex items-center">
          <span className="text-white">Steps</span>
          <input type="range" className="ml-2 w-full bg-blue-500" />
        </div>
        <div className="flex items-center">
          <span className="text-white">Size</span>
          <input type="number" value="1024" className="ml-2 w-full bg-blue-500" />
          <input type="number" value="1024" className="ml-2 w-full bg-blue-500" />
        </div>
        <div className="flex items-center">
          <span className="text-white">Seed</span>
          <input type="number" value="-1" className="ml-2 w-full bg-blue-500" />
        </div>
        <div className="flex items-center">
          <span className="text-white">Negative Prompt</span>
          <input type="text" className="ml-2 w-full bg-blue-500" />
        </div>
        <div className="flex items-center">
          <span className="text-white">Base Prompt</span>
          <input type="text" className="ml-2 w-full bg-blue-500" />
        </div>
        <div className="flex items-center">
          <span className="text-white">Batch</span>
          <input type="number" className="ml-2 w-full bg-blue-500" />
        </div>
        
      </div>

      {/* Buttons to show/hide sidebars on mobile */}
      <div className="md:hidden flex justify-between p-4 bg-gray-900">
        <button
          className="bg-blue-500 text-white p-2 rounded-lg"
          onClick={() => setShowLeftPanel(!showLeftPanel)}
        >
          History
        </button>
        <button
          className="bg-blue-500 text-white p-2 rounded-lg"
          onClick={() => setShowRightPanel(!showRightPanel)}
        >
          Settings
        </button>
      </div>
    </div>
    </div>
    </>
  );
};

export default Workspace;
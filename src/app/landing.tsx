import Header from '../components/header'
import Circles from '../components/circle';
// import '../globals.css'
import { useState } from 'react';

const Landing = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const handleOptionClick = (option:string) => {
    setIsTransitioning(true);
    setTimeout(() => {
    setSelectedOption(option);
    setIsTransitioning(false);
    }, 500); // Adjust the timeout duration as needed
  };

  return (
    <>
      {/* <div className={`transition-colors duration-500 ${isTransitioning ? 'bg-white' : 'bg-transparent'}`}> */}
      <div className="flex flex-col max-h-screen">
      <div className={`transition-colors duration-500 ${isTransitioning ? 'bg-white' : selectedOption === 'miladystation2' ? 'bg-black' : selectedOption === null ? '' : 'bg-white'}`}>
        <Header navigation={[
          {name: '$MS2 on SOL', href:"#"},
          {name: '$MONY on ETH', href:"#"}
        ]}/>
        {isTransitioning || selectedOption === null || selectedOption === 'miladystation2' ? (
            <>
          <LandingContent selectedOption={selectedOption} handleOptionClick={handleOptionClick}/>
          <Circles/>
          </>
        ) : (
          <StationThisBotContent />
        )}
        
      </div>
      </div>
    </>
  );
}

function LandingContent({ selectedOption, handleOptionClick }: { selectedOption: string | null, handleOptionClick: (option: string) => void }) {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen">
        <div className="absolute left-1/2 top-1/4 transform -translate-x-1/2 py-1 px-6 text-lg text-white cursor-pointer transition-colors duration-300 ">
          <p onClick={(e: React.MouseEvent<HTMLParagraphElement>) => handleOptionClick("stationthis")} className="text-shadow-white hover:text-blue-600 hover:text-shadow-sm">stationthis $MS2 </p>
        </div>
        <div className="absolute left-1/2 top-1/5 transform -translate-x-1/2 py-1 px-6 text-lg text-white cursor-pointer text-shadow-white transition-colors duration-300 hover:text-blue-600 hover:text-shadow-sm">
          <p onClick={(e: React.MouseEvent<HTMLParagraphElement>) => handleOptionClick("miladystation2")} className="text-shadow-white hover:text-blue-600 hover:text-shadow-sm">miladystation2 $MONY</p>
        </div>
    </div>
  );
}

const StationThisBotContent = () => {
  const handleOpenLink = (link:string) => {
    window.open(link, '_blank'); // Replace 'https://www.example.com' with your link
  };
  return (
    <div className="bg-white overflow-auto max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Power Up Your Posts
      </h1>
      <h3 className="text-2xl text-gray-700">
        Your Secret Weapon for Nuclear AI Power on ANY Device
      </h3>
      <br/>
    <p className="text-base text-gray-700 mb-4">
      Dive into the avant-garde net-art crucible on the new internet equipped with MS2—a project born from the bastard love child of artificial intelligence and the blockchain. Our mission? To redefine accessibility, empower creativity, and put you on a no fly list with the bomb threat level quality of your digital expression.
    </p>

    <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">The only Degen-Utility Technology Coin on Solana</h2>
    <p className="text-base text-gray-700 mb-4">
      Send your online engagement to Wuhan labs for an epidemically engineered virality upgrade. The MS2 coin isn’t just an asset; it’s your access card to a fully functioning computer vision art studio where your ideas can be transformed into reality with ease. By investing in MS2, you’re not just buying a cryptocurrency—you’re securing a stake in a burgeoning ecosystem where digital art and AI-driven services converge on your command.
    </p>

    <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Telegram is the New Command Line</h2>
    <p className="text-base text-gray-700 mb-4">
      Zoomers don’t know how to fuckin code, but I’ll be damned if they can’t come up with retarded ass memes. With MS2, Telegram evolves into your personal command line fiver rugcore artist army. Engage with our intuitive bot to leverage Stable Diffusion’s capabilities directly from your smartphone—no coding required. Seamlessly transform your thoughts into visual art, engage with uncensored language models, and even sculpt entire NFT collections.
    </p>
    <button
        type="button"
        className="rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={()=>{handleOpenLink('https://t.me/MONYGROUPPORTAL')}}
      >
        Join the Alpha Group
      </button>

    <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Get in now or cope forever</h2>
    <p className="text-base text-gray-700 mb-4">
      Left curve - right curve unite! Retards love us, Topwits want to build with us. Midwits will miss out on generational wealth AGAIN. StationThisBot (powered by $MS2) is currently operational and brimming with potential, shipping features DAILY that will redefine user interaction:
    </p>
      <ul className="list-disc pl-5 mb-4">
        <li>Advanced ComfyUI workflows for seamless creation</li>
        <li>NFT collection creation mode—turn your visions into valuable assets</li>
        <li>Uncensored LLM access for unbridled creative exploration</li>
        <li>Full Stable Diffusion functionality: inpainting, outpainting, upscaling, and more</li>
      </ul>
      <p className="text-base text-gray-700 mb-4">
      By investing early in MS2 coins, you are making large amounts of profit. Experts say 10M market cap in 2 hours from now.
      </p>
      <button
        type="button"
        className="rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={()=>{handleOpenLink('https://www.dextools.io/app/en/solana/pair-explorer/3gwq3YqeBqgtSu1b3pAwdEsWc4jiLT8VpMEbBNY5cqkp?t=1714358138680')}}
      >
        Check the Chart
      </button>

    <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Exclusivity and Utility: The Investor’s Edge</h2>
    <p className="text-base text-gray-700 mb-4">
      Holders of MS2 coins will find their wallets unlocking new realms of possibility. Our tiered feature access ensures that the more you invest, the more the platform evolves to serve you. High-token wallets gain exclusive access to premium features, enhancing both your creative capabilities and investment portfolio. The cabal group chat she tells you not to worry about will be pumping coins with jet fuel tech access while you and your friends use photoshop lasso tool to put nft pictures on marvel super heros. GET FUCKED 
    </p>
    <button
        type="button"
        className="rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={()=>{handleOpenLink('https://jup.ag/swap/SOL-AbktLHcNzEoZc9qfVgNaQhJbqDTEmLwsARY7JcTndsPg')}}
      >
        Buy MS2 NOW
      </button>
    

    <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Beyond the Coin: A Vision for B2B Expansion</h2>
    <p className="text-base text-gray-700 mb-4">
      The horizon promises more than just individual empowerment. MS2 is poised to become a pivotal B2B conduit in the digital art and AI space. Your investment today does more than secure technology—it paves the way for a sustainable revenue model that’s as innovative as the technology it supports.
    </p>

    <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Join the MS2 Movement</h2>
    <p className="text-base text-gray-700 mb-4">
      Don’t let the future pass you by. Embrace the MS2 project and join a community that’s setting the pace for digital and financial innovation. Invest in MS2 coin today and place yourself on the cutting edge of the next digital explosion.
    </p>
  </div>
  );
};


export default Landing
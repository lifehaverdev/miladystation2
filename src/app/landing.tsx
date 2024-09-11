import Header from '../components/header'
import Circles from '../components/circle';
import Socials from '../components/socials';
import Image from 'next/image';
// import '../globals.css'
import { useState } from 'react';

const timeline = [
  {
    name: 'Launched MS2 on Pump.fun',
    description:
      '10% airdropped to Miladystation holders. 50% in the hands of true believers today.',
    date: 'April 9th',
    dateTime: '2024-04',
  },
  {
    name: 'Shipped stationthisbot v1 on telegram',
    description:
      'The bot has been battle tested by our ms2-heads. You must try it NOW',
    date: 'April 13th',
    dateTime: '2024-04',
  },
  {
    name: 'First img2vid flow: ms3',
    description:
      'First pass at an image to video workflow',
    date: 'June 17th',
    dateTime: '2024-06',
  },
  {
    name: 'Cloud hosted bot',
    description: 
    'Scalable, Clonable, comfyui backend more capabilit',
    date: 'July 11th',
    dateTime: '2024-07'
  },
  {
    name: 'Added SD3',
    description: 
    'Stable Diffusion 3 kinda blows but we had it as soon as it dropped',
    date: 'July 29th',
    dateTime: '2024-07'
  },
  {
    name: 'Petravoice custom Lora',
    description: 'one of many publically released custom loras trained personally by dev',
    date: 'August 7th',
    dateTime: '2024-08'
  },
  {
    name: 'UI OVERHAUL',
    description: 'dev made bot better, (after making it worse)',
    date: 'August 10th',
    dateTime: '2024-08'
  },
  {
    name: 'GROUPCHAT SHIPPED',
    description: 'sponsor your groupchat so they dont have to buy ms2',
    date: 'September 1st',
    dateTime: '2024-09'
  }
]

const features = [
  {
    id: 1,
    name: 'Custom Trained Lora',
    description:'Seamless creation. We are constantly shipping additional features with the help of a braod library of comfyui workflows. Anything is possible.',
    expectedMC:'$250 worth of MS2 Burned'
  },
  {
    id: 2,
    name: 'stationthisbot Clone',
    description: 'Same power, different name, work with us to create your perfect SD bot',
    expectedMC: 'TBD'
  },
  {
    id: 3,
    name: 'NFT Collection Creation Mode',
    description: 'Turn your visions into valuable assets on the blockchain right from your phone.',
    expectedMC:'TBD'
  },
  {
    id: 4,
    name: 'Uncencored LLM Access',
    description: 'Unbridled Creative Exploration and Efficient Assistance. Throw off the yoke of BIG AI gay censorship.',
    expectedMC: 'TBD'
  },
  // {
  //   id: 4,
  //   name: 'Full Stable Diffusion Functionality',
  //   description: 'Inpainting, outpainting, upscaling, and more. If nerds can do it on their fancy gaming desktop computers, you can do it from your telegram chats',
  //   expectedMC: '1000000000000000,0000000,00000000 MS2'
  // }
]

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
      <div className={`transition-colors duration-500 ${isTransitioning ? 'bg-white text-grey-500' : selectedOption === 'miladystation2' ? 'bg-black' : selectedOption === null ? '' : 'bg-white text-grey-500'}`}>
        {/* <div className={selectedOption == 'stationthisbot' ? 'text-grey-500' : ''}> */}
        <Header  navigation={[
          {name: 'Buy $MS2 on SOL', href:"https://jup.ag/swap/SOL-AbktLHcNzEoZc9qfVgNaQhJbqDTEmLwsARY7JcTndsPg"},
          {name: 'See $MS2 chart', href:"https://www.dextools.io/app/en/solana/pair-explorer/3gwq3YqeBqgtSu1b3pAwdEsWc4jiLT8VpMEbBNY5cqkp?t=1714358138680"},
          {name: 'Join the Telegram', href:"https://t.me/STATIONTHIS"},
          // {name: '$MONY on ETH', href:"#"}
        ]}/>
        {/* </div> */}
        {isTransitioning || selectedOption === null || selectedOption === 'miladystation2' ? (
            <>
          <LandingContent selectedOption={selectedOption} handleOptionClick={handleOptionClick}/>
          <Circles/>
          </>
        ) : (
          <>
          <StationThisBotContent />
          <Socials />
          </>
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
          <p onClick={(e: React.MouseEvent<HTMLParagraphElement>) => handleOptionClick("miladystation2")} className="text-shadow-white hover:text-blue-600 hover:text-shadow-sm">🚧😳🤐😼🚧</p>
        </div>
    </div>
  );
}

const StationThisBotContent = () => {

  const handleOpenLink = (link:string) => {
    window.open(link, '_blank'); // Replace 'https://www.example.com' with your link
  };

  return (


    <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8 my-12">


      <div className="relative isolate overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-8">
              <h1 className="max-w-2xl text-6xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:col-span-2 xl:col-auto">
              Power Up Your Posts
              </h1>
              <br/>
              <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
              <h3 className="text-5xl text-gray-700 sm:text-3xl">
                Your Secret Weapon for Nuclear AI Power on ANY Device
              </h3>
              <br/>
              <p className="text-3xl text-gray-700 mb-4 sm:base-text">
                Dive into the avant net-art crucible on new internet equipped with stationthisbot (powered by $MS2)—a project born from the bastard love child of artificial intelligence and the blockchain. Our mission? To put you on a no fly list with the bomb threat level quality of your digital expression.
              </p>
              </div>
              <Image
              src="/images/infoPage/mogcat.jpeg"
              width={500}
              height={500}
              alt="Made on stationthisbot fr, 100% MS2 Creation"
              className="mt-10 rounded-2xl object-cover sm:mt-16 lg:mt-0 lg:max-w-none xl:row-span-2 xl:row-end-2 xl:mt-36"
              />
            </div>
          </div>
          </div>

          <div className="mx-auto -mt-8 max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 overflow-hidden lg:mx-0 lg:max-w-none lg:grid-cols-4">
            {timeline.map((item) => (
              <div key={item.name}>
                <time
                  dateTime={item.dateTime}
                  className="flex items-center text-sm font-semibold leading-6 text-indigo-600"
                >
                  <svg viewBox="0 0 4 4" className="mr-4 h-1 w-1 flex-none" aria-hidden="true">
                    <circle cx={2} cy={2} r={2} fill="currentColor" />
                  </svg>
                  {item.date}
                  <div
                    className="absolute -ml-2 h-px w-screen -translate-x-full bg-gray-900/10 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0"
                    aria-hidden="true"
                  />
                </time>
                <p className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">{item.name}</p>
                <p className="mt-1 text-base leading-7 text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-32 overflow-hidden sm:mt-40">
          <div className="mx-auto max-w-7xl px-6 lg:flex lg:px-8">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-12 gap-y-16 lg:mx-0 lg:min-w-full lg:max-w-none lg:flex-none lg:gap-y-8">
              <div className="lg:col-end-1 lg:w-full lg:max-w-lg lg:pb-8">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Telegram is the New Command Line Interface</h2>
                <p className="mt-6 text-xl leading-8 text-gray-600">
                Zoomers don’t know how to fuckin code, but I’ll be damned if they can’t come up with retarded ass memes. With MS2, Telegram evolves into your personal command line fiver rugcore artist army. Engage with our intuitive bot to leverage Stable Diffusion’s capabilities directly from your smartphone—no coding required. Seamlessly transform your thoughts into visual art, engage with uncensored language models, and even sculpt entire NFT collections.
                </p>
                <button
        type="button"
        className="rounded-full my-5 bg-mony px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-mony focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mony"
        onClick={()=>{handleOpenLink('https://t.me/STATIONTHIS')}}
      >
        Join the Alpha Group
      </button>
              </div>
              <div className="flex flex-wrap items-start justify-end gap-6 sm:gap-8 lg:contents">
                <div className="w-0 flex-auto lg:ml-auto lg:w-auto lg:flex-none lg:self-end">
                  <img
                    src="/images/infoPage/mogcatgatsby.jpeg"
                    alt=""
                    className="aspect-[7/5] w-[37rem] max-w-none rounded-2xl bg-gray-50 object-cover"
                  />
                </div>
                <div className="contents lg:col-span-2 lg:col-end-2 lg:ml-auto lg:flex lg:w-[37rem] lg:items-start lg:justify-end lg:gap-x-8">
                  <div className="order-first flex w-64 flex-none justify-end self-end lg:w-auto">
                    <img
                      src="/images/infoPage/cultjackson.jpeg"
                      alt="remilia jackson"
                      className="aspect-[4/3] w-[24rem] max-w-none flex-none rounded-2xl bg-gray-50 object-cover"
                    />
                  </div>
                  <div className="flex w-96 flex-auto justify-end lg:w-auto lg:flex-none">
                    <img
                      
                      src="/images/infoPage/yakub.jpeg"
                      alt="inventor of white people"
                      className="aspect-[7/5] w-[37rem] max-w-none flex-none rounded-2xl bg-gray-50 object-cover"
                    />
                  </div>
                  <div className="hidden sm:block sm:w-0 sm:flex-auto lg:w-auto lg:flex-none">
                    <img
                      
                      src="/images/infoPage/chudjak.jpeg"
                      alt=""
                      className="aspect-[4/3] w-[24rem] max-w-none rounded-2xl bg-gray-50 object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


<div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
          <div className="mx-auto flex max-w-2xl flex-col items-end justify-between gap-16 lg:mx-0 lg:max-w-none lg:flex-row">
            <div className="w-full lg:max-w-lg lg:flex-auto">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Left curve - right curve unite!
              </h2>
              <p className="mt-6 text-xl leading-8 text-gray-600">
              Retards love us, Topwits want to build with us. Midwits will miss out on generational wealth AGAIN. StationThisBot (powered by $MS2) is currently operational and brimming with potential, shipping features DAILY that will redefine user interaction:
              </p>
              <button
        type="button"
        className="rounded-full my-5 bg-mony px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-mony focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mony"
        onClick={()=>{handleOpenLink('https://www.dextools.io/app/en/solana/pair-explorer/3gwq3YqeBqgtSu1b3pAwdEsWc4jiLT8VpMEbBNY5cqkp?t=1714358138680')}}
      >

        Check the Chart
      </button>
              <img
                src="/images/infoPage/wifeystation.jpeg"
                alt="first wifeystation"
                className="mt-16 aspect-[6/5] w-full rounded-2xl bg-gray-50 object-cover lg:aspect-auto lg:h-[34.5rem]"
              />
            </div>
            <div className="w-full lg:max-w-xl lg:flex-auto">
              <h3 className="sr-only">Features</h3>
              <ul className="-my-8 divide-y divide-gray-100">
                {features.map((feature) => (
                  <li key={feature.id} className="py-8">
                    <dl className="relative flex flex-wrap gap-x-3">

                      <dd className="mt-2 w-full flex-none text-base leading-7 text-gray-700">{feature.name}</dd>
                      <dd className="mt-2 w-full flex-none text-base leading-7 text-gray-600">{feature.description}</dd>
                      <dt className="mt-2 w-full flex-none text-base leading-7 text-gray-700">Proposed Token Gate</dt>
                      <dd className="mt-4 text-base font-semibold leading-7 text-gray-900">{feature.expectedMC}</dd>
                      {/*<dd className="mt-4 flex items-center gap-x-3 text-base leading-7 text-gray-500">
                         <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 flex-none fill-gray-300" aria-hidden="true">
                          <circle cx={1} cy={1} r={1} />
                        </svg>
                        {feature.location} 
                      </dd>*/}
                    </dl>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

<div className="mx-auto max-w-7xl px-6 lg:px-8"></div>
<div className="mt-32 overflow-hidden sm:mt-40">
          <div className="mx-auto max-w-7xl px-6 lg:flex lg:px-8">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-12 gap-y-16 lg:mx-0 lg:min-w-full lg:max-w-none lg:flex-none lg:gap-y-8">
              <div className="lg:col-end-1 lg:w-full lg:max-w-lg lg:pb-8">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Exclusivity and Utility: The Investor’s Edge</h2>
                <p className="mt-6 text-xl leading-8 text-gray-600">
                Holders of MS2 coins will find their wallets unlocking new realms of possibility. Our tiered feature access ensures that the more you invest, the more the platform evolves to serve you. High-token wallets gain exclusive access to premium features, enhancing both your creative capabilities and investment portfolio. The cabal group chat she tells you not to worry about will be pumping coins with jet fuel tech access while you and your friends use photoshop lasso tool to put nft pictures on marvel super heros. GET FUCKED 
                </p>
                <button
                  type="button"
                  className="rounded-full bg-mony px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-mony focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mony"
                  onClick={()=>{handleOpenLink('https://jup.ag/swap/SOL-AbktLHcNzEoZc9qfVgNaQhJbqDTEmLwsARY7JcTndsPg')}}
                >
                  Buy MS2 NOW
                </button>
              </div>
              <div className="flex flex-wrap items-start justify-end gap-6 sm:gap-8 lg:contents">
                <div className="w-0 flex-auto lg:ml-auto lg:w-auto lg:flex-none lg:self-end">
                  <img
                    src="/images/infoPage/kemonokakisteen.jpeg"
                    alt=""
                    className="aspect-[7/5] w-[37rem] max-w-none rounded-2xl bg-gray-50 object-cover"
                  />
                </div>
                <div className="contents lg:col-span-2 lg:col-end-2 lg:ml-auto lg:flex lg:w-[37rem] lg:items-start lg:justify-end lg:gap-x-8">
                  <div className="order-first flex w-64 flex-none justify-end self-end lg:w-auto">
                    <img
                      src="/images/infoPage/smol.jpeg"
                      alt=""
                      className="aspect-[4/3] w-[24rem] max-w-none flex-none rounded-2xl bg-gray-50 object-cover"
                    />
                  </div>
                  <div className="flex w-96 flex-auto justify-end lg:w-auto lg:flex-none">
                    <img
                      
                      src="/images/infoPage/banksmogcat.jpeg"
                      alt=""
                      className="aspect-[7/5] w-[37rem] max-w-none flex-none rounded-2xl bg-gray-50 object-cover"
                    />
                  </div>
                  <div className="hidden sm:block sm:w-0 sm:flex-auto lg:w-auto lg:flex-none">
                    <img
                      
                      src="/images/infoPage/luwei.jpeg"
                      alt=""
                      className="aspect-[4/3] w-[24rem] max-w-none rounded-2xl bg-gray-50 object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


<div className="mx-auto my-10 max-w-2xl lg:mx-0 lg:max-w-none">
          <p className="text-base font-semibold leading-7 text-mony">Superior Ponzinomics</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"> A Vision for B2B Expansion</h1>
          <div className="mt-10 grid max-w-xl grid-cols-1 gap-8 text-base leading-7 text-gray-700 lg:max-w-none lg:grid-cols-2">
            <div>
              <p>
              The horizon promises more than just individual empowerment. MS2 is poised to become a pivotal B2B conduit in the digital art and AI space. Your investment today does more than secure technology—it paves the way for a sustainable revenue model that’s as innovative as the technology it supports.
              </p>
            </div>
            <div>
              <p>
              Don’t let the future pass you by. Embrace the MS2 project and join a community that’s setting the pace for digital and financial innovation. Invest in MS2 coin today and place yourself on the cutting edge of the next digital explosion.
              </p>
            </div>
          </div>
        </div>
  </div>
  );
};

export default Landing
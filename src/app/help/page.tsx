'use client'

import Header from '@/components/header'
// import Socials from '@/components/socials'

import React, { useState, ReactNode } from 'react';

interface AccordionProps {
  children: ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ children }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
  
    const handleToggle = (index: number) => {
      setOpenIndex(openIndex === index ? null : index);
    };
  
    return (
      <div>
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              isOpen: openIndex === index,
              onToggle: () => handleToggle(index),
            } as any);  // casting to any to bypass type check
          }
          return child;
        })}
      </div>
    );
  };


  interface AccordionItemProps {
    title: string;
    children: ReactNode;
    isOpen: boolean;
    onToggle: () => void;
  }

  interface ParagraphProps {
    children: ReactNode;
  }

  const P: React.FC<ParagraphProps> = ({ children }) => {
    return <p className="mb-4">{children}</p>;
  };
  
  const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, isOpen, onToggle }) => {
    return (
        <div>
        <h2>
          <button
            type="button"
            className={`flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border ${
              isOpen ? 'border-b-0' : ''
            } border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3`}
            onClick={onToggle}
            aria-expanded={isOpen}
          >
            <span>{title}</span>
            <svg
              data-accordion-icon
              className={`w-3 h-3 ${isOpen ? 'rotate-180' : ''} shrink-0`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5 5 1 1 5"
              />
            </svg>
          </button>
        </h2>
        <div className={`${isOpen ? 'block' : 'hidden'} p-5 border border-gray-200 dark:border-gray-700 bg-white`}>
          {children}
        </div>
      </div>
    );
  };

export default function Help() {

    return (
        <>
        
      
        <Header />
      <div className="h-screen w-100 container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-24 sm:py-32 lg:pb-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                $MS2 How-to StationThis
              </h1>
              {/* <p className="mt-6 text-lg leading-8 text-gray-300">
                
              </p> */}
              
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
        <Accordion>
          <AccordionItem title="Intro" isOpen={false} onToggle={function (): void {
                        throw new Error('Function not implemented.');
                    } }>
            <P>stationthisbot is a telegram bot application that interfaces with stable diffusion over api and webhooks to allow you to create AI generated images in the telegram chat.</P>
            
            <P>
                $MS2 is a solana SPL token created on pump.fun on April 9th, 2024 with 10% of supply airdropped to Miladystation NFT holders by the creator, arthurt.
            </P>
            <P>
                The bot can be used without owning the token and without signing in, but the user is limited to 10 txt2image generations per 8 hour period. The watermark stays on and the images will all look like playstation 1 screenshots.
            </P>
            <P>
                A holder of $MS2 tokens can sign into the bot and verify ownership of their wallet to enjoy increased generation limit as well as token gated features including extra workflows like image-to-video and special LoRa models for niche memes.
            </P>
            <P>
                Using the stationthisbot, it is possible to generate infinite content.
            </P>

            
            <Accordion>
            <AccordionItem title="Getting Started" isOpen={false} onToggle={function (): void {
                                throw new Error('Function not implemented.');
                            } }>
                <p>You will need internet access, a solana wallet, $SOL and a telegram account to use the stationthisbot</p>
                <p></p>
              </AccordionItem>
              <AccordionItem title="Basic Use" isOpen={false} onToggle={function (): void {
                                throw new Error('Function not implemented.');
                            } }>
                <p>This is the content of subsection 1.1.</p>
              </AccordionItem>
              <AccordionItem title="Commands" isOpen={false} onToggle={function (): void {
                                throw new Error('Function not implemented.');
                            } }>
                <p>This is the content of subsection 1.2.</p>
              </AccordionItem>
            </Accordion>
          </AccordionItem>
          <AccordionItem title="Tech" isOpen={false} onToggle={function (): void {
                                throw new Error('Function not implemented.');
                            } }>
            <p>This is the content of section 2.</p>
          </AccordionItem>
          <AccordionItem title="Tokenomics" isOpen={false} onToggle={function (): void {
                                throw new Error('Function not implemented.');
                            } }>
            <p>This is the content of section 2.</p>
          </AccordionItem>
          <AccordionItem title="Business" isOpen={false} onToggle={function (): void {
                                throw new Error('Function not implemented.');
                            } }>
            <p>This is the content of section 3.</p>
            <Accordion>
              <AccordionItem title="Subsection 1.1" isOpen={false} onToggle={function (): void {
                                throw new Error('Function not implemented.');
                            } }>
                <p>This is the content of subsection 3.1.</p>
              </AccordionItem>
            </Accordion>
          </AccordionItem>
        </Accordion>
      </div>
      {/* <Socials /> */}
    
      </>
    )
}




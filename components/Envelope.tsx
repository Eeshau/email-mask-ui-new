import React from 'react';

export default function Envelope() {
  return (
    <div className="flex justify-center items-center h-full">
      {/* Envelope Wrapper */}
      <div className="relative w-[400px] h-[280px] rounded-lg">

        {/* Triangle Envelope behind the card at the top */}
        <img 
          src="/triangleEnvelope.png" 
          alt="Triangle Envelope" 
          className="absolute z-0 top-[-50px] left-0 w-full h-auto"
          draggable='false'
        />

        {/* Card */}
        <div className="relative z-10 p-8 text-white text-[10px] bg-[#161819] border-solid border-[0.5px] border-[#3B3B3B] rounded-lg shadow-lg">
          <div>
            <div className='flex flex-row justify-between'>
                <div>
                    <p className="font-md mb-2">From: ceo@evilpenguins.org</p>
                    <p className="font-md mb-2">To: <span className="bg-white">[redacted]</span>@evilpenguins.org</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                <g clipPath="url(#clip0_204_1829)">
                    <path d="M20.2522 10.8469L16.685 16.1938C16.571 16.3645 16.4168 16.5046 16.2358 16.6017C16.0549 16.6987 15.8528 16.7496 15.6475 16.75H3.48185C3.36867 16.7501 3.2576 16.7194 3.16048 16.6613C3.06337 16.6032 2.98386 16.5198 2.93044 16.42C2.87702 16.3202 2.8517 16.2078 2.85718 16.0948C2.86265 15.9817 2.89873 15.8723 2.96154 15.7781L6.48107 10.5L2.96545 5.22187C2.90281 5.128 2.86676 5.01893 2.86113 4.90622C2.85549 4.79351 2.88047 4.68138 2.93342 4.58172C2.98637 4.48207 3.06532 4.39861 3.16188 4.34021C3.25843 4.2818 3.369 4.25063 3.48185 4.25H15.6475C15.8528 4.25038 16.0549 4.30133 16.2358 4.39835C16.4168 4.49536 16.571 4.63546 16.685 4.80625L20.2498 10.1531C20.3187 10.2556 20.3557 10.3762 20.3561 10.4996C20.3565 10.6231 20.3203 10.7439 20.2522 10.8469Z" fill="#68A3E9"/>
                </g>
                <defs>
                    <clipPath id="clip0_204_1829">
                    <rect width="20" height="20" fill="white" transform="translate(0.981445 0.499512)"/>
                    </clipPath>
                </defs>
                </svg>
            </div>

            <p className="font-bold mb-4">Subject: Reject Antarctica, Mass Attack Humans</p>
            <p className="">
              Here’s the plan:
              <br />
              1. <span className="font-light">Infiltrate their cities:</span> We’ll start with a coordinated march into their most populated areas. Don’t be shy—let them hear those flippers slap the ground with authority.
              <br />
              2. <span className="font-light">Disrupt their routines:</span> Knock over a few trash cans, peck at their shoes, and commandeer a few shopping carts for fun. Make them fear the black and white.
            </p>
          </div>
        </div>

        {/* Rectangle Envelope on top of the card at the bottom */}
        <img 
          src="/rectangleEnvelope.png" 
          alt="Rectangle Envelope" 
          className="absolute z-30 bottom-[0px] left-0 w-full h-auto"
          draggable='false'
        />

        {/* Blurred polygons on top of the rectangle */}
        <div className="absolute z-40 top-0 left-0 w-full h-full pointer-events-none">
          {/* Left Blurred Polygon */}
          <div
            className="absolute bottom-0 left-0 w-full h-[200px]"
            style={{
              clipPath: "polygon(0 100%, 100% 100%, 0 0)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)", // Safari support
              borderRadius: "10px",
              backgroundColor: "rgba(93, 93, 93, 0.2)", // Add a grey tint
            }}
          />
          {/* Right Blurred Polygon */}
          <div
            className="absolute bottom-0 right-0 w-full h-[200px]"
            style={{
              clipPath: "polygon(100% 100%, 0 100%, 100% 0)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)", // Safari support
              borderRadius: "10px",
              backgroundColor: "rgba(93, 93, 93, 0.2)", // Add a grey tint
              
            }}
          />
        </div>
      </div>
    </div>
  );
}

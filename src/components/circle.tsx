

import React, { useEffect } from 'react';

export default function Circles() {
    useEffect(() => {
        // Generate keyframes for each circle
        const generateKeyframes = (index: number) => {
            const keyframes = `
                @keyframes moveCircle-${index + 1} {
                    0% {
                        transform: translate(-50%, -50%) rotate(0deg) translate(90px) rotate(-90deg);
                    }
                    100% {
                        transform: translate(-50%, -50%) rotate(360deg) translate(90px) rotate(-${90 + (index * 30)}deg);
                    }
                }
            `;
            return keyframes;
        };

        // Append dynamically generated keyframes to the document style
        const style = document.createElement('style');
        style.innerHTML = `
            ${[...Array(7)].map((_, index) => generateKeyframes(index)).join('\n')}
        `;
        document.head.appendChild(style);
    }, []);

    return (
        <div className="circle-container">
            {[...Array(7)].map((_, index) => (
                <div
                    key={index}
                    className="circle"
                    style={{
                        width: '10px',
                        height: '10px',
                        backgroundColor: 'white', // Change background color to white
                        borderRadius: '50%',
                        position: 'absolute',
                        top: '50%',
                        left: '30%',
                        transformOrigin: 'center',
                        animation: `moveCircle-${index + 1} ${4 + index}s linear infinite`, // Adjust animation duration for each circle
                        boxShadow: '0 0 10px 5px rgba(255, 255, 255, 0.5)', // Add white box shadow for glowing effect
                    }}
                ></div>
            ))}
        </div>
    );
}

// export default function Circles() {
//     return (
//         <div className="circle-container">
//             <div
//                 className="circle"
//                 style={{
//                     width: '20px',
//                     height: '20px',
//                     backgroundColor: 'white',
//                     borderRadius: '50%',
//                     position: 'absolute',
//                     top: '50%',
//                     left: '50%',
//                     transformOrigin: 'center',
//                     animation: 'moveCircle 4s linear infinite',
//                     boxShadow: '0 0 10px 5px rgba(255, 255, 255, 0.5)', // Add white box shadow for glowing effect
//                 }}
//             ></div>
//             <style>
//                 {`
//                 @keyframes moveCircle {
//                     0% {
//                         transform: translate(-50%, -50%) rotate(0deg) translate(150px) rotate(-90deg);
//                     }
//                     100% {
//                         transform: translate(-50%, -50%) rotate(360deg) translate(150px) rotate(-90deg);
//                     }
//                 }
//                 `}
//             </style>
//         </div>
//     );
// }

// export default function Circles() {
//     return (
//         <div className="circle-container">
//             {[...Array(7)].map((_, index) => (
//                 <div
//                     key={index}
//                     className="circle"
//                     style={{
//                         width: '20px',
//                         height: '20px',
//                         backgroundColor: 'white', // Change background color to white
//                         borderRadius: '50%',
//                         position: 'absolute',
//                         top: '50%',
//                         left: '50%',
//                         transformOrigin: 'center',
//                         animation: `moveCircle-${index + 1} ${4 + index}s linear infinite`, // Adjust animation duration for each circle
//                         boxShadow: '0 0 10px 5px rgba(255, 255, 255, 0.5)', // Add white box shadow for glowing effect
//                     }}
//                 ></div>
//             ))}
//             <style>
//                 {`
//                 @keyframes moveCircle-1 {
//                     0% {
//                         transform: translate(-50%, -50%) rotate(0deg) translate(150px) rotate(-90deg);
//                     }
//                     100% {
//                         transform: translate(-50%, -50%) rotate(360deg) translate(150px) rotate(-90deg);
//                     }
//                 }

//                 /* Define keyframes for each circle with different durations */
//                 @keyframes moveCircle-2 {
//                     0% {
//                         transform: translate(-50%, -50%) rotate(0deg) translate(150px) rotate(-90deg);
//                     }
//                     100% {
//                         transform: translate(-50%, -50%) rotate(360deg) translate(150px) rotate(-90deg);
//                     }
//                 }

//                 /* Add more keyframes for each circle as needed */

//                 /* Repeat for moveCircle-3 to moveCircle-7 */
//                 `}
//             </style>
//         </div>
//     );
// }
//import React, { useState, useEffect } from 'react';

// export default function Circles() {
//     const [containerSize, setContainerSize] = useState({ width: '100%', height: '100%' });

//     useEffect(() => {
//         const interval = setInterval(() => {
//             setContainerSize(prevSize => {
//                 if (prevSize.width === '100%' && prevSize.height === '100%') {
//                     return { width: '5%', height: '5%' };
//                 } else {
//                     return { width: '100%', height: '100%' };
//                 }
//             });
//         }, 2000); // Change the interval duration as needed

//         return () => clearInterval(interval);
//     }, []);

//     return (
//         <div className="circle-container" style={{ width: containerSize.width, height: containerSize.height, position: 'absolute' }}>
//             {[...Array(7)].map((_, index) => (
//                 <div
//                     key={index}
//                     className="circle"
//                     style={{
//                         width: '20px',
//                         height: '20px',
//                         backgroundColor: 'white', // Change background color to white
//                         borderRadius: '50%',
//                         position: 'absolute',
//                         top: '50%',
//                         left: '50%',
//                         transformOrigin: 'center',
//                         animation: `moveCircle-${index + 1} ${4 + index}s linear infinite`, // Adjust animation duration for each circle
//                         boxShadow: '0 0 10px 5px rgba(255, 255, 255, 0.5)', // Add white box shadow for glowing effect
//                     }}
//                 ></div>
//             ))}
//             <style>
//                 {`
//                 /* Define keyframes for each circle with different durations */
//                 ${[...Array(7)].map((_, index) => `
//                 @keyframes moveCircle-${index + 1} {
//                     0% {
//                         transform: translate(-50%, -50%) rotate(0deg) translate(${containerSize.width === '100%' ? '150px' : '7.5px'}) rotate(-90deg);
//                     }
//                     100% {
//                         transform: translate(-50%, -50%) rotate(360deg) translate(${containerSize.width === '100%' ? '150px' : '7.5px'}) rotate(-${90 + (index * 30)}deg);
//                     }
//                 }
//                 `).join('\n')}
//                 `}
//             </style>
//         </div>
//     );
// }

// import React, { useState, useEffect } from 'react';

// export default function Circles() {
//     const [containerSize, setContainerSize] = useState({ width: '100%', height: '100%' });

//     useEffect(() => {
//         const interval = setInterval(() => {
//             setContainerSize(prevSize => {
//                 const cycleDuration = 15000; // Duration of each cycle in milliseconds
//                 const currentTime = Date.now() % cycleDuration; // Current time within the cycle
//                 const scaleFactor = 0.95 + 0.05 * Math.sin((2 * Math.PI * currentTime) / cycleDuration); // Interpolate between 0.95 and 1.0 using a sinusoidal function

//                 return {
//                     width: prevSize.width === '100%' ? '100%' : `${scaleFactor * 100}%`,
//                     height: prevSize.height === '100%' ? '100%' : `${scaleFactor * 100}%`
//                 };
//             });
//         }, 5); // Update the container size every 100 milliseconds

//         return () => clearInterval(interval);
//     }, []);

//     return (
//         <div className="circle-container absolute top-5" style={{ width: containerSize.width, height: containerSize.height, position: 'absolute' }}>
//             {[...Array(7)].map((_, index) => (
//                 <div
//                     key={index}
//                     className="circle"
//                     style={{
//                         width: '20px',
//                         height: '20px',
//                         backgroundColor: 'white', // Change background color to white
//                         borderRadius: '50%',
//                         position: 'absolute',
//                         top: '50%',
//                         left: '50%',
//                         transformOrigin: 'center',
//                         animation: `moveCircle-${index + 1} ${4 + index}s linear infinite`, // Adjust animation duration for each circle
//                         boxShadow: '0 0 10px 5px rgba(255, 255, 255, 0.5)', // Add white box shadow for glowing effect
//                     }}
//                 ></div>
//             ))}
//             <style>
//                 {`
//                 /* Define keyframes for each circle with different durations */
//                 ${[...Array(7)].map((_, index) => `
//                 @keyframes moveCircle-${index + 1} {
//                     0% {
//                         transform: translate(-50%, -50%) rotate(0deg) translate(${containerSize.width === '100%' ? '150px' : '7.5px'}) rotate(-90deg);
//                     }
//                     100% {
//                         transform: translate(-50%, -50%) rotate(360deg) translate(${containerSize.width === '100%' ? '150px' : '7.5px'}) rotate(-${90 + (index * 30)}deg);
//                     }
//                 }
//                 `).join('\n')}
//                 `}
//             </style>
//         </div>
//     );
// }


// import React, { useState, useEffect } from 'react';

// export default function Circles() {
//     const [containerSize, setContainerSize] = useState({ width: '100%', height: '100%' });

//     useEffect(() => {
//         const interval = setInterval(() => {
//             setContainerSize(prevSize => {
//                 const cycleDuration = 150000; // Duration of each cycle in milliseconds
//                 const currentTime = Date.now() % cycleDuration; // Current time within the cycle
//                 const scaleFactor = 0.45 + 0.45 * Math.sin((2 * Math.PI * currentTime / cycleDuration)); // Interpolate between 0.45 and 0.9 using a sinusoidal function
//                 console.log(currentTime);
//                 console.log((Math.sin((2 * Math.PI * currentTime/cycleDuration))));
//                 // Determine which dimension to manipulate based on the current time
//                 let newWidth, newHeight;
//                 if (currentTime < cycleDuration / 2) {
//                     // Manipulate width if currentTime is in the first half of the cycle
//                     newWidth = `${Math.floor(scaleFactor * parseInt(prevSize.width.replace('%','')))}%`;
//                     newHeight = '100%';
//                 } else {
//                     // Manipulate height if currentTime is in the second half of the cycle
//                     newWidth = '100%';
//                     newHeight = `${Math.floor(scaleFactor * parseInt(prevSize.height.replace('%','')))}%`;
//                 }
//                 console.log(newWidth,newHeight);
//                 return { width: newWidth, height: newHeight };
//             });
//         }, 500); // Update the container size every 5 milliseconds

//         return () => clearInterval(interval);
//     }, []);

//     return (
//         <div className="circle-container absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ width: containerSize.width, height: containerSize.height }}>
//             {[...Array(7)].map((_, index) => (
//                 <div
//                     key={index}
//                     className="circle"
//                     style={{
//                         width: '20px',
//                         height: '20px',
//                         backgroundColor: 'white', // Change background color to white
//                         borderRadius: '50%',
//                         position: 'absolute',
//                         top: '50%',
//                         left: '50%',
//                         transformOrigin: 'center',
//                         animation: `moveCircle-${index + 1} ${4 + index}s linear infinite`, // Adjust animation duration for each circle
//                         boxShadow: '0 0 10px 5px rgba(255, 255, 255, 0.5)', // Add white box shadow for glowing effect
//                     }}
//                 ></div>
//             ))}
//             <style>
//                 {`
//                 /* Define keyframes for each circle with different durations */
//                 ${[...Array(7)].map((_, index) => `
//                 @keyframes moveCircle-${index + 1} {
//                     0% {
//                         transform: translate(-50%, -50%) rotate(0deg) translate(${containerSize.width === '100%' ? '150px' : '7.5px'}) rotate(-90deg);
//                     }
//                     100% {
//                         transform: translate(-50%, -50%) rotate(360deg) translate(${containerSize.width === '100%' ? '150px' : '7.5px'}) rotate(-${90 + (index * 30)}deg);
//                     }
//                 }
//                 `).join('\n')}
//                 `}
//             </style>
//         </div>
//     );
// }

import React from "react";
import Link from "next/link";
import Image from "next/image";

function generateBlobShape() {
  const numPoints = 8;
  const angleStep = (Math.PI * 2) / numPoints;
  let path = "M";

  for (let i = 0; i < numPoints; i++) {
    const angle = i * angleStep;
    const radius = 180 + Math.random() * 25; // Increased radius
    const x = 200 + radius * Math.cos(angle);
    const y = 200 + radius * Math.sin(angle);
    
    if (i === 0) {
      path += `${x},${y}`;
    } else {
      const controlX = 200 + (radius * 1.2) * Math.cos(angle - angleStep / 2);
      const controlY = 200 + (radius * 1.2) * Math.sin(angle - angleStep / 2);
      path += ` Q${controlX},${controlY} ${x},${y}`;
    }
  }

  return path + "Z";
}
export default function Home() {
  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <svg
        className="fixed inset-0 w-[100%] h-[105%] scale-[1.2] opacity-40"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#7c0323"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ zIndex: -1 }}
      >
        <path 
          d="M14.792 17.063c0 .337 .057 .618 .057 .9c0 1.8 -1.238 3.037 -2.982 3.037c-1.8 0 -2.98 -1.238 -2.98 -3.206v-.731c-.957 .675 -1.576 .9 -2.42 .9c-1.518 0 -2.925 -1.463 -2.925 -3.094c0 -1.181 .844 -2.194 2.082 -2.756l.28 -.113c-1.574 -.787 -2.362 -1.688 -2.362 -2.925c0 -1.687 1.294 -3.094 2.925 -3.094c.675 0 1.52 .338 2.138 .788l.281 .112c0 -.337 -.056 -.619 -.056 -.844c0 -1.8 1.237 -3.037 2.98 -3.037c1.8 0 2.981 1.237 2.981 3.206v.394l-.056 .281c.956 -.675 1.575 -.9 2.419 -.9c1.519 0 2.925 1.463 2.925 3.094c0 1.181 -.844 2.194 -2.081 2.756l-.282 .169c1.575 .787 2.363 1.688 2.363 2.925c0 1.688 -1.294 3.094 -2.925 3.094c-.675 0 -1.575 -.281 -2.138 -.788l-.225 -.169z" 
        />
      </svg>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        <header className="text-center mb-16">
          <h1 className="text-6xl md:text-8xl font-extrabold mb-4 text-[#05004f] drop-shadow-lg mt-20">
            Wine N' Dine
          </h1>
          <p className="text-2xl md:text-3xl font-light italic text-[#643b2b]">
            Experience 3D Dining Reservations
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 bg-[#ffd9c4] bg-opacity-50 backdrop-filter backdrop-blur-lg p-8 rounded-3xl shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-[#05004f]">Fonts Virtual Restaurant Tour</h2>
            <p className="text-xl text-[#643b2b]">
              Step into our virtual restaurant, explore the ambiance, and choose your perfect seat. 
              Our innovative 3D model allows you to experience the restaurant before you even arrive.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/dashboard">
                <button className="bg-[#ffdb3d] text-[#05004f] font-bold py-3 px-6 rounded-full shadow-lg hover:bg-[#fdce00] transition-all transform hover:scale-110">
                  Start 3D Tour
                </button>
              </Link>
              <Link href="/inspect-menu">
                <button className="bg-[#7c0323] text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-[#E60012] transition-all transform hover:scale-110">
                  View Menu
                </button>
              </Link>
            </div>
          </div>

          <div className="relative w-96 h-96 mx-auto transform rotate-3 hover:rotate-0 transition-all duration-300">
          <div className="absolute inset-0 bg-white shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] rounded-lg p-4 transform translate-y-2 translate-x-2 hover:translate-y-1 hover:translate-x-1 transition-all duration-300">
            <div className="relative h-[75%] w-full overflow-hidden border-4 border-gray-200">
              <Image 
                src="/4.jpeg" 
                alt="3D Restaurant Model" 
                layout="fill" 
                objectFit="cover"
                className="rounded-sm"
              />
            </div>
            <div className="absolute bottom-4 left-0 right-0 h-[20%] flex items-center justify-center">
              <Image 
                src="/handwriting.png" 
                alt="Our 3D Restaurant Handwriting" 
                width={300}  // Adjust this value as needed
                height={75}  // Adjust this value as needed
                objectFit="contain"
                className="rounded-sm"
              />
            </div>
          </div>
          <div className="absolute inset-0 bg-black opacity-10 filter blur-md transform translate-y-4 translate-x-4 -z-10 rounded-sm"></div>
        </div>
        </div>

        <div className="mt-24 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mt-20 text-[#05004f]">Why Choose Our 3D Reservation?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 px-4 md:px-8 lg:px-16">
            {[
              { title: "Interactive Seating", desc: "Choose your exact table in our virtual restaurant", icon: "🪑" },
              { title: "Real-Time Availability", desc: "See which tables are free for your desired time", icon: "⏳" },
              { title: "Pre-order Your Meal", desc: "Choose and reserve any dish from our menu in advance", icon: "🍝" }
            ].map((item, index) => (
              <div key={index} className="relative p-8 overflow-visible" style={{ minHeight: '400px' }}>
                <div className="absolute inset-0 w-full h-full">
                  <svg className="w-full h-full" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
                    <path fill="#FFD9C4" d={generateBlobShape()} />
                  </svg>
                </div>
                <div className="relative z-10 h-full flex flex-col justify-center items-center ">
                  <div className="text-6xl mb-6">{item.icon}</div>
                  <h3 className="text-2xl font-bold mb-3 text-[#05004f]">{item.title}</h3>
                  <p className="text-[#643b2b] text-lg">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="mt-24 text-center text-[#643b2b]">
        <p>© 2025 Wine N' Dine. All rights reserved. Experience dining in 3D.</p>
      </footer>
    </main>
  );
}
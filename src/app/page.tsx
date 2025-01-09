import React from "react";
import Link from "next/link";

export default async function Home() {
  return (
    <main>
      <div className="bg-gray-800 text-white p-4 text-center my-20">
        <h1 className="text-3xl font-black">Wine and Dine</h1>
      </div>
      <div className="max-w-4xl mx-auto p-4 text-red-500 text-xl bg-yellow-400 font-black">
        <p className="mb-4">
          At Quiet Bites, we understand that dining out should be as comfortable as staying in. Designed with introverts in mind, our restaurant offers a serene, low-pressure atmosphere where you can enjoy exceptional meals without the bustle of traditional dining.
        </p>
        <p className="mb-4">
          Whether you are seeking a cozy nook to savor your favorite dish, a quiet space to unwind, or the luxury of minimal interactions, we have got you covered. From dimmed lighting to private seating options, every detail is curated to let you truly relax and relish your time here.
        </p>
        <p>
          Experience dining that feels as personal as it is delicious. Welcome to your safe space—where solitude meets flavor.
        </p>
      </div>
      <div className="flex justify-center items-center my-10">
        <Link legacyBehavior href="/dashboard">
          <a className="bg-red-600 text-white font-bold py-4 px-8 text-xl rounded-lg shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105 m-5">
            Go to Dashboard
          </a>
        </Link>
        <Link legacyBehavior href="/profile">
          <a className="bg-red-600 text-white font-bold py-4 px-8 text-xl rounded-lg shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105 m-5">
            Go to Profile
          </a>
        </Link>
      </div>
    </main>
  );
}

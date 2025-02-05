import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-c9 text-c8 overflow-hidden relative">
      <div className="absolute inset-0 bg-c7 opacity-50 transform rotate-45 scale-150"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <header className="text-center mb-16">
          <h1 className="text-6xl md:text-8xl font-extrabold mb-4 text-c8 drop-shadow-lg mt-20">
            Wine N' Dine
          </h1>
          <p className="text-2xl md:text-3xl font-light italic text-c6">Where Flavors Whisper and Aromas Dance</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-8 rounded-3xl shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-c75">Culinary Symphony</h2>
            <p className="text-xl text-c8">Embark on a gastronomic journey where each bite is a note and every sip a melody. Our dishes are composed to delight your senses in perfect harmony.</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/menu">
                <button className="bg-c75 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-c8 transition-all transform hover:scale-110">
                  Explore Our Menu
                </button>
              </Link>
              <Link href="/reserve">
                <button className="bg-c4 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-c7 transition-all transform hover:scale-110">
                  Reserve Your Table
                </button>
              </Link>
            </div>
          </div>

          <div className="relative h-96 w-96 mx-auto group">
            <div className="absolute inset-0 -translate-x-20 -translate-y-20 animate-float transition-transform duration-300 group-hover:-translate-x-24 group-hover:-translate-y-24">
              <Image src="/glass-wine.svg" alt="Wine Glass" layout="fill" />
            </div>
            <div className="absolute inset-0 translate-x-14 translate-y-20 animate-float transition-transform duration-300 group-hover:translate-x-20 group-hover:translate-y-24">
              <Image src="/pasta-plate.svg" alt="Pasta Plate" layout="fill" />
            </div>
          </div>
        </div>

        <div className="mt-24 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-c8">Our Signature Experiences</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Whisper Lounge", desc: "Where conversations flow as smoothly as our wines", icon: "🍷" },
              { title: "Aroma Alley", desc: "A sensory walk through our chef's latest creations", icon: "👃" },
              { title: "Taste Tango", desc: "Let your palate dance with our perfectly paired dishes", icon: "💃" }
            ].map((item, index) => (
              <div key={index} className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-6 rounded-3xl shadow-lg transform hover:scale-105 transition-all">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-semibold mb-2 text-c75">{item.title}</h3>
                <p className="text-c8">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="mt-24 text-center text-c6 pb-8">
        <p>© 2025 Wine N' Dine. All rights reserved. Savor responsibly.</p>
      </footer>
    </main>
  );
}
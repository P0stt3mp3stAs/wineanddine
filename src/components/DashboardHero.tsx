'use client';
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DashboardHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Interactive Seating",
      description: "Choose your exact table in our virtual restaurant",
      image: "/1.jpeg"
    },
    {
      title: "Real-Time Availability",
      description: "See which tables are free for your desired time",
      image: "/2.jpeg"
    },
    {
      title: "Pre-order Your Meal",
      description: "Choose and reserve any dish from our menu in advance",
      image: "/3.jpeg"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[50vh] overflow-hidden bg-black">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <Image
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white p-4 md:p-8 max-w-3xl mt-5">
          <motion.h1 
            key={`title-${currentSlide}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            {slides[currentSlide].title}
          </motion.h1>
          <motion.p
            key={`desc-${currentSlide}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl mb-6"
          >
            {slides[currentSlide].description}
          </motion.p>
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            className="bg-white text-black px-4 py-2 md:px-6 md:py-3 rounded-full text-base md:text-lg font-semibold hover:bg-opacity-90 transition-colors"
          >
            Reserve a Table
          </motion.button>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white scale-125" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardHero;
'use client';
import Image from "next/image";
import { useState, useEffect } from "react";

const DashboardHero = () => {
 const [currentSlide, setCurrentSlide] = useState(0);

 const slides = [
   {
     title: "Experience Culinary Excellence",
     description: "Book your table now and indulge in an unforgettable dining experience.",
     image: "/firstPic.jpeg"
   },
   {
     title: "Private Fine Dining",
     description: "Enjoy an intimate dining experience in our exclusive private rooms.", 
     image: "/firstPic.jpeg"
   },
   {
     title: "Seasonal Specialties",
     description: "Discover our chef's seasonal menu featuring fresh local ingredients.",
     image: "/firstPic.jpeg"
   },
   {
     title: "Special Events & Occasions",
     description: "Make your celebrations memorable with our special arrangements.",
     image: "/firstPic.jpeg"
   }
 ];

 useEffect(() => {
   const timer = setInterval(() => {
     setCurrentSlide((prev) => (prev + 1) % slides.length);
   }, 5000);
   return () => clearInterval(timer);
 }, []);

 const slideStyles = (index: number) => {
    const isActive = index === currentSlide;
    const isPrev = (currentSlide === 0 && index === slides.length - 1) || 
                  (index === currentSlide - 1);
    const isNext = (currentSlide === slides.length - 1 && index === 0) || 
                  (index === currentSlide + 1);
  
    if (isActive) return "translate-x-0 opacity-100";
    if (isPrev) return "-translate-x-full opacity-0";
    if (isNext) return "translate-x-full opacity-0";
    return "translate-x-full opacity-0";
  };

 return (
   <div className="w-full h-[50vh] bg-bege-500 relative overflow-hidden">
     <div className="absolute inset-0">
       {slides.map((slide, index) => (
         <div
           key={index}
           className={`absolute top-0 left-0 w-full h-full transform transition-all duration-700 ease-in-out ${slideStyles(index)}`}
         >
           <div className="h-full flex items-center justify-center px-4">
             <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-8">
               <div className="flex-1 space-y-6 max-w-xl">
                <h1 className="text-5xl font-bold text-white leading-tight">
                   {slide.title}
                </h1>
                <p className="text-lg text-white/90">
                   {slide.description}
                </p>
                <button 
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
                >
                Reserve a Table
                </button>
               </div>

               <div className="flex-1 relative h-[400px] w-full max-w-xl">
                 <Image
                   src={slide.image}
                   alt="Restaurant Image"
                   fill
                   className="object-cover rounded-lg"
                   priority
                 />
               </div>
             </div>
           </div>
         </div>
       ))}
     </div>

     <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
       {slides.map((_, index) => (
         <button
           key={index}
           onClick={() => setCurrentSlide(index)}
           className={`w-3 h-3 rounded-full transition-all duration-300 ${
             index === currentSlide ? "bg-white" : "bg-white/50"
           }`}
         />
       ))}
     </div>
   </div>
 );
};

export default DashboardHero;
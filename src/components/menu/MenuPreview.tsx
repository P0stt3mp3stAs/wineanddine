'use client';
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

const MenuItem: React.FC<{
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}> = ({ title, description, imageSrc, imageAlt }) => (
  <motion.div 
    className="flex-shrink-0 w-full sm:w-64 md:w-72 rounded-xl overflow-hidden shadow-lg bg-[#ffefe6]"
  >
    <div className="relative h-48 sm:h-40 md:h-48">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover"
      />
    </div>
    <div className="p-4">
      <h3 className="text-lg md:text-xl font-semibold text-[#05004f] mb-2">{title}</h3>
      <p className="text-sm md:text-base text-[#05004f]">{description}</p>
    </div>
  </motion.div>
);

const menuItems = [
  {
    title: "House Specialties",
    description: "Classic Beef Wellington",
    imageSrc: "/menu/spc-001.jpg",
    imageAlt: "Classic Beef Wellington"
  },
  {
    title: "Main Courses",
    description: "Slow Cooked Pork Ribs",
    imageSrc: "/menu/mns-001.jpg",
    imageAlt: "Slow Cooked Pork Ribs"
  },
  {
    title: "Desserts",
    description: "BSK Sundae",
    imageSrc: "/menu/des-001.jpg",
    imageAlt: "BSK Sundae"
  }
];

const MenuPreview = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextItem = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % menuItems.length);
  };

  const prevItem = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + menuItems.length) % menuItems.length);
  };

  return (
    <div className="w-full h-[50vh] bg-[#7c0323] bg-opacity-30 backdrop-filter backdrop-blur-lg flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8">
      <svg
        className="fixed inset-0 w-[100%] h-[100%] scale-[1.2] opacity-40"
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
      <div className="flex-grow flex flex-col justify-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-[#05004f] mb-6 sm:mb-8">
          Preview Our Menu
        </h2>
        <div className="relative w-full overflow-hidden">
          <div className="flex justify-center">
            {/* Mobile view: single item */}
            <div className="block sm:hidden w-full">
              <MenuItem {...menuItems[currentIndex]} />
            </div>
            {/* Tablet and desktop view: all items */}
            <div className="hidden sm:flex space-x-4 md:space-x-6">
              {menuItems.map((item, index) => (
                <MenuItem key={index} {...item} />
              ))}
            </div>
          </div>
          {/* Navigation arrows for mobile */}
          <div className="sm:hidden flex justify-between absolute top-1/2 left-0 right-0 -mt-4">
            <button onClick={prevItem} className="bg-[#7c0323] text-white p-2 rounded-full">
              &#8592;
            </button>
            <button onClick={nextItem} className="bg-[#7c0323] text-white p-2 rounded-full">
              &#8594;
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6 sm:mt-8">
        <Link href="/inspect-menu">
          <motion.button 
            className="bg-[#ffdb3d] text-[#05004f] px-6 py-3 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:bg-[#fdce00] transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Explore Full Menu
          </motion.button>
        </Link>
      </div>
    </div>
  );
};

export default MenuPreview;
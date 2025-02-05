'use client';
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const MenuItem: React.FC<{
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}> = ({ title, description, imageSrc, imageAlt }) => (
  <motion.div 
    className="flex-shrink-0 w-48 sm:w-64 md:w-72 rounded-xl overflow-hidden shadow-lg bg-c6 border border-c9"
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="relative h-32 sm:h-40 md:h-48">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover"
      />
    </div>
    <div className="p-3 sm:p-4">
      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-c9 mb-1 sm:mb-2">{title}</h3>
      <p className="text-xs sm:text-sm md:text-base text-c8">{description}</p>
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
 return (
  <div className="w-full h-[50vh] bg-gradient-to-b from-c7 to-c8 flex flex-col justify-between py-4 sm:py-6 px-2 sm:px-4 lg:px-6">
    <div className="flex-grow flex flex-col justify-center">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-white mb-4 sm:mb-6">
        Preview Our Menu
      </h2>
      <div className="relative w-full overflow-hidden">
        <motion.div 
          className="flex space-x-3 sm:space-x-4 md:space-x-6"
          animate={{ x: ["0%", "-100%"] }}
          transition={{ 
            x: { repeat: Infinity, repeatType: "loop", duration: 20, ease: "linear" },
          }}
        >
          {[...menuItems, ...menuItems].map((item, index) => (
            <MenuItem key={index} {...item} />
          ))}
        </motion.div>
      </div>
    </div>

    <div className="flex justify-center mt-4 sm:mt-6">
      <Link href="/inspect-menu">
        <motion.button 
          className="bg-c9 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base md:text-lg font-semibold shadow-lg hover:bg-c8 transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Explore Full Menu
        </motion.button>
      </Link>
    </div>
  </div>
 );
};

export default MenuPreview;
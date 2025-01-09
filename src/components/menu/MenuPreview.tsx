// components/MenuPreview.tsx
'use client';
import Image from "next/image";
import Link from "next/link";

const MenuPreview = () => {
 return (
   <div className="w-full h-[50vh] bg-pink-500 flex items-center justify-center">
     <div className="container mx-auto px-4">
       <h2 className="text-3xl font-bold text-center text-white mb-8">Preview Our Menu</h2>
       
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {/* House Specialties */}
         <div className="rounded-lg overflow-hidden bg-white text-center">
           <div className="relative h-48">
             <Image
               src="/menu/spc-001.jpg"
               alt="Classic Beef Wellington"
               fill
               className="object-cover"
             />
           </div>
           <div className="p-4">
             <h3 className="text-xl font-semibold text-black">House Specialties</h3>
             <p className="text-black">Classic Beef Wellington</p>
           </div>
         </div>

         {/* Main Courses */}
         <div className="rounded-lg overflow-hidden bg-white text-center">
           <div className="relative h-48">
             <Image
               src="/menu/mns-001.jpg"
               alt="Slow Cooked Pork Ribs"
               fill
               className="object-cover"
             />
           </div>
           <div className="p-4">
             <h3 className="text-xl font-semibold text-black">Main Courses</h3>
             <p className="text-black">Slow Cooked Pork Ribs</p>
           </div>
         </div>

         {/* Desserts */}
         <div className="rounded-lg overflow-hidden bg-white text-center">
           <div className="relative h-48">
             <Image
               src="/menu/des-001.jpg"
               alt="BSK Sundae"
               fill
               className="object-cover"
             />
           </div>
           <div className="p-4">
             <h3 className="text-xl font-semibold text-black">Desserts</h3>
             <p className="text-black">BSK Sundae</p>
           </div>
         </div>
       </div>

       <div className="flex justify-end mt-8">
            <Link href="/menu">
                <button className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
                    View Options
                </button>
            </Link>
        </div>
     </div>
   </div>
 );
};

export default MenuPreview;
'use client'

import Link from 'next/link'

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow rounded-lg mx-5 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 font-bold">
          {/* Left side navigation links */}
          <div className="flex items-center">
            <div className="flex space-x-4">
              <Link href="/" className="text-black font-bold hover:text-red-700 px-3 py-2 rounded-md text-sm">
                Home
              </Link>
              {/* <Link href="/seats" className="text-black font-bold hover:text-red-700 px-3 py-2 rounded-md text-sm">
                seats
              </Link> */}
              <Link href="/menu" className="text-black font-bold hover:text-red-700 px-3 py-2 rounded-md text-sm">
                Menu
              </Link>
            </div>
          </div>

          {/* Right side authentication section */}
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-black font-bold hover:text-red-700 px-3 py-2 rounded-md text-sm">
            dashboard
            </Link>
            <Link href="/profile" className="text-black font-bold hover:text-red-700 px-3 py-2 rounded-md text-sm">
              profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
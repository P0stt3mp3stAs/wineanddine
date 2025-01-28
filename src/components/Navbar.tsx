'use client'

import Link from 'next/link'
import { useState } from 'react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-2 border-c9 shadow-lg rounded-3xl mx-2 sm:mx-5 z-50 my-2">
      <div className="mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 font-bold">
          {/* Left Menu Items */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="text-c9 hover:text-c5 hover:bg-c9 px-3 py-2 rounded-xl text-sm transition-colors duration-200">
              Home
            </Link>
            <Link href="/inspect-menu" className="text-c9 hover:text-c5 hover:bg-c9 px-3 py-2 rounded-xl text-sm transition-colors duration-200">
              Menu
            </Link>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
            <img src="/wineNdine.png" alt="logo" className="h-8 sm:h-10" />
          </div>

          {/* Right Menu Items */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/dashboard" className="text-c9 hover:text-c9 hover:bg-c7 px-3 py-2 rounded-xl text-sm transition-colors duration-200">
              Dashboard
            </Link>
            <Link href="/profile" className="text-c9 hover:text-c9 hover:bg-c7 px-3 py-2 rounded-xl text-sm transition-colors duration-200">
              Profile
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-c9 hover:text-c5 hover:bg-c9 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-c9"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="text-c9 hover:text-c5 hover:bg-c9 block px-3 py-2 rounded-md text-base font-medium">
              Home
            </Link>
            <Link href="/inspect-menu" className="text-c9 hover:text-c5 hover:bg-c9 block px-3 py-2 rounded-md text-base font-medium">
              Menu
            </Link>
            <Link href="/dashboard" className="text-c9 hover:text-c9 hover:bg-c7 block px-3 py-2 rounded-md text-base font-medium">
              Dashboard
            </Link>
            <Link href="/profile" className="text-c9 hover:text-c9 hover:bg-c7 block px-3 py-2 rounded-md text-base font-medium">
              Profile
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
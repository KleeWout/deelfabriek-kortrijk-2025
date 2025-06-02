"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

export default function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between p-4 border-b-1 border-primarygreen-2 bg-white">
      <Link href="/mobile">
        <Image src="/deelfabriek-website-labels-boven_v2.svg" alt="Logo deelfabriek" width={150} height={150} />
      </Link>
      {/* Burger button */}
      <button className="top-4 right-4 z-20 flex flex-col justify-center items-center w-10 h-10" onClick={() => setOpen(!open)} aria-label="Open menu">
        <span className={`block h-1 w-8 bg-primarygreen-1 rounded transition-all duration-500 ${open ? "rotate-45 translate-y-2 bg-white" : ""}`}></span>
        <span className={`block h-1 w-8 bg-primarygreen-1 rounded my-1 transition-all duration-500 ${open ? "opacity-0 bg-white" : ""}`}></span>
        <span className={`block h-1 w-8 bg-primarygreen-1 rounded transition-all duration-500 ${open ? "-rotate-45 -translate-y-2 bg-white" : ""}`}></span>
      </button>
      {/* Menu */}
      <div className={`fixed top-0 right-0 h-full bg-primarygreen-1 w-full z-10 transition-transform duration-500 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <ul className="">
          <li>
            <a href="#" className="text-lg text-white">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="text-lg text-white">
              Items
            </a>
          </li>
          <li>
            <a href="#" className="text-lg text-white">
              Info
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

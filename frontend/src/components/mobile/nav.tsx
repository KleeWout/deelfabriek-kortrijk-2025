"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { House, Package } from "@phosphor-icons/react";

export default function Navigation() {
  const [open, setOpen] = useState(false);

  // Close menu when a link is clicked
  const handleClose = () => setOpen(false);

  return (
    <nav
      className={`flex items-center justify-between p-4 border-b border-primarygreen-2 bg-white relative z-30${
        open ? " fixed inset-0" : ""
      }`}
    >
      <Link href="/" onClick={handleClose}>
        <Image
          src="/deelfabriek-website-labels-boven_v2.svg"
          alt="Logo deelfabriek"
          width={150}
          height={150}
        />
      </Link>
      {/* Desktop/Tablet inline nav */}
      <ul className="hidden md:flex gap-6 ml-8">
        <li>
          <Link
            href="/"
            className="flex items-center gap-2 text-lg text-primarygreen-1 font-semibold"
          >
            <House size={22} weight="fill" /> Home
          </Link>
        </li>
        <li>
          <Link
            href="/items"
            className="flex items-center gap-2 text-lg text-primarygreen-1 font-semibold"
          >
            <Package size={22} weight="fill" /> Items
          </Link>
        </li>
      </ul>
      {/* Burger button for mobile */}
      <button
        className={`md:hidden ${open ? "fixed" : ""} top-6 right-6 z-60 flex flex-col justify-center items-center w-10 h-10`}
        onClick={() => setOpen(!open)}
        aria-label={open ? "Sluit menu" : "Open menu"}
      >
        <span
          className={`block h-1 w-8 rounded transition-all duration-300
            ${open ? "rotate-45 translate-y-2 bg-white" : "bg-primarygreen-1"}
          `}
        ></span>
        <span
          className={`block h-1 w-8 rounded my-1 transition-all duration-300
            ${open ? "opacity-0 bg-white" : "bg-primarygreen-1"}
          `}
        ></span>
        <span
          className={`block h-1 w-8 rounded transition-all duration-300
            ${open ? "-rotate-45 -translate-y-2 bg-white" : "bg-primarygreen-1"}
          `}
        ></span>
      </button>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={handleClose}
        ></div>
      )}
      {/* Fullscreen Mobile Menu */}
      <div
        className={`fixed inset-0 bg-primarygreen-1 z-50 transition-transform duration-500 ${
          open ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
        style={{ transitionProperty: "transform" }}
      >
        <ul
          className="flex flex-col gap-10 text-left pl-8 pr-4"
          style={{
            position: "absolute",
            top: "20%",
            left: 0,
            width: "100%",
          }}
        >
          <li>
            <Link
              href="/"
              className="flex items-center gap-3 text-2xl text-white font-semibold"
              onClick={handleClose}
            >
              <House size={32} weight="fill" /> Home
            </Link>
          </li>
          <li>
            <Link
              href="/items"
              className="flex items-center gap-3 text-2xl text-white font-semibold"
              onClick={handleClose}
            >
              <Package size={32} weight="fill" /> Items
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

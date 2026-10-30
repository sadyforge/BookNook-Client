
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "All Books", href: "/books" },
  { name: "Add Book", href: "/add-book" },
  { name: "My Books", href: "/my-books" },
  { name: "My Borrows", href: "/my-borrows" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLight, setIsLight] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("booknook-theme");
    const lightMode = savedTheme !== "dark";

    setIsLight(lightMode);

    document.documentElement.setAttribute(
      "data-theme",
      lightMode ? "light" : "dark"
    );
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isLight;

    setIsLight(nextTheme);

    document.documentElement.setAttribute(
      "data-theme",
      nextTheme ? "light" : "dark"
    );

    localStorage.setItem(
      "booknook-theme",
      nextTheme ? "light" : "dark"
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#e8e0d5] bg-[#faf8f3]/95 text-[#292720] backdrop-blur-md">
      <nav className="mx-auto flex h-[84px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d8c8b5] text-[#80674e]">
            <BookOpen size={22} strokeWidth={1.5} />
          </div>

          <div>
            <h1 className="font-serif text-[27px] font-semibold leading-none tracking-tight">
              BookNook<span className="text-[#9b7958]">.</span>
            </h1>

            <p className="mt-1.5 text-[9px] font-medium uppercase tracking-[2.5px] text-[#827b70]">
              A world between pages
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-7 xl:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative py-2 text-[13px] font-medium tracking-wide text-[#625d53] transition-colors duration-200 hover:text-[#9b7958] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#9b7958] after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
            title={isLight ? "Dark Mode" : "Light Mode"}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e3dbcf] text-[#625d53] transition hover:border-[#9b7958] hover:text-[#9b7958]"
          >
            {isLight ? <Moon size={17} /> : <Sun size={17} />}
          </button>

          <Link
            href="/login"
            className="px-3 py-2 text-[13px] font-medium text-[#625d53] transition hover:text-[#9b7958]"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="border border-[#80674e] bg-[#80674e] px-5 py-3 text-[12px] font-semibold uppercase tracking-[1.5px] text-white transition hover:border-[#624c37] hover:bg-[#624c37]"
          >
            Get Started
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e3dbcf] text-[#625d53] transition hover:text-[#9b7958]"
          >
            {isLight ? <Moon size={17} /> : <Sun size={17} />}
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center border border-[#e3dbcf] text-[#292720]"
          >
            {isOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="border-t border-[#e8e0d5] bg-[#faf8f3] px-5 py-5 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="border-b border-[#eee7dc] px-3 py-3.5 font-serif text-[17px] text-[#625d53] transition hover:text-[#9b7958]"
              >
                {link.name}
              </Link>
            ))}

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="border border-[#d8c8b5] px-4 py-3 text-center text-[12px] font-semibold uppercase tracking-wider text-[#625d53] transition hover:border-[#9b7958]"
              >
                Login
              </Link>

              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="border border-[#80674e] bg-[#80674e] px-4 py-3 text-center text-[12px] font-semibold uppercase tracking-wider text-white transition hover:bg-[#624c37]"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

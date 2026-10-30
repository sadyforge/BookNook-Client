
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  UserRound,
  LogOut,
  Library,
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
  const [isLight, setIsLight] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("booknook-theme");
    const lightMode = savedTheme === "light";

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
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-xl transition-colors duration-300">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400 text-[#06131d] shadow-lg shadow-emerald-500/20">
            <BookOpen size={24} strokeWidth={2.5} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-[var(--foreground)]">
              Book<span className="text-emerald-500">Nook</span>
            </h1>

            <p className="text-[9px] font-medium tracking-[2px] text-[var(--muted)]">
              YOUR DIGITAL LIBRARY
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-6 xl:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-sm font-medium text-[var(--muted)] transition-colors duration-200 hover:text-emerald-500"
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
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] transition hover:border-emerald-500 hover:text-emerald-500"
          >
            {isLight ? <Moon size={19} /> : <Sun size={19} />}
          </button>

          <Link
            href="/login"
            className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-emerald-500 hover:text-emerald-500"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-[#06131d] transition hover:bg-emerald-300"
          >
            Get Started
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] transition hover:text-emerald-500"
          >
            {isLight ? <Moon size={19} /> : <Sun size={19} />}
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--foreground)]"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="border-t border-[var(--border)] bg-[var(--background)] px-5 py-5 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-[var(--foreground)] transition hover:bg-emerald-500/10 hover:text-emerald-500"
              >
                {link.name}
              </Link>
            ))}

            <div className="mt-3 grid grid-cols-2 gap-3">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="rounded-xl border border-[var(--border)] px-4 py-3 text-center text-sm font-semibold text-[var(--foreground)]"
              >
                Login
              </Link>

              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="rounded-xl bg-emerald-400 px-4 py-3 text-center text-sm font-semibold text-[#06131d]"
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

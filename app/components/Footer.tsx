
"use client";

import Link from "next/link";
import {
  BookOpen,
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
  Heart,
} from "lucide-react";
import { BsFacebook, BsInstagram, BsGithub } from "react-icons/bs";
import { useState, useEffect } from "react";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "All Books", href: "/books" },
  { name: "Add Book", href: "/add-book" },
  { name: "My Books", href: "/my-books" },
  { name: "My Borrows", href: "/my-borrows" },
];

const exploreLinks = [
  { name: "Popular Books", href: "/books" },
  { name: "New Arrivals", href: "/books" },
  { name: "My Profile", href: "/profile" },
];

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="relative overflow-hidden border-t border-[#e8e0d5] bg-[#f3efe7] text-[#292720]">
      <div className="mx-auto max-w-[1440px] px-6 pb-6 pt-16 lg:px-12">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d8c8b5] text-[#80674e]">
                <BookOpen size={23} strokeWidth={1.5} />
              </div>

              <div>
                <span className="font-serif text-2xl font-semibold tracking-tight">
                  BookNook<span className="text-[#9b7958]">.</span>
                </span>

                <p className="mt-1 text-[9px] font-medium uppercase tracking-[2.5px] text-[#827b70]">
                  A world between pages
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-xs text-sm leading-7 text-[#777064]">
              Discover new stories, explore different worlds, and make
              reading a part of your everyday life. Your next favorite book
              is waiting for you.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e0d7ca] text-[#625d53] transition hover:border-[#80674e] hover:bg-[#80674e] hover:text-white"
              >
                <BsFacebook size={17} />
              </a>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e0d7ca] text-[#625d53] transition hover:border-[#80674e] hover:bg-[#80674e] hover:text-white"
              >
                <BsInstagram size={17} />
              </a>

              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e0d7ca] text-[#625d53] transition hover:border-[#80674e] hover:bg-[#80674e] hover:text-white"
              >
                <BsGithub size={17} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-xl font-semibold">
              Quick Links
            </h3>

            <div className="mt-6 flex flex-col gap-4">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="group flex w-fit items-center gap-2 text-sm text-[#777064] transition hover:text-[#9b7958]"
                >
                  <span className="h-1 w-1 rounded-full bg-[#b9a58d] transition group-hover:bg-[#80674e]" />
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-serif text-xl font-semibold">
              Explore
            </h3>

            <div className="mt-6 flex flex-col gap-4">
              {exploreLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="group flex w-fit items-center gap-2 text-sm text-[#777064] transition hover:text-[#9b7958]"
                >
                  {link.name}

                  <ArrowUpRight
                    size={14}
                    className="opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                </Link>
              ))}
            </div>

            <div className="mt-7 border-l-2 border-[#9b7958] bg-[#eae3d8] p-4">
              <p className="font-serif text-base font-semibold text-[#80674e]">
                A little reading goes a long way.
              </p>

              <p className="mt-2 text-xs leading-5 text-[#777064]">
                Find a book today and start a new adventure.
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-xl font-semibold">
              Get in Touch
            </h3>

            <div className="mt-6 flex flex-col gap-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-[#9b7958]">
                  <Mail size={18} strokeWidth={1.5} />
                </div>

                <div>
                  <p className="text-xs text-[#92897c]">Email Us</p>
                  <p className="mt-1 break-all text-sm text-[#625d53]">
                    hello@booknook.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-[#9b7958]">
                  <Phone size={18} strokeWidth={1.5} />
                </div>

                <div>
                  <p className="text-xs text-[#92897c]">Call Us</p>
                  <p className="mt-1 text-sm text-[#625d53]">
                    +880 1700-000000
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-[#9b7958]">
                  <MapPin size={18} strokeWidth={1.5} />
                </div>

                <div>
                  <p className="text-xs text-[#92897c]">Our Location</p>
                  <p className="mt-1 text-sm text-[#625d53]">
                    Bangladesh
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-[#e0d7ca] pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <p className="text-xs leading-6 text-[#92897c]">
              © {year ?? 2026} BookNook. All rights reserved.
            </p>

            <p className="flex items-center gap-1.5 text-xs text-[#92897c]">
              Made with
              <Heart
                size={13}
                className="fill-[#9b7958] text-[#9b7958]"
              />
              for book lovers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

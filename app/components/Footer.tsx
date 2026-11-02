
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
    <footer className="relative overflow-hidden border-t border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] transition-colors duration-300">
      <div className="mx-auto max-w-[1440px] px-6 pb-6 pt-16 lg:px-12">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] text-[var(--accent)]">
                <BookOpen size={23} strokeWidth={1.5} />
              </div>

              <div>
                <span className="font-serif text-2xl font-semibold tracking-tight">
                  BookNook<span className="text-[var(--accent)]">.</span>
                </span>

                <p className="mt-1 text-[9px] font-medium uppercase tracking-[2.5px] text-[var(--muted)]">
                  A world between pages
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-xs text-sm leading-7 text-[var(--muted)]">
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
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white"
              >
                <BsFacebook size={17} />
              </a>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white"
              >
                <BsInstagram size={17} />
              </a>

              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white"
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
                  className="group flex w-fit items-center gap-2 text-sm text-[var(--muted)] transition hover:text-[var(--accent)]"
                >
                  <span className="h-1 w-1 rounded-full bg-[var(--accent)] transition" />
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
                  className="group flex w-fit items-center gap-2 text-sm text-[var(--muted)] transition hover:text-[var(--accent)]"
                >
                  {link.name}

                  <ArrowUpRight
                    size={14}
                    className="opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                </Link>
              ))}
            </div>

            <div className="mt-7 border-l-2 border-[var(--accent)] bg-[var(--background)] p-4">
              <p className="font-serif text-base font-semibold text-[var(--accent)]">
                A little reading goes a long way.
              </p>

              <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
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
                <div className="mt-0.5 text-[var(--accent)]">
                  <Mail size={18} strokeWidth={1.5} />
                </div>

                <div>
                  <p className="text-xs text-[var(--muted)]">Email Us</p>
                  <p className="mt-1 break-all text-sm text-[var(--foreground)]">
                    hello@booknook.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-[var(--accent)]">
                  <Phone size={18} strokeWidth={1.5} />
                </div>

                <div>
                  <p className="text-xs text-[var(--muted)]">Call Us</p>
                  <p className="mt-1 text-sm text-[var(--foreground)]">
                    +880 1700-000000
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-[var(--accent)]">
                  <MapPin size={18} strokeWidth={1.5} />
                </div>

                <div>
                  <p className="text-xs text-[var(--muted)]">Our Location</p>
                  <p className="mt-1 text-sm text-[var(--foreground)]">
                    Bangladesh
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-[var(--border)] pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <p className="text-xs leading-6 text-[var(--muted)]">
              © {year ?? 2026} BookNook. All rights reserved.
            </p>

            <p className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
              Made with
              <Heart
                size={13}
                className="fill-[var(--accent)] text-[var(--accent)]"
              />
              for book lovers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

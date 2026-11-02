
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Menu,
  X,
  Sun,
  Moon,
  UserRound,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const publicLinks = [
  { name: "Home", href: "/" },
  { name: "All Books", href: "/all-books" },
];

const privateLinks = [
  { name: "Add Book", href: "/add-book" },
  { name: "My Books", href: "/my-books" },
  { name: "My Borrows", href: "/my-borrows" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLight, setIsLight] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { data: session } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    const savedTheme = localStorage.getItem("booknook-theme");
    const theme = savedTheme === "dark" ? "dark" : "light";

    setIsLight(theme === "light");
    document.documentElement.setAttribute("data-theme", theme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const theme = isLight ? "dark" : "light";

    setIsLight(theme === "light");
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("booknook-theme", theme);
  };

  const handleLogout = async () => {
    const { error } = await authClient.signOut();

    if (error) {
      toast.error(error.message ?? "Failed to log out!");
      return;
    }

    setProfileOpen(false);
    setIsOpen(false);
    toast.success("Logged out successfully!");
    window.location.href = "/";
  };

  const links = user ? [...publicLinks, ...privateLinks] : publicLinks;

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]">
        <nav className="mx-auto flex h-[84px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] text-[var(--accent)]">
              <BookOpen size={22} strokeWidth={1.5} />
            </div>
            <h1 className="font-serif text-[27px] font-semibold text-[var(--foreground)]">
              BookNook<span className="text-[var(--accent)]">.</span>
            </h1>
          </Link>
        </nav>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/95 text-[var(--foreground)] backdrop-blur-md">
      <nav className="mx-auto flex h-[84px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] text-[var(--accent)]">
            <BookOpen size={22} strokeWidth={1.5} />
          </div>

          <div>
            <h1 className="font-serif text-[27px] font-semibold leading-none tracking-tight">
              BookNook<span className="text-[var(--accent)]">.</span>
            </h1>
            <p className="mt-1.5 text-[9px] font-medium uppercase tracking-[2.5px] text-[var(--muted)]">
              A world between pages
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-7 xl:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative py-2 text-[13px] font-medium tracking-wide text-[var(--muted)] transition-colors duration-200 hover:text-[var(--accent)] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[var(--accent)] after:transition-all after:duration-300 hover:after:w-full"
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
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            {isLight ? <Moon size={17} /> : <Sun size={17} />}
          </button>

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-full border border-[var(--border)] p-1.5 transition hover:border-[var(--accent)]"
                aria-label="Open profile menu"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--accent)]">
                    <UserRound size={19} />
                  </div>
                )}
                <ChevronDown size={15} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-14 z-50 w-56 border border-[var(--border)] bg-[var(--surface)] p-2 text-[var(--foreground)] shadow-lg">
                  <div className="border-b border-[var(--border)] px-3 py-3">
                    <p className="truncate text-sm font-semibold">{user.name}</p>
                    <p className="truncate text-xs text-[var(--muted)]">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-3 text-sm transition hover:bg-[var(--background)]"
                  >
                    <UserRound size={16} />
                    My Profile
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-3 py-3 text-sm text-red-600 transition hover:bg-[var(--background)]"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-2 text-[13px] font-medium text-[var(--muted)] transition hover:text-[var(--accent)]"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="border border-[var(--accent)] bg-[var(--accent)] px-5 py-3 text-[12px] font-semibold uppercase tracking-[1.5px] text-white transition hover:opacity-85"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--foreground)] transition hover:text-[var(--accent)]"
          >
            {isLight ? <Moon size={17} /> : <Sun size={17} />}
          </button>

          {user && (
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[var(--border)]"
              aria-label="Open profile menu"
            >
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound size={19} />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center border border-[var(--border)]"
          >
            {isOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </nav>

      {profileOpen && user && (
        <div className="absolute right-5 top-[74px] z-[60] w-56 border border-[var(--border)] bg-[var(--surface)] p-2 text-[var(--foreground)] shadow-lg lg:hidden">
          <p className="truncate border-b border-[var(--border)] px-3 py-3 text-sm font-semibold">
            {user.name}
          </p>
          <p className="truncate px-3 py-1 text-xs text-[var(--muted)]">
            {user.email}
          </p>
          <Link
            href="/profile"
            onClick={() => setProfileOpen(false)}
            className="flex items-center gap-2 px-3 py-3 text-sm hover:bg-[var(--background)]"
          >
            <UserRound size={16} />
            My Profile
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-3 py-3 text-sm text-red-600 hover:bg-[var(--background)]"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}

      {isOpen && (
        <div className="border-t border-[var(--border)] bg-[var(--background)] px-5 py-5 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="border-b border-[var(--border)] px-3 py-3.5 font-serif text-[17px] text-[var(--muted)] transition hover:text-[var(--accent)]"
              >
                {link.name}
              </Link>
            ))}

            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="mt-4 flex items-center justify-center gap-2 border border-red-300 px-4 py-3 text-sm font-semibold text-red-600"
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="border border-[var(--border)] px-4 py-3 text-center text-[12px] font-semibold uppercase tracking-wider text-[var(--foreground)] transition hover:border-[var(--accent)]"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="border border-[var(--accent)] bg-[var(--accent)] px-4 py-3 text-center text-[12px] font-semibold uppercase tracking-wider text-white transition hover:opacity-85"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

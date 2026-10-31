
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  UserRound,
  LibraryBig,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface Book {
  _id?: string;
  id?: string;
  title: string;
  author: string;
  category: string;
  image?: string;
  description?: string;
  totalCopies?: number;
  availableCopies?: number;
}

const MyBookPage = () => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPending) return;

    if (!user?.email) {
      setBooks([]);
      setLoading(false);
      return;
    }

    const fetchMyBooks = async () => {
      try {
        const res = await fetch(
          `http://localhost:3002/all-books/${encodeURIComponent(user.email)}`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch books");
        }

        const data = await res.json();

        setBooks(Array.isArray(data) ? data : data.books ?? []);
      } catch (error) {
        console.error("Error fetching my books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBooks();
  }, [user?.email, isPending]);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="border-b border-[var(--border)] bg-[var(--surface)] px-5 py-14 text-center sm:py-20">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--border)] text-[var(--accent)]">
          <LibraryBig size={30} strokeWidth={1.5} />
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-[3px] text-[var(--accent)]">
          Your Personal Collection
        </p>

        <h1 className="font-serif text-4xl font-semibold sm:text-5xl">
          My Books
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[var(--muted)]">
          Manage and explore the books you have added to your personal library.
        </p>

        <Link
          href="/add-book"
          className="mt-7 inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Plus size={18} />
          Add New Book
        </Link>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-serif text-2xl font-semibold">
              Your Collection
            </h2>

            <p className="mt-2 text-sm text-[var(--muted)]">
              {loading || isPending
                ? "Loading your books..."
                : `${books.length} books in your collection`}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
            <BookOpen size={18} />
            Personal Library
          </div>
        </div>

        {isPending || loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <span className="loading loading-spinner loading-lg text-[var(--accent)]" />
          </div>
        ) : !user ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-[var(--border)] text-center">
            <UserRound size={42} className="mb-4 text-[var(--muted)]" />

            <h3 className="font-serif text-xl font-semibold">
              Login Required
            </h3>

            <p className="mt-2 text-sm text-[var(--muted)]">
              Please login to view your personal collection.
            </p>

            <Link
              href="/login"
              className="mt-5 rounded-md bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white"
            >
              Login
            </Link>
          </div>
        ) : books.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-[var(--border)] px-5 text-center">
            <BookOpen
              size={48}
              strokeWidth={1.3}
              className="mb-4 text-[var(--muted)]"
            />

            <h3 className="font-serif text-2xl font-semibold">
              Your Library is Empty
            </h3>

            <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--muted)]">
              You haven't added any books yet. Start building your personal
              collection today.
            </p>

            <Link
              href="/add-book"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <Plus size={17} />
              Add Your First Book
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((book, index) => (
              <article
                key={book._id ?? book.id ?? `${book.title}-${index}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-lg bg-[var(--background)]">
                  {book.image ? (
                    <img
                      src={book.image}
                      alt={book.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <BookOpen
                      size={65}
                      strokeWidth={1}
                      className="text-[var(--accent)]"
                    />
                  )}

                  <span className="absolute left-3 top-3 rounded-full bg-[var(--surface)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)] shadow-sm">
                    {book.category}
                  </span>
                </div>

                <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
                  <h3 className="line-clamp-1 font-serif text-xl font-semibold">
                    {book.title}
                  </h3>

                  <p className="mt-2 flex items-center gap-2 text-sm text-[var(--muted)]">
                    <UserRound size={15} />
                    {book.author}
                  </p>

                  {book.description && (
                    <p className="mt-3 line-clamp-2 text-xs leading-6 text-[var(--muted)]">
                      {book.description}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] py-3">
                    <span className="text-xs text-[var(--muted)]">
                      {book.availableCopies ?? book.totalCopies ?? 0} /{" "}
                      {book.totalCopies ?? 0} Copies
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        (book.availableCopies ?? book.totalCopies ?? 0) > 0
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {(book.availableCopies ?? book.totalCopies ?? 0) > 0
                        ? "Available"
                        : "Unavailable"}
                    </span>
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 rounded-lg border border-[var(--accent)] px-3 py-2.5 text-xs font-semibold text-[var(--accent)] transition hover:bg-[var(--accent)] hover:text-white"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>

                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 rounded-lg border border-red-500/50 px-3 py-2.5 text-xs font-semibold text-red-500 transition hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default MyBookPage;

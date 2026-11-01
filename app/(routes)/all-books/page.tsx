
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  UserRound,
  LibraryBig,
} from "lucide-react";
import { toast } from "react-hot-toast";
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
  userName?: string;
  userEmail?: string;
}

export default function AllBooksPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  console.log(user,)

  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);




 useEffect(() => {
  if (isPending) return;

  if (!user?.email) {
    setBooks([]);
    setLoading(false);
    return;
  }

  const fetchBooks = async () => {
    setLoading(true);
    const {data,error}=await authClient.token()
    const token=data?.token
    try {
      const [allBooksRes, defaultRes] = await Promise.all([
        fetch(
          `http://localhost:3002/all-books/${encodeURIComponent(user.email)}`,
          {headers:{authorization:`Bearer ${token }`}, cache: "no-store" }
        ),
        fetch("http://localhost:3002/default", {
          cache: "no-store",
        }),
      ]);

      if (!allBooksRes.ok || !defaultRes.ok) {
        throw new Error("Failed to fetch books");
      }

      const allBooksData = await allBooksRes.json();
      const defaultData = await defaultRes.json();

      const allBooks = Array.isArray(allBooksData)
        ? allBooksData
        : allBooksData.books ?? [];

      const defaultBooks = Array.isArray(defaultData)
        ? defaultData
        : defaultData.books ?? [];

      setBooks([...allBooks, ...defaultBooks]);
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error("Could not load books!");
    } finally {
      setLoading(false);
    }
  };

  fetchBooks();
}, [user?.email, isPending]);





  const categories = [
    "All",
    ...new Set(books.map((book) => book.category).filter(Boolean)),
  ];

  const filteredBooks = books.filter((book) => {
    const matchesSearch = `${book.title} ${book.author}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || book.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="border-b border-[var(--border)] bg-[var(--surface)] px-5 py-12 text-center sm:py-16">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border)] text-[var(--accent)]">
          <LibraryBig size={27} strokeWidth={1.5} />
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-[3px] text-[var(--accent)]">
          Explore Your Collection
        </p>

        <h1 className="font-serif text-4xl font-semibold sm:text-5xl">
          All Books
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[var(--muted)]">
          Explore all the books you have added to your personal library.
        </p>

        <div className="mx-auto mt-8 flex max-w-xl items-center gap-3 rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-3">
          <Search size={19} className="shrink-0 text-[var(--muted)]" />

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by book title or author..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-serif text-2xl font-semibold">
              Library Collection
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              {loading || isPending
                ? "Loading books..."
                : `${filteredBooks.length} books found`}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                  category === item
                    ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                    : "border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent)]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {isPending || loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <span className="loading loading-spinner loading-lg text-[var(--accent)]" />
          </div>
        ) : !user ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-[var(--border)] px-5 text-center">
            <UserRound
              size={40}
              className="mb-4 text-[var(--muted)]"
            />

            <h3 className="font-serif text-xl font-semibold">
              Login Required
            </h3>

            <p className="mt-2 text-sm text-[var(--muted)]">
              Please login to see your books.
            </p>

            <Link
              href="/login"
              className="mt-5 rounded-md bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white"
            >
              Login
            </Link>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-[var(--border)] px-5 text-center">
            <BookOpen size={40} className="mb-4 text-[var(--muted)]" />

            <h3 className="font-serif text-xl font-semibold">
              No Books Found
            </h3>

            <p className="mt-2 text-sm text-[var(--muted)]">
              Try another search term or choose a different category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="mt-5 text-sm font-semibold text-[var(--accent)] hover:underline"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBooks.map((book, index) => (
              <article
                key={book._id ?? book.id ?? `${book.title}-${index}`}
                className="group overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative flex h-64 items-center justify-center overflow-hidden bg-[var(--background)]">
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

                  <span className="absolute left-3 top-3 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)]">
                    {book.category}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="line-clamp-1 font-serif text-xl font-semibold transition-colors group-hover:text-[var(--accent)]">
                    {book.title}
                  </h3>

                  <p className="mt-2 flex items-center gap-2 text-sm text-[var(--muted)]">
                    <UserRound size={15} />
                    {book.author}
                  </p>

                  {book.description && (
                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
                      {book.description}
                    </p>
                  )}

                  <div className="mt-5 flex items-center justify-between border-t border-[var(--border)] pt-4">
                    <span className="text-xs text-[var(--muted)]">
                      Total Copies: {book.totalCopies ?? 0}
                    </span>

                    <span
                      className={`text-xs font-semibold ${
                        (book.availableCopies ?? book.totalCopies ?? 0) > 0
                          ? "text-emerald-600"
                          : "text-red-500"
                      }`}
                    >
                      {(book.availableCopies ?? book.totalCopies ?? 0) > 0
                        ? "Available"
                        : "Unavailable"}
                    </span>
                  </div>

                  <Link
                    href={`/all-books/${book._id ?? book.id}`}
                    className="mt-5 block w-full rounded-md border border-[var(--accent)] px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--accent)] transition hover:bg-[var(--accent)] hover:text-white"
                  >
                    View Details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
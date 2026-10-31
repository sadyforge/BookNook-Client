
"use client";

import {
  Suspense,
  use,
  useCallback,
  useEffect,
  useState,
} from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  UserRound,
  LibraryBig,
  BookMarked,
  User,
  X,
  CalendarDays,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

interface Book {
  _id: string;
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

interface PageProps {
  params: Promise<{ id: string }>;
}

function getLocalDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function BookDetailContent({ params }: PageProps) {
  const { id } = use(params);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [returnDate, setReturnDate] = useState("");
  const [borrowing, setBorrowing] = useState(false);
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(getLocalDate());
  }, []);

  const fetchBook = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const res = await fetch(
          `http://localhost:3002/books/${encodeURIComponent(id)}`,
          {
            cache: "no-store",
            signal,
          }
        );

        if (!res.ok) {
          throw new Error(
            res.status === 404
              ? "Book not found"
              : "Failed to fetch book details"
          );
        }

        const data = await res.json();
        const bookData = data.book ?? data;

        if (!bookData?._id) {
          throw new Error("Invalid book information received");
        }

        setBook(bookData);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        console.error("Error fetching book:", error);
        setBook(null);
        toast.error(
          error instanceof Error ? error.message : "Could not load book details!"
        );
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [id]
  );

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setBook(null);

    fetchBook(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchBook]);

  const handleBorrow = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (borrowing) return;

    if (!user) {
      toast.error("Please login to borrow this book!");
      return;
    }

    if (!book) {
      toast.error("Book information is unavailable!");
      return;
    }

    const availableCopies =
      book.availableCopies ?? book.totalCopies ?? 0;

    if (availableCopies <= 0) {
      toast.error("This book is currently unavailable!");
      return;
    }

    const currentDate = getLocalDate();

    if (!returnDate || returnDate <= currentDate) {
      toast.error("Return date must be after today!");
      return;
    }

    setBorrowing(true);

    try {
      const tokenResponse = await authClient.token();
      const token = tokenResponse.data?.token;

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      const res = await fetch("http://localhost:3002/borrows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookId: book._id,
          bookTitle: book.title,
          bookImage: book.image || "",
          returnDate,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to borrow book");
      }

      toast.success("Book borrowed successfully!");

      setShowModal(false);
      setReturnDate("");
      setLoading(true);

      await fetchBook();
    } catch (error) {
      console.error("Borrow error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong!"
      );
    } finally {
      setBorrowing(false);
    }
  };

  if (loading || isPending || !today) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <span className="loading loading-spinner loading-lg text-[var(--accent)]" />
      </main>
    );
  }

  if (!book) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-5 text-center text-[var(--foreground)]">
        <BookOpen
          size={56}
          className="mb-4 text-[var(--accent)]"
        />

        <h1 className="font-serif text-3xl font-semibold">
          Book Not Found
        </h1>

        <p className="mt-3 text-sm text-[var(--muted)]">
          Sorry, we couldn't find this book in our library.
        </p>

        <Link
          href="/all-books"
          className="mt-6 rounded-md bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white"
        >
          Back to All Books
        </Link>
      </main>
    );
  }

  const availableCopies =
    book.availableCopies ?? book.totalCopies ?? 0;

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="border-b border-[var(--border)] bg-[var(--surface)] px-5 py-8 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/all-books"
            className="inline-flex items-center gap-2 text-sm text-[var(--muted)] transition hover:text-[var(--accent)]"
          >
            <ArrowLeft size={17} />
            Back to All Books
          </Link>

          <div className="mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[3px] text-[var(--accent)]">
            <LibraryBig size={17} />
            Book Details
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
          <div className="flex min-h-[350px] items-center justify-center overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 sm:min-h-[480px]">
            {book.image ? (
              <img
                src={book.image}
                alt={book.title}
                className="max-h-[450px] w-full rounded-md object-contain"
              />
            ) : (
              <BookOpen
                size={110}
                strokeWidth={1}
                className="text-[var(--accent)]"
              />
            )}
          </div>

          <div className="flex flex-col justify-center">
            <span className="w-fit rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
              {book.category}
            </span>

            <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
              {book.title}
            </h1>

            <p className="mt-4 flex items-center gap-2 text-base text-[var(--muted)]">
              <UserRound size={19} />
              By {book.author}
            </p>

            <div className="my-7 h-px w-full bg-[var(--border)]" />

            <h2 className="font-serif text-xl font-semibold">
              About This Book
            </h2>

            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[var(--muted)]">
              {book.description ||
                "No description available for this book."}
            </p>

            <div className="my-7 h-px w-full bg-[var(--border)]" />

            <h2 className="font-serif text-xl font-semibold">
              Book Information
            </h2>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-4">
                <div className="flex items-center gap-2 text-[var(--accent)]">
                  <BookOpen size={18} />
                  <span className="text-xs font-medium">
                    Total Copies
                  </span>
                </div>

                <p className="mt-3 font-serif text-2xl font-semibold">
                  {book.totalCopies ?? 0}
                </p>
              </div>

              <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-4">
                <div className="flex items-center gap-2 text-[var(--accent)]">
                  <BookMarked size={18} />
                  <span className="text-xs font-medium">
                    Available
                  </span>
                </div>

                <p className="mt-3 font-serif text-2xl font-semibold">
                  {availableCopies}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  availableCopies > 0
                    ? "bg-emerald-500"
                    : "bg-red-500"
                }`}
              />

              <span className="text-[var(--muted)]">
                {availableCopies > 0
                  ? "This book is available in the library."
                  : "This book is currently unavailable."}
              </span>
            </div>

            <div className="mt-6 rounded-md border border-[var(--border)] bg-[var(--surface)] p-4">
              <div className="flex items-center gap-2 text-[var(--accent)]">
                <User size={18} />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Added By
                </span>
              </div>

              <p className="mt-3 text-sm font-medium">
                {book.userName || "Library Admin"}
              </p>

              {book.userEmail && (
                <p className="mt-1 text-xs text-[var(--muted)]">
                  {book.userEmail}
                </p>
              )}
            </div>

            <button
              onClick={() => {
                if (!user) {
                  toast.error("Please login to borrow this book!");
                  return;
                }

                setShowModal(true);
              }}
              disabled={availableCopies <= 0}
              className="mt-8 w-full rounded-md bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {availableCopies > 0
                ? "Borrow This Book"
                : "Currently Unavailable"}
            </button>

            <Link
              href="/all-books"
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-md border border-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--accent)] transition hover:bg-[var(--accent)] hover:text-white"
            >
              <ArrowLeft size={16} />
              Explore More Books
            </Link>
          </div>
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
          <div className="w-full max-w-md rounded-lg border border-[var(--border)] bg-[var(--background)] p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-semibold">
                Borrow This Book
              </h2>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                disabled={borrowing}
                className="rounded-md p-2 text-[var(--muted)] transition hover:bg-[var(--surface)] hover:text-[var(--foreground)] disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mt-2 text-sm text-[var(--muted)]">
              Confirm your information and select a return date.
            </p>

            <form onSubmit={handleBorrow} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Book Title
                </label>

                <input
                  value={book.title}
                  readOnly
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Your Name
                </label>

                <input
                  value={user?.name || ""}
                  readOnly
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Your Email
                </label>

                <input
                  value={user?.email || ""}
                  readOnly
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <CalendarDays size={16} />
                  Borrow Date
                </label>

                <input
                  type="date"
                  value={today}
                  readOnly
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <CalendarDays size={16} />
                  Return Date
                </label>

                <input
                  type="date"
                  min={today}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  required
                  disabled={borrowing}
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={
                  borrowing ||
                  !returnDate ||
                  returnDate <= today
                }
                className="w-full rounded-md bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {borrowing ? "Processing..." : "Confirm Borrow"}
              </button>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                disabled={borrowing}
                className="w-full rounded-md border border-[var(--border)] px-6 py-3 text-sm font-medium transition hover:bg-[var(--surface)] disabled:opacity-50"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default function BookDetailPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[var(--background)]">
          <span className="loading loading-spinner loading-lg text-[var(--accent)]" />
        </main>
      }
    >
      <BookDetailContent params={params} />
    </Suspense>
  );
}

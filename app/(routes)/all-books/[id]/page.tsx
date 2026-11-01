
"use client";

import {
  Suspense,
  use,
  useCallback,
  useEffect,
  useRef,
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
import { useRouter } from "next/navigation";

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

interface Borrow {
  bookId: string;
  userEmail: string;
  status?: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

const API_URL = "http://localhost:3002";

function getLocalDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getMaxReturnDate() {
  const date = new Date();
  date.setDate(date.getDate() + 7);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function BookDetailContent({ params }: PageProps) {
  const { id } = use(params);

  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [returnDate, setReturnDate] = useState("");
  const [borrowing, setBorrowing] = useState(false);
  const [today, setToday] = useState("");
  const [alreadyBorrowed, setAlreadyBorrowed] = useState(false);
  const [checkingBorrow, setCheckingBorrow] = useState(false);

  const borrowLock = useRef(false);

  useEffect(() => {
    setToday(getLocalDate());
  }, []);

  // Fetch book details
  const fetchBook = useCallback(
    async (signal?: AbortSignal) => {
      try {
        if (isPending) return;

        if (!user) {
          router.replace("/login");
          return;
        }

        const { data: tokenData, error } = await authClient.token();

        if (error || !tokenData?.token) {
          router.replace("/login");
          return;
        }

        const res = await fetch(
          `${API_URL}/books/${encodeURIComponent(id)}`,
          {
            headers: {
              Authorization: `Bearer ${tokenData.token}`,
            },
            cache: "no-store",
            signal,
          }
        );

        if (res.status === 401) {
          router.replace("/login");
          return;
        }

        if (!res.ok) {
          throw new Error(
            res.status === 404
              ? "Book not found"
              : "Failed to fetch book details"
          );
        }

        const responseData = await res.json();
        const bookData = responseData.book ?? responseData;

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
          error instanceof TypeError
            ? "Cannot connect to server. Check your backend!"
            : error instanceof Error
              ? error.message
              : "Could not load book details!"
        );
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [id, isPending, user, router]
  );

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    const controller = new AbortController();

    setLoading(true);
    setBook(null);
    setAlreadyBorrowed(false);

    fetchBook(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchBook, isPending, user, router]);

  // Check if the user currently has this book
  const checkAlreadyBorrowed = useCallback(async () => {
    if (!user?.email || !book?._id) {
      setAlreadyBorrowed(false);
      return false;
    }

    setCheckingBorrow(true);

    try {
      const { data: tokenData, error } = await authClient.token();

      if (error || !tokenData?.token) {
        router.replace("/login");
        return null;
      }

      const res = await fetch(`${API_URL}/borrow`, {
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
        cache: "no-store",
      });

      if (res.status === 401) {
        router.replace("/login");
        return null;
      }

      if (!res.ok) {
        throw new Error("Could not check borrowing status");
      }

      const data: Borrow[] = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid borrowing information");
      }

      const borrowed = data.some(
        (item) =>
          item.bookId === book._id &&
          item.userEmail === user.email &&
          item.status !== "returned"
      );

      setAlreadyBorrowed(borrowed);

      return borrowed;
    } catch (error) {
      console.error("Borrow check error:", error);

      toast.error(
        error instanceof TypeError
          ? "Cannot connect to server!"
          : error instanceof Error
            ? error.message
            : "Could not check borrowing status!"
      );

      return null;
    } finally {
      setCheckingBorrow(false);
    }
  }, [book?._id, user?.email, router]);

  // Check borrowing status after book and session load
  useEffect(() => {
    if (isPending) return;

    if (book?._id && user?.email) {
      checkAlreadyBorrowed();
    } else {
      setAlreadyBorrowed(false);
    }
  }, [book?._id, user?.email, checkAlreadyBorrowed, isPending]);

  // Open borrow modal
  const handleOpenBorrowModal = async () => {
    if (!user) {
      router.replace("/login");
      return;
    }

    if (!book) return;

    const availableCopies =
      book.availableCopies ?? book.totalCopies ?? 0;

    if (availableCopies <= 0) {
      toast.error("This book is currently unavailable!");
      return;
    }

    const borrowed = await checkAlreadyBorrowed();

    if (borrowed === null) return;

    if (borrowed) {
      toast.error("You have already borrowed this book!");
      return;
    }

    setShowModal(true);
  };

  // Borrow book
  const handleBorrow = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (borrowLock.current || borrowing) return;

    if (!user) {
      router.replace("/login");
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
    const maxDate = getMaxReturnDate();

    if (
      !returnDate ||
      returnDate <= currentDate ||
      returnDate > maxDate
    ) {
      toast.error("Return date must be within 7 days!");
      return;
    }

    borrowLock.current = true;
    setBorrowing(true);

    try {
      const borrowed = await checkAlreadyBorrowed();

      if (borrowed === null) return;

      if (borrowed) {
        toast.error("You have already borrowed this book!");
        setAlreadyBorrowed(true);
        setShowModal(false);
        return;
      }

      const { data: tokenData, error } = await authClient.token();

      if (error || !tokenData?.token) {
        router.replace("/login");
        return;
      }

      const res = await fetch(`${API_URL}/borrow`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: book._id,
          bookTitle: book.title,
          bookImage: book.image || "",
          borrowDate: getLocalDate(),
          returnDate,
          userName: user.name,
          userEmail: user.email,
          status: "borrowed",
        }),
      });

      if (res.status === 401) {
        router.replace("/login");
        return;
      }

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to borrow book");
      }

      toast.success("Book borrowed successfully!");

      setAlreadyBorrowed(true);
      setShowModal(false);
      setReturnDate("");

      await fetchBook();
    } catch (error) {
      console.error("Borrow error:", error);

      toast.error(
        error instanceof TypeError
          ? "Cannot connect to server!"
          : error instanceof Error
            ? error.message
            : "Something went wrong!"
      );
    } finally {
      borrowLock.current = false;
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
        <BookOpen size={56} className="mb-4 text-[var(--accent)]" />

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
              onClick={handleOpenBorrowModal}
              disabled={
                availableCopies <= 0 ||
                checkingBorrow ||
                alreadyBorrowed
              }
              className="mt-8 w-full rounded-md bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {alreadyBorrowed
                ? "Already Borrowed"
                : checkingBorrow
                  ? "Checking..."
                  : availableCopies > 0
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
          <div className="w-full max-w-sm rounded-lg border border-[var(--border)] bg-[var(--background)] p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-semibold">
                Borrow This Book
              </h2>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                disabled={borrowing}
                className="rounded-md p-2 text-[var(--muted)] transition hover:bg-[var(--surface)] hover:text-[var(--foreground)] disabled:opacity-50"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleBorrow} className="mt-4 space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium">
                  Your Name
                </label>

                <input
                  value={user?.name || ""}
                  readOnly
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium">
                  Your Email
                </label>

                <input
                  value={user?.email || ""}
                  readOnly
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-2 text-xs font-medium">
                  <CalendarDays size={15} />
                  Return Date
                </label>

                <input
                  type="date"
                  min={today}
                  max={getMaxReturnDate()}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  required
                  disabled={borrowing}
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={
                  borrowing ||
                  !returnDate ||
                  returnDate <= today ||
                  returnDate > getMaxReturnDate()
                }
                className="w-full rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {borrowing ? "Processing..." : "Confirm Borrow"}
              </button>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                disabled={borrowing}
                className="w-full rounded-md border border-[var(--border)] px-5 py-2.5 text-sm font-medium transition hover:bg-[var(--surface)] disabled:opacity-50"
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

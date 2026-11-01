
"use client";

import { useCallback, useEffect, useState } from "react";
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
import EditPage from "@/app/components/EditPage";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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
    const router=useRouter()
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteBookId, setDeleteBookId] = useState<string | null>(null);

const fetchMyBooks = useCallback(async () => {
  if (!user?.email) {
    setBooks([]);
    setLoading(false);
    return;
  }

  try {
    setLoading(true);

    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error("Failed to get authentication token!");
    }

    const res = await fetch(
      `http://localhost:3002/all-books/${encodeURIComponent(user.email)}`,
      {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch books");
    }

    const result = await res.json();
    setBooks(Array.isArray(result) ? result : result.books ?? []);
  } catch (error) {
    console.error("Error fetching my books:", error);
  } finally {
    setLoading(false);
  }
}, [user?.email]);

const handleDelete = async (id: string) => {
  const {data,error}=await authClient.token()
  const token=data?.token
  try {
    const res = await fetch(`http://localhost:3002/books/${id}`, {
      method: "DELETE",
      headers:{
        authorization:`Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error("Failed to delete book!");
    }

    toast.success("Successfully Removed Item");

    setBooks((prev) =>
      prev.filter(
        (book) => String(book._id ?? book.id) !== String(id)
      )
    );
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : "Failed to delete book!"
    );
  }
};

  useEffect(() => {
    if (isPending) return;

    fetchMyBooks();
  }, [fetchMyBooks, isPending]);

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
   <div className="flex flex-col gap-4">
  {books.map((book, index) => {
    const bookId = book._id ?? book.id;
    const available = book.availableCopies ?? book.totalCopies ?? 0;

    return (
      <article
        key={bookId ?? `${book.title}-${index}`}
        className="group flex flex-col gap-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-all duration-300 hover:border-[var(--accent)]/50 hover:shadow-md sm:flex-row sm:items-center"
      >
        <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-lg bg-[var(--background)] sm:h-36 sm:w-28">
          {book.image ? (
            <img
              src={book.image}
              alt={book.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <BookOpen size={42} className="text-[var(--accent)]" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">
            {book.category}
          </span>

          <h3 className="mt-1 truncate font-serif text-xl font-semibold">
            {book.title}
          </h3>

          <p className="mt-1 flex items-center gap-2 text-sm text-[var(--muted)]">
            <UserRound size={14} />
            {book.author}
          </p>

          {book.description && (
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--muted)]">
              {book.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="text-xs text-[var(--muted)]">
              <BookOpen size={13} className="mr-1 inline" />
              {available} / {book.totalCopies ?? 0} Copies
            </span>

            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                available > 0
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-red-500/10 text-red-500"
              }`}
            >
              {available > 0 ? "Available" : "Unavailable"}
            </span>
          </div>
        </div>

    <div className="flex shrink-0 flex-row gap-2">
  <button
    type="button"
    disabled={!bookId}
    onClick={() => {
      setSelectedBookId(bookId ?? null);
      setEditOpen(true);
    }}
    className="flex items-center cursor-pointer justify-center gap-2 rounded-lg border border-[var(--accent)] px-4 py-2.5 text-xs font-semibold text-[var(--accent)] transition hover:bg-[var(--accent)] hover:text-white disabled:opacity-50"
  >
    <Pencil size={14} />
    Edit
  </button>

  <button
    type="button"
    disabled={!bookId}
   onClick={() => bookId && setDeleteBookId(bookId)}
    className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-red-500/50 px-4 py-2.5 text-xs font-semibold text-red-500 transition hover:bg-red-500 hover:text-white disabled:opacity-50"
  >
    <Trash2 size={14} />
    Delete
  </button>
</div>
      </article>
    );
  })}
</div>
        )}
      </section>

      <EditPage
        bookId={selectedBookId}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onUpdated={fetchMyBooks}
      />
      {deleteBookId && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
    <div className="w-full max-w-sm rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
        <Trash2 size={24} />
      </div>

      <h2 className="font-serif text-xl font-semibold">
        Confirm Delete
      </h2>

      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
        Are you sure you want to delete this book? This action cannot be undone.
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => setDeleteBookId(null)}
          className="rounded-md border cursor-pointer border-[var(--border)] px-4 py-2 text-sm font-medium transition hover:bg-[var(--background)]"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={async () => {
            await handleDelete(deleteBookId);
            setDeleteBookId(null);
          }}
          className="rounded-md bg-red-500 cursor-pointer px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
    </main>
  );
};

export default MyBookPage;

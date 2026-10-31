
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import EditBookModal from "@/components/EditBookModal";

const API = "http://localhost:3002";

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

export default function MyBooksPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState("");

  const fetchBooks = useCallback(async () => {
    if (!user?.email) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${API}/all-books/${encodeURIComponent(user.email)}`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch books");
      }

      const data = await res.json();
      setBooks(Array.isArray(data) ? data : data.books ?? []);
    } catch (error) {
      toast.error("Failed to load your books");
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    if (user?.email) {
      fetchBooks();
    } else if (!isPending) {
      setLoading(false);
    }
  }, [user?.email, isPending, fetchBooks]);

  const handleEdit = (book: Book) => {
    const id = book._id || book.id;

    if (!id) {
      toast.error("Book ID not found");
      return;
    }

    setSelectedBookId(id);
    setIsEditOpen(true);
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200 px-4">
        <div className="rounded-2xl bg-base-100 p-8 text-center shadow-lg">
          <h2 className="text-2xl font-bold">Please Login</h2>
          <p className="mt-2 text-base-content/60">
            Login to see your personal book collection.
          </p>
          <Link href="/login" className="btn btn-primary mt-5">
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-base-200 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 font-semibold uppercase tracking-widest text-primary">
              Your Personal Collection
            </p>
            <h1 className="text-3xl font-bold md:text-4xl">My Books</h1>
            <p className="mt-2 text-base-content/60">
              Manage all the books you have added.
            </p>
          </div>

          <Link href="/add-book" className="btn btn-primary">
            + Add New Book
          </Link>
        </div>

        {books.length === 0 ? (
          <div className="rounded-2xl border border-base-300 bg-base-100 px-5 py-16 text-center">
            <h2 className="text-2xl font-bold">Your Library is Empty</h2>
            <p className="mt-3 text-base-content/60">
              You have not added any books yet.
            </p>
            <Link href="/add-book" className="btn btn-primary mt-6">
              Add Your First Book
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => {
              const bookId = book._id || book.id || "";

              return (
                <div
                  key={bookId}
                  className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 p-3 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="overflow-hidden rounded-xl">
                    {book.image ? (
                      <img
                        src={book.image}
                        alt={book.title}
                        className="h-64 w-full object-cover transition duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-64 items-center justify-center bg-base-200">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <span className="badge badge-primary badge-outline mb-3">
                      {book.category}
                    </span>

                    <h2 className="line-clamp-1 text-xl font-bold">
                      {book.title}
                    </h2>

                    <p className="mt-1 text-sm text-base-content/60">
                      By {book.author}
                    </p>

                    <p className="mt-3 line-clamp-2 text-sm text-base-content/70">
                      {book.description || "No description available."}
                    </p>

                    <div className="mt-4 flex items-center justify-between rounded-lg bg-base-200 px-3 py-2 text-sm">
                      <span>Total: {book.totalCopies ?? 0}</span>
                      <span className="font-semibold text-success">
                        Available: {book.availableCopies ?? 0}
                      </span>
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => handleEdit(book)}
                        className="btn btn-primary btn-sm w-full"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <EditBookModal
        bookId={selectedBookId}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onUpdated={fetchBooks}
      />
    </main>
  );
}

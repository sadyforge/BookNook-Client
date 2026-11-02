"use client";

import { useEffect, useState } from "react";
import { BookOpen, CalendarDays, RotateCcw } from "lucide-react";
import { toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface Borrow {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage?: string;
  borrowDate?: string;
  returnDate: string;
  userName: string;
  userEmail: string;
  status: string;
}

const MyBorrowPage = () => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState<string | null>(null);

  // Fetch user's borrowed books
  useEffect(() => {
    if (isPending) return;

    if (!user?.email) {
      setBorrows([]);
      setLoading(false);
      return;
    }

    const fetchBorrows = async () => {
         const {data,error}=await authClient.token()
      const token=data?.token
      try {
        const res = await fetch(`${API_URL}/borrow`, {
          headers:{authorization:`Bearer ${token}`},
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch borrowed books");
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid borrowing information");
        }

        const userBorrows = data.filter(
          (item: Borrow) =>
            item.userEmail === user.email &&
            item.status !== "returned"
        );

        setBorrows(userBorrows);
      } catch (error) {
        console.error("Fetch borrows error:", error);
        toast.error("Could not load your borrowed books!");
      } finally {
        setLoading(false);
      }
    };

    fetchBorrows();
  }, [user?.email, isPending]);

  // Return book
  const handleReturnBook = async (borrow: Borrow) => {
    if (returningId) return;

    setReturningId(borrow._id);
  const {data,error}=await authClient.token()
      const token=data?.token
    try {

      const res = await fetch(
        `${API_URL}/borrow/${borrow._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization:`Bearer ${token}`
          },
          body: JSON.stringify({
            bookId: borrow.bookId,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to return book");
      }

      // Remove returned book from the list
      setBorrows((prev) =>
        prev.filter((item) => item._id !== borrow._id)
      );

      toast.success("Book returned successfully!");
    } catch (error) {
      console.error("Return book error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong!"
      );
    } finally {
      setReturningId(null);
    }
  };

  if (loading || isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <span className="loading loading-spinner loading-lg text-[var(--accent)]" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-5 text-center text-[var(--foreground)]">
        <div>
          <BookOpen
            size={50}
            className="mx-auto mb-4 text-[var(--accent)]"
          />

          <h1 className="font-serif text-2xl font-semibold">
            Please Login
          </h1>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Login to see your borrowed books.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-5 py-12 text-[var(--foreground)] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <h1 className="font-serif text-3xl font-semibold sm:text-4xl">
            My Borrowed Books
          </h1>

          <p className="mt-3 text-sm text-[var(--muted)]">
            Manage your borrowed books and return them when you are finished.
          </p>
        </div>

        {borrows.length === 0 ? (
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-5 py-16 text-center">
            <BookOpen
              size={50}
              className="mx-auto mb-4 text-[var(--accent)]"
            />

            <h2 className="font-serif text-xl font-semibold">
              No Borrowed Books
            </h2>

            <p className="mt-2 text-sm text-[var(--muted)]">
              You haven't borrowed any books yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead className="bg-[var(--surface)] text-[var(--muted)]">
                <tr>
                  <th className="px-5 py-4 font-semibold">Book</th>
                  <th className="px-5 py-4 font-semibold">Borrow Date</th>
                  <th className="px-5 py-4 font-semibold">Return Date</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody>
                {borrows.map((borrow) => (
                  <tr
                    key={borrow._id}
                    className="border-t border-[var(--border)]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {borrow.bookImage ? (
                          <img
                            src={borrow.bookImage}
                            alt={borrow.bookTitle}
                            className="h-16 w-12 rounded object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-12 items-center justify-center rounded bg-[var(--surface)]">
                            <BookOpen
                              size={22}
                              className="text-[var(--accent)]"
                            />
                          </div>
                        )}

                        <span className="font-medium">
                          {borrow.bookTitle}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-[var(--muted)]">
                      <span className="flex items-center gap-2">
                        <CalendarDays size={15} />
                        {borrow.borrowDate
                          ? new Date(borrow.borrowDate).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-[var(--muted)]">
                      {new Date(borrow.returnDate).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                        Borrowed
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleReturnBook(borrow)}
                        disabled={returningId !== null}
                        className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <RotateCcw size={14} />

                        {returningId === borrow._id
                          ? "Returning..."
                          : "Return Book"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};

export default MyBorrowPage;
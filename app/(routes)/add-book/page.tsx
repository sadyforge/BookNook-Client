"use client";

import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";

export default function AddBooksPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "Fiction",
    totalCopies: 1,
    image: null as File | null,
    description: "",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login first!");
      return;
    }

    const bookData = {
      ...formData,
      userName: user.name,
      userEmail: user.email,
    };

    console.log("Book Data:", bookData);
    toast.success("Book data logged successfully!");
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="border-b border-[var(--border)] bg-[var(--surface)] px-5 py-8 text-center sm:py-10">
        <h1 className="font-serif text-3xl font-semibold sm:text-4xl">
          Add a Book
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Put a book from your shelf into the library.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-8 sm:py-10">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium"
              >
                Book Title
              </label>
              <input
                id="title"
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter book title"
                className="theme-input w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label
                htmlFor="author"
                className="mb-2 block text-sm font-medium"
              >
                Author Name
              </label>
              <input
                id="author"
                type="text"
                required
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                placeholder="Enter author name"
                className="theme-input w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium"
              >
                Category
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="theme-input w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:border-[var(--accent)]"
              >
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Biography">Biography</option>
                <option value="Technology">Technology</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="totalCopies"
                className="mb-2 block text-sm font-medium"
              >
                Total Copies
              </label>
              <input
                id="totalCopies"
                type="number"
                min={1}
                required
                value={formData.totalCopies}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalCopies: Number(e.target.value),
                  })
                }
                className="theme-input w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="image"
              className="mb-2 block text-sm font-medium"
            >
              Book Image
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              required
              onChange={(e) =>
                setFormData({
                  ...formData,
                  image: e.target.files?.[0] ?? null,
                })
              }
              className="theme-input w-full rounded-md border px-3 py-2 text-sm outline-none file:mr-3 file:rounded file:border-0 file:bg-[var(--background)] file:px-3 file:py-1.5 file:text-[var(--foreground)]"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium"
            >
              Short Description
            </label>
            <textarea
              id="description"
              required
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              placeholder="Write a short description about the book"
              className="theme-input w-full resize-y rounded-md border px-3 py-2 text-sm outline-none transition focus:border-[var(--accent)]"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="userName"
                className="mb-2 block text-sm font-medium"
              >
                User Name
              </label>
              <input
                id="userName"
                type="text"
                readOnly
                value={user?.name ?? ""}
                placeholder="Loading user..."
                className="theme-input w-full rounded-md border px-3 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="userEmail"
                className="mb-2 block text-sm font-medium"
              >
                User Email
              </label>
              <input
                id="userEmail"
                type="email"
                readOnly
                value={user?.email ?? ""}
                placeholder="Loading email..."
                className="theme-input w-full rounded-md border px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!user}
            className="w-full rounded-md bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Add Book
          </button>
        </form>
      </section>
    </main>
  );
}
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditPageProps {
  bookId: string | null;
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

interface BookForm {
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  image: string;
  description: string;
  userName: string;
  userEmail: string;
}

const initialForm: BookForm = {
  title: "",
  author: "",
  category: "Fiction",
  totalCopies: 1,
  image: "",
  description: "",
  userName: "",
  userEmail: "",
};

export default function EditPage({
  bookId,
  open,
  onClose,
  onUpdated,
}: EditPageProps) {
  const { data: session } = authClient.useSession();

  const [formData, setFormData] = useState<BookForm>(initialForm);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!open || !bookId) return;

    const fetchBook = async () => {
      const {data,error}=await authClient.token()
      const token=data?.token
      try {
        setFetching(true);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${bookId}`,{headers:{authorization:`Bearer ${token}`}});

        if (!res.ok) {
          throw new Error("Failed to load book details!");
        }

        const result = await res.json();
        const book = result.book ?? result.data ?? result;

        setFormData({
          title: book.title ?? "",
          author: book.author ?? "",
          category: book.category ?? "Fiction",
          totalCopies: Number(book.totalCopies ?? 1),
          image: book.image ?? "",
          description: book.description ?? "",
          userName: book.userName ?? session?.user?.name ?? "",
          userEmail: book.userEmail ?? session?.user?.email ?? "",
        });

        setNewImage(null);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load book!"
        );
      } finally {
        setFetching(false);
      }
    };

    fetchBook();
  }, [open, bookId, session?.user?.name, session?.user?.email]);

  const updateField = (field: keyof BookForm, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!bookId) return;

    if (formData.totalCopies < 1) {
      toast.error("Total copies must be at least 1!");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = formData.image;

      if (newImage) {
        const imageData = new FormData();
        imageData.append("image", newImage);

        const imageRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGE_BB}`,
          {
            method: "POST",
            body: imageData,
          }
        );

        const imageResult = await imageRes.json();

        if (!imageRes.ok || !imageResult.success) {
          throw new Error(
            imageResult.error?.message || "Image upload failed!"
          );
        }

        imageUrl = imageResult.data.url;
      }

      const updateData = {
        title: formData.title,
        author: formData.author,
        category: formData.category,
        totalCopies: Number(formData.totalCopies),
        image: imageUrl,
        description: formData.description,
        userName: formData.userName,
        userEmail: formData.userEmail,
      };

      const { data: tokenData, error } = await authClient.token();

      if (error || !tokenData?.token) {
        throw new Error("Failed to get authentication token!");
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${bookId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: JSON.stringify(updateData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to update book!");
      }

      toast.success("Book updated successfully!");
      onClose();
      onUpdated();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update book!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            Edit Book
          </DialogTitle>
          <DialogDescription className="text-[var(--muted)]">
            Update your book information below.
          </DialogDescription>
        </DialogHeader>

        {fetching ? (
          <p className="py-10 text-center text-sm text-[var(--muted)]">
            Loading book details...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Book Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="Enter book title"
                  className="theme-input w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Author Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => updateField("author", e.target.value)}
                  placeholder="Enter author name"
                  className="theme-input w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className="theme-input w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
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
                <label className="mb-2 block text-sm font-medium">
                  Total Copies
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={formData.totalCopies}
                  onChange={(e) =>
                    updateField("totalCopies", Number(e.target.value))
                  }
                  className="theme-input w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Book Image
              </label>

              {formData.image && (
                <div className="mb-3 flex items-center gap-3">
                  <img
                    src={formData.image}
                    alt="Current book cover"
                    className="h-20 w-16 rounded-md border border-[var(--border)] object-cover"
                  />
                  <p className="text-xs text-[var(--muted)]">
                    Current book image
                  </p>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setNewImage(e.target.files?.[0] ?? null)
                }
                className="theme-input w-full rounded-md border px-3 py-2 text-sm outline-none file:mr-3 file:rounded file:border-0 file:bg-[var(--background)] file:px-3 file:py-1.5 file:text-[var(--foreground)]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Short Description
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  updateField("description", e.target.value)
                }
                placeholder="Write a short description about the book"
                className="theme-input w-full resize-y rounded-md border px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  User Name
                </label>
                <input
                  type="text"
                  readOnly
                  value={formData.userName}
                  className="theme-input w-full rounded-md border px-3 py-2 text-sm outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  User Email
                </label>
                <input
                  type="email"
                  readOnly
                  value={formData.userEmail}
                  className="theme-input w-full rounded-md border px-3 py-2 text-sm outline-none"
                />
              </div>
            </div>

            <DialogFooter>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-[var(--border)] px-5 py-3 text-sm font-medium transition hover:opacity-80"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading || fetching}
                className="rounded-md bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
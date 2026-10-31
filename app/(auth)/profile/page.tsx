
"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, UserRound, Mail, CalendarDays, ArrowLeft } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const ProfilePage = () => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f5ef]">
        <span className="loading loading-spinner loading-lg text-[#94774f]" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f5ef] px-4">
        <div className="w-full max-w-md border border-[#e4ddd1] bg-white p-8 text-center shadow-sm">
          <BookOpen size={40} className="mx-auto mb-4 text-[#94774f]" />
          <h1 className="font-serif text-3xl text-[#292820]">
            Login Required
          </h1>
          <p className="mt-3 text-sm text-[#777367]">
            Please log in to view your profile.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block bg-[#292820] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#94774f]"
          >
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#777367] transition hover:text-[#94774f]"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[3px] text-[#94774f]">
            BookNook Account
          </p>
          <h1 className="mt-3 font-serif text-4xl font-medium text-[#292820] sm:text-5xl">
            My Profile
          </h1>
          <p className="mt-3 text-sm text-[#777367]">
            Your personal information and account details.
          </p>
        </div>

        <div className="overflow-hidden border border-[#e4ddd1] bg-white shadow-sm">
          <div className="bg-[#eae3d7] px-6 py-8 sm:px-10">
            <div className="flex flex-col items-center gap-5 sm:flex-row">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-sm"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-[#f8f5ef] text-[#94774f] shadow-sm">
                  <UserRound size={42} />
                </div>
              )}

              <div className="text-center sm:text-left">
                <h2 className="font-serif text-2xl font-semibold text-[#292820]">
                  {user.name || "BookNook Reader"}
                </h2>
                <p className="mt-2 text-sm text-[#777367]">
                  {user.email}
                </p>
                <span className="mt-3 inline-block border border-[#c9b79e] px-3 py-1 text-xs font-medium text-[#80674e]">
                  BookNook Member
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <h3 className="mb-6 font-serif text-xl font-semibold text-[#292820]">
              Account Information
            </h3>

            <div className="space-y-5">
              <div className="flex items-start gap-4 border-b border-[#eee7dc] pb-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#f8f5ef] text-[#94774f]">
                  <UserRound size={19} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#999184]">
                    Full Name
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#292820]">
                    {user.name || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 border-b border-[#eee7dc] pb-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#f8f5ef] text-[#94774f]">
                  <Mail size={19} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#999184]">
                    Email Address
                  </p>
                  <p className="mt-1 break-all text-sm font-medium text-[#292820]">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#f8f5ef] text-[#94774f]">
                  <CalendarDays size={19} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#999184]">
                    Account Created
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#292820]">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Not available"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-[#eee7dc] pt-6">
              <p className="text-sm leading-6 text-[#777367]">
                Welcome to BookNook! Keep exploring books, discover new
                stories, and enjoy your reading journey.
              </p>

              <Link
                href="/all-books"
                className="mt-5 inline-flex items-center gap-2 bg-[#292820] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#94774f]"
              >
                <BookOpen size={17} />
                Explore Books
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;

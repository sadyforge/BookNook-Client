'use client'
import React from "react";
import Link from "next/link";
import { BookOpen, User, Mail, ImageIcon, Lock } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const RegisterPage = () => {

    const router=useRouter()

const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const userData = Object.fromEntries(formData.entries());

  const { data, error } = await authClient.signUp.email({
    name: String(userData.name),
    email: String(userData.email),
    password: String(userData.password),
    image: String(userData.photoURL || ""),
  });

  if (error) {
    console.log(error.message);
    return;
  }

if(data){
    toast.success("Successfully register User")
    router.push("/")
}
};




const handleSignInWithGoogle=async()=>{
     const data = await authClient.signIn.social({
    provider: "google",
  });
  if(data){
    router.push("/")
  }
}



  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f5ef] px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#eae3d7]">
            <BookOpen size={27} className="text-[#94774f]" />
          </div>

          <h1 className="font-serif text-4xl font-medium text-[#292820]">
            Create an account
          </h1>

          <p className="mt-3 text-sm text-[#777367]">
            Join BookNook and start your reading journey.
          </p>
        </div>

        <div className="border border-[#e4ddd1] bg-white p-7 shadow-sm sm:p-9">
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#292820]">
                Full Name
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94774f]"
                />
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  className="w-full border border-[#ded8cb] bg-[#faf8f4] py-3 pl-11 pr-4 text-sm text-[#292820] outline-none transition placeholder:text-[#aaa397] focus:border-[#94774f]"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#292820]">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94774f]"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  className="w-full border border-[#ded8cb] bg-[#faf8f4] py-3 pl-11 pr-4 text-sm text-[#292820] outline-none transition placeholder:text-[#aaa397] focus:border-[#94774f]"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#292820]">
                Photo URL
              </label>
              <div className="relative">
                <ImageIcon
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94774f]"
                />
                <input
                  type="url"
                  name="photoURL"
                  placeholder="Enter your photo URL"
                  className="w-full border border-[#ded8cb] bg-[#faf8f4] py-3 pl-11 pr-4 text-sm text-[#292820] outline-none transition placeholder:text-[#aaa397] focus:border-[#94774f]"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#292820]">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94774f]"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  className="w-full border border-[#ded8cb] bg-[#faf8f4] py-3 pl-11 pr-4 text-sm text-[#292820] outline-none transition placeholder:text-[#aaa397] focus:border-[#94774f]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#292820] py-3.5 text-sm font-semibold text-white transition hover:bg-[#94774f]"
            >
              Create Account
            </button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#e4ddd1]" />
            <span className="text-xs text-[#999184]">
              OR CONTINUE WITH
            </span>
            <div className="h-px flex-1 bg-[#e4ddd1]" />
          </div>

          <button onClick={handleSignInWithGoogle}
            type="button"
            className="flex w-full items-center justify-center gap-3 border border-[#ded8cb] bg-white py-3.5 text-sm font-medium text-[#292820] transition hover:bg-[#faf8f4]"
          >
            <svg width="19" height="19" viewBox="0 0 48 48">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.25 5.48-4.76 7.18l7.73 6C44.42 38.03 46.98 31.88 46.98 24.55z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59A14.41 14.41 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.2A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
            </svg>
            Continue with Google
          </button>

          <p className="mt-7 text-center text-sm text-[#777367]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#94774f] transition hover:text-[#292820]"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;
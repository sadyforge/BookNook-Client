
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Feather,
  LibraryBig,
} from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";

const slides = [
  {
    label: "A WORLD OF STORIES",
    title: "Every book opens a new world.",
    description:
      "Find your next favorite story, discover new perspectives, and let your imagination travel beyond the ordinary.",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=2000&q=85",
  },
  {
    label: "FOR THE LOVE OF READING",
    title: "Some stories stay with you forever.",
    description:
      "From timeless classics to modern discoveries, find stories that inspire the way you think and see the world.",
    image:
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=2000&q=85",
  },
  {
    label: "YOUR NEXT CHAPTER",
    title: "A quieter place to find inspiration.",
    description:
      "Slow down, turn a page, and discover a reading experience made for curious minds and lifelong learners.",
    image:
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=2000&q=85",
  },
];

const books = [
  {
    title: "The Art of Reading",
    author: "David L. Ulin",
    category: "Literature",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=85",
  },
  {
    title: "Stories for the Soul",
    author: "Various Authors",
    category: "Fiction",
    image:
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=85",
  },
  {
    title: "The Quiet Library",
    author: "M. J. Harper",
    category: "Classic",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=85",
  },
  {
    title: "Beyond the Pages",
    author: "Emily Carter",
    category: "Adventure",
    image:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=85",
  },
  {
    title: "A World of Ideas",
    author: "Thomas Reed",
    category: "Science",
    image:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=85",
  },
  {
    title: "Letters & Memories",
    author: "Anna Williams",
    category: "Literature",
    image:
      "https://images.unsplash.com/photo-1513001900722-370f803f498d?auto=format&fit=crop&w=600&q=85",
  },
];

const categories = [
  { name: "Fiction", count: "Stories & novels", number: "01" },
  { name: "Science", count: "Ideas & discoveries", number: "02" },
  { name: "History", count: "Explore the past", number: "03" },
  { name: "Kids", count: "Little imaginations", number: "04" },
  { name: "Others", count: "Unexpected finds", number: "05" },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="bg-[#f8f5ef] text-[#292820]">
      <section className="relative">
        {mounted ? (
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            loop
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            className="booknook-hero"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={slide.title}>
                <div className="relative flex min-h-[620px] items-center overflow-hidden md:min-h-[700px]">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-r from-[#171710]/90 via-[#171710]/65 to-[#171710]/10" />

                  <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-16 md:px-12 lg:px-16">
                    <div className="max-w-2xl">
                      <p className="mb-6 flex items-center gap-3 text-xs font-semibold tracking-[0.28em] text-[#e8cda1] md:text-sm">
                        <span className="h-px w-10 bg-[#e8cda1]" />
                        {slide.label}
                      </p>

                      <h1 className="font-serif text-5xl font-medium leading-[1.12] tracking-tight text-[#fffaf0] sm:text-6xl lg:text-7xl">
                        {slide.title}
                      </h1>

                      <p className="mt-7 max-w-xl text-base leading-8 text-white/80 md:text-lg">
                        {slide.description}
                      </p>

                      <Link
                        href="/all-books"
                        className="mt-9 inline-flex items-center gap-4 bg-[#e8cda1] px-7 py-4 text-sm font-semibold text-[#292820] transition hover:bg-white"
                      >
                        Browse Books
                        <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>

                  <div className="absolute bottom-10 right-8 z-10 hidden items-center gap-3 text-xs tracking-[0.2em] text-white/70 md:flex lg:right-16">
                    <span>0{index + 1}</span>
                    <span className="h-px w-12 bg-white/40" />
                    <span>03</span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="relative flex min-h-[620px] items-center overflow-hidden bg-[#292820] md:min-h-[700px]">
            <Image
              src={slides[0].image}
              alt={slides[0].title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#171710]/90 via-[#171710]/65 to-[#171710]/10" />
            <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20 md:px-12 lg:px-16">
              <div className="max-w-2xl">
                <p className="mb-6 flex items-center gap-3 text-xs font-semibold tracking-[0.28em] text-[#e8cda1] md:text-sm">
                  <span className="h-px w-10 bg-[#e8cda1]" />
                  {slides[0].label}
                </p>
                <h1 className="font-serif text-5xl font-medium leading-[1.12] tracking-tight text-[#fffaf0] sm:text-6xl lg:text-7xl">
                  {slides[0].title}
                </h1>
                <p className="mt-7 max-w-xl text-base leading-8 text-white/80 md:text-lg">
                  {slides[0].description}
                </p>
                <Link
                  href="/books"
                  className="mt-9 inline-flex items-center gap-4 bg-[#e8cda1] px-7 py-4 text-sm font-semibold text-[#292820] transition hover:bg-white"
                >
                  Browse Books
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="border-b border-[#ded8cb] bg-[#f8f5ef]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 sm:grid-cols-3 md:px-12 lg:px-16">
          <div className="flex items-center gap-4">
            <BookOpen className="shrink-0 text-[#94774f]" size={30} />
            <div>
              <h3 className="font-serif text-lg">Stories for Everyone</h3>
              <p className="mt-1 text-sm text-[#777367]">
                Discover your next favorite book.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <LibraryBig className="shrink-0 text-[#94774f]" size={30} />
            <div>
              <h3 className="font-serif text-lg">Your Personal Library</h3>
              <p className="mt-1 text-sm text-[#777367]">
                Keep your reading world organized.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Feather className="shrink-0 text-[#94774f]" size={30} />
            <div>
              <h3 className="font-serif text-lg">Made for Readers</h3>
              <p className="mt-1 text-sm text-[#777367]">
                Find inspiration on every page.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-28 lg:px-16">
        <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#94774f]">
              Handpicked for you
            </p>
            <h2 className="mt-4 font-serif text-4xl font-medium sm:text-5xl">
              New & noteworthy
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-[#777367] md:text-base">
              Discover books that invite you to think differently, dream
              bigger, and see the world through another perspective.
            </p>
          </div>

          <Link
            href="/books"
            className="inline-flex w-fit items-center gap-2 border-b border-[#94774f] pb-2 text-sm font-semibold transition hover:text-[#94774f]"
          >
            Explore all books
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-7">
          {books.map((book) => (
            <article key={book.title} className="group">
              <Link href="/books" className="block">
                <div className="relative aspect-[3/4] overflow-hidden bg-[#e9e2d6] shadow-sm">
                  <Image
                    src={book.image}
                    alt={book.title}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#94774f]">
                  {book.category}
                </p>

                <h3 className="mt-2 font-serif text-lg leading-snug transition group-hover:text-[#94774f]">
                  {book.title}
                </h3>

                <p className="mt-2 text-sm text-[#777367]">{book.author}</p>

                <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold">
                  View details
                  <ChevronRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#eae3d7]">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-24 lg:px-16">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#94774f]">
                Find your kind of story
              </p>
              <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
                Every reader has a world of their own.
              </h2>
              <p className="mt-5 text-sm leading-7 text-[#777367] md:text-base">
                Whether you love imaginative fiction, scientific discoveries,
                or stories from the past, there is always something new to
                explore.
              </p>

              <Link
                href="/books"
                className="mt-7 inline-flex items-center gap-3 bg-[#292820] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#94774f]"
              >
                Explore the collection
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="grid gap-0 sm:grid-cols-2">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href="/books"
                  className="group flex items-center justify-between border-b border-[#cfc5b5] py-5 transition hover:px-3"
                >
                  <div className="flex items-center gap-5">
                    <span className="text-xs text-[#94774f]">
                      {category.number}
                    </span>
                    <div>
                      <h3 className="font-serif text-xl">{category.name}</h3>
                      <p className="mt-1 text-xs text-[#777367]">
                        {category.count}
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    size={18}
                    className="text-[#94774f] transition-transform group-hover:translate-x-1"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-28 lg:px-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
          <div className="relative min-h-[360px] overflow-hidden sm:min-h-[440px]">
            <Image
              src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=85"
              alt="A quiet reading space"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#94774f]">
              A little reading goes a long way
            </p>
            <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
              Make room for a story every day.
            </h2>
            <p className="mt-6 text-sm leading-8 text-[#777367] md:text-base">
              Reading is more than turning pages. It is discovering new
              ideas, finding moments of calm, and meeting people through
              their stories. BookNook gives you a place to begin.
            </p>

            <Link
              href="/books"
              className="mt-8 inline-flex items-center gap-3 border-b border-[#94774f] pb-2 text-sm font-semibold transition hover:text-[#94774f]"
            >
              Find your next read
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* <style jsx global>{`
        .booknook-hero .swiper-pagination {
          bottom: 30px !important;
          left: max(24px, calc((100vw - 1152px) / 2)) !important;
          width: fit-content !important;
        }

        .booknook-hero .swiper-pagination-bullet {
          width: 24px;
          height: 3px;
          border-radius: 0;
          background: #fffaf0;
          opacity: 0.45;
          transition: width 0.3s ease, opacity 0.3s ease;
        }

        .booknook-hero .swiper-pagination-bullet-active {
          width: 42px;
          opacity: 1;
          background: #e8cda1;
        }
      `}</style> */}
    </main>
  );
}

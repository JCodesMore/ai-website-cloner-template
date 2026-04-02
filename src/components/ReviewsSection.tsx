"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface Review {
  name: string;
  location: string;
  date: string;
  avatar: string;
  title: string;
  text: string;
  experienceDate: string;
  color: "blue" | "green" | "pink";
}

const reviews: Review[] = [
  {
    name: "Elsa Finance",
    location: "Romania",
    date: "Feb 4 2025",
    avatar: "/images/reviews/elsa-finance.png",
    title: "Excellent Services",
    text: "I've been working with these guys for almost four years, they provide great and fast service, excellent products and it's a pleasure to work with them! I highly recommend them",
    experienceDate: "February 03, 2024",
    color: "blue",
  },
  {
    name: "\u0412\u0438\u043a\u0442\u043e\u0440 \u041b\u0430\u0440\u0438\u0447\u0435\u0432",
    location: "Israel",
    date: "Feb 4 2025",
    avatar: "/images/reviews/victor-larichev.avif",
    title: "Excellent Services",
    text: "They always respond quickly and help, the cards work, they are very encouraging! I recommend it!",
    experienceDate: "April 11, 2025",
    color: "green",
  },
  {
    name: "Sergei Kashaev",
    location: "Cyprus",
    date: "Feb 4 2025",
    avatar: "/images/reviews/sergei-kashaev.avif",
    title: "Good service with cards.",
    text: "I recommend it to everyone. We have been using it for about three years now. Convenient interface for work. Prompt customer support. Regular update card BINs.",
    experienceDate: "December 18, 2024",
    color: "pink",
  },
];

const colorMap = {
  blue: "border-t-blue-500",
  green: "border-t-green-500",
  pink: "border-t-pink-500",
} as const;

export function ReviewsSection() {
  return (
    <section className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-[58.75rem]">
        <h2
          className="mb-10 text-center leading-[1.2] font-bold text-[#151c28] md:mb-14"
          style={{
            fontSize: "clamp(1.75rem, 1.1338rem + 2.6291vw, 3.5rem)",
          }}
        >
          Reviews from{" "}
          <span className="text-[#00b67a]">Trustpilot</span>
        </h2>

        <div className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
          {reviews.map((review) => (
            <div
              key={review.name}
              className={cn(
                "min-w-[300px] flex-shrink-0 snap-start rounded-2xl border border-transparent bg-white p-6 md:min-w-[340px] md:p-8",
                "border-t-4",
                colorMap[review.color]
              )}
              style={{
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    width={50}
                    height={50}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-[#151c28]">
                      {review.name}
                    </p>
                    <p className="text-sm text-[#4d5e80]">{review.location}</p>
                  </div>
                </div>
                <span className="text-sm text-[#4d5e80]">{review.date}</span>
              </div>

              <Image
                src="/images/reviews/review-stars.png"
                alt="5 stars"
                width={150}
                height={28}
                className="mb-4"
                style={{
                  width: "clamp(8rem, 6rem + 4vw, 9.375rem)",
                  height: "auto",
                }}
              />

              <h3 className="mb-2 font-bold text-[#151c28]">{review.title}</h3>
              <p className="mb-4 text-sm leading-relaxed text-[#4d5e80]">
                {review.text}
              </p>
              <p className="text-xs text-[#4d5e80]">
                Date of experience:{" "}
                <span className="font-medium">{review.experienceDate}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

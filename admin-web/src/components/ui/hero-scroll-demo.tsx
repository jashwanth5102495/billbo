"use client";

import React from "react";
import { Download } from "lucide-react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden py-12 md:py-16">
      <ContainerScroll
        titleComponent={
          <>
            <h2 className="text-3xl md:text-4xl font-semibold text-black dark:text-white">
              How BillBo works
            </h2>
            <p className="mt-4 text-sm sm:text-base md:text-lg text-neutral-700 dark:text-neutral-200">
              From idea to live campaign in minutes. Scroll to see how brands and screen
              owners use BillBo to launch, schedule, and manage digital billboard content.
            </p>
          </>
        }
      >
        <img
          src="/box.png"
          alt="BillBo app showing ad booking flow"
          className="mx-auto h-full w-full rounded-2xl object-cover object-center"
          draggable={false}
        />
      </ContainerScroll>

      <div className="mt-1 flex flex-col items-center justify-center px-4">
        <p className="mb-6 max-w-3xl text-center text-xs sm:text-sm md:text-base text-neutral-300">
          BillBo provides a smooth and seamless platform to book and play advertisements across both
          digital and traditional static billboards. Powered by an AI-integrated mobile application,
          we simplify the entire process—from discovery and booking to scheduling and playback—
          allowing businesses to launch ads in less time and at lower costs. Our intelligent automation
          removes manual complexity, making billboard advertising fast, affordable, and accessible for
          everyone, from small businesses to large brands.
        </p>
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Simple booking flow
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] sm:text-xs md:text-sm">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white">
            Login
          </span>
          <span className="text-neutral-500">→</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white">
            Select date & configure advertisement
          </span>
          <span className="text-neutral-500">→</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white">
            Upload & complete payment
          </span>
          <span className="text-neutral-500">→</span>
          <span className="rounded-full border border-emerald-400/40 bg-emerald-500/20 px-3 py-1 text-emerald-200">
            Watch your Ad being played
          </span>
        </div>

        <a
          href="/app.apk"
          download="BillBo-App.apk"
          className="mt-6 flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-600 hover:shadow-lg active:scale-95"
        >
          <Download className="h-4 w-4" />
          Download Mobile App
        </a>
      </div>
    </div>
  );
}

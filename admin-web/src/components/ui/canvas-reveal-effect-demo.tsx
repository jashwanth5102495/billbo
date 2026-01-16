"use client";
import React from "react";
import { AnimatePresence, motion } from "motion/react";
import PixelCard from "@/components/ui/pixel-card";

export default function CanvasRevealEffectDemo() {
  return (
    <>
      <div className="py-20 w-full bg-white dark:bg-black">
        <div className="max-w-5xl mx-auto px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            Our Services
          </h2>
          <p className="mt-4 mb-10 text-sm sm:text-base md:text-lg text-center text-neutral-700 dark:text-neutral-200">
            Powered by AI-driven automation, BillBo makes digital billboard advertising fast and effortless.
            Businesses can book, schedule, and play ads in just 5–10 minutes at flexible, affordable prices,
            while billboard owners can connect their LED screens to grow revenue seamlessly. Beyond advertising,
            anyone can also share public wishes and invitations—everything managed smoothly through one intelligent platform.
          </p>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
            <Card
              title="Play advertisement"
              image="/1.png"
              description={[
                "Launch your ads on digital billboards in minutes.",
                "Upload, schedule, and go live instantly with flexible pricing and zero manual effort.",
              ]}
              icon={<AceternityIcon />}
              variant="brown"
            />
            <Card
              title="Connect your screen"
              image="/2.png"
              description={[
                "Turn your LED screen into a smart revenue source.",
                "Connect, manage, and monetize your display remotely through our platform.",
              ]}
              icon={<AceternityIcon />}
              variant="blue"
            />
            <Card
              title="Wish your loved once"
              image="/3.png"
              description={[
                "Make moments unforgettable with public digital wishes.",
                "Celebrate birthdays, anniversaries, and milestones on premium LED screens.",
              ]}
              icon={<AceternityIcon />}
              variant="pink"
            />
          </div>
        </div>
      </div>
    </>
  );
}

const Card = ({
  title,
  icon,
  image,
  description,
  variant = "default",
}: {
  title: string;
  icon: React.ReactNode;
  image: string;
  description: string[];
  variant?: "default" | "brown" | "blue" | "yellow" | "pink";
}) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <PixelCard
      variant={variant}
      className="border border-black/[0.2] group/canvas-card flex items-center justify-center dark:border-white/[0.2] max-w-sm w-full mx-auto p-4 relative h-[30rem]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
        animate={{ opacity: hovered ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      />
      <div className="absolute inset-0 z-10 bg-black/40" />
      <Icon className="absolute z-20 h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute z-20 h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute z-20 h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
      <Icon className="absolute z-20 h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />
      <div className="relative z-30 flex h-full w-full items-center justify-center px-6 text-center">
        <AnimatePresence mode="wait">
          {!hovered ? (
            <motion.h2
              key="title"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="text-xl font-bold text-white"
            >
              {title}
            </motion.h2>
          ) : (
            <motion.div
              key="description"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-2 text-sm leading-relaxed text-white"
            >
              <h3 className="text-lg font-semibold">{title}</h3>
              <p>
                {description[0]}
                <br />
                {description[1]}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PixelCard>
  );
};

const AceternityIcon = () => {
  return (
    <svg
      width="66"
      height="65"
      viewBox="0 0 66 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10 text-black dark:text-white group-hover/canvas-card:text-white "
    >
      <path
        d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696"
        stroke="currentColor"
        strokeWidth="15"
        strokeMiterlimit="3.86874"
        strokeLinecap="round"
        style={{ mixBlendMode: "darken" }}
      />
    </svg>
  );
};

const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};

"use client";

import { motion } from "framer-motion";
import ShinyText from "@/components/ui/ShinyText";

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 30 }, (_, index) => {
    const i = index + 3;
    return {
      id: i,
      d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
        380 - i * 5 * position
      } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
        152 - i * 5 * position
      } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
        684 - i * 5 * position
      } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
      color: `rgba(15,23,42,${0.1 + i * 0.03})`,
      width: 0.5 + i * 0.03,
    }
  });

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full hero-paths"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 28 + Math.random() * 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export function BackgroundPaths({
  title = "Background Paths",
}: {
  title?: string;
}) {
  const words = title.split(" ");

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden hero-background">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-6xl sm:text-8xl md:text-8xl font-bold mb-3 -mt-6 tracking-tighter">
            {words.map((word, wordIndex) => (
              <span
                key={wordIndex}
                className="inline-block mr-4 last:mr-0"
              >
                {word.split("").map((letter, letterIndex) => (
                  <motion.span
                    key={`${wordIndex}-${letterIndex}`}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay:
                        wordIndex * 0.1 +
                        letterIndex * 0.03,
                      type: "spring",
                      stiffness: 150,
                      damping: 25,
                    }}
                    className="inline-block text-transparent bg-clip-text hero-title-gradient"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>
          <p className="mt-2 text-sm sm:text-base md:text-lg text-white">
            <ShinyText
              text="Book. Play. Go Live — in Minutes."
              speed={1.5}
              delay={0}
              color="#9ca3af"
              shineColor="#ffffff"
              spread={90}
              direction="left"
              yoyo={true}
              pauseOnHover={false}
              className="text-base sm:text-lg md:text-xl font-semibold"
            />
          </p>
          <p className="mt-5 mx-auto max-w-2xl text-sm sm:text-base md:text-lg text-neutral-700 dark:text-neutral-200">
            BillBo lets businesses launch ads on digital billboards in just 5–10 minutes with flexible,
            low pricing—accessible for everyone from small businesses to large brands.
            <br />
            From advertising to public wishes, everything runs seamlessly through one app.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

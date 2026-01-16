"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import "./pixel-card.css";

class Pixel {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  x: number;
  y: number;
  color: string;
  speed: number;
  size: number;
  sizeStep: number;
  minSize: number;
  maxSizeInteger: number;
  maxSize: number;
  delay: number;
  counter: number;
  counterStep: number;
  isIdle: boolean;
  isReverse: boolean;
  isShimmer: boolean;

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    speed: number,
    delay: number,
  ) {
    this.canvas = canvas;
    this.ctx = context;
    this.width = canvas.width;
    this.height = canvas.height;
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = this.getRandomValue(0.1, 0.9) * speed;
    this.size = 0;
    this.sizeStep = Math.random() * 0.4;
    this.minSize = 0.5;
    this.maxSizeInteger = 2;
    this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger);
    this.delay = delay;
    this.counter = 0;
    this.counterStep =
      Math.random() * 4 + (this.width + this.height) * 0.01;
    this.isIdle = false;
    this.isReverse = false;
    this.isShimmer = false;
  }

  getRandomValue(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  draw() {
    const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(
      this.x + centerOffset,
      this.y + centerOffset,
      this.size,
      this.size,
    );
  }

  appear() {
    this.isIdle = false;
    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }
    if (this.size >= this.maxSize) {
      this.isShimmer = true;
    }
    if (this.isShimmer) {
      this.shimmer();
    } else {
      this.size += this.sizeStep;
    }
    this.draw();
  }

  disappear() {
    this.isShimmer = false;
    this.counter = 0;
    if (this.size <= 0) {
      this.isIdle = true;
      return;
    } else {
      this.size -= 0.1;
    }
    this.draw();
  }

  shimmer() {
    if (this.size >= this.maxSize) {
      this.isReverse = true;
    } else if (this.size <= this.minSize) {
      this.isReverse = false;
    }
    if (this.isReverse) {
      this.size -= this.speed;
    } else {
      this.size += this.speed;
    }
  }
}

function getEffectiveSpeed(
  value: number | string,
  reducedMotion: boolean,
): number {
  const min = 0;
  const max = 100;
  const throttle = 0.001;
  const parsed =
    typeof value === "string" ? parseInt(value, 10) || 0 : value;

  if (parsed <= min || reducedMotion) {
    return min;
  } else if (parsed >= max) {
    return max * throttle;
  } else {
    return parsed * throttle;
  }
}

const VARIANTS = {
  default: {
    activeColor: null as string | null,
    gap: 5,
    speed: 35,
    colors: "#f8fafc,#f1f5f9,#cbd5e1",
    noFocus: false,
  },
  brown: {
    activeColor: "#78350f",
    gap: 7,
    speed: 30,
    colors: "#f5f5f4,#f97316,#78350f",
    noFocus: false,
  },
  blue: {
    activeColor: "#e0f2fe",
    gap: 10,
    speed: 25,
    colors: "#e0f2fe,#7dd3fc,#0ea5e9",
    noFocus: false,
  },
  yellow: {
    activeColor: "#fef08a",
    gap: 3,
    speed: 20,
    colors: "#fef08a,#fde047,#eab308",
    noFocus: false,
  },
  pink: {
    activeColor: "#fecdd3",
    gap: 6,
    speed: 80,
    colors: "#fecdd3,#fda4af,#e11d48",
    noFocus: true,
  },
};

type VariantKey = keyof typeof VARIANTS;

type PixelCardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: VariantKey;
  gap?: number | string;
  speed?: number | string;
  colors?: string;
  noFocus?: boolean;
};

export default function PixelCard({
  variant = "default",
  gap,
  speed,
  colors,
  noFocus,
  className,
  children,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...rest
}: PixelCardProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const animationRef = useRef<number | null>(null);
  const timePreviousRef = useRef<number>(performance.now());

  const variantCfg = VARIANTS[variant] || VARIANTS.default;
  const finalGap = gap ?? variantCfg.gap;
  const finalSpeed = speed ?? variantCfg.speed;
  const finalColors = colors ?? variantCfg.colors;
  const finalNoFocus = noFocus ?? variantCfg.noFocus;

  const doAnimate = (fnName: "appear" | "disappear") => {
    animationRef.current = window.requestAnimationFrame(() =>
      doAnimate(fnName),
    );
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const timeNow = performance.now();
    const timePassed = timeNow - timePreviousRef.current;
    const timeInterval = 1000 / 60;
    if (timePassed < timeInterval) return;
    timePreviousRef.current =
      timeNow - (timePassed % timeInterval);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let allIdle = true;
    for (let i = 0; i < pixelsRef.current.length; i += 1) {
      const pixel = pixelsRef.current[i];
      pixel[fnName]();
      if (!pixel.isIdle) {
        allIdle = false;
      }
    }
    if (allIdle && animationRef.current !== null) {
      window.cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const handleAnimation = (name: "appear" | "disappear") => {
    if (animationRef.current !== null) {
      window.cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    animationRef.current = window.requestAnimationFrame(() =>
      doAnimate(name),
    );
  };

  const handleMouseEnter: React.MouseEventHandler<HTMLDivElement> = (
    event,
  ) => {
    handleAnimation("appear");
    if (onMouseEnter) {
      onMouseEnter(event);
    }
  };

  const handleMouseLeave: React.MouseEventHandler<HTMLDivElement> = (
    event,
  ) => {
    handleAnimation("disappear");
    if (onMouseLeave) {
      onMouseLeave(event);
    }
  };

  const handleFocus: React.FocusEventHandler<HTMLDivElement> = (
    event,
  ) => {
    if (!finalNoFocus) {
      handleAnimation("appear");
    }
    if (onFocus) {
      onFocus(event);
    }
  };

  const handleBlur: React.FocusEventHandler<HTMLDivElement> = (
    event,
  ) => {
    if (!finalNoFocus) {
      handleAnimation("disappear");
    }
    if (onBlur) {
      onBlur(event);
    }
  };

  useEffect(() => {
    const createPixels = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const colorsArray = finalColors.split(",");
      const reducedMotion =
        typeof window !== "undefined" &&
        window
          .matchMedia("(prefers-reduced-motion: reduce)")
          .matches;

      const gapValue =
        typeof finalGap === "string"
          ? parseInt(finalGap, 10) || 1
          : finalGap;

      const pixels: Pixel[] = [];
      for (let x = 0; x < width; x += gapValue) {
        for (let y = 0; y < height; y += gapValue) {
          const color =
            colorsArray[
              Math.floor(Math.random() * colorsArray.length)
            ];

          const dx = x - width / 2;
          const dy = y - height / 2;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const delay = reducedMotion ? 0 : distance;

          pixels.push(
            new Pixel(
              canvas,
              ctx,
              x,
              y,
              color,
              getEffectiveSpeed(finalSpeed, reducedMotion),
              delay,
            ),
          );
        }
      }
      pixelsRef.current = pixels;
    };

    createPixels();

    const handleResize = () => {
      createPixels();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current !== null) {
        window.cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      pixelsRef.current = [];
    };
  }, [finalGap, finalSpeed, finalColors]);

  return (
    <div
      ref={containerRef}
      className={cn("pixel-card", className)}
      tabIndex={finalNoFocus ? -1 : 0}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...rest}
    >
      <canvas
        ref={canvasRef}
        className="pixel-card-canvas"
        aria-hidden="true"
      />
      <div className="pixel-card-inner">{children}</div>
    </div>
  );
}

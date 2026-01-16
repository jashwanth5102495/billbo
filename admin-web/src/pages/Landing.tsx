import { BackgroundPaths } from "@/components/ui/background-paths";
import BackgroundBeamsDemo from "@/components/ui/background-beams-demo";
import CanvasRevealEffectDemo from "@/components/ui/canvas-reveal-effect-demo";
import { FloatingNav } from "@/components/ui/floating-nav";
import { HeroScrollDemo } from "@/components/ui/hero-scroll-demo";

export default function Landing() {
  return (
    <>
      <FloatingNav />
      <main className="relative w-full overflow-hidden">
        <section>
          <BackgroundPaths title="BillBo" />
        </section>
        <section>
          <HeroScrollDemo />
        </section>
        <section id="services">
          <CanvasRevealEffectDemo />
        </section>
        <section id="waitlist">
          <BackgroundBeamsDemo />
        </section>
      </main>
    </>
  );
}

import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PinMode, StackedCardsAnimationOptions, StackedCardsInitOptions } from "./types";

gsap.registerPlugin(ScrollTrigger, Observer);

const DEFAULT_ANIMATION: StackedCardsAnimationOptions = {
  start: "top 20%",
  end: "+=100",
  yOffsetStep: 20,
  stepDuration: 0.5,
  activeColor: "#3498db"
};

const DEFAULT_PIN_MODE: PinMode = "gsap";
const MOBILE_MEDIA = "(max-width: 900px)";
const REDUCED_MEDIA = "(prefers-reduced-motion: reduce)";

type ActiveInstance = { destroy: () => void };

const activeInstances = new WeakMap<HTMLElement, ActiveInstance>();

function withDefaults(options?: Partial<StackedCardsInitOptions>): StackedCardsInitOptions {
  return {
    pinMode: options?.pinMode ?? DEFAULT_PIN_MODE,
    reducedMotion: options?.reducedMotion ?? window.matchMedia(REDUCED_MEDIA).matches,
    animation: {
      ...DEFAULT_ANIMATION,
      ...(options?.animation ?? {})
    }
  };
}

function shouldUseStaticMode(options: StackedCardsInitOptions, cardsCount: number): boolean {
  if (options.reducedMotion) return true;
  if (cardsCount <= 1) return true;
  if (window.matchMedia(MOBILE_MEDIA).matches) return true;
  return false;
}

export function initStackedCards(
  root: HTMLElement,
  options?: Partial<StackedCardsInitOptions>
): { destroy: () => void } {
  const existing = activeInstances.get(root);
  if (existing) return existing;

  const merged = withDefaults(options);
  const pinned = root.querySelector<HTMLElement>("[data-stacked-cards-pinned]");
  const cardsTrack = root.querySelector<HTMLElement>("[data-stacked-cards-track]");
  const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-stacked-cards-card]"));

  if (!pinned || !cardsTrack || cards.length === 0 || shouldUseStaticMode(merged, cards.length)) {
    root.dataset.enhanced = "false";
    const noop = { destroy: () => activeInstances.delete(root) };
    activeInstances.set(root, noop);
    return noop;
  }

  root.dataset.enhanced = "true";
  root.dataset.stackedCardsPinMode = merged.pinMode;

  gsap.set(cards, {
    y: (index) => index * merged.animation.yOffsetStep,
    transformOrigin: "center top",
    zIndex: (index) => index + 1
  });

  const timeline = gsap.timeline({ paused: true });

  for (let index = 0; index < cards.length - 1; index += 1) {
    const currentCard = cards[index];
    const nextCard = cards[index + 1];
    const targetScale = Math.min(0.95, 0.85 + 0.05 * index);

    timeline.add(`card${index + 2}`);
    timeline.to(
      currentCard,
      {
        scale: targetScale,
        duration: merged.animation.stepDuration,
        backgroundColor: merged.animation.activeColor
      }
    );

    timeline.from(
      nextCard,
      { y: () => window.innerHeight, duration: merged.animation.stepDuration },
      "<"
    );
  }
  timeline.add(`card${cards.length + 1}`);

  let animating = false;
  let currentDirection: "up" | "down" | null = null;
  let queuedDirection: "up" | "down" | null = null;
  let activeTween: gsap.core.Tween | null = null;
  let restoreScroll: (() => void) | null = null;

  const directionToLabel = (direction: "up" | "down"): string | null =>
    direction === "down" ? timeline.nextLabel() : timeline.previousLabel();

  const startTweenTo = (direction: "up" | "down") => {
    const label = directionToLabel(direction);
    if (!label) {
      return;
    }

    currentDirection = direction;
    animating = true;
    activeTween?.kill();
    activeTween = timeline.tweenTo(label, {
      overwrite: true,
      onComplete: () => {
        activeTween = null;
        animating = false;
        currentDirection = null;

        if (queuedDirection) {
          const nextDirection = queuedDirection;
          queuedDirection = null;
          startTweenTo(nextDirection);
        }
      }
    });
  };

  const tweenToDirection = (direction: "up" | "down") => {
    if (animating) {
      if (currentDirection && currentDirection !== direction) {
        queuedDirection = null;
        animating = false;
        currentDirection = null;
        activeTween?.kill();
        activeTween = null;
        startTweenTo(direction);
        return;
      }

      queuedDirection = direction;
      return;
    }

    startTweenTo(direction);
  };

  const cardsObserver = Observer.create({
    wheelSpeed: -1,
    onDown: () => tweenToDirection("up"),
    onUp: () => tweenToDirection("down"),
    tolerance: 10,
    preventDefault: true,
    onEnable(self) {
      const savedScroll = self.scrollY();
      restoreScroll = () => self.scrollY(savedScroll);
      document.addEventListener("scroll", restoreScroll, { passive: false });
    },
    onDisable() {
      if (restoreScroll) {
        document.removeEventListener("scroll", restoreScroll);
        restoreScroll = null;
      }
    }
  });
  cardsObserver.disable();

  const trigger = ScrollTrigger.create({
    trigger: root,
    start: merged.animation.start,
    end: merged.animation.end,
    pin: merged.pinMode === "gsap" ? root : false,
    pinSpacing: merged.pinMode === "gsap",
    onEnter: () => {
      if (!cardsObserver.isEnabled) cardsObserver.enable();
    },
    onEnterBack: () => {
      if (!cardsObserver.isEnabled) cardsObserver.enable();
    },
    onLeave: () => cardsObserver.disable(),
    onLeaveBack: () => cardsObserver.disable()
  });

  const cleanup = {
    destroy: () => {
      queuedDirection = null;
      activeTween?.kill();
      activeTween = null;
      currentDirection = null;
      cardsObserver.kill();
      trigger.kill();
      timeline.kill();
      gsap.set(cards, { clearProps: "transform,backgroundColor,zIndex" });
      delete root.dataset.enhanced;
      delete root.dataset.stackedCardsPinMode;
      activeInstances.delete(root);
    }
  };

  activeInstances.set(root, cleanup);
  return cleanup;
}

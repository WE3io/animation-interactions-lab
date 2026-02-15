import { initStackedCards } from "./initStackedCards";
import type { StackedCardsInitOptions } from "./types";

type ActiveCleanup = { destroy: () => void };

type BootState = {
  observer: IntersectionObserver | null;
  active: Map<HTMLElement, ActiveCleanup>;
  refresh: () => void;
  destroyAll: () => void;
};

const ROOT_SELECTOR = "[data-stacked-cards-root]";
const STATE_KEY = "__stackedCardsBootState";

function parseOptions(root: HTMLElement): Partial<StackedCardsInitOptions> {
  const optionsRaw = root.dataset.stackedCardsOptions;
  if (!optionsRaw) return {};

  try {
    const parsed = JSON.parse(optionsRaw);
    if (typeof parsed !== "object" || parsed === null) return {};
    return parsed as Partial<StackedCardsInitOptions>;
  } catch {
    return {};
  }
}

function setupState(): BootState {
  const active = new Map<HTMLElement, ActiveCleanup>();

  const state: BootState = {
    observer: null,
    active,
    refresh: () => {
      const roots = Array.from(document.querySelectorAll<HTMLElement>(ROOT_SELECTOR));
      for (const root of roots) {
        if (active.has(root)) {
          if (root.dataset.enhanced !== "false") continue;
          active.get(root)?.destroy();
          active.delete(root);
        }

        if (!state.observer) {
          state.observer = new IntersectionObserver(
            (entries) => {
              for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                const target = entry.target as HTMLElement;
                if (active.has(target)) {
                  state.observer?.unobserve(target);
                  continue;
                }
                const cleanup = initStackedCards(target, parseOptions(target));
                active.set(target, cleanup);
                state.observer?.unobserve(target);
              }
            },
            { rootMargin: "240px 0px" }
          );
        }

        state.observer.observe(root);
      }
    },
    destroyAll: () => {
      state.observer?.disconnect();
      state.observer = null;
      for (const cleanup of active.values()) {
        cleanup.destroy();
      }
      active.clear();
    }
  };

  return state;
}

export function bootStackedCards(): void {
  if (typeof window === "undefined") return;

  const win = window as typeof window & { [STATE_KEY]?: BootState };
  if (!win[STATE_KEY]) {
    const state = setupState();
    win[STATE_KEY] = state;

    document.addEventListener("astro:before-swap", state.destroyAll);
    document.addEventListener("astro:page-load", state.refresh);
    window.addEventListener("resize", state.refresh, { passive: true });
  }

  win[STATE_KEY]?.refresh();
}

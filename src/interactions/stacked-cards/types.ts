export type PinMode = "sticky" | "gsap";

export type StackedCardItem = {
  id: string;
  title: string;
  body?: string;
  imageSrc?: string;
  imageAlt?: string;
};

export type StackedCardsAnimationOptions = {
  start: string;
  end: string;
  yOffsetStep: number;
  stepDuration: number;
  activeColor: string;
};

export type StackedCardsInitOptions = {
  pinMode: PinMode;
  reducedMotion: boolean;
  animation: StackedCardsAnimationOptions;
};

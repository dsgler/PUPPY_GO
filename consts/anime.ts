import {
  Easing,
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';

export const myFadeIn = FadeIn.duration(300).easing(Easing.inOut(Easing.quad));
export const myFadeOut = FadeOut.duration(300).easing(
  Easing.inOut(Easing.quad),
);
export const myLayoutTransition = LinearTransition.duration(300);

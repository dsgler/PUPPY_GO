import { createContext } from 'react';

export const ChosenDateArrCtx = createContext<
  [number, React.Dispatch<React.SetStateAction<number>>]
>([
  -1,
  () => {
    throw Error('请提供chosenDateArr');
  },
]);

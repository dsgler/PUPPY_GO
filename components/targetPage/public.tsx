import {
  Easing,
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import { createContext } from 'react';
import { ImmerHook } from 'use-immer';

import { getGapTimeString } from '@/utility/datetool';
import { frequencyType, targetRow } from '@/sqls/targetSql2';
import sportArr from '@/consts/sportType';
import * as consts_frequency from '@/consts/frequency';
import { defaultError } from '@/consts/defaultError';
import { GestureResponderEvent } from 'react-native';

export function getDescription(v: {
  sportId: number;
  description: string;
  duration: number;
}) {
  return v.sportId === -1
    ? v.description
    : `${sportArr[v.sportId].sportName}${getGapTimeString(v.duration)}`;
}

export const MenuCtx = createContext<
  [menuObjType, (menuobj: menuObjType) => void]
>([
  {
    x: 0,
    y: 0,
    visibility: false,
    targetId: -1,
    groupId: -1,
    groupName: '',
  },
  defaultError,
]);

export type menuObjType = {
  x: number;
  y: number;
  visibility: boolean;
  targetId: number;
  groupId: number;
  groupName: string;
};

export const RefreshFnCtx = createContext<() => void>(() => {
  throw Error('不应获取默认值');
});

export const ShowAddTargetCtx =
  createContext<
    (
      e?: GestureResponderEvent,
      isClear?: boolean,
      afterClear?: (AddTargetStates: AddTargetStates) => void,
    ) => void
  >(defaultError);
export const ShowAddGroupCtx = createContext<() => void>(defaultError);
export type AddTargetStates = {
  frequencyState: ImmerHook<frequencyType>;
  dataState: ImmerHook<targetRow>;
};
export const AddTarget_frequencyStateDefault = {
  typeId: consts_frequency.DAILY,
  content: [],
};
export const AddTarget_dataStateDefault = {
  Id: -1,
  groupId: -1,
  description: '',
  makeTime: -1,
  duration: 0,
  count: 0,
  frequency: '',
  sportId: -1,
  endTime: -1,
};

export const myFadeIn = FadeIn.duration(300).easing(Easing.inOut(Easing.quad));
export const myFadeOut = FadeOut.duration(300).easing(
  Easing.inOut(Easing.quad),
);
export const myLayoutTransition = LinearTransition.duration(300);

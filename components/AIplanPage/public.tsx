import { createContext } from 'react';
import { ImmerHook } from 'use-immer';
import { HeightAndWeight } from '@/consts/AIplanPage';
import { planReplyType } from '@/consts/propmts';
import { defaultError } from '@/consts/defaultError';

export type InfoObjType = {
  heightRaw: string;
  weightRaw: string;
  sick: { chosen: Set<number>; attach: string };
  bodyImprove: { chosen: Set<number>; attach: string };
  retArr: planReplyType;
};

export const InfoObjDefault: InfoObjType = {
  heightRaw: '',
  weightRaw: '',
  sick: { chosen: new Set(), attach: '' },
  bodyImprove: { chosen: new Set(), attach: '' },
  retArr: [],
};

export const InfoObjStateCtx = createContext<ImmerHook<InfoObjType>>([
  InfoObjDefault,
  defaultError,
]);

export const checkValid = (Step: number, obj: InfoObjType): string => {
  const messages: string[] = [];
  if (Step >= HeightAndWeight) {
    const height = Number(obj.heightRaw);
    if (isNaN(height) || height < 50 || height > 300) {
      messages.push('请输入合理的身高');
    }
    const weight = Number(obj.weightRaw);
    if (isNaN(weight) || weight < 10 || weight > 300) {
      messages.push('请输入合理的体重');
    }
  }
  return messages.join('\n');
};

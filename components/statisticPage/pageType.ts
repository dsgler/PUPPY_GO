import { ColorValue } from 'react-native';

export const MOOD = 0;
export const DURATION = 1;
export const EFFORT = 2;
export const TAG = 3;
type pageTypeRow = { Id: number; color: ColorValue; description: string };
export const pageTypeArr: pageTypeRow[] = [
  { Id: MOOD, color: '#BE6FBD', description: '心情' },
  { Id: DURATION, color: '#95D494', description: '时间' },
  { Id: EFFORT, color: '#6EC2DC', description: '耗力' },
  { Id: TAG, color: '#DCC76E', description: '关键词/日记' },
];

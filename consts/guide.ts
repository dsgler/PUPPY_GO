type guideRowType = {
  step: number;
  description: string;
  topModifier: number;
  leftModifier: number;
};
export const guideArr: guideRowType[] = [
  {
    step: 1,
    description: '点击记录本次运动情况',
    topModifier: -130,
    leftModifier: 20,
  },
  {
    step: 2,
    description: '点这里查看往期数据',
    topModifier: 30,
    leftModifier: 20,
  },
  {
    step: 3,
    description: '创建分组，可以归类不同类型的目标',
    topModifier: 80,
    leftModifier: 0,
  },
  {
    step: 4,
    description:
      '添加目标，可以选择将其置于某个周/月分组下就可以开始和小狗一起运动啦！',
    topModifier: 80,
    leftModifier: 0,
  },
];
export const END_STEP = guideArr[guideArr.length - 1].step;

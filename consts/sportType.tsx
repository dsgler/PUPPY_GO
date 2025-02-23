export type sportItemType = {
  id: number;
  sportName: string;
  color: string;
  emoji: string;
};
const sportArr: sportItemType[] = [
  {
    id: 0,
    sportName: "跑步",
    color: "#c5d29c",
    emoji: "🏃",
  },
  {
    id: 1,
    sportName: "快走",
    color: "#b49bd4",
    emoji: "🚶",
  },
  {
    id: 2,
    sportName: "羽毛球",
    color: "#dcc76e",
    emoji: "🏸",
  },
  {
    id: 3,
    sportName: "篮球",
    color: "#6ec2dc",
    emoji: "🏀",
  },
  {
    id: 4,
    sportName: "乒乓球",
    color: "#e58787",
    emoji: "🏓",
  },
  {
    id: 5,
    sportName: "游泳",
    color: "#90c89c",
    emoji: "🏊",
  },
  {
    id: 6,
    sportName: "网球",
    color: "#be6fbc",
    emoji: "🎾",
  },
  {
    id: 7,
    sportName: "瑜伽",
    color: "#6f70be",
    emoji: "🧘‍♂️",
  },
  {
    id: 8,
    sportName: "排球",
    color: "#da9e69",
    emoji: "🏐",
  },
  {
    id: 9,
    sportName: "飞盘",
    color: "#95d494",
    emoji: "🥏",
  },
];

export default sportArr;

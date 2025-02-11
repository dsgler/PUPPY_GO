import { ColorValue, ImageSourcePropType } from "react-native";

export const HAPPY = 0;
export const SAD = 1;
export const COOL = 2;
export const ANGRY = 3;

type MoodArrRow = {
  Id: number;
  unPic: () => ImageSourcePropType;
  pic: () => ImageSourcePropType;
  descirption: string;
  icon: string;
  color: ColorValue;
};
export const MoodArr: MoodArrRow[] = [
  {
    Id: HAPPY,
    unPic: () => require("../assets/images/addPage/happy_un.png"),
    pic: () => require("../assets/images/addPage/happy.png"),
    descirption: "开心",
    icon: "emoticon-happy-outline",
    color: "#F0AD5B",
  },
  {
    Id: SAD,
    unPic: () => require("../assets/images/addPage/sad_un.png"),
    pic: () => require("../assets/images/addPage/sad.png"),
    descirption: "伤心",
    icon: "emoticon-sad-outline",
    color: "#1F80A3",
  },
  {
    Id: COOL,
    unPic: () => require("../assets/images/addPage/wink_un.png"),
    pic: () => require("../assets/images/addPage/wink.png"),
    descirption: "得意",
    icon: "emoticon-cool-outline",
    color: "#9FA8F5",
  },
  {
    Id: ANGRY,
    unPic: () => require("../assets/images/addPage/angry_un.png"),
    pic: () => require("../assets/images/addPage/angry.png"),
    descirption: "生气",
    icon: "emoticon-angry-outline",
    color: "#F57165",
  },
];

type effortType = {
  s1: string;
  s2: string;
};

export const effortArr: effortType[] = [
  {
    s1: "点击进度条记录运动耗力",
    s2: "小狗我要开始奔跑啦",
  },
  {
    s1: "毫不费力",
    s2: "小小运动，轻松拿下",
  },
  {
    s1: "比较轻松",
    s2: "努努力，这点运动量简直轻轻松松",
  },
  {
    s1: "有点费力",
    s2: "呼哧带喘，只能用大拇指竖起来表示赞赏",
  },
  {
    s1: "太费力啦",
    s2: "今天的运动量太超标啦",
  },
];

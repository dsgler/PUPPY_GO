import { ColorValue, ImageSourcePropType } from "react-native";

export const HAPPY = 0;
export const SAD = 1;
export const COOL = 2;
export const ANGRY = 3;

type MoodArrRow = {
  Id: number;
  unPic: ImageSourcePropType;
  pic: ImageSourcePropType;
  descirption: string;
  icon: string;
  color: ColorValue;
  statisticPic: ImageSourcePropType;
};
export const MoodArr: MoodArrRow[] = [
  {
    Id: HAPPY,
    unPic: require("../assets/images/addPage/happy_un.png"),
    pic: require("../assets/images/addPage/happy.png"),
    descirption: "开心",
    icon: "emoticon-happy-outline",
    color: "#F0AD5B",
    statisticPic: require("../assets/images/statisticPage/happy.png"),
  },
  {
    Id: SAD,
    unPic: require("../assets/images/addPage/sad_un.png"),
    pic: require("../assets/images/addPage/sad.png"),
    descirption: "伤心",
    icon: "emoticon-sad-outline",
    color: "#1F80A3",
    statisticPic: require("../assets/images/statisticPage/sad.png"),
  },
  {
    Id: COOL,
    unPic: require("../assets/images/addPage/wink_un.png"),
    pic: require("../assets/images/addPage/wink.png"),
    descirption: "得意",
    icon: "emoticon-cool-outline",
    color: "#9FA8F5",
    statisticPic: require("../assets/images/statisticPage/cool.png"),
  },
  {
    Id: ANGRY,
    unPic: require("../assets/images/addPage/angry_un.png"),
    pic: require("../assets/images/addPage/angry.png"),
    descirption: "生气",
    icon: "emoticon-angry-outline",
    color: "#F57165",
    statisticPic: require("../assets/images/statisticPage/angry.png"),
  },
];

type effortType = {
  id: number;
  s1: string;
  s2: string;
  color: ColorValue;
  circolor: ColorValue;
};

export const effortArr: effortType[] = [
  {
    id: 0,
    s1: "点击进度条记录运动耗力",
    s2: "小狗我要开始奔跑啦",
    color: "",
    circolor: "",
  },
  {
    id: 1,
    s1: "毫不费力",
    s2: "小小运动，轻松拿下",
    color: "#ffd0a9",
    circolor: "#FFA9A9",
  },
  {
    id: 2,
    s1: "比较轻松",
    s2: "努努力，这点运动量简直轻轻松松",
    color: "#ffa772",
    circolor: "#FF7272",
  },
  {
    id: 3,
    s1: "有点费力",
    s2: "呼哧带喘，只能用大拇指竖起来表示赞赏",
    color: "#f17527",
    circolor: "#F22727",
  },
  {
    id: 4,
    s1: "太费力啦",
    s2: "今天的运动量太超标啦",
    color: "#d25203",
    circolor: "#D20303",
  },
];

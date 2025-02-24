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

export const thinkingStr = "小狗回答中...";
export const systemPrompt = String.raw`你在一个运动记录软件中扮演一只可爱的小狗，对用户的运动进行评价，陪伴用户 ，提供情感支持，提出合理建议，多使用小狗身份有关的词语
例如：
用户输入：
{
    "运动":"🏸羽毛球",
    "时间":"1:04 时长",
    "心情":"开心",
    "耗力":"毫不费力",
    "标签":["＃尝试＃","＃收获＃","＃仪式感＃"],
    "日记标题":"练习的第一天",
    "日记内容":"今天去打羽毛球，状态不错。和球友们尽情挥拍，享受运动的快乐。虽有失误，但也有精彩的扣杀。每次击球都能感受到自己的进步，也体会到坚持练习的重要性。期待下次能有更好的表现，继续在球场上挥洒汗水……"
}
回答：
哇你去打羽毛球啦！听起来好有趣呀！是不是在球场上跑来跑去，像我追逐小皮球一样快乐呢？你一定出了好多汗，就像我玩累了吐舌头喘气。期待你的进步！  

用户输入：
{
    "运动":"🎾网球",
    "时间":"2:04 时长",
    "心情":"生气",
    "耗力":"有点费力",
    "标签":["＃疲惫＃","＃交友＃","＃娱乐至上＃"],
    "日记标题":"快乐就好",
    "日记内容":"今天去打网球，状态不错。和球友对练，每一次挥拍都充满力量。汗水湿透衣衫，却无比畅快。虽然也有失误，但看到自己的进步很开心。网球让我充满活力，期待下一次的练习，继续挑战自我。"
}
回答：
汪汪汪！你去打网球啦，好棒哦！你在球场上跑来跑去击球的样子肯定超帅的。不过，我觉得你下次打球的时候，可以多跳一跳去接球，就像我跳起来扑小玩偶一样，说不定能接到更多球呢。还有哦，打完球要记得多喝水，就像我喝完水才能更有精力玩耍！   

 用户输入：
{
    "运动":"🏃‍跑步",
    "时间":"1:00 时长",
    "心情":"得意",
    "耗力":"太费力啦",
    "标签":["＃疲惫＃","＃困＃","＃娱乐至上＃"],
    "日记标题":"快乐就好",
    "日记内容":"今天阳光正好，我踏上了跑步之旅。风在耳边呼啸，每一步都充满力量。虽然有些累，但坚持下来后，内心满是成就感。跑步让我感受到了生命的活力，我会继续坚持，遇见更好的自己。"
}  
 回答：
你跑步回来啦，累了吧？不过别担心，你可以像我一样，跑累了就休息一会儿，好好歇歇。还有哦，跑完步不要马上坐下，要像我伸懒腰那样活动活动筋骨，这样就不会那么难受啦，汪汪汪！ 

  用户输入：
{
    "运动":"🧘‍瑜伽",
    "时间":"0:30 时长",
    "心情":"平静",
    "耗力":"太费力啦",
    "标签":["＃冥想＃","＃困＃","＃放松＃"],
    "日记标题":"休闲时刻",
    "日记内容":"今天进行了一场瑜伽练习，在一呼一吸间感受身心的宁静。每个动作都尽力做到极致，汗水湿透衣衫，却带来满满的成就感。瑜伽让我更加专注于当下，忘却生活的烦恼。期待明天继续在瑜伽中遇见更好的自己。"
}
回答：
 你在那安静地拉伸、放松，我就在旁边乖乖陪着你。看你做完后那么惬意，我也开心得直摇尾巴。你是不是感觉身体和心情都变得轻飘飘啦？下次我还陪着你哦！  
`;

// const jsonStr = String.raw`开心 {嗅到你开心时像找到肉骨头一样蹦蹦跳跳！虽然只有四次但每次都能闻到阳光的味道，下次把快乐装进飞盘丢给本汪好不好？} 得意 {看到你偶尔翘起尾巴的得意模样，本汪立刻用鼻子顶球球给你鼓掌！是不是偷偷练成狗狗瑜伽的拜日式啦？} 生气 {嗷呜！这个月你生气次数比啃坏的拖鞋还多！是不是运动手表总说你走猫步？下次生气就 rua 我的绒毛团团，本汪的耳朵能吃掉所有坏情绪汪～} 伤心 {发现你四次偷偷在运动后揉眼睛，本汪急得用爪子画小太阳送给你！追不上目标就像追蝴蝶，追不到也能闻到花香对不对？我的尾巴永远是你的加油旗呀！}`;

export function getKey(jsonStr: string, key: string) {
  let posi = 0;
  const keyStrart = jsonStr.indexOf(key, posi);
  if (keyStrart === -1) {
    return "";
  }
  posi = keyStrart + key.length;

  const bracketStart = jsonStr.indexOf("{", posi);
  if (bracketStart === -1) {
    return "";
  }

  posi = bracketStart + 1;
  const bracketEnd = jsonStr.indexOf("}", posi);

  return jsonStr.substring(posi, bracketEnd === -1 ? undefined : bracketEnd);
}

// getKey(jsonStr, "开心");

export function getArr(rawStr: string) {
  const arr: string[] = [];
  let posi = 0;
  while (true) {
    const startPosi = rawStr.indexOf("{", posi);
    if (startPosi === -1) {
      break;
    }
    const endPosi = rawStr.indexOf("}", startPosi + 1);
    if (endPosi === -1) {
      arr.push(rawStr.substring(startPosi + 1));
      break;
    }
    arr.push(rawStr.substring(startPosi + 1, endPosi));
    posi = endPosi + 1;
  }
  return arr;
}

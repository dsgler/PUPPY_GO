"use strict";
(() => {
  // utility/datetool.ts
  var oneDay = 24 * 60 * 60 * 1e3;
  function getDateNumber(t) {
    let d = new Date(t);
    return d.getFullYear() * 1e4 + (d.getMonth() + 1) * 100 + d.getDate();
  }
  function getDatesInMonth(t) {
    let d = new Date(t);
    let month = d.getMonth();
    t = d.getTime();
    t -= d.getDate() * oneDay;
    let ret = [];
    while (true) {
      t += oneDay;
      d = new Date(t);
      if (d.getMonth() === month) {
        ret.push(d);
      } else {
        break;
      }
    }
    return ret;
  }

  // test.ts
  console.log(getDatesInMonth(/* @__PURE__ */ new Date()).map((v) => getDateNumber(v)));
})();

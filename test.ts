import { getDatesInMonth, getDateNumber } from "@/utility/datetool";

console.log(getDatesInMonth(new Date()).map((v) => getDateNumber(v)));

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var datetool_1 = require("@/utility/datetool");
console.log((0, datetool_1.getDatesInMonth)(new Date()).map(function (v) { return (0, datetool_1.getDateNumber)(v); }));

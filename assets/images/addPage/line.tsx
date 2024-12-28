import React from "react";
import Svg, { Path } from "react-native-svg";

const Line = ({ length }: { length: number }) => (
  <Svg width={length} height="1" viewBox={`0 0 ${length} 1`}>
    <Path d={`M0 0.5h${length}V1H0z`} fill="#dcdcdc" />
  </Svg>
);

export default Line;

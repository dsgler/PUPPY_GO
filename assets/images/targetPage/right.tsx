import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
const SvgComponent = (props: SvgProps) => (
  <Svg width={17} height={17} fill="none" {...props}>
    <Path
      fill="#131315"
      d="M0 8.46a8.46 8.46 0 1 0 16.92 0A8.46 8.46 0 0 0 0 8.46Zm15.766 0c0 4.029-3.277 7.306-7.306 7.306S1.154 12.49 1.154 8.46 4.43 1.153 8.46 1.153s7.306 3.278 7.306 7.307Z"
    />
    <Path
      fill="#131315"
      d="m6.747 6.252 2.384 2.21-2.333 2.218a.646.646 0 0 0 .013.815c.197.222.51.217.7-.011l2.675-2.63a.647.647 0 0 0-.013-.816l-2.74-2.614a.447.447 0 0 0-.699.012.647.647 0 0 0 .013.816Z"
    />
  </Svg>
);
export default SvgComponent;

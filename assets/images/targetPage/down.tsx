import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
const SvgComponent = (props: SvgProps) => (
  <Svg width={17} height={17} fill="none" {...props}>
    <Path
      fill="#131315"
      d="M8.485 0C3.799 0 0 3.788 0 8.46c0 4.672 3.799 8.46 8.485 8.46s8.484-3.788 8.484-8.46C16.97 3.788 13.17 0 8.485 0Zm0 15.766c-4.04 0-7.328-3.277-7.328-7.306s3.287-7.306 7.328-7.306c4.04 0 7.327 3.277 7.327 7.306s-3.287 7.306-7.327 7.306Z"
    />
    <Path
      fill="#131315"
      d="M10.699 6.747 8.481 9.13 6.258 6.798a.65.65 0 0 0-.818.013.446.446 0 0 0 .012.7l2.637 2.675a.65.65 0 0 0 .819-.013l2.62-2.74a.446.446 0 0 0-.01-.7.65.65 0 0 0-.819.014Z"
    />
  </Svg>
);
export default SvgComponent;

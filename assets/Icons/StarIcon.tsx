import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgStarIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 12 12"
    {...props}
  >
    <Path
      fill="#F4C430"
      d="m6 1 1.545 3.13L11 4.635 8.5 7.07l.59 3.44L6 8.885 2.91 10.51l.59-3.44L1 4.635l3.455-.505z"
    />
  </Svg>
);
export default SvgStarIcon;

import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGoback = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path
      stroke="#364153"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m12 19-7-7 7-7M19 12H5"
    />
  </Svg>
);
export default SvgGoback;

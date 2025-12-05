import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSearch = (props: SvgProps) => (
  <Svg
    width={props.width}
    height={props.height}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      fill={props.color}
      d="M21.71 20.29 18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.39M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14"
    />
  </Svg>
);
export default SvgSearch;

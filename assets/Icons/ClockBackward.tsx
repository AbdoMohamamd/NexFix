import * as React from "react";
import type { SvgProps } from "react-native-svg";
import Svg, { Path } from "react-native-svg";
const SvgClockBackward = (props: SvgProps) => (
  <Svg
    width={props.width}
    height={props.height}
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <Path
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.667}
      d="M2.5 10A7.5 7.5 0 1 0 10 2.5a8.13 8.13 0 0 0-5.617 2.283L2.5 6.667"
    />
    <Path
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.667}
      d="M2.5 2.5v4.167h4.167M10 5.833V10l3.333 1.667"
    />
  </Svg>
);
export default SvgClockBackward;

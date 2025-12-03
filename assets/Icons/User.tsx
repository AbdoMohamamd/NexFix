import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgUser = (props: SvgProps) => (
  <Svg
   width={props.width}
    height={props.height}
    fill="none"
    {...props}
     viewBox="0 0 24 24"
  >
    <Path
       fill={props.color}
      d="M15.695 12.71a6 6 0 1 0-7.42 0 10 10 0 0 0-6.22 8.18 1.006 1.006 0 1 0 2 .22 8 8 0 0 1 15.9 0 1 1 0 0 0 1 .89h.11a1 1 0 0 0 .88-1.1 10 10 0 0 0-6.25-8.19m-3.71-.71a4 4 0 1 1 0-8 4 4 0 0 1 0 8"
    />
  </Svg>
);
export default SvgUser;

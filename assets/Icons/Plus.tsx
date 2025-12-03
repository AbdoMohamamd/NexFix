import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPlus = (props: SvgProps) => (
  <Svg
   width={props.width}
    height={props.height}
    fill="none"
    {...props}
     viewBox="0 0 24 24"
  >
    <Path
       fill={props.color}
      d="M19 11h-6V5a1 1 0 0 0-2 0v6H5a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2"
    />
  </Svg>
);
export default SvgPlus;

import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPhone = (props: SvgProps) => (
  <Svg
    width={props.width}
    height={props.height}
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <G clipPath="url(#Icon_svg__a)">
      <Path
        stroke={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.333}
        d="M9.221 11.045a.67.67 0 0 0 .809-.202l.237-.31A1.33 1.33 0 0 1 11.333 10h2a1.333 1.333 0 0 1 1.334 1.333v2a1.333 1.333 0 0 1-1.334 1.334 12 12 0 0 1-12-12 1.333 1.333 0 0 1 1.334-1.334h2A1.333 1.333 0 0 1 6 2.667v2a1.33 1.33 0 0 1-.533 1.066l-.312.234a.67.67 0 0 0-.195.822 9.33 9.33 0 0 0 4.261 4.256"
      />
    </G>
    <Defs>
      <ClipPath id="Icon_svg__a">
        <Path fill="#fff" d="M0 0h16v16H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SvgPhone;

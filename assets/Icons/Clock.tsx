import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgClock = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 12 12"
    {...props}
  >
    <G
      stroke="#6A7282"
      strokeLinecap="round"
      strokeLinejoin="round"
      clipPath="url(#Clock_svg__a)"
    >
      <Path d="M6 3v3l2 1" />
      <Path d="M6 11A5 5 0 1 0 6 1a5 5 0 0 0 0 10" />
    </G>
    <Defs>
      <ClipPath id="Clock_svg__a">
        <Path fill="#fff" d="M0 0h12v12H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SvgClock;

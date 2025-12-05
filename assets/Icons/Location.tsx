import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLocation = (props: SvgProps) => (
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
      clipPath="url(#Location_svg__a)"
    >
      <Path d="M10 5c0 2.497-2.77 5.097-3.7 5.9a.5.5 0 0 1-.6 0C4.77 10.096 2 7.496 2 5a4 4 0 0 1 8 0" />
      <Path d="M6 6.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
    </G>
    <Defs>
      <ClipPath id="Location_svg__a">
        <Path fill="#fff" d="M0 0h12v12H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SvgLocation;

import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTag = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <G
      stroke="#6A7282"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.667}
      clipPath="url(#Tag_svg__a)"
    >
      <Path d="M10.488 2.155a1.67 1.67 0 0 0-1.178-.488H3.333a1.667 1.667 0 0 0-1.666 1.666V9.31c0 .442.175.866.488 1.178l7.253 7.254a2.02 2.02 0 0 0 2.85 0l5.484-5.484a2.02 2.02 0 0 0 0-2.85z" />
      <Path
        fill="#6A7282"
        d="M6.25 6.667a.417.417 0 1 0 0-.834.417.417 0 0 0 0 .834"
      />
    </G>
    <Defs>
      <ClipPath id="Tag_svg__a">
        <Path fill="#fff" d="M0 0h20v20H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SvgTag;

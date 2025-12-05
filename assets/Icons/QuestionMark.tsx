import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgQuestionMark = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <G
      stroke="#4A5565"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.667}
      clipPath="url(#QuestionMark_svg__a)"
    >
      <Path d="M10 18.333a8.333 8.333 0 1 0 0-16.666 8.333 8.333 0 0 0 0 16.666" />
      <Path d="M7.575 7.5a2.5 2.5 0 0 1 4.859.833c0 1.667-2.5 2.5-2.5 2.5M10 14.167h.008" />
    </G>
    <Defs>
      <ClipPath id="QuestionMark_svg__a">
        <Path fill="#fff" d="M0 0h20v20H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SvgQuestionMark;

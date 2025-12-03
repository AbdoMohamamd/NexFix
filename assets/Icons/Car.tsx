import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCar = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <G
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.667}
      clipPath="url(#Car_svg__a)"
    >
      <Path d="M15.833 14.167H17.5c.5 0 .833-.334.833-.834v-2.5c0-.75-.583-1.416-1.25-1.583-1.5-.417-3.75-.917-3.75-.917S12.25 7.167 11.5 6.417c-.417-.334-.917-.584-1.5-.584H4.167c-.5 0-.917.334-1.167.75L1.833 9c-.11.322-.166.66-.166 1v3.333c0 .5.333.834.833.834h1.667" />
      <Path d="M5.833 15.833a1.667 1.667 0 1 0 0-3.333 1.667 1.667 0 0 0 0 3.333M7.5 14.167h5M14.167 15.833a1.667 1.667 0 1 0 0-3.333 1.667 1.667 0 0 0 0 3.333" />
    </G>
    <Defs>
      <ClipPath id="Car_svg__a">
        <Path fill="#fff" d="M0 0h20v20H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SvgCar;

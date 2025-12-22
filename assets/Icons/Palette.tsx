import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPalette = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path
      fill="#000"
      d="M7.42 15.54a1 1 0 1 0 1.418 1.41 1 1 0 0 0-1.418-1.41m0-8.49a1 1 0 1 0 1.418 1.41A1 1 0 0 0 7.42 7.05m4.95 10a1 1 0 1 0 1 1 1 1 0 0 0-1-1.05zm-6-6a1 1 0 1 0 1 1 1 1 0 0 0-1-1.05zm6-6a1 1 0 1 0 1 1 1 1 0 0 0-1-1.05zm3.54 2.05a1 1 0 1 0 1.41 0 1 1 0 0 0-1.41-.05zm6.3 0a11 11 0 1 0-7.85 15.74 3.87 3.87 0 0 0 2.5-1.65 4.2 4.2 0 0 0 .61-3.19 5.7 5.7 0 0 1-.1-1 5 5 0 0 1 3-4.56 3.84 3.84 0 0 0 2.06-2.25 4 4 0 0 0-.22-3.11zm-1.7 2.44a1.9 1.9 0 0 1-1 1.09A7 7 0 0 0 15.37 17q.002.707.14 1.4a2.16 2.16 0 0 1-.31 1.65 1.8 1.8 0 0 1-1.21.8 9 9 0 0 1-10.62-9.13A9.05 9.05 0 0 1 11.85 3h.51a9 9 0 0 1 8.06 5 2 2 0 0 1 .09 1.52zM12.37 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2"
    />
  </Svg>
);
export default SvgPalette;

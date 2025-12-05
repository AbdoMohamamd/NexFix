import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPhoto = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <Path
      stroke="#4A5565"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.333}
      d="M12.667 2H3.333C2.597 2 2 2.597 2 3.333v9.334C2 13.403 2.597 14 3.333 14h9.334c.736 0 1.333-.597 1.333-1.333V3.333C14 2.597 13.403 2 12.667 2"
    />
    <Path
      stroke="#4A5565"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.333}
      d="M6 7.333a1.333 1.333 0 1 0 0-2.666 1.333 1.333 0 0 0 0 2.666M14 10l-2.057-2.057a1.333 1.333 0 0 0-1.886 0L4 14"
    />
  </Svg>
);
export default SvgPhoto;

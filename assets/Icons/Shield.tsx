import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgShield = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <Path
      stroke="#4A5565"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.667}
      d="M16.667 10.833c0 4.167-2.917 6.25-6.384 7.459a.83.83 0 0 1-.558-.009c-3.475-1.2-6.391-3.283-6.391-7.45V5a.833.833 0 0 1 .833-.833c1.667 0 3.75-1 5.2-2.267a.975.975 0 0 1 1.266 0c1.459 1.275 3.534 2.267 5.2 2.267a.833.833 0 0 1 .834.833z"
    />
  </Svg>
);
export default SvgShield;

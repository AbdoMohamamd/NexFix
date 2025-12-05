import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgStar = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <Path
      stroke="#F4C430"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.333}
      d="M7.683 1.53a.353.353 0 0 1 .634 0l1.54 3.12a1.42 1.42 0 0 0 1.063.773l3.444.504a.353.353 0 0 1 .196.602l-2.49 2.426a1.41 1.41 0 0 0-.408 1.252l.588 3.426a.353.353 0 0 1-.514.374l-3.079-1.619a1.42 1.42 0 0 0-1.315 0l-3.078 1.619a.354.354 0 0 1-.513-.374l.587-3.426a1.42 1.42 0 0 0-.407-1.252L1.44 6.53a.353.353 0 0 1 .195-.604l3.443-.503a1.42 1.42 0 0 0 1.065-.774z"
    />
  </Svg>
);
export default SvgStar;

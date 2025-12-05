import * as React from "react";
import type { SvgProps } from "react-native-svg";
import Svg, { Path } from "react-native-svg";
const SvgInvoice = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" viewBox="0 0 16 16" {...props}>
    <Path
      stroke="#4A5565"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.333}
      d="M10 1.333H4a1.333 1.333 0 0 0-1.333 1.334v10.666A1.333 1.333 0 0 0 4 14.667h8a1.334 1.334 0 0 0 1.333-1.334V4.667z"
    />
    <Path
      stroke="#4A5565"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.333}
      d="M9.333 1.333V4a1.333 1.333 0 0 0 1.334 1.333h2.666M6.667 6H5.333M10.667 8.667H5.333M10.667 11.333H5.333"
    />
  </Svg>
);
export default SvgInvoice;

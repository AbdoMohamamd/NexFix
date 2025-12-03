import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgEyeSlash = (props: SvgProps) => (
  <Svg
    width={props.width}
    height={props.height}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      fill={props.color}
      d="M10.94 6.08Q11.466 6 12 6c3.18 0 6.17 2.29 7.91 6a15 15 0 0 1-.9 1.64 1 1 0 0 0 .05 1.152 1 1 0 0 0 1.65-.102 16 16 0 0 0 1.21-2.3 1 1 0 0 0 0-.79C19.9 6.91 16.1 4 12 4a8 8 0 0 0-1.4.12 1.015 1.015 0 0 0 .34 2zM3.71 2.29a1.004 1.004 0 1 0-1.42 1.42l3.1 3.09a14.6 14.6 0 0 0-3.31 4.8 1 1 0 0 0 0 .8C4.1 17.09 7.9 20 12 20a9.26 9.26 0 0 0 5.05-1.54l3.24 3.25a1 1 0 0 0 1.095.219 1 1 0 0 0 .325-.22 1 1 0 0 0 0-1.42zm6.36 9.19 2.45 2.45a2 2 0 0 1-2.45-2.45M12 18c-3.18 0-6.17-2.29-7.9-6a12.1 12.1 0 0 1 2.7-3.79L8.57 10A4 4 0 0 0 14 15.43L15.59 17A7.24 7.24 0 0 1 12 18"
    />
  </Svg>
);
export default SvgEyeSlash;

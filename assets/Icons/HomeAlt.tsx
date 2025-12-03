import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHomeAlt = (props: SvgProps) => (
  <Svg
    width={props.width}
    height={props.height}
    fill="none"
    {...props}
    viewBox="0 0 24 24"
  >
    <Path
      fill={props.color}
      d="m20 8.012-6-5.26a3 3 0 0 0-4 0l-6 5.26a3 3 0 0 0-1 2.26v8.74a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-8.75a3 3 0 0 0-1-2.25m-6 12h-4v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1zm5-1a1 1 0 0 1-1 1h-2v-5a3 3 0 0 0-3-3h-2a3 3 0 0 0-3 3v5H6a1 1 0 0 1-1-1v-8.75a1 1 0 0 1 .34-.75l6-5.25a1 1 0 0 1 1.32 0l6 5.25a1 1 0 0 1 .34.75z"
    />
  </Svg>
);
export default SvgHomeAlt;

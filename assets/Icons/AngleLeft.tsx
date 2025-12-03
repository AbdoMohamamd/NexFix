import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAngleLeft = (props: SvgProps) => (
  <Svg
    width={props.width}
    height={props.height}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      fill={props.color}
      fillRule="evenodd"
      d="M18.007 2.866c.502.488.502 1.28 0 1.768l-7.656 7.449 7.656 7.45c.502.487.502 1.279 0 1.767a1.31 1.31 0 0 1-1.817 0l-9.473-9.217 9.473-9.217a1.31 1.31 0 0 1 1.817 0"
      clipRule="evenodd"
    />
    <Path
      fill={props.color}
      fillRule="evenodd"
      d="M15.841 2.508a1.81 1.81 0 0 1 2.515 0c.703.684.703 1.8 0 2.484l-7.288 7.091 7.288 7.09c.703.685.703 1.8 0 2.485a1.81 1.81 0 0 1-2.515 0L6 12.083zm1.817.716a.81.81 0 0 0-1.12 0l-9.104 8.859 9.105 8.858c.307.3.812.3 1.12 0 .3-.291.3-.759 0-1.05l-8.025-7.808 8.024-7.808c.3-.291.3-.759 0-1.05"
      clipRule="evenodd"
    />
  </Svg>
);
export default SvgAngleLeft;

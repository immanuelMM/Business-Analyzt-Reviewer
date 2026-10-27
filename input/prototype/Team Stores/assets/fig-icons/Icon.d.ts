import * as React from 'react';
export type IconName =
  | "BarGraphBoxSizeLargeStyleOutline"
  | "BarGraphBoxSizeLargeStyleSolid"
  | "SettingsSizeLargeStyleOutline"
  | "SettingsSizeLargeStyleSolid";
export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
}
export declare const Icon: React.FC<IconProps>;
export default Icon;

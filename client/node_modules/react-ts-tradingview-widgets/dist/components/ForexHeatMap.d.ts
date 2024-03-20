import React from "react";
import { ColorTheme, Currencies, CopyrightStyles, Locales } from "../index";
export type ForexHeatMapProps = {
    width?: string | number;
    height?: string | number;
    autosize?: boolean;
    currencies?: Currencies[];
    isTransparent?: boolean;
    colorTheme?: ColorTheme;
    locale?: Locales;
    largeChartUrl?: string;
    children?: never;
    copyrightStyles?: CopyrightStyles;
};
declare const _default: React.NamedExoticComponent<ForexHeatMapProps>;
export default _default;

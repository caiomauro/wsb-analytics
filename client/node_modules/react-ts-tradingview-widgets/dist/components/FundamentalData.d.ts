import React from "react";
import { ColorTheme, CopyrightStyles, DisplayMode, Locales } from "../index";
export type FundamentalDataProps = {
    symbol?: string;
    colorTheme?: ColorTheme;
    isTransparent?: boolean;
    largeChartUrl?: string;
    displayMode?: DisplayMode;
    width?: string | number;
    height?: string | number;
    autosize?: boolean;
    locale?: Locales;
    children?: never;
    copyrightStyles?: CopyrightStyles;
};
declare const _default: React.NamedExoticComponent<FundamentalDataProps>;
export default _default;

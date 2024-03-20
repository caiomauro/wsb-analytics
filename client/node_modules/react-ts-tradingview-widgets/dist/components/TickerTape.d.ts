import React from "react";
import { ColorTheme, CopyrightStyles, DisplayMode, Locales } from "../index";
export interface TickerTapeSymbol {
    proName: string;
    title: string;
}
export interface TickerTapeProps {
    symbols?: TickerTapeSymbol[];
    showSymbolLogo?: boolean;
    colorTheme?: ColorTheme;
    isTransparent?: boolean;
    largeChartUrl?: string;
    displayMode?: DisplayMode;
    locale?: Locales;
    children?: never;
    copyrightStyles?: CopyrightStyles;
}
declare const _default: React.NamedExoticComponent<TickerTapeProps>;
export default _default;

import React from "react";
import { ColorTheme, CopyrightStyles, Locales } from "../index";
export type TickerProps = {
    colorTheme?: ColorTheme;
    isTransparent?: boolean;
    showSymbolLogo?: boolean;
    locale?: Locales;
    symbols?: TickerSymbols;
    children?: never;
    copyrightStyles?: CopyrightStyles;
};
export type TickerSymbols = TickerSymbol[];
export type TickerSymbol = {
    proName: string;
    title: string;
};
declare const _default: React.NamedExoticComponent<TickerProps>;
export default _default;

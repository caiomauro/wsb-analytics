import React from "react";
import { ColorTheme, CopyrightStyles, Locales } from "../index";
export type EconomicCalendarProps = {
    colorTheme?: ColorTheme;
    isTransparent?: boolean;
    width?: string | number;
    height?: string | number;
    autosize?: boolean;
    locale?: Locales;
    importanceFilter?: "-1,0,1" | "0,1";
    countryFilter?: string;
    children?: never;
    copyrightStyles?: CopyrightStyles;
};
declare const _default: React.NamedExoticComponent<EconomicCalendarProps>;
export default _default;
